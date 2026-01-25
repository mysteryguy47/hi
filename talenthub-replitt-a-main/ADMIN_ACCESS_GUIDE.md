# Admin Dashboard Access Guide

## 📍 Where to Access the Admin Dashboard

The Admin Dashboard is accessible at:
- **URL**: `/admin` (e.g., `http://localhost:5173/admin` or `https://yourdomain.com/admin`)
- **Navigation**: When logged in as an admin, you'll see an "Admin Dashboard" link in the user profile dropdown menu (top right corner)

## 🔐 Who Can Access the Admin Dashboard

**Only users with the `admin` role can access the admin dashboard.**

Access is controlled in two ways:
1. **Frontend Protection**: The route checks if the user has `role === "admin"` before allowing access
2. **Backend Protection**: All admin API endpoints verify the admin role using `get_current_admin()`

## ⚙️ How to Manage Admin Access

### Setting Up Admin Access (2 Gmail Accounts)

Admin access is managed through the `ADMIN_EMAILS` environment variable in the backend.

#### Step 1: Set Environment Variable

Create or update a `.env` file in the `backend/` directory:

```bash
# backend/.env
ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com
```

**Important Notes:**
- Use comma-separated email addresses (no spaces)
- Use the **exact Gmail addresses** that users will sign in with
- Case-sensitive matching (though Gmail emails are typically case-insensitive)

#### Step 2: Restart Backend

After setting the environment variable, restart your backend server:

```bash
# If using Docker
docker-compose restart backend

# If running directly
# Stop the server (Ctrl+C) and restart:
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Step 3: First-Time Admin Login

When a user with an email in `ADMIN_EMAILS` signs in for the **first time**, they will automatically be assigned the `admin` role.

**Important**: If a user already exists in the database with `role="student"`, you need to manually update their role:

**Option A: Update via Database**
```sql
-- Connect to your database
UPDATE users SET role = 'admin' WHERE email = 'admin1@gmail.com';
UPDATE users SET role = 'admin' WHERE email = 'admin2@gmail.com';
```

**Option B: Delete and Re-create Account**
1. Delete the user account through the admin dashboard (if you have access)
2. Or manually delete from database
3. Have the user sign in again - they'll be assigned `admin` role

### For Docker Deployment

If using Docker, set the environment variable in `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      - ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com
      # ... other environment variables
```

Or use a `.env` file that Docker Compose reads automatically.

### For Production Deployment

Set the environment variable in your production environment:

**Linux/Systemd:**
```bash
# In /etc/systemd/system/talenthub-backend.service
[Service]
Environment="ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com"
```

**Platform-as-a-Service (Railway, Render, etc.):**
- Add `ADMIN_EMAILS` as an environment variable in your platform's dashboard
- Value: `admin1@gmail.com,admin2@gmail.com`

## 🔍 Verifying Admin Access

1. **Check User Role in Database:**
   ```sql
   SELECT email, role FROM users WHERE email IN ('admin1@gmail.com', 'admin2@gmail.com');
   ```
   Should show `role = 'admin'`

2. **Check Frontend:**
   - Sign in with one of the admin emails
   - Look for "Admin Dashboard" link in the user profile dropdown (top right)
   - Navigate to `/admin` - should show the admin dashboard

3. **Check Backend:**
   - Try accessing an admin endpoint (e.g., `/users/admin/stats`)
   - Should return data, not a 403 Forbidden error

## 🛡️ Security Features

1. **Frontend Protection:**
   - `AdminRoute` component checks `isAdmin` before rendering
   - Non-admins see "Access Denied" message
   - Admin Dashboard link only appears for admins

2. **Backend Protection:**
   - All admin routes use `get_current_admin()` dependency
   - Verifies JWT token and checks `role === "admin"`
   - Returns 403 Forbidden if not admin

3. **API Endpoints Protected:**
   - `/users/admin/stats` - Admin statistics
   - `/users/admin/students` - List all students
   - `/users/admin/students/{id}/stats` - Student stats
   - `/users/admin/students/{id}` - Delete student
   - `/users/admin/students/{id}/points` - Update points
   - `/users/admin/leaderboard/refresh` - Refresh leaderboard
   - `/users/admin/database/stats` - Database statistics

## 📝 Example Configuration

```bash
# backend/.env
ADMIN_EMAILS=john.doe@gmail.com,jane.smith@gmail.com
GOOGLE_CLIENT_ID=your-google-client-id
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./abacus_replitt.db
```

## ⚠️ Troubleshooting

**Problem**: User can't access admin dashboard even after setting `ADMIN_EMAILS`

**Solutions:**
1. Check that the email in `ADMIN_EMAILS` matches exactly the email used for Google sign-in
2. Verify the user's role in the database: `SELECT email, role FROM users WHERE email = 'user@email.com';`
3. If role is `student`, update it: `UPDATE users SET role = 'admin' WHERE email = 'user@email.com';`
4. Restart the backend server after changing `ADMIN_EMAILS`
5. Clear browser cache and sign in again

**Problem**: "Access Denied" message appears

**Solutions:**
1. Verify you're signed in with the correct Gmail account
2. Check that your email is in `ADMIN_EMAILS` environment variable
3. Verify your role in the database is `admin`
4. Try signing out and signing in again

## 🔄 Changing Admin Access

To add a new admin:
1. Add their email to `ADMIN_EMAILS` environment variable
2. Restart backend
3. Have them sign in (first-time users get admin automatically)
4. Or manually update: `UPDATE users SET role = 'admin' WHERE email = 'newadmin@gmail.com';`

To remove admin access:
1. Update in database: `UPDATE users SET role = 'student' WHERE email = 'oldadmin@gmail.com';`
2. Remove from `ADMIN_EMAILS` (optional, only affects new users)

---

**Last Updated**: 2024
**Maintained By**: Talent Hub Development Team
