# Attendance & Fee Management System - Complete Workflow Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Attendance Management System](#attendance-management-system)
3. [Fee Management System](#fee-management-system)
4. [Unified Management Page](#unified-management-page)
5. [Student Calendar View](#student-calendar-view)
6. [Features & Options](#features--options)
7. [Expected Behavior](#expected-behavior)

---

## System Overview

The Attendance & Fee Management System is an integrated solution that allows administrators to:
- Schedule and manage class schedules
- Mark and track student attendance
- Manage fee plans, assignments, and payments
- View comprehensive statistics and reports
- Access everything from a unified management interface

Students can:
- View their class schedule in a calendar format
- See their attendance records
- Track their fee payments and due dates

---

## Attendance Management System

### 1. Class Schedule Management

#### Purpose
Class schedules define when classes are held for specific branches, courses, and levels. These schedules automatically appear in students' calendar views.

#### How to Create a Schedule

1. **Access Schedule Management**
   - Navigate to `/admin/attendance` or `/admin/unified`
   - Click on the "Class Schedules" section
   - Click "Create Schedule" button

2. **Fill in Schedule Details**
   - **Branch** (Required): Select from Rohini-16, Rohini-11, Gurgaon, or Online
   - **Course** (Optional): Select Abacus, Vedic Maths, or Handwriting (leave empty for all courses)
   - **Level** (Optional): Enter specific level (e.g., "Level 1", "Junior-1")
   - **Batch Name** (Optional): Enter batch identifier (e.g., "Morning Batch", "Evening Batch")

3. **Set Schedule Days** (Required)
   - Click on the days of the week when classes are held
   - Selected days will be highlighted
   - At least one day must be selected

4. **Add Time Slots** (Optional)
   - Click "Add Time Slot" to specify class times
   - Enter start and end times (e.g., 10:00 - 11:00)
   - Multiple time slots can be added for the same schedule

5. **Set Active Status**
   - Check "Active Schedule" to enable the schedule
   - Uncheck to deactivate (schedule won't appear in student calendars)

6. **Save Schedule**
   - Click "Create Schedule" to save
   - The schedule will immediately appear in the schedules list

#### How to Edit a Schedule

1. Find the schedule in the schedules list
2. Click the "Edit" icon (pencil icon)
3. Modify any fields as needed
4. Click "Update Schedule" to save changes

#### How to Delete a Schedule

1. Find the schedule in the schedules list
2. Click the "Delete" icon (trash icon)
3. Confirm the deletion
4. The schedule will be removed and won't appear in student calendars

#### Expected Behavior

- **Schedule Creation**: 
  - New schedules are immediately available
  - Students see scheduled classes in their calendar view
  - Schedules can be filtered by branch and course

- **Schedule Display**:
  - Active schedules show in green badge
  - Inactive schedules show in gray badge
  - Schedule days are displayed as badges (Mon, Tue, Wed, etc.)
  - Time slots are shown below the days

- **Schedule Matching**:
  - Schedules match students based on:
    - Branch (must match or schedule must be branch-agnostic)
    - Course (must match or schedule must be course-agnostic)
  - Students see all matching schedules in their calendar

---

### 2. Class Session Management

#### Purpose
Class sessions represent actual class instances on specific dates. Sessions are created when attendance is marked, or can be created manually.

#### How Sessions Work

1. **Automatic Session Creation**
   - When marking attendance for a date, a session is automatically created if one doesn't exist
   - Sessions are linked to schedules (if created from a schedule)

2. **Manual Session Creation**
   - Sessions can be created manually when marking attendance
   - Select date, branch, course, and optional details

3. **Session Completion**
   - Sessions are marked as "completed" when attendance is recorded
   - Completed sessions appear in attendance history

#### Expected Behavior

- Sessions appear in the attendance calendar
- Clicking a date in the calendar loads or creates a session for that date
- Sessions show course information and can have topics/remarks

---

### 3. Marking Attendance

#### How to Mark Attendance

1. **Select Filters**
   - Choose Branch (optional - "All Branches" shows all)
   - Choose Course (optional - "All Courses" shows all)
   - Select Session Date using the date picker

2. **View Students**
   - Students matching the selected branch/course appear in a list
   - Each student shows: Name, ID, Class, Level

3. **Mark Attendance Status**
   - For each student, click one of:
     - **Present**: Student attended the class
     - **Absent**: Student did not attend
     - **Break**: Student is on a break
   - Selected status is highlighted

4. **Bulk Actions**
   - Click "Mark All Present" to mark all students as present
   - Click "Mark All Absent" to mark all students as absent

5. **Save Attendance**
   - Click "Save Attendance" or "Update Attendance"
   - Attendance is saved and session is marked as completed
   - Success message appears

#### Expected Behavior

- **Attendance Status Colors**:
  - Present: Green
  - Absent: Red
  - Break: Orange

- **Calendar Display**:
  - Dates with sessions show a session indicator
  - Dates with attendance show status icons
  - Clicking a date loads that date's attendance

- **Data Persistence**:
  - Attendance records are saved immediately
  - Previous attendance can be updated
  - All changes are tracked with timestamps

---

## Fee Management System

### 1. Fee Dashboard Statistics

#### Overview
The fee dashboard displays 8 key statistics that are clickable to view detailed information:

1. **Total Collected (All Time)**
   - Shows lifetime revenue from all fee payments
   - Click to view all students who have made payments

2. **Monthly Collection**
   - Shows total collected in the current month
   - Click to view students with payments this month

3. **Today's Collection**
   - Shows total collected today
   - Click to view students with payments today

4. **Total Fees Due**
   - Shows total amount of pending fees
   - Click to view all students with outstanding fees

5. **Active Students**
   - Shows count of students with active fee assignments
   - Click to view list of active students

6. **Students with Due**
   - Shows count of students who have fees due
   - Click to view students with pending payments

7. **Overdue Students**
   - Shows count of students with overdue payments
   - Click to view overdue students list

8. **Due Today**
   - Shows count of students with payments due today
   - Click to view students with payments due today

#### How to Use Clickable Stats

1. **Click on any statistic card**
2. **View detailed list**:
   - The system switches to the "Students" tab
   - Shows filtered list based on the clicked statistic
   - For "Overdue" and "Due Today", automatically filters to show only those students

3. **Interact with student list**:
   - Click on any student to view detailed fee information
   - See payment history, balance, next due date
   - Record new payments directly from the detail view

#### Expected Behavior

- **Stat Cards**:
  - Hover effect shows card is clickable
  - Cards scale slightly on hover
  - Color-coded by category (green for collections, red for overdue, etc.)

- **Detail Views**:
  - Automatically filters student list
  - Shows relevant information based on stat type
  - Can close detail view to return to dashboard

---

### 2. Fee Plan Management

#### Purpose
Fee plans define the fee structure for different courses, levels, and branches.

#### How to Create a Fee Plan

1. Navigate to Fee Management → Fee Plans tab
2. Click "Create Fee Plan"
3. Fill in details:
   - **Name**: Plan name (e.g., "Abacus Level 1 Monthly")
   - **Description**: Optional description
   - **Branch**: Select branch or leave for all branches
   - **Course**: Select course or leave for all courses
   - **Level**: Enter level or leave for all levels
   - **Fee Amount**: Base fee amount
   - **Duration (Days)**: How many days the fee covers
   - **Currency**: Default is INR
   - **Active Status**: Enable/disable plan

4. Click "Create" to save

#### How to Assign Fees to Students

1. Navigate to Fee Management → Fee Assignment
2. Select student (by profile ID or name)
3. Select fee plan
4. Set optional customizations:
   - **Custom Fee Amount**: Override plan amount
   - **Discount Amount**: Fixed discount
   - **Discount Percentage**: Percentage discount
5. Set start date
6. Add optional remarks
7. Click "Assign Fee"

#### Expected Behavior

- **Fee Calculation**:
  - Effective fee = (Custom amount or Plan amount) - Discount amount - (Percentage discount)
  - System automatically calculates effective fee

- **Active Assignments**:
  - Only one active assignment per student
  - New assignment deactivates previous one
  - Previous assignment end date is set to new start date

---

### 3. Recording Payments

#### How to Record a Payment

1. Navigate to Fee Management → Record Payment
2. Enter student profile ID
3. System loads student's fee information:
   - Current balance
   - Total due
   - Last payment date
   - Next due date
4. Fill in payment details:
   - **Amount**: Payment amount
   - **Payment Date**: Date of payment
   - **Payment Mode**: Cash, Online, UPI, Bank Transfer, etc.
   - **Reference Number**: Optional transaction reference
   - **Remarks**: Optional notes
   - **Partial Payment**: Check if this is a partial payment
5. Click "Record Payment"
6. Balance is automatically updated

#### Expected Behavior

- **Balance Calculation**:
  - Balance Before: Previous balance
  - Payment Amount: Deducted from balance
  - Balance After: New balance after payment

- **Payment History**:
  - All payments are recorded with timestamps
  - Payment history shows in student detail view
  - Can view all transactions for a student

- **Due Date Calculation**:
  - Next due date = Last payment date + Fee duration days
  - If no payment, due date = Start date + Fee duration days

---

### 4. Student Fee Details

#### How to View Student Fee Details

1. Click on any student in the fee list
2. View comprehensive information:
   - **Student Information**: Name, ID, Branch, Course
   - **Current Assignment**: Active fee plan details
   - **Payment Summary**: Total paid, Total due, Balance
   - **Payment History**: All transactions with dates
   - **Due Dates**: Last payment date, Next due date
   - **Overdue Status**: Days overdue if applicable

3. **Actions Available**:
   - Record new payment
   - Update fee assignment
   - View transaction details

#### Expected Behavior

- **Overdue Indicators**:
  - Red highlight for overdue students
  - Shows number of days overdue
  - Warning message for overdue payments

- **Payment Status**:
  - Green for fully paid
  - Yellow for partial payment
  - Red for overdue

---

## Unified Management Page

### Overview

The Unified Management Page (`/admin/unified`) combines attendance, fees, and schedule management in one integrated interface.

### View Modes

#### 1. Overview Mode
- **Fee Statistics Dashboard**: All 8 clickable stat cards
- **Attendance Calendar**: Monthly calendar view
- **Quick Access**: Click calendar dates or stats to navigate to detailed views

#### 2. Attendance Mode
- **Calendar View**: Interactive attendance calendar
- **Attendance Form**: Mark attendance for selected date
- **Student List**: Filtered by branch/course
- **Bulk Actions**: Mark all present/absent

#### 3. Fees Mode
- **Fee Statistics**: Clickable dashboard stats
- **Student Lists**: Filtered by selected stat
- **Fee Plans Management**: Create and manage plans
- **Fee Assignment**: Assign fees to students
- **Payment Recording**: Record payments

#### 4. Schedules Mode
- **Schedule List**: All class schedules
- **Create/Edit/Delete**: Full schedule management
- **Schedule Details**: View days, times, branches, courses

### Navigation

1. **View Mode Tabs**: Click to switch between Overview, Attendance, Fees, Schedules
2. **Filters**: Apply branch/course filters (affects all views)
3. **Stat Cards**: Click to view detailed student lists
4. **Calendar Dates**: Click to mark attendance for that date

### Expected Behavior

- **Unified Filters**:
  - Branch and course filters apply to all views
  - Changing filters reloads relevant data
  - Filters persist across view changes

- **Data Synchronization**:
  - All views stay in sync
  - Changes in one view reflect in others
  - Real-time updates across components

- **Seamless Navigation**:
  - Click stats → automatically switches to Fees view
  - Click calendar date → automatically switches to Attendance view
  - Smooth transitions between views

---

## Student Calendar View

### Overview

Students see their class schedule and attendance in a calendar format on their dashboard.

### What Students See

1. **Scheduled Classes**:
   - Classes appear on days based on class schedules
   - Shows number of classes per day
   - Indicated by blue/purple gradient badge

2. **Attendance Records**:
   - **Present**: Green checkmark icon
   - **Absent**: Red X icon
   - **On Break**: Orange clock icon
   - **Leave**: Blue user-check icon

3. **Calendar Navigation**:
   - Previous/Next month buttons
   - Current month highlighted
   - Today's date highlighted

### How Scheduled Classes Appear

1. **Schedule Matching**:
   - System matches student's branch and course with active schedules
   - Shows classes on days specified in schedules
   - Multiple schedules can create multiple classes per day

2. **Session Generation**:
   - If a session exists for a date, it shows in the calendar
   - If no session but schedule matches, a scheduled class indicator appears
   - Students can see upcoming scheduled classes

3. **Time Display**:
   - If schedule has time slots, times are shown
   - Default time (10:00 AM) if no time slot specified

### Expected Behavior

- **Calendar Updates**:
  - Calendar updates when schedules change
  - New schedules appear immediately
  - Inactive schedules don't appear

- **Attendance Display**:
  - Attendance status appears after admin marks it
  - Historical attendance is visible
  - Status icons are color-coded

- **Schedule Changes**:
  - Students see updated schedules automatically
  - Changes reflect in next calendar load
  - No manual refresh needed

---

## Features & Options

### Admin Features

1. **Schedule Management**
   - Create, edit, delete class schedules
   - Set days, times, branches, courses
   - Activate/deactivate schedules

2. **Attendance Management**
   - Mark attendance for any date
   - Bulk mark all present/absent
   - View attendance calendar
   - Filter by branch/course

3. **Fee Management**
   - Create fee plans
   - Assign fees to students
   - Record payments
   - View statistics
   - Track overdue payments

4. **Statistics & Reports**
   - Total collections (all time, monthly, today)
   - Fees due tracking
   - Active/inactive student counts
   - Overdue student tracking

5. **Unified Interface**
   - Single page for all management
   - Integrated calendar and stats
   - Seamless navigation
   - Real-time updates

### Student Features

1. **Calendar View**
   - See scheduled classes
   - View attendance records
   - Navigate months
   - See today's date

2. **Attendance Tracking**
   - View attendance history
   - See attendance statistics
   - Check attendance percentage

---

## Expected Behavior

### System Behavior

1. **Data Consistency**:
   - All data stays synchronized
   - Changes reflect immediately
   - No data loss or conflicts

2. **Performance**:
   - Fast loading times
   - Efficient data fetching
   - Smooth user interactions

3. **Error Handling**:
   - Clear error messages
   - Graceful error recovery
   - User-friendly notifications

4. **Access Control**:
   - Admin-only features protected
   - Students see only their data
   - Proper authentication required

### User Experience

1. **Intuitive Interface**:
   - Clear navigation
   - Obvious actions
   - Helpful tooltips

2. **Responsive Design**:
   - Works on all screen sizes
   - Mobile-friendly
   - Touch-optimized

3. **Visual Feedback**:
   - Loading indicators
   - Success/error messages
   - Hover effects
   - Status colors

4. **Workflow Efficiency**:
   - Minimal clicks to complete tasks
   - Bulk actions available
   - Quick filters
   - Keyboard shortcuts where applicable

---

## Quick Reference Guide

### For Admins

**To Schedule Classes:**
1. Go to Attendance or Unified Management
2. Click "Class Schedules" section
3. Create schedule with days and times
4. Students see it in their calendar

**To Mark Attendance:**
1. Select branch/course filters
2. Choose date
3. Mark each student's status
4. Click "Save Attendance"

**To Manage Fees:**
1. Go to Fee Management or Unified Management
2. Click on any stat card for details
3. Create plans, assign fees, record payments
4. Track collections and due amounts

**To View Statistics:**
1. Click any stat card on dashboard
2. View filtered student list
3. Click student for detailed view
4. Record payments or update assignments

### For Students

**To View Schedule:**
1. Go to Dashboard
2. Look at Attendance Calendar
3. See scheduled classes on calendar days
4. View attendance status for past dates

**To Check Attendance:**
1. Calendar shows attendance icons
2. Green = Present, Red = Absent
3. View attendance statistics in dashboard
4. Check monthly breakdown

---

## Technical Notes

### API Endpoints

- `/api/attendance/schedules` - Schedule management
- `/api/attendance/sessions` - Session management
- `/api/attendance/mark-bulk` - Bulk attendance marking
- `/api/fees/dashboard/stats` - Fee statistics
- `/api/fees/students/{id}/summary` - Student fee details
- `/api/fees/transactions` - Payment recording

### Data Models

- **ClassSchedule**: Defines recurring class schedule
- **ClassSession**: Individual class instance
- **AttendanceRecord**: Student attendance for a session
- **FeePlan**: Fee structure definition
- **FeeAssignment**: Student's fee assignment
- **FeeTransaction**: Payment record

### Integration Points

- Attendance system integrates with student profiles
- Fee system tracks payments and balances
- Calendar shows both schedules and sessions
- Unified page combines all systems

---

## Conclusion

The Attendance & Fee Management System provides a comprehensive solution for managing classes, attendance, and fees. The unified interface makes it easy to access all features from one place, while the clickable statistics provide quick access to detailed information. Students benefit from seeing their schedule and attendance in an intuitive calendar format.

All features are designed to work together seamlessly, with real-time updates and consistent data across all views.
