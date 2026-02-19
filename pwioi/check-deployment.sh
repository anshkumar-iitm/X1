#!/bin/bash

# Split the Bill - Quick Deployment Script
# This script helps prepare your app for deployment

echo "🚀 Split the Bill - Deployment Preparation Script"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  if [ -d "backend" ] && [ -d "frontend" ]; then
    echo "✓ Project structure found"
  else
    echo "✗ Error: package.json not found. Make sure you're in the project root"
    exit 1
  fi
fi

# Check frontend
echo ""
echo "📦 Checking Frontend..."
if [ -f "frontend/netlify.toml" ]; then
  echo "✓ netlify.toml found"
else
  echo "⚠ netlify.toml not found in frontend/"
fi

if [ -f "frontend/public/_redirects" ]; then
  echo "✓ _redirects file found"
else
  echo "⚠ _redirects file not found in frontend/public/"
fi

# Check backend
echo ""
echo "🔧 Checking Backend..."
if [ -f "backend/Procfile" ]; then
  echo "✓ Procfile found"
else
  echo "⚠ Procfile not found in backend/"
fi

# Test builds
echo ""
echo "🔨 Testing Build Process..."

# Frontend build
echo "  Building frontend..."
cd frontend
if npm run build > /dev/null 2>&1; then
  build_size=$(du -sh dist | cut -f1)
  echo "  ✓ Frontend build successful (size: $build_size)"
else
  echo "  ✗ Frontend build failed. Run 'npm run build' for details"
fi
cd ..

# Backend build
echo "  Building backend..."
cd backend
if npm run build > /dev/null 2>&1; then
  echo "  ✓ Backend build successful"
else
  echo "  ✗ Backend build failed. Run 'npm run build' for details"
fi
cd ..

# Check environment files
echo ""
echo "🔐 Checking Environment Configuration..."
if [ -f "backend/.env" ]; then
  echo "✓ Backend .env file exists"
else
  echo "⚠ Backend .env not found. Copy from .env.example and add your values"
fi

if [ -f "frontend/.env" ]; then
  echo "✓ Frontend .env file exists"
else
  echo "⚠ Frontend .env not found. Copy from .env.example"
fi

# Summary
echo ""
echo "=================================================="
echo "✅ Pre-deployment checks complete!"
echo ""
echo "Next steps:"
echo "1. Make sure all .env files are configured"
echo "2. Test locally: npm run dev (both backend and frontend)"
echo "3. Push to GitHub"
echo "4. Deploy frontend to Netlify"
echo "5. Deploy backend to Render/Heroku"
echo ""
echo "See DEPLOYMENT.md for detailed instructions"
