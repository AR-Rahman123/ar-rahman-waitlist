# Fresh Start: Clean Deployment Setup

## Step 1: Create New Netlify Site
1. **Go to Netlify dashboard**
2. **Sites → Add new site → Deploy manually**
3. **Drag and drop a simple folder** (just to create the site)
4. **Site settings → Change site name** to something like `ar-rahman-ai`
5. **Domain settings → Add custom domain**: `www.ar-rahman.ai`

## Step 2: Get Your Project Files Ready
1. **Download from Replit**: Menu → Export → Download as ZIP
2. **Extract and clean**: Remove `node_modules/`, `attached_assets/`, `dist/`
3. **Keep only**: `client/`, `server/`, `shared/`, `package.json`, etc.

## Step 3: Upload to GitHub (Fresh)
1. **Create new repository** (or clear existing one)
2. **Upload all clean files** via GitHub web interface
3. **Commit**: "Fresh AR Rahman waitlist deployment"

## Step 4: Connect New Netlify Site to GitHub
1. **New Netlify site → Site settings → Build & deploy**
2. **Link to repository**: Your GitHub repo
3. **Build settings**:
   - Branch: `main`
   - Build command: `npm run build`
   - Publish directory: `dist/public`

## Step 5: Add Environment Variables
In Netlify site settings → Environment variables:
- `DATABASE_URL`: Your PostgreSQL connection
- `SENDGRID_API_KEY`: When ready for emails
- `FROM_EMAIL`: help@ar-rahman.ai
- `ADMIN_EMAIL`: Your email

This eliminates all the Bolt conflicts and gives you a clean deployment pipeline.