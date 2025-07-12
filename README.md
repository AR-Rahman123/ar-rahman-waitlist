# AR Rahman - Augmented Reality Quranic Prayer Application

A comprehensive waitlist application for an innovative AR tool designed to enhance the Quranic prayer experience.

## Features

- **Professional Landing Page** with Vimeo-hosted video player
- **Interactive 13-Question Waitlist Form** collecting user demographics and preferences
- **Advanced Analytics Dashboard** with ScoreApp-style visual metrics
- **Multi-Select Response Management** with bulk deletion and CSV export
- **Email Automation** with branded templates (SendGrid integration)
- **Real-time Data Visualization** using Recharts
- **Custom Domain Support** at www.ar-rahman.ai

## Tech Stack

- **Frontend**: React + TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (Neon serverless)
- **Email**: SendGrid integration
- **Hosting**: Netlify with custom domain
- **Analytics**: React Query + Recharts

## Quick Start

1. **Clone and install**:
   ```bash
   git clone <your-repo>
   cd ar-rahman
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   DATABASE_URL=your_neon_database_url
   SENDGRID_API_KEY=your_sendgrid_key
   FROM_EMAIL=help@ar-rahman.ai
   ADMIN_EMAIL=your_admin_email
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Deployment

This project auto-deploys to Netlify via GitHub Actions on push to main branch.

### Required Netlify Environment Variables:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `SENDGRID_API_KEY` - For email automation
- `FROM_EMAIL` - help@ar-rahman.ai
- `ADMIN_EMAIL` - Admin notification email

## Routes

- `/` - Landing page with video and waitlist CTA
- `/admin` - Analytics dashboard with response management

## Database Schema

- **Users**: Basic authentication (if needed)
- **Waitlist Responses**: Comprehensive survey data including:
  - Demographics (age, location)
  - Prayer habits and frequency
  - Arabic understanding level
  - AR interest and feature preferences

## Recent Updates

- Professional video player with Vimeo hosting
- Complete visual analytics dashboard
- Multi-select deletion with confirmations
- CSV export functionality
- Enhanced UI/UX throughout
- Email automation framework

## License

MIT