COMPLETE FRONTEND REBUILD PLAN FROM BACKEND
PHASE 1: FOUNDATION & AUTHENTICATION
(Build first - everything depends on this)

1.1 Core Setup
Tech Stack: React + TypeScript + Vite + Tailwind CSS
State Management: React Query + Context API
Routing: Wouter
UI Library: Lucide React icons
1.2 Authentication System
Pages Needed:

Login.tsx - Google OAuth login page
AuthContext.tsx - Authentication context provider
Components:

Login button with Google OAuth
Protected route wrapper
Admin route wrapper
API Integration:

POST /users/login - Google OAuth
GET /users/me - Get current user

PHASE 2: CORE USER EXPERIENCE
(Build second - main user flows)

2.1 Home & Navigation
Pages:

Home.tsx - Landing page with course links
Header.tsx - Navigation with user menu
Footer.tsx - Footer component
Header Navigation Items:

Courses (dropdown: Abacus, Vedic Maths, Handwriting, STEM)
Papers (link to create)
Mental Math (link to practice)
User Portal (dropdown):Dashboard
Profile
Attendance (admin only)
Fees (admin only)
Admin Panel (admin only)
Settings
Logout
2.2 Student Dashboard
Page: StudentDashboard.tsx

Sections:

Stats Cards (4 cards):

Total Points
Current Streak
Best Streak
Accuracy %
Recent Sessions (table/list):

Session type (Mental Math / Practice Paper)
Title/Operation
Date/Time
Score/Accuracy
Points earned
View Details button
Attendance Calendar (component):

Monthly calendar view
Present/Absent indicators
Session details on hover
Leaderboard (tabs: Overall/Weekly):

Rank, Name, Points, Streak
Highlight current user
API Calls:

GET /users/stats - Student statistics
GET /users/leaderboard/overall - Overall leaderboard
GET /users/leaderboard/weekly - Weekly leaderboard
GET /users/profile - Student profile for attendance
GET /attendance/records - Attendance records
GET /attendance/sessions - Class sessions for calendar

PHASE 3: PAPER MANAGEMENT SYSTEM
(Build third - core educational feature)

3.1 Paper Creation
Page: PaperCreate.tsx

Step 1: Level Selection

Main Levels: Junior, Basic, Advanced
Sub-levels based on selection:Junior: Junior-1, Junior-2, Junior-3
Basic: AB-1, AB-2, AB-3, AB-4, AB-5, AB-6
Advanced: AB-7, AB-8, AB-9, AB-10
Step 2: Builder Interface

Title input field
Add Block button
Block list with:Block number
Operation dropdown: Add/Sub, Addition, Subtraction, Multiplication, Division
Count input (1-50)
Digits input (1-10)
Rows input (1-20)
Delete block button
Move up/down buttons
Step 3: Preview & Generate

Preview button → shows generated questions
Generate PDF button → downloads PDF
API Integration:

GET /presets/{level} - Get preset blocks for level
POST /papers/preview - Preview paper
POST /papers/generate-pdf - Generate PDF
3.2 Paper Attempt
Page: PaperAttempt.tsx

Components:

Question display (math problem)
Answer input field
Timer display
Progress indicator
Submit button
Previous/Next navigation
API Integration:

POST /papers/attempt - Start attempt
PUT /papers/attempt/{attempt_id} - Submit answer
GET /papers/attempt/{attempt_id} - Get attempt details
3.3 Mental Math Practice
Page: Mental.tsx

Interface:

Operation selection: Addition, Subtraction, Add/Sub, Multiplication, Division
Difficulty selection: Easy, Medium, Hard
Question count input
Start Practice button
Question display
Answer input
Timer
Results screen with score
API Integration:

POST /users/practice-session - Save session

PHASE 4: STUDENT PROFILE MANAGEMENT
(Build fourth - user account management)

4.1 Student Profile
Page: StudentProfile.tsx

Form Fields:

Display Name (text input)
Full Name (text input) - admin only
Class Name (text input)
Course (dropdown) - admin only
Level Type (dropdown) - admin only
Level (dropdown) - admin only
Branch (dropdown) - admin only
Status (dropdown: active, inactive, completed) - admin only
Join Date (date input) - admin only
Finish Date (date input) - admin only
Parent Contact Number (text input)
Buttons:

Edit/Save/Cancel buttons
View Attendance Stats button
API Integration:

GET /users/profile - Get profile
PUT /users/profile - Update profile
GET /attendance/stats/{profile_id} - Attendance stats
4.2 Settings
Page: Settings.tsx

Form Fields:

Display Name (text input)
Buttons:

Save Settings button
API Integration:

PUT /users/me/display-name - Update display name

PHASE 5: ADMIN PANEL
(Build fifth - administrative features)

5.1 Admin Dashboard
Page: AdminDashboard.tsx

Sections:

Stats Overview (6 cards):

Total Students
Active Students
Total Papers Created
Total Practice Sessions
Total Points Awarded
Database Size
Student Management Table:

Search/filter inputs
Student list with: ID, Name, Email, Points, Streak, Last Active
Action buttons: View Details, Edit Points, Delete Student
Student Detail Modal/Popup:

Full student info
Points adjustment (+/- input)
Practice sessions list
Paper attempts list
Delete confirmation
API Integration:

GET /users/admin/stats - Admin statistics
GET /users/admin/students - Student list
GET /users/admin/students/{id}/stats - Student stats
PUT /users/admin/students/{id}/points - Update points
DELETE /users/admin/students/{id} - Delete student
GET /users/admin/database/stats - Database stats
5.2 Attendance Management
Page: AdminAttendance.tsx

Interface:

Branch selection dropdown
Date selection
Student list with attendance checkboxes
Mark Present/Absent/Excused radio buttons per student
Bulk actions: Mark All Present, Mark All Absent
Create Session button
View Calendar button
API Integration:

GET /attendance/students - Get students for branch
POST /attendance/sessions - Create session
POST /attendance/mark-bulk - Mark attendance
GET /attendance/sessions - Get sessions for calendar
5.3 Fee Management
Page: AdminFeeManagement.tsx

Tabs: Dashboard, Students, Plans

Dashboard Tab:

Revenue stats cards
Recent transactions table
Plans Tab:

Fee Plans table (Name, Amount, Duration, Branch, Course, Level, Active)
Create Plan button
Edit/Delete buttons per plan
Create/Edit Plan Form:

Name (text)
Description (textarea)
Branch (dropdown)
Course (dropdown)
Level (dropdown)
Fee Amount (number)
Fee Duration Days (number)
Currency (dropdown: INR, USD)
Is Active (checkbox)
Students Tab:

Student list with fee summaries
Assign Fee Plan button per student
Payment recording
API Integration:

GET /fees/dashboard/stats - Dashboard stats
GET /fees/plans - Fee plans list
POST /fees/plans - Create plan
PUT /fees/plans/{id} - Update plan
DELETE /fees/plans/{id} - Delete plan
GET /fees/dashboard/students - Students with fees
POST /fees/assignments - Assign fee plan
POST /fees/transactions - Record payment

PHASE 6: COURSE CONTENT PAGES
(Build last - marketing/static content)

6.1 Course Pages
Pages: AbacusCourse.tsx, VedicMathsCourse.tsx, HandwritingCourse.tsx, STEMCourse.tsx

Structure per page:

Hero section with title and description
Benefits grid (4-6 benefit cards)
Curriculum levels table
Testimonials/reviews
Call-to-action buttons
No API integration needed - these are static marketing pages.


PHASE 7: SHARED COMPONENTS
(Build throughout all phases)

7.1 Reusable Components
MathQuestion.tsx - Display math problems
AttendanceCalendar.tsx - Calendar component
RewardsExplanation.tsx - Rewards info
ErrorBoundary.tsx - Error handling
LoadingSpinner.tsx - Loading states
7.2 Utility Functions
api.ts - All API functions
timezoneUtils.ts - Date/time formatting
constants/index.ts - Dropdown options

DEVELOPMENT APPROACH
✅ INCREMENTAL BUILD (RECOMMENDED)
Phase 1: Auth system → Test login/logout
Phase 2: Home + Dashboard → Test user flows
Phase 3: Paper system → Test creation/attempt
Phase 4: Profile/Settings → Test user management
Phase 5: Admin features → Test admin workflows
Phase 6: Course pages → Polish UI/UX
🔄 TESTING STRATEGY
Unit Tests: API functions, utility functions
Integration Tests: Page loads, form submissions
E2E Tests: Complete user journeys
API Testing: Use Postman/Insomnia for backend verification
🎨 UI/UX CONSIDERATIONS
Responsive Design: Mobile-first approach
Dark Mode: Theme toggle in header
Loading States: Skeletons, spinners
Error Handling: Toast notifications, error boundaries
Accessibility: ARIA labels, keyboard navigation
📊 DATA FLOW
State Management: React Query for server state, Context for auth
Form Handling: Controlled components with validation
Caching: React Query caching for performance
Real-time: Polling for live updates where needed
This approach ensures each phase is testable and functional before moving to the next, minimizing bugs and ensuring the frontend perfectly matches the backend capabilities.