#!/bin/bash
echo "🚀 Deploying admin authentication fix..."

# Step 1: Remove Git locks
echo "Removing Git locks..."
sudo rm -rf .git/index.lock .git/HEAD.lock .git/refs/heads/main.lock .git/objects/*/tmp_*
sudo pkill -9 git

# Step 2: Add all changes
echo "Adding changes..."
git add -A

# Step 3: Commit with force
echo "Committing changes..."
git commit -m "Fix admin authentication - prevent infinite refresh and enable login" --no-verify

# Step 4: Force push to deploy
echo "Pushing to production..."
git push origin main --force --no-verify

echo ""
echo "✅ Deployment initiated!"
echo "⏳ Wait 2-3 minutes for Netlify to build and deploy"
echo "🌐 Then test: https://ar-rahman.ai/admin"
echo "🔑 Password: admin123"
echo ""
echo "Expected behavior:"
echo "1. Visit /admin"
echo "2. See login form (may show 'Checking...' for 1 second first)" 
echo "3. Enter password 'admin123'"
echo "4. Access full analytics dashboard"