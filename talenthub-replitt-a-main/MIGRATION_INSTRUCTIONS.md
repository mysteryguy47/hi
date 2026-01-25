# Fee Management Tables Migration

The fee management tables need to be created in your database. Here are the options:

## Option 1: Redeploy (Recommended)

Simply redeploy your backend on Railway. The `init_db()` function runs on startup and will automatically create the tables.

1. Commit and push your changes
2. Railway will automatically redeploy
3. Check the logs for: `✅ [INIT_DB] Tables created. Fee tables: ['fee_plans', 'fee_assignments', 'fee_transactions']`

## Option 2: Run Migration Script Manually

If you need to create the tables without redeploying:

### Via Railway CLI (if installed):
```bash
railway run python backend/railway_migrate.py
```

### Via Railway Dashboard:
1. Go to your Railway project
2. Open the "Deploy Logs" or use "Shell" if available
3. Run: `python backend/railway_migrate.py`

### Via SSH (if enabled):
```bash
cd backend
python railway_migrate.py
```

## Option 3: Manual SQL (Last Resort)

If neither option works, you can run the SQL directly in your PostgreSQL database:

```sql
-- These will be created automatically, but if needed, you can inspect the structure
-- by checking the models.py file or running the migration script
```

**Note**: The tables are defined in `backend/models.py` (FeePlan, FeeAssignment, FeeTransaction models). The migration script (`railway_migrate.py`) will create them with the correct schema.
