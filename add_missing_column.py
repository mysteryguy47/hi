"""
Quick migration script to add the missing last_daily_login_bonus_date column.
Run this from the project root: python add_missing_column.py
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

def add_missing_column():
    """Add last_daily_login_bonus_date column to users table."""
    db = next(get_db())
    try:
        inspector = inspect(engine)
        
        # Check users table
        if 'users' in inspector.get_table_names():
            existing_user_columns = {col['name'] for col in inspector.get_columns('users')}
            print(f"📊 Users table columns: {sorted(existing_user_columns)}")
            
            # Add last_daily_login_bonus_date
            if 'last_daily_login_bonus_date' not in existing_user_columns:
                db.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN last_daily_login_bonus_date TIMESTAMP
                """))
                db.commit()
                print("✅ Added last_daily_login_bonus_date to users table")
            else:
                print("ℹ️  last_daily_login_bonus_date column already exists")
        else:
            print("❌ Users table not found!")
        
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
    print("🟡 Adding missing last_daily_login_bonus_date column...")
    add_missing_column()
