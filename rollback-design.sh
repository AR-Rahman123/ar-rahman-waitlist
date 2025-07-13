#!/bin/bash

# AR Rahman Design Rollback Script
echo "🔄 Rolling back to original design..."

# Restore original files
cp backups/current-design/src/pages/home.tsx client/src/pages/home.tsx
cp backups/current-design/src/index.css client/src/index.css

echo "✅ Design has been rolled back to the original version"
echo "📁 New design files are saved in backups/current-design/ if you want to switch back"

# Make the script executable
chmod +x rollback-design.sh