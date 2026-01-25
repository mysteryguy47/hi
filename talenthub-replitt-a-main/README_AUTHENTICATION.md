# Authentication & Progress Tracking System

## Overview
This system adds Google OAuth authentication, progress tracking, gamification, leaderboards, and admin dashboards to the Abacus practice application.

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=sqlite:///./abacus_replitt.db
   SECRET_KEY=your-secret-key-change-in-production-use-random-string
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ADMIN_EMAILS=your-email@gmail.com
   ```

3. **Get Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized JavaScript origins: `http://localhost:5173`
   - Add authorized redirect URIs: `http://localhost:5173`
   - Copy the Client ID to `GOOGLE_CLIENT_ID` in `.env`

4. **Initialize Database**
   The database will be automatically initialized when the backend starts. All new tables (User, PracticeSession, Attempt, Reward, Leaderboard) will be created.

### Frontend Setup

1. **Configure Environment Variables**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE=http://localhost:8000
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

2. **Install Dependencies** (if needed)
   ```bash
   cd frontend
   npm install
   ```

## Features Implemented

### ✅ Authentication
- Google OAuth login
- JWT token-based authentication
- Role-based access (student/admin)
- Protected routes

### ✅ Progress Tracking
- Every practice session is saved
- Tracks: total questions, correct/wrong, accuracy, time, score
- Per-question attempt tracking (answer, time, correctness)

### ✅ Gamification
- Points system (based on correct answers, speed, difficulty, accuracy)
- Badge system (Accuracy King, Speed Star, Perfect Score, Streak badges)
- Daily practice streaks
- Total points per student

### ✅ Leaderboards
- Overall leaderboard (all-time points)
- Weekly leaderboard
- Automatic ranking updates

### ✅ Student Dashboard
- Personal statistics
- Badges earned
- Recent practice sessions
- Leaderboard position
- Quick stats

### ✅ Admin Dashboard
- View all students
- Individual student progress & history
- Overall statistics
- Top students
- Active students today

## API Endpoints

### Authentication
- `POST /users/login` - Login with Google OAuth token
- `GET /users/me` - Get current user info

### Practice Sessions
- `POST /users/practice-session` - Save a practice session

### Student Features
- `GET /users/stats` - Get student statistics
- `GET /users/leaderboard/overall` - Get overall leaderboard
- `GET /users/leaderboard/weekly` - Get weekly leaderboard

### Admin Features
- `GET /users/admin/stats` - Get admin dashboard statistics
- `GET /users/admin/students` - Get all students
- `GET /users/admin/students/{student_id}/stats` - Get specific student stats

## Database Schema

### User
- id, google_id, email, name, avatar_url, role
- total_points, current_streak, longest_streak, last_practice_date

### PracticeSession
- id, user_id, operation_type, difficulty_mode
- total_questions, correct_answers, wrong_answers, accuracy
- score, time_taken, points_earned
- started_at, completed_at

### Attempt
- id, session_id, question_data (JSON), user_answer, correct_answer
- is_correct, time_taken, question_number

### Reward
- id, user_id, badge_type, badge_name, earned_at

### Leaderboard
- id, user_id, total_points, rank
- weekly_points, weekly_rank, last_updated

## Usage

1. **Start Backend**
   ```bash
   docker-compose up backend
   # Or: python run.py
   ```

2. **Start Frontend**
   ```bash
   docker-compose up frontend
   # Or: npm run dev
   ```

3. **Access Application**
   - Open http://localhost:5173
   - Click "Mental" to access practice page
   - You'll be prompted to login with Google
   - After login, practice sessions are automatically tracked

4. **Admin Access**
   - Add your email to `ADMIN_EMAILS` in backend `.env`
   - Login with that email to access admin dashboard
   - Navigate to `/admin` route

## Notes

- The system is optimized for 90-100 concurrent users
- All practice sessions are automatically saved
- Leaderboards update automatically after each session
- Badges are awarded automatically based on performance
- Streaks are maintained automatically





