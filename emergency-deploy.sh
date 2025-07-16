#!/bin/bash

# Emergency deployment script to fix missing submissions in production

echo "🚨 EMERGENCY DEPLOYMENT: Fixing missing Micheal Oguntayo and Yusha Malik submissions"

# Check if changes exist
echo "📋 Current git status:"
git status --porcelain

# Check current production API response
echo "🔍 Current production API (first 3 responses):"
curl -s https://ar-rahman.ai/api/waitlist/responses | head -200

echo ""
echo "📊 Production count:"
curl -s https://ar-rahman.ai/api/waitlist/count

echo ""
echo "🎯 Database verification (local):"
echo "SELECT id, full_name, email FROM waitlist_responses WHERE id >= 13 ORDER BY id DESC;" | npm run db:query 2>/dev/null || echo "Database query failed"

echo ""
echo "⚠️  To deploy the fix manually:"
echo "1. git add ."
echo "2. git commit -m 'EMERGENCY: Fix missing submissions - connect production to database'"
echo "3. git push origin main"

echo ""
echo "🔧 The fix adds database connectivity to production admin responses endpoint"
echo "📈 Expected result: Micheal Oguntayo and Yusha Malik (if exists) will appear in admin dashboard"