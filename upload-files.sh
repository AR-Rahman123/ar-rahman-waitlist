#!/bin/bash

# Script to prepare files for clean upload
echo "Preparing files for GitHub upload..."

# Create clean directory
mkdir -p ar-rahman-clean

# Copy essential files only
cp -r client/ ar-rahman-clean/
cp -r server/ ar-rahman-clean/
cp -r shared/ ar-rahman-clean/
cp package.json ar-rahman-clean/
cp package-lock.json ar-rahman-clean/
cp netlify.toml ar-rahman-clean/
cp tsconfig.json ar-rahman-clean/
cp tailwind.config.ts ar-rahman-clean/
cp vite.config.ts ar-rahman-clean/
cp postcss.config.js ar-rahman-clean/
cp components.json ar-rahman-clean/
cp drizzle.config.ts ar-rahman-clean/
cp README.md ar-rahman-clean/

# Copy GitHub workflow
mkdir -p ar-rahman-clean/.github/workflows/
cp .github/workflows/deploy.yml ar-rahman-clean/.github/workflows/

echo "Clean files ready in ar-rahman-clean/ directory"
echo "Total size: $(du -sh ar-rahman-clean/ | cut -f1)"
echo ""
echo "Next steps:"
echo "1. Compress ar-rahman-clean/ folder"
echo "2. Upload to GitHub"
echo "3. Connect to new Netlify site"