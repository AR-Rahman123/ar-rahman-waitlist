# AR Rahman - Augmented Reality Quranic Prayer Application

## Overview

AR Rahman is a full-stack web application that serves as a landing page and waitlist platform for an innovative Augmented Reality tool designed to enhance the Quranic prayer experience. The application allows users to join a waitlist and provides an admin dashboard for tracking user responses and analytics.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom spiritual color scheme
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Email Service**: SendGrid for welcome emails and admin notifications
- **Session Management**: PostgreSQL-based session storage

### Development Setup
- **Environment**: Node.js with ES modules
- **Package Manager**: npm
- **TypeScript**: Strict mode enabled with path aliases
- **Build System**: Vite for frontend, esbuild for backend

## Key Components

### Frontend Components
1. **Landing Page** (`/`) - Main marketing page with hero section, local video player, and waitlist CTA
2. **Waitlist Form** - Multi-step form collecting user demographics and preferences
3. **Admin Dashboard** (`/admin`) - ScoreApp-style analytics with multi-select deletion, CSV export, and visual charts
4. **UI Components** - Comprehensive shadcn/ui component library

### Backend Components
1. **API Routes** - RESTful endpoints for waitlist management
2. **Database Layer** - Drizzle ORM with PostgreSQL integration
3. **Email Service** - SendGrid integration for automated emails
4. **Storage Layer** - Abstracted storage interface for data operations

### Database Schema
- **Users Table**: Basic user management (id, username, password)
- **Waitlist Responses Table**: Comprehensive user survey data including demographics, prayer habits, Arabic understanding, and feature preferences

## Data Flow

### Waitlist Signup Flow
1. User fills out multi-step waitlist form
2. Frontend validates data using Zod schemas
3. Data submitted to `/api/waitlist` endpoint
4. Backend validates and stores data in PostgreSQL
5. Welcome email sent to user via SendGrid
6. Admin notification email sent
7. Success confirmation displayed to user

### Analytics Flow
1. Admin accesses dashboard at `/admin`
2. Frontend fetches analytics data from `/api/waitlist/analytics`
3. Data aggregated and displayed in dashboard components
4. Real-time updates via React Query

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **@sendgrid/mail**: Email service integration
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Database ORM and migrations
- **express**: Web framework
- **react**: Frontend framework
- **tailwindcss**: Utility-first CSS framework

### UI Dependencies
- **@radix-ui/***: Headless UI primitives
- **@hookform/resolvers**: Form validation
- **zod**: Schema validation
- **wouter**: Lightweight routing

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SENDGRID_API_KEY`: SendGrid API key for emails
- `FROM_EMAIL`: Sender email address
- `ADMIN_EMAIL`: Admin notification email

### Production Considerations
- Frontend served as static files from `dist/public`
- Backend runs on Node.js server
- Database hosted on Neon serverless PostgreSQL
- Email delivery through SendGrid service

### Development Features
- Hot module replacement via Vite
- Real-time error overlay
- Replit integration for cloud development
- TypeScript strict mode for type safety

## Recent Changes

### GitHub Deployment Setup (July 12, 2025)
- Prepared complete GitHub deployment workflow with Actions
- Created Netlify configuration for automatic builds
- Resolved Git lock file issues by implementing manual upload strategy
- Ready for production deployment at www.ar-rahman.ai domain
- Configured one-button deployment via Replit's GitHub integration

### Video Player Implementation (July 12, 2025)
- Replaced YouTube iframe with local HTML5 video player
- Eliminated YouTube ads and external navigation
- Added custom video controls with disabled downloads and right-click protection
- Configured Vimeo hosting for 100MB+ video files with direct MP4 streaming
- Enhanced user experience with custom poster image and fallback content
- Added professional video overlay with branding
- Resolved Google Drive download limitations by using Vimeo as CDN

### Database Schema Restructuring & Dashboard Fixes (July 13, 2025)
- ⚠️ **Data Loss Event**: Had to drop and recreate waitlist_responses table to fix schema mismatches
- Fixed critical form submission issues - all 15 steps now work properly
- Resolved database query syntax errors in analytics dashboard  
- Updated admin email template to work with new field structure
- Form validation and submission now working end-to-end
- All analytics charts and data visualization restored
- **Current Status**: 3 submissions after fix (historical data lost during schema migration)

### Data Protection & Backup System Implementation (July 13, 2025)
- Implemented comprehensive backup system to prevent future data loss
- Added automatic backups after every waitlist submission
- Created manual backup and CSV export endpoints (`/api/backup/create`, `/api/backup/export-csv`)
- Built migration safety framework with pre-migration checks and risk assessment
- Added backup and export buttons to admin dashboard
- Created detailed backup strategy documentation and emergency procedures
- Backup files stored in `/backups` directory with automatic cleanup (keeps last 10)
- All dangerous database operations now require manual confirmation and automatic backups

### Admin Authentication & Security Implementation (July 13, 2025)
- Implemented session-based admin authentication for dashboard protection
- Added secure login/logout functionality with password protection
- Protected all admin endpoints: analytics, responses, backups, and deletions
- Created admin login screen with password visibility toggle and security warnings
- Default admin password: `admin123` (configurable via ADMIN_PASSWORD environment variable)
- Session expires after 24 hours for security
- All sensitive admin operations now require authentication

### Form Options & Dashboard Updates (July 13, 2025)
- **Form Updates**: Removed "Extremely important" option from importance question
- **Form Updates**: Removed "Community prayer features" option from features selection
- **Dashboard Fixes**: Fixed field mapping issues - all questions now display correctly
- **CSV Export**: Fixed export functionality - all data fields properly included in exports
- **Data Display**: Enhanced dashboard to show all 15 form questions and responses
- **Field Names**: Corrected field name mapping between frontend and database schema
- **Export Format**: CSV exports now contain complete data with proper formatting
- **Current Status**: 6 submissions with full data visibility and working export functionality

### Visual Design Update (July 13, 2025)
- **New Color Scheme**: Applied dark theme inspired by reference site with purple/teal gradients
- **Modern Layout**: Updated hero section with gradient backgrounds and glass morphism effects
- **Enhanced Cards**: Added backdrop blur effects and hover animations throughout
- **Typography**: Improved contrast with white text on dark backgrounds
- **Rollback Ready**: Original design backed up in `/backups/current-design/` with rollback script
- **Side-by-side Hero**: Large text on left, video on right matching reference site layout
- **Form Issue Resolution**: Fixed waitlist form submission that stopped working after design changes
- **Stability Fix**: Implemented robust form submission to prevent HMR-related failures during development
- **Current Status**: New dark theme active with stable form submission resistant to hot reloading issues

### Analytics Dashboard Enhancements (Previous)
- Resolved critical deployment/caching issues that were preventing dashboard updates from showing
- Implemented complete visual analytics dashboard with pie charts, donut charts, and bar charts using recharts library
- Added ScoreApp-style summary metrics including Total Leads, Daily Leads, Number of Visitors, and Completion Rate
- Enhanced response management with multi-select functionality, bulk delete operations, and confirmation dialogs
- Integrated CSV data export feature for complete dataset downloads with safety confirmations