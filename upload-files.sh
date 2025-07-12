#!/bin/bash

# Create a clean directory for upload
mkdir -p /tmp/github-upload
cd /tmp/github-upload

# Copy essential files (excluding large directories)
cp -r /home/runner/workspace/client .
cp -r /home/runner/workspace/server .
cp -r /home/runner/workspace/shared .
cp -r /home/runner/workspace/.github .
cp /home/runner/workspace/package.json .
cp /home/runner/workspace/package-lock.json .
cp /home/runner/workspace/vite.config.ts .
cp /home/runner/workspace/tsconfig.json .
cp /home/runner/workspace/tailwind.config.ts .
cp /home/runner/workspace/postcss.config.js .
cp /home/runner/workspace/components.json .
cp /home/runner/workspace/drizzle.config.ts .
cp /home/runner/workspace/netlify.toml .
cp /home/runner/workspace/README.md .
cp /home/runner/workspace/.gitignore .
cp /home/runner/workspace/_redirects .

# Create public directory structure
mkdir -p public/video
cp /home/runner/workspace/public/video/README.md public/video/ 2>/dev/null || echo "# Video Files" > public/video/README.md

echo "Files prepared for upload in /tmp/github-upload"
echo "Do NOT include:"
echo "- node_modules/ (too large)"
echo "- dist/ (build output)"
echo "- .replit files"
echo "- attached_assets/"

ls -la