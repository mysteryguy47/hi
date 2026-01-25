# Abacus Paper Generator

## Overview

A comprehensive math exam paper generator designed for abacus training programs. The application allows users to create customizable math worksheets across multiple difficulty levels (Junior through Advanced, plus Vedic Maths levels 1-4), preview questions in real-time, and generate professional PDF documents with answer keys. The system includes Google OAuth authentication, student progress tracking, gamification features (points, badges, streaks), leaderboards, attendance management, and fee management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7.3
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack Query for server state, React Context for auth/theme
- **Styling**: Tailwind CSS with dark mode support (class-based)
- **Key Pages**: Home, PaperCreate (main worksheet builder), Mental (practice mode), StudentDashboard, AdminDashboard

### Backend Architecture
- **Framework**: FastAPI (Python 3.11+)
- **Server**: Uvicorn ASGI
- **Database**: SQLAlchemy ORM with SQLite (PostgreSQL-ready for production)
- **Authentication**: Google OAuth with JWT tokens (python-jose)
- **PDF Generation**: Dual approach - ReportLab for direct PDF creation, Playwright for HTML-to-PDF conversion
- **API Structure**: RESTful endpoints under `/api` prefix, organized into routers (user_routes, attendance_routes, fee_routes)

### Math Question Generation
- Custom generator in `backend/math_generator.py` supporting 50+ question types
- Seeded random number generation for reproducible questions
- Preset configurations for each difficulty level in `backend/presets.py`
- Constraints system for controlling digit counts, row counts, and operation-specific parameters

### Data Models
- **User**: Authentication, roles (student/admin), gamification stats
- **StudentProfile**: Extended student info with public IDs, course enrollment
- **PracticeSession/Attempt**: Track practice activity and scores
- **Paper/PaperAttempt**: Worksheet configurations and student attempts
- **Attendance**: ClassSchedule, ClassSession, AttendanceRecord
- **Fees**: FeePlan, FeeAssignment, FeeTransaction

### Key Design Patterns
- Lazy imports for routers to prevent startup failures
- Pydantic schemas for request/response validation
- Admin role verification via `ADMIN_EMAILS` environment variable
- IST timezone handling for India-based operations

## External Dependencies

### Authentication
- Google OAuth 2.0 for user authentication
- Requires `GOOGLE_CLIENT_ID` environment variable
- JWT tokens for session management with 30-day expiration

### Database
- SQLite by default (file at `/data/abacus_replitt.db`)
- PostgreSQL support via `DATABASE_URL` environment variable
- SQLAlchemy handles both seamlessly

### PDF Generation
- ReportLab for programmatic PDF creation
- Playwright with headless Chromium for HTML-to-PDF (pixel-perfect output)
- Playwright requires browser installation: `playwright install chromium`

### Environment Variables Required
- `SECRET_KEY`: JWT signing key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `ADMIN_EMAILS`: Comma-separated list of admin email addresses
- `DATABASE_URL`: Optional, defaults to SQLite

### Deployment
- Frontend proxies `/api` requests to backend (port 8000)
- Railway deployment supported with included migration scripts
- Docker-ready with service name detection for proxy configuration