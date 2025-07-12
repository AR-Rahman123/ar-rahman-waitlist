# Setting Up Git Integration in Replit

## Method 1: Using Replit's Git Integration (Recommended)

1. **Open the Git panel** in Replit:
   - Click the **Git icon** in the left sidebar
   - Or go to **Tools → Git**

2. **Connect to GitHub**:
   - Click **"Connect to GitHub"**
   - Authorize Replit to access your GitHub account
   - Select your `ar-rahman-waitlist` repository

3. **Push your code**:
   - The interface will show all your files
   - Add a commit message: "Initial commit - Enhanced AR Rahman waitlist"
   - Click **"Commit and push"**

## Method 2: Manual Git Setup (If Git panel doesn't work)

Run these commands in the Replit Shell:

```bash
# Set up git credentials
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/ar-rahman-waitlist.git

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Enhanced AR Rahman waitlist"

# Push to GitHub
git push -u origin main
```

## Method 3: Using GitHub Personal Access Token

If you need authentication:

1. **Create a Personal Access Token**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Create a new token with "repo" permissions
   - Copy the token

2. **Use token for authentication**:
   ```bash
   git remote add origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/ar-rahman-waitlist.git
   git push -u origin main
   ```

## Future Workflow

Once set up, your workflow will be:
1. **Make changes** in Replit
2. **Test locally** using the preview
3. **Commit and push** via Git panel
4. **Netlify auto-deploys** to your live site

This gives you a professional development workflow with version control and automatic deployment!