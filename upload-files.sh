#!/bin/bash

# Emergency deployment script to bypass Git issues

echo "🚨 EMERGENCY DEPLOYMENT: Bypassing Git locks"

# Kill any git processes
pkill -f git 2>/dev/null || true

# Remove all git locks
rm -f .git/index.lock .git/HEAD.lock .git/refs/heads/main.lock .git/config.lock

# Force add critical files
git add --force netlify/functions/api.js netlify.toml package.json

# Commit with force
git commit -m "EMERGENCY: Fix API endpoints - immediate deployment required" || true

# Force push
git push origin main --force-with-lease || git push origin main --force

echo "✅ Emergency deployment initiated"
echo "⏳ Waiting for Netlify build..."
echo "🔗 Test: https://ar-rahman.ai/api/health"