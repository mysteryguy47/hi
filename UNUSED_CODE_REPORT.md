# Unused/Inaccessible Code Report

This document lists all files, pages, components, APIs, and code that are either:
1. Not accessible from the UI (no navigation links)
2. Not used anywhere in the codebase
3. One-time migration/utility scripts
4. Commented out or disabled

---

## 🔴 Pages Accessible via URL but NOT Linked in UI

### 1. `/rewards` - Rewards Page
- **Status**: Route exists in `App.tsx`, page component exists (`Rewards.tsx`)
- **Issue**: No link in Header, Footer, or any navigation menu
- **Access**: Only via direct URL: `/rewards`
- **API Usage**: Uses `/users/rewards/summary`, `/users/rewards/badges`, `/users/rewards/grace-skip`
- **Recommendation**: Add link to Header user menu or Dashboard

### 2. `/admin/student-ids` - Student ID Management
- **Status**: Route exists in `App.tsx`, page component exists (`AdminStudentIDManagement.tsx`)
- **Issue**: No link in Header admin menu or Admin Dashboard
- **Access**: Only via direct URL: `/admin/student-ids`
- **API Usage**: Uses `/users/admin/students/{id}/id-info`, `/users/admin/students/{id}/public-id`, `/users/admin/generate-student-id`
- **Recommendation**: Add link to Admin Dashboard or Header admin menu

### 3. `/promote-admin` - Promote Admin Page
- **Status**: Route exists in `App.tsx`, page component exists (`PromoteAdmin.tsx`)
- **Issue**: No link anywhere in the UI
- **Access**: Only via direct URL: `/promote-admin`
- **API Usage**: Uses `/users/admin/promote-self`
- **Recommendation**: Add link to Admin Dashboard or remove if not needed

### 4. `/admin/unified` - Unified Management
- **Status**: Route exists in `App.tsx`, page component exists (`AdminUnifiedManagement.tsx`)
- **Issue**: No link in Header admin menu or Admin Dashboard
- **Access**: Only via direct URL: `/admin/unified`
- **Recommendation**: Add link to Admin Dashboard or Header admin menu

### 5. `/settings` - Settings Page
- **Status**: Route is **commented out** in `App.tsx`, page component exists (`Settings.tsx`)
- **Issue**: Completely inaccessible - route is disabled
- **Code**: Line 173 in `App.tsx`: `{/* <Route path="/settings"> ... </Route> */}`
- **Recommendation**: Either enable the route and add navigation, or delete the page

---

## 🟡 Components Not Used or Hidden

### 1. `BackendTest.tsx`
- **Status**: Only used in `Login.tsx` as a hidden debug tool
- **Location**: `frontend/src/components/BackendTest.tsx`
- **Usage**: Toggle button in Login page (line 278-293)
- **Recommendation**: Remove if not needed for production, or move to admin-only debug panel

### 2. `Settings.tsx` (Page Component)
- **Status**: Page exists but route is commented out
- **Location**: `frontend/src/pages/Settings.tsx`
- **Functionality**: Allows updating display name
- **Recommendation**: Either enable and link, or delete

---

## 🟠 Backend Migration/Utility Scripts (One-Time Use)

These are Python scripts that were likely used for database migrations or one-time fixes. They should probably be moved to a `scripts/` or `migrations/` folder, or deleted if no longer needed:

1. **`backend/add_display_name_column.py`** - Adds display_name column
2. **`backend/create_all_missing_tables.py`** - Creates missing database tables
3. **`backend/create_fee_tables.py`** - Creates fee-related tables
4. **`backend/fix_fee_tables.py`** - Fixes fee table issues
5. **`backend/fix_index_conflict.py`** - Fixes index conflicts
6. **`backend/fix_orphaned_index.py`** - Drops orphaned indexes
7. **`backend/migrate_student_profiles.py`** - Migrates student profiles
8. **`backend/railway_migrate.py`** - Railway-specific migration
9. **`backend/promote_to_admin.py`** - Promotes user to admin
10. **`backend/run_migration.py`** - Runs migrations
11. **`run_reward_migration.py`** (root) - Reward system migration

**Recommendation**: Move to `backend/scripts/` or `backend/migrations/legacy/` folder, or delete if migrations are complete.

---

## 🔵 Potentially Unused API Endpoints

### Admin Endpoints (Check if called from frontend):

1. **`POST /users/admin/rewards/evaluate-monthly`** - Manual monthly badge evaluation
   - **Status**: Admin-only endpoint
   - **Usage**: Check if called from Admin Dashboard

2. **`GET /users/admin/database/stats`** - Database statistics
   - **Status**: Admin-only endpoint
   - **Usage**: Check if called from Admin Dashboard

3. **`POST /users/admin/leaderboard/refresh`** - Refresh leaderboard
   - **Status**: Admin-only endpoint
   - **Usage**: Check if called from Admin Dashboard

4. **`GET /users/admin/students/{student_id}/id-info`** - Get student ID info
   - **Status**: Used in `AdminStudentIDManagement.tsx` (but page not linked)

5. **`PUT /users/admin/students/{student_id}/public-id`** - Update student public ID
   - **Status**: Used in `AdminStudentIDManagement.tsx` (but page not linked)

6. **`POST /users/admin/generate-student-id`** - Generate next student ID
   - **Status**: Used in `AdminStudentIDManagement.tsx` (but page not linked)

### Other Endpoints:

7. **`GET /users/valid-levels`** - Get valid levels
   - **Status**: Check if used anywhere

8. **`GET /users/profile/{user_id}/audit-logs`** - Get profile audit logs
   - **Status**: Check if used anywhere

---

## 🟢 Root-Level Test/Debug Files

These files in the root directory appear to be test/debug scripts:

1. **`debug_questions.py`** - Debug questions
2. **`simple_test.py`** - Simple test script
3. **`test_full_preview.py`** - Test preview functionality
4. **`test_multiplication.py`** - Test multiplication
5. **`test_obvious_questions.py`** - Test obvious questions
6. **`test_preview_api.py`** - Test preview API
7. **`test_preview.py`** - Test preview

**Recommendation**: Move to `tests/` or `scripts/` folder, or delete if not needed.

---

## 📝 Documentation Files (May be outdated)

1. **`API_STABILITY_FIXES.md`**
2. **`ATTENDANCE_FEE_MANAGEMENT_WORKFLOW.md`**
3. **`frontend_design.md`**
4. **`frontend_rebuild.md`**
5. **`REWARD_SYSTEM_IMPLEMENTATION_SUMMARY.md`**
6. **`REWARD_SYSTEM_MIGRATION.sql`**
7. **`reward_system.md`**
8. **`RUN_MIGRATION_INSTRUCTIONS.md`**
9. **`STREAK_TESTING_GUIDE.md`**

**Recommendation**: Review and archive outdated documentation, or move to `docs/` folder.

---

## 🎯 Summary & Recommendations

### High Priority (Fix Navigation):
1. **Add navigation links** for:
   - `/rewards` - Add to Header user menu or Dashboard
   - `/admin/student-ids` - Add to Admin Dashboard
   - `/admin/unified` - Add to Admin Dashboard
   - `/promote-admin` - Add to Admin Dashboard (if needed)

2. **Decide on Settings page**:
   - Either enable route and add navigation
   - Or delete `Settings.tsx` component

### Medium Priority (Cleanup):
1. **Move migration scripts** to `backend/scripts/` or `backend/migrations/legacy/`
2. **Move test files** to `tests/` folder
3. **Remove or hide** `BackendTest` component in production

### Low Priority (Documentation):
1. **Organize documentation** into `docs/` folder
2. **Review and update** outdated documentation

---

## 📊 Statistics

- **Pages without navigation**: 5
- **Components hidden/debug**: 2
- **Migration scripts**: 11
- **Test files**: 7
- **Documentation files**: 9

**Total items to review/cleanup**: ~34 files
