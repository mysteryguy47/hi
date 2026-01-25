"""
Migration script to add reward system fields.
Run this from the project root: python run_reward_migration.py
"""
import sys
import os

# Add backend to path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Change to backend directory for imports
os.chdir(backend_path)

from sqlalchemy import text, inspect
from models import get_db, engine

def run_migration():
    """Add reward system fields to database."""
    db = next(get_db())
    try:
        inspector = inspect(engine)
        
        # Check users table
        if 'users' in inspector.get_table_names():
            existing_user_columns = {col['name'] for col in inspector.get_columns('users')}
            print(f"📊 Users table columns: {sorted(existing_user_columns)}")
            
            # Add total_questions_attempted
            if 'total_questions_attempted' not in existing_user_columns:
                db.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN total_questions_attempted INTEGER DEFAULT 0
                """))
                print("✅ Added total_questions_attempted to users")
            else:
                print("ℹ️  total_questions_attempted already exists")
            
            # Add last_grace_skip_date
            if 'last_grace_skip_date' not in existing_user_columns:
                db.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN last_grace_skip_date TIMESTAMP
                """))
                print("✅ Added last_grace_skip_date to users")
            else:
                print("ℹ️  last_grace_skip_date already exists")
            
            # Add grace_skip_week_start
            if 'grace_skip_week_start' not in existing_user_columns:
                db.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN grace_skip_week_start TIMESTAMP
                """))
                print("✅ Added grace_skip_week_start to users")
            else:
                print("ℹ️  grace_skip_week_start already exists")
            
            # Add last_daily_login_bonus_date
            if 'last_daily_login_bonus_date' not in existing_user_columns:
                db.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN last_daily_login_bonus_date TIMESTAMP
                """))
                print("✅ Added last_daily_login_bonus_date to users")
            else:
                print("ℹ️  last_daily_login_bonus_date already exists")
        
        # Check attendance_records table
        if 'attendance_records' in inspector.get_table_names():
            existing_attendance_columns = {col['name'] for col in inspector.get_columns('attendance_records')}
            
            if 't_shirt_worn' not in existing_attendance_columns:
                db.execute(text("""
                    ALTER TABLE attendance_records 
                    ADD COLUMN t_shirt_worn BOOLEAN DEFAULT FALSE
                """))
                print("✅ Added t_shirt_worn to attendance_records")
            else:
                print("ℹ️  t_shirt_worn already exists")
        
        # Check rewards table
        if 'rewards' in inspector.get_table_names():
            existing_rewards_columns = {col['name'] for col in inspector.get_columns('rewards')}
            
            if 'badge_category' not in existing_rewards_columns:
                db.execute(text("""
                    ALTER TABLE rewards 
                    ADD COLUMN badge_category VARCHAR(50) DEFAULT 'general'
                """))
                print("✅ Added badge_category to rewards")
            else:
                print("ℹ️  badge_category already exists")
            
            if 'is_lifetime' not in existing_rewards_columns:
                db.execute(text("""
                    ALTER TABLE rewards 
                    ADD COLUMN is_lifetime BOOLEAN DEFAULT FALSE
                """))
                print("✅ Added is_lifetime to rewards")
            else:
                print("ℹ️  is_lifetime already exists")
            
            if 'month_earned' not in existing_rewards_columns:
                db.execute(text("""
                    ALTER TABLE rewards 
                    ADD COLUMN month_earned VARCHAR(7)
                """))
                print("✅ Added month_earned to rewards")
            else:
                print("ℹ️  month_earned already exists")
        
        db.commit()
        print("\n✅ Migration completed successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Migration failed: {e}")
        import traceback
        print(traceback.format_exc())
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🟡 Starting reward system migration...")
    run_migration()
