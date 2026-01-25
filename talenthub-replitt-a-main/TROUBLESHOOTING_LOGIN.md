# Login Troubleshooting Guide

## Issue: "Signing in..." hangs and times out

### Quick Fixes

1. **Check if backend is running:**
   ```bash
   docker-compose ps
   ```
   You should see both `backend` and `frontend` services running.

2. **Check backend logs:**
   ```bash
   docker-compose logs backend
   ```
   Look for any errors, especially related to:
   - `GOOGLE_CLIENT_ID` not set
   - Database connection issues
   - Import errors

3. **Test backend directly:**
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"ok","message":"Server is running"}`

4. **Restart containers:**
   ```bash
   docker-compose restart
   ```

### Common Issues

#### Issue 1: Backend not accessible
**Symptoms:** Timeout error, "Backend is not responding"

**Solutions:**
- Check if backend container is running: `docker-compose ps backend`
- Check backend logs: `docker-compose logs backend`
- Verify port 8000 is not blocked: `lsof -i :8000`
- Restart backend: `docker-compose restart backend`

#### Issue 2: GOOGLE_CLIENT_ID not set
**Symptoms:** Backend logs show "GOOGLE_CLIENT_ID not set in environment"

**Solutions:**
- Check backend `.env` file exists: `cat backend/.env`
- Verify `GOOGLE_CLIENT_ID` is set: `grep GOOGLE_CLIENT_ID backend/.env`
- Restart backend after setting: `docker-compose restart backend`

#### Issue 3: Vite proxy not working
**Symptoms:** Frontend can't reach backend through `/api`

**Solutions:**
- Check Vite dev server is running (should show proxy logs)
- Try direct backend URL: Set `VITE_API_BASE=http://localhost:8000` in frontend `.env`
- Restart frontend: `docker-compose restart frontend`

#### Issue 4: CORS errors
**Symptoms:** Browser console shows CORS errors

**Solutions:**
- Backend CORS is already configured to allow all origins
- Check backend logs for CORS-related errors
- Verify backend is running on port 8000

### Debug Steps

1. **Open browser console (F12)** and look for:
   - "Attempting login with token..."
   - "Trying endpoint: ..."
   - Any error messages

2. **Check backend logs in real-time:**
   ```bash
   docker-compose logs -f backend
   ```
   Then try logging in and watch for:
   - "Login attempt received..."
   - "Verifying token with client ID..."
   - Any error messages

3. **Test backend endpoints manually:**
   ```bash
   # Health check
   curl http://localhost:8000/health
   
   # Test login endpoint (will fail but shows if it's reachable)
   curl -X POST http://localhost:8000/users/login \
     -H "Content-Type: application/json" \
     -d '{"token":"test"}'
   ```

### Environment Variables Checklist

**Backend `.env` (required):**
- `GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com`
- `SECRET_KEY=your-secret-key`
- `ADMIN_EMAILS=your-email@gmail.com`
- `DATABASE_URL=sqlite:////data/abacus_replitt.db`

**Frontend `.env` (optional, for explicit backend URL):**
- `VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com`
- `VITE_API_BASE=http://localhost:8000/api` (only if proxy doesn't work)

### What I Fixed

1. ✅ Simplified API endpoint structure (uses consistent `/` base path)
2. ✅ Added health check before login attempt
3. ✅ Improved error messages with troubleshooting steps
4. ✅ Added comprehensive logging
5. ✅ Reduced timeout to 15 seconds per attempt
6. ✅ Updated Vite proxy configuration

### Next Steps

1. **Check backend is running:**
   ```bash
   docker-compose ps
   ```

2. **Check backend logs for errors:**
   ```bash
   docker-compose logs backend | tail -50
   ```

3. **Verify GOOGLE_CLIENT_ID is set:**
   ```bash
   docker-compose exec backend env | grep GOOGLE_CLIENT_ID
   ```

4. **Try logging in again and check:**
   - Browser console (F12) for frontend logs
   - Backend logs for backend errors

If still stuck, share:
- Browser console output
- Backend logs output
- Result of `docker-compose ps`





