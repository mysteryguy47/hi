"""Gamification logic for points, badges, and streaks."""
from sqlalchemy.orm import Session
from models import User, Reward, PracticeSession
from datetime import datetime, timedelta
from timezone_utils import get_ist_now
from typing import List, Optional


def calculate_points(
    correct_answers: int,
    total_questions: int,
    time_taken: float,
    difficulty_mode: str,
    accuracy: float,
    is_mental_math: bool = True  # True for mental math, False for paper attempts
) -> int:
    """
    Calculate points earned for a practice session or paper attempt.
    
    Mental Math Practice: 10 points per correct answer only (same as practice papers)
    Paper Attempts: 10 points per correct answer only (marks * 10)
    """
    if is_mental_math:
        # Mental math: 10 points per correct answer only (same as practice papers)
        return correct_answers * 10
    else:
        # Paper attempts: points only on correct answers (marks * 10)
        # Example: 39/50 = 390 points, 2/4 = 20 points
        return correct_answers * 10


def check_and_award_badges(
    db: Session,
    user: User,
    session: PracticeSession
) -> List[str]:
    """Check if user qualifies for badges and award them."""
    awarded_badges = []
    
    # Accuracy King - 95%+ accuracy in a session
    if session.accuracy >= 95:
        badge_type = "accuracy_king"
        existing = db.query(Reward).filter(
            Reward.user_id == user.id,
            Reward.badge_type == badge_type
        ).first()
        if not existing:
            reward = Reward(
                user_id=user.id,
                badge_type=badge_type,
                badge_name="Accuracy King"
            )
            db.add(reward)
            awarded_badges.append("Accuracy King")
    
    # Speed Star - Average < 2 seconds per question
    avg_time = session.time_taken / session.total_questions if session.total_questions > 0 else 0
    if avg_time < 2 and session.total_questions >= 10:
        badge_type = "speed_star"
        existing = db.query(Reward).filter(
            Reward.user_id == user.id,
            Reward.badge_type == badge_type
        ).first()
        if not existing:
            reward = Reward(
                user_id=user.id,
                badge_type=badge_type,
                badge_name="Speed Star"
            )
            db.add(reward)
            awarded_badges.append("Speed Star")
    
    # Perfect Score - 100% accuracy
    if session.accuracy == 100 and session.total_questions >= 5:
        badge_type = "perfect_score"
        existing = db.query(Reward).filter(
            Reward.user_id == user.id,
            Reward.badge_type == badge_type
        ).first()
        if not existing:
            reward = Reward(
                user_id=user.id,
                badge_type=badge_type,
                badge_name="Perfect Score"
            )
            db.add(reward)
            awarded_badges.append("Perfect Score")
    
    # Streak badges
    if user.current_streak >= 7:
        badge_type = "streak_7"
        existing = db.query(Reward).filter(
            Reward.user_id == user.id,
            Reward.badge_type == badge_type
        ).first()
        if not existing:
            reward = Reward(
                user_id=user.id,
                badge_type=badge_type,
                badge_name="7-Day Streak"
            )
            db.add(reward)
            awarded_badges.append("7-Day Streak")
    
    if user.current_streak >= 30:
        badge_type = "streak_30"
        existing = db.query(Reward).filter(
            Reward.user_id == user.id,
            Reward.badge_type == badge_type
        ).first()
        if not existing:
            reward = Reward(
                user_id=user.id,
                badge_type=badge_type,
                badge_name="30-Day Streak"
            )
            db.add(reward)
            awarded_badges.append("30-Day Streak")
    
    return awarded_badges


def check_and_award_super_rewards(db: Session, user: User) -> List[str]:
    """
    Check and award SUPER badge rewards based on total points.
    Returns list of newly awarded rewards.
    """
    awarded_rewards = []
    total_points = user.total_points
    
    # Define reward thresholds
    rewards = [
        (1500, "chocolate_1", "Chocolate 🍫"),
        (3000, "super_s", "SUPER Badge - S"),
        (4500, "chocolate_2", "Chocolate 🍫"),
        (6000, "super_u", "SUPER Badge - U"),
        (7500, "chocolate_3", "Chocolate 🍫"),
        (9000, "super_p", "SUPER Badge - P"),
        (12000, "super_e", "SUPER Badge - E + Mystery Gift 🎁"),
        (15000, "super_r", "SUPER Badge - R + Party 🎉"),
    ]
    
    for threshold, badge_type, badge_name in rewards:
        if total_points >= threshold:
            # Check if already awarded
            existing = db.query(Reward).filter(
                Reward.user_id == user.id,
                Reward.badge_type == badge_type
            ).first()
            
            if not existing:
                reward = Reward(
                    user_id=user.id,
                    badge_type=badge_type,
                    badge_name=badge_name
                )
                db.add(reward)
                awarded_rewards.append(badge_name)
    
    # Don't commit here - let the caller handle the transaction
    return awarded_rewards


def update_streak(db: Session, user: User, questions_practiced_today: int = 0) -> None:
    """
    Update user's practice streak.
    Streak only increments if user practices 10+ questions daily in mental math.
    """
    ist_now = get_ist_now()
    today = ist_now.date()
    
    # Check if user practiced 10+ questions today (for mental math only)
    # Count questions from today's practice sessions (excluding current session)
    from models import PracticeSession
    today_start = datetime.combine(today, datetime.min.time()).replace(tzinfo=ist_now.tzinfo)
    today_sessions = db.query(PracticeSession).filter(
        PracticeSession.user_id == user.id,
        PracticeSession.completed_at >= today_start,
        PracticeSession.completed_at < ist_now  # Exclude current session
    ).all()
    
    # Count total questions from previous sessions today
    total_questions_today = sum(session.total_questions for session in today_sessions)
    
    # Add current session questions
    total_questions_today += questions_practiced_today
    
    # Check if minimum requirement met (10 questions)
    met_daily_requirement = total_questions_today >= 10
    
    if user.last_practice_date:
        last_date = user.last_practice_date.date()
        days_diff = (today - last_date).days
        
        if days_diff == 0:
            # Same day - check if requirement is met, reset streak if not
            # This handles cases where user practices multiple sessions in one day
            # Example: Session 1 = 5 questions, Session 2 = 4 questions (total 9 < 10)
            # The streak should be reset to 0 if total < 10
            if not met_daily_requirement:
                # If total questions today is less than 10, reset streak to 0
                user.current_streak = 0
                print(f"🟡 [STREAK] Same day practice: {total_questions_today} questions (< 10), streak reset to 0")
            # If requirement is met (>= 10 questions), keep current streak
            # Note: Streak only increments when moving to a new day (days_diff == 1)
            # On the same day, we just maintain the streak if requirement is met
        elif days_diff == 1:
            # Consecutive day - check if yesterday met requirement
            # Use IST timezone for date calculations
            yesterday_start = datetime.combine(last_date, datetime.min.time()).replace(tzinfo=ist_now.tzinfo)
            yesterday_end = datetime.combine(today, datetime.min.time()).replace(tzinfo=ist_now.tzinfo)
            yesterday_sessions = db.query(PracticeSession).filter(
                PracticeSession.user_id == user.id,
                PracticeSession.completed_at >= yesterday_start,
                PracticeSession.completed_at < yesterday_end
            ).all()
            
            yesterday_questions = sum(session.total_questions for session in yesterday_sessions)
            yesterday_met_requirement = yesterday_questions >= 10
            
            if yesterday_met_requirement:
                # Yesterday met requirement - increment streak
                user.current_streak += 1
                if user.current_streak > user.longest_streak:
                    user.longest_streak = user.current_streak
            else:
                # Yesterday didn't meet requirement - reset streak
                if met_daily_requirement:
                    user.current_streak = 1  # Start new streak today
                else:
                    user.current_streak = 0
        else:
            # Streak broken (more than 1 day gap)
            if met_daily_requirement:
                user.current_streak = 1  # Start new streak
            else:
                user.current_streak = 0
    else:
        # First practice - start streak only if requirement met (10+ questions)
        if met_daily_requirement:
            user.current_streak = 1
        else:
            user.current_streak = 0
            print(f"🟡 [STREAK] First practice: {total_questions_today} questions (< 10), streak set to 0")
    
    user.last_practice_date = get_ist_now()
    
    # Final validation: Ensure streak is 0 if requirement not met (safety check)
    if user.current_streak > 0 and not met_daily_requirement:
        print(f"⚠️ [STREAK] Safety check: Streak was {user.current_streak} but requirement not met ({total_questions_today} < 10), resetting to 0")
        user.current_streak = 0
    # Don't commit here - let the caller handle the transaction





