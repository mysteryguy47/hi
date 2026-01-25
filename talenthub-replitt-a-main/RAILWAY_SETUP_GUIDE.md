# Railway Deployment Guide for Talent Hub

## Overview
This guide will help you deploy Talent Hub on Railway with a PostgreSQL database.

---

## Step 1: Create Railway Account & Project

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"** (connect your GitHub account if needed)
4. Select your repository

---

## Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a PostgreSQL database
4. **Important**: Note the database name (e.g., `railway`)

---

## Step 3: Configure Backend Service

### 3.1 Add Backend Service

1. In your Railway project, click **"+ New"**
2. Select **"GitHub Repo"** (if not already connected) or **"Empty Service"**
3. If using GitHub, select your repository
4. Railway will auto-detect it's a Python project

### 3.2 Configure Service Settings

1. Click on your **backend service**
2. Go to **"Settings"** tab
3. Set the following:

**Root Directory:**
```
backend
```

**Start Command:**
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Watch Paths:**
```
backend/
```

### 3.3 Set Environment Variables

Go to the **"Variables"** tab in your backend service and add:

#### Required Variables:

```bash
# Database URL - Railway automatically provides this
# Click "Add Reference" → Select your PostgreSQL database → Select "DATABASE_URL"
# OR manually set it (Railway provides it in the format):
# postgresql://postgres:password@hostname:port/railway

# Secret Key for JWT (generate a random string)
SECRET_KEY=your-super-secret-key-change-this-to-random-string

# Admin Emails (comma-separated)
ADMIN_EMAILS=ayushkhurana47@gmail.com,sunitakhurana15061977@gmail.com

# Port (Railway sets this automatically, but you can reference it)
PORT=${{PORT}}
```

#### How to Get DATABASE_URL from Railway:

**Option 1: Use Railway's Variable Reference (Recommended)**
1. In your backend service → **Variables** tab
2. Click **"+ New Variable"**
3. Click **"Add Reference"**
4. Select your **PostgreSQL database**
5. Select **"DATABASE_URL"**
6. Railway will automatically sync this variable

**Option 2: Manual Copy**
1. Click on your **PostgreSQL database** service
2. Go to **"Variables"** tab
3. Copy the `DATABASE_URL` value
4. Paste it in your backend service's **Variables** tab

**⚠️ Important**: Railway's `DATABASE_URL` format is:
```
postgresql://postgres:PASSWORD@HOSTNAME:PORT/railway
```

The code will automatically add `?sslmode=require` if needed.

---

## Step 4: Verify Database Connection

### 4.1 Check Logs

1. Go to your backend service → **"Deployments"** tab
2. Click on the latest deployment
3. Check the logs for:
   - ✅ `[STARTUP] Database initialized successfully`
   - ❌ If you see: `could not translate host name` → DATABASE_URL is incorrect

### 4.2 Common Issues & Fixes

**Issue 1: "could not translate host name"**
- **Cause**: DATABASE_URL is not set or incorrect
- **Fix**: 
  1. Verify DATABASE_URL is set in backend service variables
  2. Use Railway's "Add Reference" feature (recommended)
  3. Or manually copy DATABASE_URL from PostgreSQL service

**Issue 2: "SSL connection required"**
- **Cause**: Missing SSL parameters
- **Fix**: The code automatically adds `?sslmode=require` - ensure DATABASE_URL is correct

**Issue 3: "database does not exist"**
- **Cause**: Wrong database name in connection string
- **Fix**: Railway's default database is `railway` - don't change it

---

## Step 5: Deploy Frontend (Optional - Separate Service)

If you want to deploy frontend on Railway too:

1. Add another service → **"GitHub Repo"** → Select your repo
2. **Settings:**
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -l $PORT`
3. **Variables:**
   ```bash
   VITE_API_BASE=https://your-backend-service.railway.app/api
   PORT=${{PORT}}
   ```

**OR** deploy frontend separately on Vercel/Netlify (recommended for better performance).

---

## Step 6: Custom Domain (Optional)

1. In your service → **Settings** → **Domains**
2. Click **"Generate Domain"** (Railway provides a free `.railway.app` domain)
3. Or add your custom domain:
   - Click **"Custom Domain"**
   - Enter your domain (e.g., `talenthub.yourdomain.com`)
   - Add DNS records as instructed by Railway

---

## Step 7: Verify Everything Works

### 7.1 Health Check
Visit: `https://your-backend.railway.app/health`
Should return: `{"status": "ok", "message": "Server is running"}`

### 7.2 Database Check
Visit: `https://your-backend.railway.app/users/me` (requires login)
If it works, database is connected!

### 7.3 Test Admin Access
1. Visit your frontend
2. Log in with one of the admin emails
3. Try accessing `/admin` route
4. Should work if `ADMIN_EMAILS` is set correctly

---

## Environment Variables Summary

### Backend Service Variables:
```bash
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}  # Use Railway's reference
SECRET_KEY=your-random-secret-key-here
ADMIN_EMAILS=ayushkhurana47@gmail.com,sunitakhurana15061977@gmail.com
PORT=${{PORT}}  # Railway sets this automatically
```

### PostgreSQL Service Variables (Auto-generated by Railway):
```bash
DATABASE_URL=postgresql://postgres:PASSWORD@HOSTNAME:PORT/railway
PGHOST=hostname
PGPORT=port
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=railway
```

---

## Troubleshooting

### Database Connection Issues

**Error: "could not translate host name"**
```bash
# Check if DATABASE_URL is set
# In Railway: Backend Service → Variables → Check DATABASE_URL exists
# Use "Add Reference" to link PostgreSQL DATABASE_URL
```

**Error: "SSL connection required"**
```bash
# The code automatically adds sslmode=require
# If still failing, check DATABASE_URL format
# Should be: postgresql://user:pass@host:port/db
```

**Error: "database initialization failed"**
```bash
# Check Railway logs for detailed error
# Common causes:
# 1. DATABASE_URL not set
# 2. Database service not running
# 3. Network connectivity issues
```

### Service Won't Start

**Check logs:**
1. Go to service → **Deployments** → Latest deployment → **Logs**
2. Look for Python errors, import errors, or missing dependencies

**Common fixes:**
- Ensure `requirements.txt` is in `backend/` folder
- Check that `uvicorn` is in requirements.txt
- Verify Python version (Railway auto-detects, but you can set it in `runtime.txt`)

### Port Issues

Railway automatically sets `$PORT` environment variable. Your start command should use:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## Quick Checklist

- [ ] Railway account created
- [ ] PostgreSQL database added
- [ ] Backend service created
- [ ] DATABASE_URL set (using Railway's "Add Reference")
- [ ] SECRET_KEY set (random string)
- [ ] ADMIN_EMAILS set (comma-separated)
- [ ] Service deployed successfully
- [ ] Health check endpoint works
- [ ] Database initialization successful (check logs)
- [ ] Can log in and access admin dashboard

---

## Support

If you're still having issues:
1. Check Railway logs: Service → Deployments → Latest → Logs
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL service is running
4. Check that DATABASE_URL format is correct (should start with `postgresql://`)

---

## Notes

- Railway provides free tier with limited resources
- PostgreSQL database is automatically backed up by Railway
- Railway auto-scales your services
- You can view database data using Railway's PostgreSQL dashboard
- Railway provides free SSL certificates automatically
