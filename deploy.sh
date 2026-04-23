#!/bin/bash
set -e

cd /var/www/SmartMenu

echo "→ Pulling latest code..."
git pull origin main

echo "→ Building frontend..."
cd frontend
npm install --silent
npm run build
chmod -R 755 dist/
cd ..

echo "→ Restarting backend..."
cd backend
npm install --silent
cd ..

pm2 restart smartmenu

echo "✓ Deploy complete!"
