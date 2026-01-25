"""API routes for attendance management system."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_, or_
from typing import List, Optional
from datetime import datetime, timedelta, date
from timezone_utils import get_ist_now
from calendar import monthrange

from models import (
    User, StudentProfile, ClassSchedule, ClassSession, AttendanceRecord,
    Certificate, get_db
)
from auth import get_current_user, get_current_admin
from user_schemas import (
    ClassScheduleCreate, ClassScheduleResponse,
    ClassSessionCreate, ClassSessionResponse,
    AttendanceRecordCreate, AttendanceRecordUpdate, AttendanceRecordResponse,
    BulkAttendanceCreate, AttendanceStats,
    CertificateCreate, CertificateResponse
)

router = APIRouter(prefix="/attendance", tags=["attendance"])


# Class Schedule Management
@router.post("/schedules", response_model=ClassScheduleResponse)
async def create_class_schedule(
    schedule_data: ClassScheduleCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new class schedule."""
    schedule = ClassSchedule(
        branch=schedule_data.branch,
        course=schedule_data.course,
        level=schedule_data.level,
        batch_name=schedule_data.batch_name,
        schedule_days=schedule_data.schedule_days,
        time_slots=schedule_data.time_slots,
        is_active=schedule_data.is_active,
        created_by_user_id=admin.id
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return ClassScheduleResponse.model_validate(schedule)


def ensure_default_schedules(db: Session, admin_id: int):
    """Ensure default Saturday/Sunday schedules exist for each branch."""
    branches = ["Rohini-16", "Rohini-11", "Gurgaon", "Online"]
    courses = ["Abacus", "Vedic Maths", "Handwriting"]
    
    # Saturday = 5, Sunday = 6 (0=Monday, 1=Tuesday, ..., 6=Sunday)
    default_days = [5, 6]  # Saturday and Sunday
    
    for branch in branches:
        # Check if any schedule exists for this branch
        existing = db.query(ClassSchedule).filter(
            ClassSchedule.branch == branch,
            ClassSchedule.is_active == True
        ).first()
        
        if not existing:
            # Create default schedule for all courses (course = None means all courses)
            default_schedule = ClassSchedule(
                branch=branch,
                course=None,  # None means applies to all courses
                level=None,
                batch_name=None,
                schedule_days=default_days,
                time_slots=None,
                is_active=True,
                created_by_user_id=admin_id
            )
            db.add(default_schedule)
            db.flush()
            
            # Also create course-specific defaults
            for course in courses:
                course_schedule = ClassSchedule(
                    branch=branch,
                    course=course,
                    level=None,
                    batch_name=None,
                    schedule_days=default_days,
                    time_slots=None,
                    is_active=True,
                    created_by_user_id=admin_id
                )
                db.add(course_schedule)
            db.commit()


@router.get("/schedules", response_model=List[ClassScheduleResponse])
async def get_class_schedules(
    branch: Optional[str] = Query(None),
    course: Optional[str] = Query(None),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get class schedules with optional filters. Creates default Saturday/Sunday schedules if none exist."""
    # Ensure default schedules exist
    ensure_default_schedules(db, admin.id)
    
    query = db.query(ClassSchedule)
    
    if branch:
        query = query.filter(ClassSchedule.branch == branch)
    if course:
        query = query.filter(ClassSchedule.course == course)
    
    schedules = query.filter(ClassSchedule.is_active == True).all()
    return [ClassScheduleResponse.model_validate(s) for s in schedules]


@router.put("/schedules/{schedule_id}", response_model=ClassScheduleResponse)
async def update_class_schedule(
    schedule_id: int,
    schedule_data: ClassScheduleCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a class schedule."""
    schedule = db.query(ClassSchedule).filter(ClassSchedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    schedule.branch = schedule_data.branch
    schedule.course = schedule_data.course
    schedule.level = schedule_data.level
    schedule.batch_name = schedule_data.batch_name
    schedule.schedule_days = schedule_data.schedule_days
    schedule.time_slots = schedule_data.time_slots
    schedule.is_active = schedule_data.is_active
    schedule.updated_at = get_ist_now()
    
    db.commit()
    db.refresh(schedule)
    return ClassScheduleResponse.model_validate(schedule)


@router.delete("/schedules/{schedule_id}")
async def delete_class_schedule(
    schedule_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a class schedule."""
    schedule = db.query(ClassSchedule).filter(ClassSchedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    db.delete(schedule)
    db.commit()
    return {"message": "Schedule deleted successfully"}


# Class Session Management
@router.post("/sessions", response_model=ClassSessionResponse)
async def create_class_session(
    session_data: ClassSessionCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new class session."""
    session = ClassSession(
        schedule_id=session_data.schedule_id,
        session_date=session_data.session_date,
        branch=session_data.branch,
        course=session_data.course,
        level=session_data.level,
        batch_name=session_data.batch_name,
        topic=session_data.topic,
        teacher_remarks=session_data.teacher_remarks,
        created_by_user_id=admin.id
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return ClassSessionResponse.model_validate(session)


@router.get("/sessions", response_model=List[ClassSessionResponse])
async def get_class_sessions(
    branch: Optional[str] = Query(None),
    course: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get class sessions with optional filters."""
    query = db.query(ClassSession)
    
    if branch:
        query = query.filter(ClassSession.branch == branch)
    if course:
        query = query.filter(ClassSession.course == course)
    if start_date:
        query = query.filter(ClassSession.session_date >= start_date)
    if end_date:
        query = query.filter(ClassSession.session_date <= end_date)
    
    # Students can only see sessions for their branch
    if current_user.role != "admin":
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if profile and profile.branch:
            query = query.filter(ClassSession.branch == profile.branch)
    
    sessions = query.order_by(desc(ClassSession.session_date)).all()
    return [ClassSessionResponse.model_validate(s) for s in sessions]


@router.get("/sessions/{session_id}", response_model=ClassSessionResponse)
async def get_class_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific class session."""
    session = db.query(ClassSession).filter(ClassSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return ClassSessionResponse.model_validate(session)


# Attendance Management
@router.post("/mark", response_model=AttendanceRecordResponse)
async def mark_attendance(
    attendance_data: AttendanceRecordCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Mark attendance for a single student."""
    # Check if record already exists
    existing = db.query(AttendanceRecord).filter(
        AttendanceRecord.session_id == attendance_data.session_id,
        AttendanceRecord.student_profile_id == attendance_data.student_profile_id
    ).first()
    
    if existing:
        # Update existing record
        existing.status = attendance_data.status
        existing.remarks = attendance_data.remarks
        existing.marked_by_user_id = admin.id
        existing.updated_at = get_ist_now()
        db.commit()
        db.refresh(existing)
        record = existing
    else:
        # Create new record
        record = AttendanceRecord(
            session_id=attendance_data.session_id,
            student_profile_id=attendance_data.student_profile_id,
            status=attendance_data.status,
            remarks=attendance_data.remarks,
            marked_by_user_id=admin.id
        )
        db.add(record)
        db.commit()
        db.refresh(record)
    
    # Mark session as completed
    session = db.query(ClassSession).filter(ClassSession.id == attendance_data.session_id).first()
    if session:
        session.is_completed = True
        db.commit()
    
    # Get student info for response
    profile = db.query(StudentProfile).filter(StudentProfile.id == attendance_data.student_profile_id).first()
    response = AttendanceRecordResponse.model_validate(record)
    if profile:
        response.student_name = profile.full_name or profile.display_name
        response.student_public_id = profile.public_id
    
    return response


@router.post("/mark-bulk", response_model=List[AttendanceRecordResponse])
async def mark_bulk_attendance(
    bulk_data: BulkAttendanceCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Mark attendance for multiple students at once."""
    results = []
    
    for attendance_data in bulk_data.attendance_data:
        # Check if record already exists
        existing = db.query(AttendanceRecord).filter(
            AttendanceRecord.session_id == bulk_data.session_id,
            AttendanceRecord.student_profile_id == attendance_data.student_profile_id
        ).first()
        
        if existing:
            existing.status = attendance_data.status
            existing.remarks = attendance_data.remarks
            existing.marked_by_user_id = admin.id
            existing.updated_at = get_ist_now()
            record = existing
        else:
            record = AttendanceRecord(
                session_id=bulk_data.session_id,
                student_profile_id=attendance_data.student_profile_id,
                status=attendance_data.status,
                remarks=attendance_data.remarks,
                marked_by_user_id=admin.id
            )
            db.add(record)
        
        results.append(record)
    
    # Mark session as completed
    session = db.query(ClassSession).filter(ClassSession.id == bulk_data.session_id).first()
    if session:
        session.is_completed = True
    
    db.commit()
    
    # Add student info to responses
    response_list = []
    for record in results:
        profile = db.query(StudentProfile).filter(StudentProfile.id == record.student_profile_id).first()
        response = AttendanceRecordResponse.model_validate(record)
        if profile:
            response.student_name = profile.full_name or profile.display_name
            response.student_public_id = profile.public_id
        response_list.append(response)
    
    return response_list


@router.get("/records", response_model=List[AttendanceRecordResponse])
async def get_attendance_records(
    student_profile_id: Optional[int] = Query(None),
    session_id: Optional[int] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get attendance records with optional filters."""
    query = db.query(AttendanceRecord)
    
    # Students can only see their own records
    if current_user.role != "admin":
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if profile:
            query = query.filter(AttendanceRecord.student_profile_id == profile.id)
        else:
            return []
    
    if student_profile_id:
        query = query.filter(AttendanceRecord.student_profile_id == student_profile_id)
    if session_id:
        query = query.filter(AttendanceRecord.session_id == session_id)
    if start_date or end_date:
        query = query.join(ClassSession).filter(ClassSession.session_date >= start_date if start_date else True)
        if end_date:
            query = query.filter(ClassSession.session_date <= end_date)
    
    records = query.order_by(desc(AttendanceRecord.created_at)).all()
    
    # Add student and session info
    results = []
    for record in records:
        profile = db.query(StudentProfile).filter(StudentProfile.id == record.student_profile_id).first()
        session = db.query(ClassSession).filter(ClassSession.id == record.session_id).first()
        
        response = AttendanceRecordResponse.model_validate(record)
        if profile:
            response.student_name = profile.full_name or profile.display_name
            response.student_public_id = profile.public_id
        if session:
            response.session = ClassSessionResponse.model_validate(session)
        results.append(response)
    
    return results


@router.get("/stats/{student_profile_id}", response_model=AttendanceStats)
async def get_attendance_stats(
    student_profile_id: int,
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get attendance statistics for a student."""
    # Check permissions
    if current_user.role != "admin":
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if not profile or profile.id != student_profile_id:
            raise HTTPException(status_code=403, detail="You can only view your own stats")
    
    # Build query
    query = db.query(AttendanceRecord).filter(
        AttendanceRecord.student_profile_id == student_profile_id
    )
    
    if start_date or end_date:
        query = query.join(ClassSession)
        if start_date:
            query = query.filter(ClassSession.session_date >= start_date)
        if end_date:
            query = query.filter(ClassSession.session_date <= end_date)
    
    records = query.all()
    
    # Calculate stats
    total_sessions = len(records)
    present_count = sum(1 for r in records if r.status == "present")
    absent_count = sum(1 for r in records if r.status == "absent")
    on_break_count = sum(1 for r in records if r.status == "on_break")
    leave_count = sum(1 for r in records if r.status == "leave")
    
    attendance_percentage = (present_count / total_sessions * 100) if total_sessions > 0 else 0
    
    # Monthly breakdown
    monthly_stats = {}
    if start_date and end_date:
        current = start_date.replace(day=1)
        while current <= end_date:
            month_key = current.strftime("%Y-%m")
            month_records = [r for r in records if r.session and r.session.session_date.strftime("%Y-%m") == month_key]
            month_total = len(month_records)
            month_present = sum(1 for r in month_records if r.status == "present")
            monthly_stats[month_key] = {
                "total": month_total,
                "present": month_present,
                "percentage": (month_present / month_total * 100) if month_total > 0 else 0
            }
            # Move to next month
            if current.month == 12:
                current = current.replace(year=current.year + 1, month=1)
            else:
                current = current.replace(month=current.month + 1)
    
    return AttendanceStats(
        total_sessions=total_sessions,
        present_count=present_count,
        absent_count=absent_count,
        on_break_count=on_break_count,
        leave_count=leave_count,
        attendance_percentage=round(attendance_percentage, 2),
        monthly_stats=monthly_stats
    )


# Certificate Management
@router.post("/certificates", response_model=CertificateResponse)
async def create_certificate(
    certificate_data: CertificateCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a certificate for a student."""
    certificate = Certificate(
        student_profile_id=certificate_data.student_profile_id,
        title=certificate_data.title,
        marks=certificate_data.marks,
        date_issued=certificate_data.date_issued,
        description=certificate_data.description,
        certificate_file_url=certificate_data.certificate_file_url,
        issued_by_user_id=admin.id
    )
    db.add(certificate)
    db.commit()
    db.refresh(certificate)
    
    # Add student info
    profile = db.query(StudentProfile).filter(StudentProfile.id == certificate_data.student_profile_id).first()
    response = CertificateResponse.model_validate(certificate)
    if profile:
        response.student_name = profile.full_name or profile.display_name
        response.student_public_id = profile.public_id
    
    return response


@router.get("/certificates", response_model=List[CertificateResponse])
async def get_certificates(
    student_profile_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get certificates with optional student filter."""
    query = db.query(Certificate)
    
    # Students can only see their own certificates
    if current_user.role != "admin":
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if profile:
            query = query.filter(Certificate.student_profile_id == profile.id)
        else:
            return []
    elif student_profile_id:
        query = query.filter(Certificate.student_profile_id == student_profile_id)
    
    certificates = query.order_by(desc(Certificate.date_issued)).all()
    
    # Add student info
    results = []
    for cert in certificates:
        profile = db.query(StudentProfile).filter(StudentProfile.id == cert.student_profile_id).first()
        response = CertificateResponse.model_validate(cert)
        if profile:
            response.student_name = profile.full_name or profile.display_name
            response.student_public_id = profile.public_id
        results.append(response)
    
    return results


@router.delete("/certificates/{certificate_id}")
async def delete_certificate(
    certificate_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a certificate."""
    certificate = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    db.delete(certificate)
    db.commit()
    return {"message": "Certificate deleted successfully"}


# Helper endpoint to get students for a branch (for admin dashboard)
@router.get("/students")
async def get_students_for_attendance(
    branch: Optional[str] = Query(None),
    course: Optional[str] = Query(None),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get list of students for attendance marking (admin only)."""
    query = db.query(StudentProfile).join(User).filter(User.role == "student")
    
    if branch:
        query = query.filter(StudentProfile.branch == branch)
    if course:
        query = query.filter(StudentProfile.course == course)
    
    profiles = query.filter(StudentProfile.status == "active").all()
    
    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "public_id": p.public_id,
            "name": p.full_name or p.display_name or "Unknown",
            "display_name": p.display_name,
            "class_name": p.class_name,
            "course": p.course,
            "level": p.level,
            "branch": p.branch
        }
        for p in profiles
    ]
