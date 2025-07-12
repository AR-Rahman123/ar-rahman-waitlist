# Simple GitHub Upload for Auto-Deployment

Since Replit's GitHub integration isn't visible, here's the easiest approach:

## Step 1: Download Your Project
1. **Click the three-line menu (☰)** in top-left of Replit
2. **File → Export → Download as ZIP**
3. **Extract the ZIP** on your computer

## Step 2: Clean the Files
Delete these large folders before uploading:
- `node_modules/` (too large)
- `attached_assets/` (Replit-specific)
- `dist/` (build output, if exists)

## Step 3: Upload to GitHub
1. **Go to**: https://github.com/AR-Rahman123/ar-rahman-waitlist
2. **Click "uploading an existing file"** or drag files
3. **Upload all remaining files**
4. **Commit message**: "Enhanced waitlist with working video"

## Step 4: Configure Auto-Deploy
In GitHub, go to **Settings → Secrets and variables → Actions**:

Add these secrets:
- `NETLIFY_AUTH_TOKEN`: Get from Netlify → User settings → Applications → Personal access tokens
- `NETLIFY_SITE_ID`: Get from your site dashboard → Site settings → General → Site ID
- `DATABASE_URL`: Your PostgreSQL connection string

## Step 5: Connect Netlify
1. **Netlify dashboard → Sites**
2. **Click your site → Site settings → Build & deploy**
3. **Repository → Change repository**
4. **Select**: `AR-Rahman123/ar-rahman-waitlist`
5. **Branch**: `main`
6. **Build command**: `npm run build`
7. **Publish directory**: `dist/public`

## Result: One-Button Future Updates
After this setup, any future changes:
1. **Make changes in Replit**
2. **Export → Download ZIP**
3. **Upload to GitHub** (drag & drop)
4. **Auto-deployment happens** in 3 minutes

Your enhanced site with working video and analytics will be live at www.ar-rahman.ai!