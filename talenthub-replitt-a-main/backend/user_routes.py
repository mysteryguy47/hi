"""API routes for user authentication, progress tracking, and dashboards."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from datetime import datetime, timedelta
from timezone_utils import get_ist_now

from models import User, PracticeSession, Attempt, Reward, Leaderboard, PaperAttempt, Paper, StudentProfile, ProfileAuditLog, get_db
from auth import get_current_user, get_current_admin, verify_google_token, create_access_token
from user_schemas import (
    LoginRequest, LoginResponse, UserResponse, PracticeSessionCreate,
    PracticeSessionResponse, StudentStats, LeaderboardEntry, AdminStats,
    PracticeSessionDetailResponse, AttemptResponse,
    StudentProfileResponse, StudentProfileUpdate, ProfileAuditLogResponse,
    PaperAttemptResponse
)
from student_profile_utils import (
    validate_level, validate_course, validate_branch, validate_status,
    validate_level_type, generate_public_id
)
from pydantic import BaseModel
from typing import Optional, List
import uuid as uuid_module

class UpdateDisplayNameRequest(BaseModel):
    display_name: Optional[str] = None

from gamification import calculate_points, check_and_award_badges, update_streak, check_and_award_super_rewards
from leaderboard_service import (
    update_leaderboard, update_weekly_leaderboard,
    get_overall_leaderboard, get_weekly_leaderboard
)

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login with Google OAuth token."""
    try:
        print(f"Login attempt received, token length: {len(login_data.token) if login_data.token else 0}")
        # Verify Google token
        user_info = verify_google_token(login_data.token)
        print(f"Token verified, user info: {user_info.get('email', 'N/A')}")
        
        # Find or create user
        user = db.query(User).filter(User.google_id == user_info["google_id"]).first()
        
        # Check if admin email (you can set this in environment)
        import os
        admin_emails = [email.strip() for email in os.getenv("ADMIN_EMAILS", "").split(",") if email.strip()]
        is_admin_email = user_info["email"] in admin_emails
        
        if not user:
            # New user - assign role based on admin emails
            role = "admin" if is_admin_email else "student"
            
            user = User(
                google_id=user_info["google_id"],
                email=user_info["email"],
                name=user_info["name"],
                avatar_url=user_info.get("avatar_url"),
                role=role
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            # Create leaderboard entry
            from models import Leaderboard
            leaderboard = Leaderboard(user_id=user.id, total_points=0)
            db.add(leaderboard)
            db.commit()
        else:
            # Existing user - update info and check if role needs updating
            user.name = user_info["name"]
            user.avatar_url = user_info.get("avatar_url")
            
            # Update role if email is in admin list (promote to admin)
            # Or demote if email is removed from admin list (but keep existing admins unless explicitly removed)
            if is_admin_email and user.role != "admin":
                print(f"🔄 [AUTH] Promoting user {user.email} to admin (found in ADMIN_EMAILS)")
                user.role = "admin"
            elif not is_admin_email and user.role == "admin":
                # Only demote if explicitly not in admin list (optional - comment out if you want to keep existing admins)
                # Uncomment the next line if you want to automatically demote admins removed from ADMIN_EMAILS
                # print(f"🔄 [AUTH] Demoting user {user.email} from admin (not in ADMIN_EMAILS)")
                # user.role = "student"
                pass
            
            db.commit()
        
        # Create access token - sub must be a string for JWT
        access_token = create_access_token(data={"sub": str(user.id)})
        
        print(f"Login successful for user: {user.email}")
        return LoginResponse(
            access_token=access_token,
            user=UserResponse.model_validate(user)
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Login error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info."""
    return UserResponse.model_validate(current_user)


@router.put("/me/display-name", response_model=UserResponse)
async def update_display_name(
    request: UpdateDisplayNameRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's display name."""
    current_user.display_name = request.display_name
    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.post("/practice-session", response_model=PracticeSessionResponse)
async def save_practice_session(
    session_data: PracticeSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a practice session with all attempts."""
    try:
        # Calculate points for mental math: 10 points per correct answer only
        points_earned = calculate_points(
            correct_answers=session_data.correct_answers,
            total_questions=session_data.total_questions,
            time_taken=session_data.time_taken,
            difficulty_mode=session_data.difficulty_mode,
            accuracy=session_data.accuracy,
            is_mental_math=True  # Mental math practice
        )
        
        # Create practice session
        session = PracticeSession(
            user_id=current_user.id,
            operation_type=session_data.operation_type,
            difficulty_mode=session_data.difficulty_mode,
            total_questions=session_data.total_questions,
            correct_answers=session_data.correct_answers,
            wrong_answers=session_data.wrong_answers,
            accuracy=session_data.accuracy,
            score=session_data.score,
            time_taken=session_data.time_taken,
            points_earned=points_earned,
            completed_at=get_ist_now().replace(tzinfo=None)  # Store IST time as naive (SQLAlchemy requirement)
        )
        db.add(session)
        db.flush()  # Get session ID
        
        # Save attempts
        for attempt_data in session_data.attempts:
            attempt = Attempt(
                session_id=session.id,
                question_data=attempt_data.get("question_data", {}),
                user_answer=attempt_data.get("user_answer"),
                correct_answer=attempt_data.get("correct_answer"),
                is_correct=attempt_data.get("is_correct", False),
                time_taken=attempt_data.get("time_taken", 0),
                question_number=attempt_data.get("question_number", 0)
            )
            db.add(attempt)
        
        # Update user points and streak
        current_user.total_points += points_earned
        update_streak(db, current_user, questions_practiced_today=session_data.total_questions)
        
        # Check for badges
        badges = check_and_award_badges(db, current_user, session)
        
        # Check for SUPER badge rewards
        super_rewards = check_and_award_super_rewards(db, current_user)
        
        db.commit()
        db.refresh(session)
        
        # Update leaderboards
        update_leaderboard(db)
        update_weekly_leaderboard(db)
        
        # Ensure datetimes are treated as IST (SQLAlchemy returns naive datetimes)
        from timezone_utils import IST_TIMEZONE
        if session.started_at and session.started_at.tzinfo is None:
            session.started_at = session.started_at.replace(tzinfo=IST_TIMEZONE)
        if session.completed_at and session.completed_at.tzinfo is None:
            session.completed_at = session.completed_at.replace(tzinfo=IST_TIMEZONE)
        
        return PracticeSessionResponse.model_validate(session)
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Rollback transaction on error
        db.rollback()
        import traceback
        error_msg = str(e)
        traceback_str = traceback.format_exc()
        print(f"❌ [PRACTICE SESSION] Error saving practice session: {error_msg}")
        print(traceback_str)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save practice session: {error_msg}"
        )


@router.get("/stats", response_model=StudentStats)
async def get_student_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get student statistics and progress."""
    # Get session stats
    sessions = db.query(PracticeSession).filter(
        PracticeSession.user_id == current_user.id
    ).all()
    
    total_sessions = len(sessions)
    total_questions = sum(s.total_questions for s in sessions)
    total_correct = sum(s.correct_answers for s in sessions)
    total_wrong = sum(s.wrong_answers for s in sessions)
    overall_accuracy = (total_correct / total_questions * 100) if total_questions > 0 else 0
    
    # Get badges
    badges = db.query(Reward).filter(Reward.user_id == current_user.id).all()
    badge_names = [badge.badge_name for badge in badges]
    
    # Get recent sessions (only latest 10 are stored)
    recent_sessions = db.query(PracticeSession).filter(
        PracticeSession.user_id == current_user.id
    ).order_by(desc(PracticeSession.started_at)).limit(10).all()
    
    # Get recent paper attempts (only latest 10 are stored)
    from models import PaperAttempt
    recent_paper_attempts = db.query(PaperAttempt).filter(
        PaperAttempt.user_id == current_user.id
    ).order_by(desc(PaperAttempt.started_at)).limit(10).all()
    
    # Ensure datetimes are treated as IST (SQLAlchemy returns naive datetimes)
    from timezone_utils import IST_TIMEZONE
    for s in recent_sessions:
        if s.started_at and s.started_at.tzinfo is None:
            s.started_at = s.started_at.replace(tzinfo=IST_TIMEZONE)
        if s.completed_at and s.completed_at.tzinfo is None:
            s.completed_at = s.completed_at.replace(tzinfo=IST_TIMEZONE)
    for a in recent_paper_attempts:
        if a.started_at and a.started_at.tzinfo is None:
            a.started_at = a.started_at.replace(tzinfo=IST_TIMEZONE)
        if a.completed_at and a.completed_at.tzinfo is None:
            a.completed_at = a.completed_at.replace(tzinfo=IST_TIMEZONE)
    
    return StudentStats(
        total_sessions=total_sessions,
        total_questions=total_questions,
        total_correct=total_correct,
        total_wrong=total_wrong,
        overall_accuracy=round(overall_accuracy, 2),
        total_points=current_user.total_points,
        current_streak=current_user.current_streak,
        longest_streak=current_user.longest_streak,
        badges=badge_names,
        recent_sessions=[PracticeSessionResponse.model_validate(s) for s in recent_sessions],
        recent_paper_attempts=[PaperAttemptResponse.model_validate(a) for a in recent_paper_attempts]
    )


@router.get("/practice-session/{session_id}", response_model=PracticeSessionDetailResponse)
async def get_practice_session_detail(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed practice session with all attempts."""
    session = db.query(PracticeSession).filter(
        PracticeSession.id == session_id,
        PracticeSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get all attempts for this session
    attempts = db.query(Attempt).filter(
        Attempt.session_id == session_id
    ).order_by(Attempt.question_number).all()
    
    # Ensure datetimes are treated as IST (SQLAlchemy returns naive datetimes)
    from timezone_utils import IST_TIMEZONE
    started_at = session.started_at
    completed_at = session.completed_at
    if started_at and started_at.tzinfo is None:
        started_at = started_at.replace(tzinfo=IST_TIMEZONE)
    if completed_at and completed_at.tzinfo is None:
        completed_at = completed_at.replace(tzinfo=IST_TIMEZONE)
    
    return PracticeSessionDetailResponse(
        id=session.id,
        operation_type=session.operation_type,
        difficulty_mode=session.difficulty_mode,
        total_questions=session.total_questions,
        correct_answers=session.correct_answers,
        wrong_answers=session.wrong_answers,
        accuracy=session.accuracy,
        score=session.score,
        time_taken=session.time_taken,
        points_earned=session.points_earned,
        started_at=started_at,
        completed_at=completed_at,
        attempts=[AttemptResponse.model_validate(a) for a in attempts]
    )


@router.get("/leaderboard/overall", response_model=List[LeaderboardEntry])
async def get_overall_leaderboard_endpoint(db: Session = Depends(get_db)):
    """Get overall leaderboard."""
    entries = get_overall_leaderboard(db)
    return [LeaderboardEntry(**entry) for entry in entries]


@router.get("/leaderboard/weekly", response_model=List[LeaderboardEntry])
async def get_weekly_leaderboard_endpoint(db: Session = Depends(get_db)):
    """Get weekly leaderboard."""
    entries = get_weekly_leaderboard(db)
    return [LeaderboardEntry(**entry) for entry in entries]


# Admin routes
@router.get("/admin/stats", response_model=AdminStats)
async def get_admin_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics."""
    # Total students
    total_students = db.query(User).filter(User.role == "student").count()
    
    # Total sessions (mental math + practice paper attempts)
    total_mental_math_sessions = db.query(PracticeSession).count()
    total_paper_attempts = db.query(PaperAttempt).count()
    total_sessions = total_mental_math_sessions + total_paper_attempts
    
    # Total questions
    total_questions = db.query(func.sum(PracticeSession.total_questions)).scalar() or 0
    
    # Average accuracy
    avg_accuracy = db.query(func.avg(PracticeSession.accuracy)).scalar() or 0
    
    # Active students today (IST)
    ist_now = get_ist_now()
    today_start = ist_now.replace(hour=0, minute=0, second=0, microsecond=0)
    active_today = db.query(func.count(func.distinct(PracticeSession.user_id))).filter(
        PracticeSession.started_at >= today_start
    ).scalar() or 0
    
    # Top students
    top_students = get_overall_leaderboard(db, limit=10)
    
    return AdminStats(
        total_students=total_students,
        total_sessions=total_sessions,
        total_questions=int(total_questions),
        average_accuracy=round(float(avg_accuracy), 2),
        active_students_today=active_today,
        top_students=[LeaderboardEntry(**entry) for entry in top_students]
    )


@router.get("/admin/students", response_model=List[UserResponse])
async def get_all_students(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all students."""
    students = db.query(User).filter(User.role == "student").order_by(
        User.id.asc()
    ).all()
    
    # Add public_id from student profiles
    result = []
    for student in students:
        student_dict = {
            "id": student.id,
            "email": student.email,
            "name": student.name,
            "display_name": student.display_name,
            "avatar_url": student.avatar_url,
            "role": student.role,
            "total_points": student.total_points,
            "current_streak": student.current_streak,
            "longest_streak": student.longest_streak,
            "created_at": student.created_at,
            "public_id": None
        }
        
        # Get public_id from student profile
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == student.id).first()
        if profile:
            student_dict["public_id"] = profile.public_id
        
        result.append(UserResponse.model_validate(student_dict))
    
    return result


@router.get("/admin/students/{student_id}/stats", response_model=StudentStats)
async def get_student_stats_admin(
    student_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get stats for a specific student (admin view)."""
    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Reuse the stats logic
    sessions = db.query(PracticeSession).filter(
        PracticeSession.user_id == student.id
    ).all()
    
    total_sessions = len(sessions)
    total_questions = sum(s.total_questions for s in sessions)
    total_correct = sum(s.correct_answers for s in sessions)
    total_wrong = sum(s.wrong_answers for s in sessions)
    overall_accuracy = (total_correct / total_questions * 100) if total_questions > 0 else 0
    
    badges = db.query(Reward).filter(Reward.user_id == student.id).all()
    badge_names = [badge.badge_name for badge in badges]
    
    recent_sessions = db.query(PracticeSession).filter(
        PracticeSession.user_id == student.id
    ).order_by(desc(PracticeSession.started_at)).limit(10).all()
    
    # Get recent paper attempts (practice paper sessions)
    recent_paper_attempts = db.query(PaperAttempt).filter(
        PaperAttempt.user_id == student.id
    ).order_by(desc(PaperAttempt.started_at)).limit(10).all()
    
    # Calculate practice paper metrics
    all_paper_attempts = db.query(PaperAttempt).filter(
        PaperAttempt.user_id == student.id
    ).all()
    
    total_paper_attempts = len(all_paper_attempts)
    paper_total_questions = sum(a.total_questions for a in all_paper_attempts)
    paper_total_correct = sum(a.correct_answers for a in all_paper_attempts)
    paper_total_wrong = sum(a.wrong_answers for a in all_paper_attempts)
    paper_overall_accuracy = (paper_total_correct / paper_total_questions * 100) if paper_total_questions > 0 else 0.0
    
    return StudentStats(
        total_sessions=total_sessions,
        total_questions=total_questions,
        total_correct=total_correct,
        total_wrong=total_wrong,
        overall_accuracy=round(overall_accuracy, 2),
        total_points=student.total_points,
        current_streak=student.current_streak,
        longest_streak=student.longest_streak,
        badges=badge_names,
        recent_sessions=[PracticeSessionResponse.model_validate(s) for s in recent_sessions],
        recent_paper_attempts=[PaperAttemptResponse.model_validate(a) for a in recent_paper_attempts],
        total_paper_attempts=total_paper_attempts,
        paper_total_questions=paper_total_questions,
        paper_total_correct=paper_total_correct,
        paper_total_wrong=paper_total_wrong,
        paper_overall_accuracy=round(paper_overall_accuracy, 2)
    )


class UpdatePointsRequest(BaseModel):
    points: int


class DatabaseStatsResponse(BaseModel):
    total_users: int
    total_students: int
    total_admins: int
    total_sessions: int
    total_paper_attempts: int
    total_rewards: int
    total_papers: int
    database_size_mb: float


@router.delete("/admin/students/{student_id}")
async def delete_student(
    student_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a student account and all associated data."""
    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Delete associated data (cascade should handle most, but we'll be explicit)
    # Delete leaderboard entry
    leaderboard = db.query(Leaderboard).filter(Leaderboard.user_id == student_id).first()
    if leaderboard:
        db.delete(leaderboard)
    
    # Delete user (cascade will handle sessions, attempts, rewards, paper_attempts)
    db.delete(student)
    db.commit()
    
    # Refresh leaderboard after deletion
    update_leaderboard(db)
    update_weekly_leaderboard(db)
    
    return {"message": f"Student {student.name} deleted successfully"}


@router.put("/admin/students/{student_id}/points")
async def update_student_points(
    student_id: int,
    request: UpdatePointsRequest,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a student's total points."""
    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    old_points = student.total_points
    student.total_points = max(0, request.points)  # Ensure non-negative
    db.commit()
    
    # Update leaderboard entry
    leaderboard = db.query(Leaderboard).filter(Leaderboard.user_id == student_id).first()
    if leaderboard:
        leaderboard.total_points = student.total_points
        db.commit()
    
    # Refresh leaderboard rankings
    update_leaderboard(db)
    
    return {
        "message": f"Points updated for {student.name}",
        "old_points": old_points,
        "new_points": student.total_points
    }


@router.post("/admin/leaderboard/refresh")
async def refresh_leaderboard(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Manually refresh both overall and weekly leaderboards."""
    update_leaderboard(db)
    update_weekly_leaderboard(db)
    return {"message": "Leaderboard refreshed successfully"}


@router.get("/admin/database/stats", response_model=DatabaseStatsResponse)
async def get_database_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get database statistics."""
    total_users = db.query(User).count()
    total_students = db.query(User).filter(User.role == "student").count()
    total_admins = db.query(User).filter(User.role == "admin").count()
    total_sessions = db.query(PracticeSession).count()
    total_paper_attempts = db.query(PaperAttempt).count()
    total_rewards = db.query(Reward).count()
    total_papers = db.query(Paper).count()
    
    # Calculate database size (SQLite or PostgreSQL)
    import os
    from sqlalchemy import text
    db_path = os.getenv("DATABASE_URL", "sqlite:///./abacus_replitt.db")
    
    if db_path.startswith("sqlite:///"):
        # SQLite: get file size
        db_file = db_path.replace("sqlite:///", "")
        if os.path.exists(db_file):
            db_size_mb = os.path.getsize(db_file) / (1024 * 1024)
        else:
            db_size_mb = 0.0
    else:
        # PostgreSQL: use pg_database_size query
        try:
            # Extract database name from connection string
            # Format: postgresql://user:pass@host:port/dbname or postgresql+psycopg2://...
            if "postgresql" in db_path or "postgres" in db_path:
                # Get database name from connection string
                # Handle both postgresql:// and postgresql+psycopg2:// formats
                db_name = db_path.split("/")[-1].split("?")[0]
                # Query PostgreSQL for database size in bytes, then convert to MB
                result = db.execute(text("SELECT pg_database_size(current_database()) as size_bytes"))
                size_bytes = result.scalar()
                if size_bytes:
                    db_size_mb = size_bytes / (1024 * 1024)
                else:
                    db_size_mb = 0.0
            else:
                db_size_mb = 0.0
        except Exception as e:
            print(f"⚠️ [DB STATS] Failed to get PostgreSQL size: {e}")
            db_size_mb = 0.0
    
    return DatabaseStatsResponse(
        total_users=total_users,
        total_students=total_students,
        total_admins=total_admins,
        total_sessions=total_sessions,
        total_paper_attempts=total_paper_attempts,
        total_rewards=total_rewards,
        total_papers=total_papers,
        database_size_mb=round(db_size_mb, 2)
    )


@router.post("/admin/promote-self")
async def promote_self_to_admin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Allow users to promote themselves to admin if their email is in ADMIN_EMAILS.
    This is useful for fixing existing users who should be admins.
    """
    import os
    admin_emails = [email.strip() for email in os.getenv("ADMIN_EMAILS", "").split(",") if email.strip()]
    
    if current_user.email not in admin_emails:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your email is not in the ADMIN_EMAILS list. Contact system administrator."
        )
    
    if current_user.role == "admin":
        return {
            "message": "You are already an admin",
            "email": current_user.email,
            "role": current_user.role
        }
    
    # Promote to admin
    current_user.role = "admin"
    db.commit()
    
    return {
        "message": f"Successfully promoted {current_user.email} to admin",
        "email": current_user.email,
        "role": current_user.role
    }


# Student Profile Routes
@router.get("/valid-levels")
async def get_valid_levels(
    course: Optional[str] = Query(None),
    level_type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get valid levels for a course and level type combination."""
    from student_profile_utils import get_valid_levels
    
    if not course or not level_type:
        return {"levels": []}
    
    # Trim whitespace from inputs
    course = course.strip() if course else None
    level_type = level_type.strip() if level_type else None
    
    if not course or not level_type:
        return {"levels": []}
    
    levels = get_valid_levels(course, level_type)
    return {"levels": levels}


@router.get("/profile", response_model=StudentProfileResponse)
async def get_student_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's student profile. Students and parents can view their own profile."""
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    
    if not profile:
        # Auto-create profile if it doesn't exist
        profile = StudentProfile(
            user_id=current_user.id,
            internal_uuid=str(uuid_module.uuid4())
        )
        # Auto-generate public_id if user is a student
        if current_user.role == "student":
            profile.public_id = generate_public_id(db)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return StudentProfileResponse.model_validate(profile)


@router.get("/profile/{user_id}", response_model=StudentProfileResponse)
async def get_student_profile_by_id(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a student profile by user ID. Students can only view their own, admins can view any."""
    # Check permissions: students can only view their own profile
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own profile"
        )
    
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    return StudentProfileResponse.model_validate(profile)


@router.put("/profile", response_model=StudentProfileResponse)
async def update_student_profile(
    profile_data: StudentProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update student profile. Students can edit basic info (display_name, class_name, parent_contact_number), admins can edit everything."""
    # Get or create profile for current user
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    
    if not profile:
        profile = StudentProfile(
            user_id=current_user.id,
            internal_uuid=str(uuid_module.uuid4())
        )
        if current_user.role == "student":
            profile.public_id = generate_public_id(db)
        db.add(profile)
        db.flush()
    
    # Students can only edit basic info fields
    is_admin = current_user.role == "admin"
    student_editable_fields = {"display_name", "class_name", "parent_contact_number"}
    admin_only_fields = {"course", "level_type", "level", "branch", "status", "join_date", "finish_date", "full_name"}
    
    # Check if student is trying to edit admin-only fields
    # Use model_dump(exclude_unset=True) to only check fields that were actually provided in the request
    if not is_admin:
        provided_fields = profile_data.model_dump(exclude_unset=True)
        for field in admin_only_fields:
            if field in provided_fields:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Only admins can edit {field}"
                )
    
    # Validate inputs (only for admin-only fields if they're being updated)
    if profile_data.course:
        is_valid, error = validate_course(profile_data.course)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
    
    if profile_data.level_type:
        is_valid, error = validate_level_type(profile_data.level_type)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
    
    if profile_data.level:
        is_valid, error = validate_level(profile_data.course, profile_data.level_type, profile_data.level)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
    
    if profile_data.branch:
        is_valid, error = validate_branch(profile_data.branch)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
    
    if profile_data.status:
        is_valid, error = validate_status(profile_data.status)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
    
    # Track changes for audit log
    changes = []
    field_mapping = {
        "full_name": "full_name",
        "display_name": "display_name",
        "class_name": "class_name",
        "course": "course",
        "level_type": "level_type",
        "level": "level",
        "branch": "branch",
        "status": "status",
        "join_date": "join_date",
        "finish_date": "finish_date",
        "parent_contact_number": "parent_contact_number"
    }
    
    for field_key, model_field in field_mapping.items():
        new_value = getattr(profile_data, field_key, None)
        if new_value is not None:
            old_value = getattr(profile, model_field, None)
            # Convert datetime to string for comparison
            if isinstance(old_value, datetime):
                old_value = old_value.isoformat() if old_value else None
            if isinstance(new_value, datetime):
                new_value = new_value.isoformat() if new_value else None
            else:
                new_value = str(new_value) if new_value is not None else None
            
            # Only log if value actually changed
            if str(old_value) != str(new_value):
                changes.append({
                    "field": model_field,
                    "old": str(old_value) if old_value is not None else None,
                    "new": new_value
                })
                setattr(profile, model_field, getattr(profile_data, field_key))
    
    # Update profile
    profile.updated_at = get_ist_now()
    db.flush()
    
    # Create audit log entries
    for change in changes:
        audit_log = ProfileAuditLog(
            profile_id=profile.id,
            changed_by_user_id=current_user.id,
            field_name=change["field"],
            old_value=change["old"],
            new_value=change["new"]
        )
        db.add(audit_log)
    
    db.commit()
    db.refresh(profile)
    
    return StudentProfileResponse.model_validate(profile)


@router.put("/profile/{user_id}", response_model=StudentProfileResponse)
async def update_student_profile_by_id(
    user_id: int,
    profile_data: StudentProfileUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a student profile by user ID. Only admins can use this endpoint."""
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    
    if not profile:
        # Create profile if it doesn't exist
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        profile = StudentProfile(
            user_id=user_id,
            internal_uuid=str(uuid_module.uuid4())
        )
        if user.role == "student":
            profile.public_id = generate_public_id(db)
        db.add(profile)
        db.flush()
    
    # Validate inputs
    if profile_data.course:
        is_valid, error = validate_course(profile_data.course)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
    
    if profile_data.level_type:
        is_valid, error = validate_level_type(profile_data.level_type)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
    
    if profile_data.level:
        is_valid, error = validate_level(profile_data.course, profile_data.level_type, profile_data.level)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
    
    if profile_data.branch:
        is_valid, error = validate_branch(profile_data.branch)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
    
    if profile_data.status:
        is_valid, error = validate_status(profile_data.status)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
    
    # Track changes for audit log
    changes = []
    field_mapping = {
        "full_name": "full_name",
        "display_name": "display_name",
        "class_name": "class_name",
        "course": "course",
        "level_type": "level_type",
        "level": "level",
        "branch": "branch",
        "status": "status",
        "join_date": "join_date",
        "finish_date": "finish_date",
        "parent_contact_number": "parent_contact_number"
    }
    
    for field_key, model_field in field_mapping.items():
        new_value = getattr(profile_data, field_key, None)
        if new_value is not None:
            old_value = getattr(profile, model_field, None)
            # Convert datetime to string for comparison
            if isinstance(old_value, datetime):
                old_value = old_value.isoformat() if old_value else None
            if isinstance(new_value, datetime):
                new_value = new_value.isoformat() if new_value else None
            else:
                new_value = str(new_value) if new_value is not None else None
            
            # Only log if value actually changed
            if str(old_value) != str(new_value):
                changes.append({
                    "field": model_field,
                    "old": str(old_value) if old_value is not None else None,
                    "new": new_value
                })
                setattr(profile, model_field, getattr(profile_data, field_key))
    
    # Update profile
    profile.updated_at = get_ist_now()
    db.flush()
    
    # Create audit log entries
    for change in changes:
        audit_log = ProfileAuditLog(
            profile_id=profile.id,
            changed_by_user_id=admin.id,
            field_name=change["field"],
            old_value=change["old"],
            new_value=change["new"]
        )
        db.add(audit_log)
    
    db.commit()
    db.refresh(profile)
    
    return StudentProfileResponse.model_validate(profile)


@router.get("/profile/{user_id}/audit-logs", response_model=List[ProfileAuditLogResponse])
async def get_profile_audit_logs(
    user_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get audit logs for a student profile. Only admins can access."""
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    logs = db.query(ProfileAuditLog).filter(
        ProfileAuditLog.profile_id == profile.id
    ).order_by(desc(ProfileAuditLog.created_at)).all()
    
    # Get user names for changed_by
    result = []
    for log in logs:
        changed_by_user = db.query(User).filter(User.id == log.changed_by_user_id).first()
        log_dict = ProfileAuditLogResponse.model_validate(log).model_dump()
        log_dict["changed_by_name"] = changed_by_user.name if changed_by_user else None
        result.append(ProfileAuditLogResponse(**log_dict))
    
    return result

