# How to Run the Reward System Migration

The database is missing columns required for the reward system. You need to add these columns to your PostgreSQL database.

## Option 1: Run SQL Directly (Recommended)

1. Connect to your PostgreSQL database (using psql, pgAdmin, or your database tool)
2. Run the SQL commands from `REWARD_SYSTEM_MIGRATION.sql`:

```sql
-- Add columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS total_questions_attempted INTEGER DEFAULT 0;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_grace_skip_date TIMESTAMP;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS grace_skip_week_start TIMESTAMP;

-- Add column to attendance_records table
ALTER TABLE attendance_records 
ADD COLUMN IF NOT EXISTS t_shirt_worn BOOLEAN DEFAULT FALSE;

-- Add columns to rewards table
ALTER TABLE rewards 
ADD COLUMN IF NOT EXISTS badge_category VARCHAR(50) DEFAULT 'general';

ALTER TABLE rewards 
ADD COLUMN IF NOT EXISTS is_lifetime BOOLEAN DEFAULT FALSE;

ALTER TABLE rewards 
ADD COLUMN IF NOT EXISTS month_earned VARCHAR(7);
```

## Option 2: Run Python Migration Script

1. Activate your virtual environment:
   ```bash
   # If using venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # Linux/Mac
   ```

2. Run the migration:
   ```bash
   python run_reward_migration.py
   ```

## Option 3: Using psql Command Line

If you have psql installed and know your database connection string:

```bash
psql $DATABASE_URL -f REWARD_SYSTEM_MIGRATION.sql
```

Or if using Railway/Heroku:

```bash
railway run psql < REWARD_SYSTEM_MIGRATION.sql
# or
heroku pg:psql < REWARD_SYSTEM_MIGRATION.sql
```

## Verify Migration

After running the migration, verify the columns exist:

```sql
-- Check users table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('total_questions_attempted', 'last_grace_skip_date', 'grace_skip_week_start');

-- Check attendance_records table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'attendance_records' 
AND column_name = 't_shirt_worn';

-- Check rewards table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rewards' 
AND column_name IN ('badge_category', 'is_lifetime', 'month_earned');
```

## After Migration

Once the migration is complete, restart your backend server and try logging in again. The login should work now.
