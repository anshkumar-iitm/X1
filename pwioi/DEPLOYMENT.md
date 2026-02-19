# Deployment Guide - Split the Bill dApp

## Frontend Deployment (Netlify)

### Prerequisites
- Netlify account
- GitHub account with code pushed

### Step 1: Prepare Your Frontend

Make sure these files exist in your frontend directory:
- `netlify.toml` ✓ (already created)
- `public/_redirects` ✓ (already created)
- `vite.config.ts` ✓ (already configured)

### Step 2: Deploy to Netlify

#### Option A: Via Netlify UI (Easiest)

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub, GitLab, Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Set environment variables:
   ```
   VITE_API_BASE=https://your-backend-url.com
   VITE_ALGORAND_SERVER=https://mainnet-api.algonode.cloud
   ```
7. Click "Deploy site"

#### Option B: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd frontend

# Deploy
netlify deploy --prod
```

### Step 3: Verify Deployment

After deployment:
1. Visit your Netlify URL
2. Try navigating to different pages (/groups, /groups/123)
3. Verify no 404 errors occur
4. Check browser console for API connection issues

### Troubleshooting 404 Errors

**Problem**: Page not found errors when visiting routes
**Solution**: Make sure `_redirects` file is in `public/` folder and `netlify.toml` is present

**Problem**: API calls failing (CORS issues)
**Solution**: Update `VITE_API_BASE` environment variable to your backend URL

---

## Backend Deployment (Render, Heroku, or AWS)

### Option 1: Deploy to Render (Recommended - Free tier available)

#### Step 1: Prepare Backend

1. Ensure `Procfile` exists in backend directory ✓
2. Update `backend/package.json` to include Node version:
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

#### Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create new "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/split-the-bill
   PORT=3000
   NODE_ENV=production
   CORS_ORIGIN=https://your-netlify-url.netlify.app
   ALGORAND_NETWORK=mainnet
   ALGORAND_ALGOD_SERVER=https://mainnet-api.algonode.cloud
   ```
7. Click "Create Web Service"

### Option 2: Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Navigate to backend
cd backend

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set CORS_ORIGIN="https://your-frontend.netlify.app"
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Option 3: Deploy to AWS Lambda + API Gateway

1. Install AWS SAM CLI
2. Create `template.yaml` in backend root
3. Build and deploy:
```bash
sam build
sam deploy --guided
```

---

## Full Deployment Checklist

### Frontend
- [ ] `_redirects` file in `public/` directory
- [ ] `netlify.toml` configured
- [ ] `vite.config.ts` has build configuration
- [ ] Environment variables set (VITE_API_BASE)
- [ ] API calls use correct backend URL
- [ ] No hardcoded localhost URLs

### Backend
- [ ] `Procfile` exists
- [ ] `package.json` has start script
- [ ] MongoDB Atlas cluster created and connection string in env
- [ ] All environment variables configured
- [ ] CORS properly configured with frontend URL
- [ ] Build command works locally
- [ ] TypeScript compiles without errors

---

## Environment Variables Reference

### Frontend (.env in frontend/)
```
VITE_ALGORAND_SERVER=https://mainnet-api.algonode.cloud
VITE_API_BASE=https://your-backend-url.com
```

### Backend (.env in backend/)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/split-the-bill
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-netlify-site.netlify.app
ALGORAND_NETWORK=mainnet
ALGORAND_ALGOD_SERVER=https://mainnet-api.algonode.cloud
ALGORAND_EXPLORER=https://allo.info/tx/
```

---

## Testing Deployment

### Test Frontend
```bash
# Build locally to catch issues
cd frontend
npm run build

# Preview production build
npm run preview
```

### Test Backend
```bash
# Build and run locally
cd backend
npm run build
npm start

# Test API endpoints
curl http://localhost:3000/api/health
```

---

## Common Issues & Solutions

### 1. 404 Page Not Found
**Cause**: SPA routing not configured on server
**Fix**: Ensure `_redirects` and `netlify.toml` are present

### 2. CORS Errors
**Cause**: Frontend and backend on different domains
**Fix**: Update backend CORS_ORIGIN to match frontend URL

### 3. API Calls Failing
**Cause**: Wrong API base URL
**Fix**: Update VITE_API_BASE environment variable

### 4. MongoDB Connection Failed
**Cause**: Invalid connection string or IP whitelist
**Fix**:
- Check MongoDB Atlas connection string
- Add server IP to MongoDB IP whitelist

### 5. Build Fails with TypeScript Errors
**Cause**: Type errors in code
**Fix**:
```bash
cd backend
npm run build
# Fix any TypeScript errors shown
```

---

## Post-Deployment

### Monitor Your App
- Netlify: Check "Analytics" and "Deployment logs"
- Render: Check "Logs" in service dashboard
- MongoDB: Check "Monitoring" in Atlas dashboard

### Setup Custom Domain
1. In Netlify/Render, go to Domain settings
2. Add your custom domain
3. Update DNS records as instructed
4. Update CORS_ORIGIN in backend

### SSL Certificate
- Netlify: Automatically provides free SSL
- Render: Automatically provides free SSL
- MongoDB Atlas: Required for all connections

---

## Updating Deployed Apps

### Update Frontend
```bash
cd frontend
git push origin main
# Netlify automatically redeploys
```

### Update Backend
```bash
cd backend
git push heroku main  # If using Heroku
# OR for Render: Push to main, automatic redeploy occurs
```

---

## Cost Breakdown

### Free Tier Options
- **Frontend**: Netlify (free)
- **Backend**: Render (free tier with limited resources)
- **Database**: MongoDB Atlas (512MB free tier)
- **Total**: $0/month

### Production Tier (Recommended)
- **Frontend**: Netlify Pro ($19/mo) or free
- **Backend**: Render ($7+/mo) or Heroku ($50+/mo)
- **Database**: MongoDB Atlas ($0.30/GB)
- **Estimated**: $25-50/month

