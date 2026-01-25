# Railway Quick Start Checklist

## 🚀 Quick Setup (5 minutes)

### Step 1: Add PostgreSQL Database
1. Railway Dashboard → Your Project → **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. ✅ Database created automatically

### Step 2: Add Backend Service
1. Railway Dashboard → **"+ New"** → **"GitHub Repo"** → Select your repo
2. Go to **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3: Set Environment Variables
Go to Backend Service → **Variables** tab → Add these:

```bash
# 1. DATABASE_URL (IMPORTANT - Use Railway's Reference)
# Click "Add Reference" → Select PostgreSQL → Select "DATABASE_URL"
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}

# 2. Secret Key (generate random string)
SECRET_KEY=change-this-to-random-secret-key-12345

# 3. Admin Emails
ADMIN_EMAILS=ayushkhurana47@gmail.com,sunitakhurana15061977@gmail.com
```

### Step 4: Deploy
1. Railway will auto-deploy when you push to GitHub
2. Or click **"Deploy"** button manually
3. Wait for deployment to complete

### Step 5: Verify
1. Check **Logs** tab → Look for: `✅ [STARTUP] Database initialized successfully`
2. Visit: `https://your-service.railway.app/health`
3. Should see: `{"status": "ok", "message": "Server is running"}`

---

## ❌ Common Error Fixes

### Error: "could not translate host name"
**Problem**: DATABASE_URL not set correctly

**Fix**:
1. Go to Backend Service → **Variables**
2. Click **"+ New Variable"**
3. Click **"Add Reference"** (NOT "Raw Value")
4. Select your **PostgreSQL** database
5. Select **"DATABASE_URL"**
6. Save and redeploy

### Error: "SSL connection required"
**Problem**: Missing SSL in connection string

**Fix**: The code automatically adds SSL. Just ensure DATABASE_URL is correct (use Railway's reference).

### Error: "database initialization failed"
**Problem**: Database not accessible

**Fix**:
1. Verify PostgreSQL service is running (green status)
2. Check DATABASE_URL is set (use Railway's reference)
3. Check logs for specific error message

---

## 📋 Environment Variables Checklist

- [ ] `DATABASE_URL` - Use Railway's "Add Reference" feature
- [ ] `SECRET_KEY` - Random string (e.g., `openssl rand -hex 32`)
- [ ] `ADMIN_EMAILS` - Comma-separated email addresses
- [ ] `PORT` - Railway sets this automatically (optional to set)

---

## 🔍 How to Check if Database is Connected

1. **Check Logs**: Look for `✅ [STARTUP] Database initialized successfully`
2. **Test API**: Visit `https://your-service.railway.app/health`
3. **Test Login**: Try logging in through your frontend
4. **Check Admin**: If you can access `/admin`, database is working!

---

## 💡 Pro Tips

1. **Always use Railway's "Add Reference"** for DATABASE_URL - it auto-updates if database changes
2. **Check logs first** when something breaks - Railway shows detailed error messages
3. **Redeploy after changing variables** - Some changes require a redeploy
4. **Use Railway's free domain** - They provide `*.railway.app` domains with free SSL

---

## 🆘 Still Having Issues?

1. Check **RAILWAY_SETUP_GUIDE.md** for detailed instructions
2. Check Railway **Logs** tab for error messages
3. Verify all environment variables are set correctly
4. Ensure PostgreSQL service is running (green status)
