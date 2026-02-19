# Quick Deployment Reference

## Before Deploying - Checklist

- [ ] Backend `.env` file created with MONGODB_URI
- [ ] Frontend `.env` file created
- [ ] `frontend/netlify.toml` exists
- [ ] `frontend/public/_redirects` exists
- [ ] All code committed to Git
- [ ] No hardcoded localhost URLs in code
- [ ] `npm run build` works locally for both

## One-Command Deploy

### Frontend to Netlify

```bash
# Option 1: Via Netlify CLI (easiest)
npm install -g netlify-cli
cd frontend
netlify deploy --prod

# Option 2: Via Git (automatic)
git push origin main
# Then connect repo to Netlify dashboard
# Netlify auto-deploys on every push
```

### Backend to Render

```bash
# Via Git (automatic)
git push origin main

# Then:
# 1. Go to render.com
# 2. New Web Service
# 3. Select your repo
# 4. Root Dir: backend
# 5. Build: npm install && npm run build
# 6. Start: npm start
# 7. Add env vars: MONGODB_URI, CORS_ORIGIN, etc.
```

## Verify Deployment Works

### Frontend
```bash
# Visit your Netlify URL
# Click "View Group" button
# Try accessing /groups in address bar
# Both should work without 404
```

### Backend
```bash
# Test API health
curl https://yourbackend.onrender.com/api/health

# Should return:
# {"status":"ok"}
```

### Together
```bash
# Update VITE_API_BASE in frontend .env
VITE_API_BASE=https://yourbackend.onrender.com

# Redeploy frontend
# Try adding an expense - should save to DB
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yoursite.netlify.app
ALGORAND_NETWORK=mainnet
ALGORAND_ALGOD_SERVER=https://mainnet-api.algonode.cloud
ALGORAND_EXPLORER=https://allo.info/tx/
```

### Frontend (in Netlity UI or .env.local)
```
VITE_ALGORAND_SERVER=https://mainnet-api.algonode.cloud
VITE_API_BASE=https://your-backend-url.com
```

## Most Common Issues (Fixes)

### 404 Page Not Found
```bash
# Make sure these files exist:
ls frontend/netlify.toml
ls frontend/public/_redirects

# If missing, redeploy
```

### API Calls Failing
```bash
# Update VITE_API_BASE to your backend URL
# Redeploy frontend
# Check backend CORS_ORIGIN matches frontend URL
```

### MongoDB Connection Error
```bash
# 1. Check connection string in .env
# 2. Whitelist your IP in MongoDB Atlas
# 3. Redeploy backend
```

## File Locations (Final Check)

```
project/
├── backend/
│   ├── src/
│   ├── package.json
│   ├── Procfile ✓ (required for Heroku/Render)
│   └── .env (created from .env.example)
├── frontend/
│   ├── src/
│   ├── public/
│   │   └── _redirects ✓ (fixes 404 errors)
│   ├── netlify.toml ✓ (Netlify config)
│   ├── vite.config.ts ✓ (already configured)
│   ├── package.json
│   └── .env (created from .env.example)
├── DEPLOYMENT.md (full guide)
├── TROUBLESHOOTING.md (problem solving)
└── README.md (project info)
```

## After Deployment

1. Update backend CORS_ORIGIN in environment
2. Update frontend API_BASE in environment
3. Redeploy both

```bash
# Backend (Render dashboard or Git)
# Frontend (Netlify will auto-redeploy on git push)
git push origin main
```

## Monitoring

### Frontend (Netlify)
- Go to: netlify.com → your-site → Deploys
- Check deployment logs
- Monitor Analytics for errors

### Backend (Render)
- Go to: render.com → your-service → Logs
- Check recent logs for errors
- Monitor dashboard metrics

### Database (MongoDB)
- Go to: Atlas → Metrics
- Check connections and storage
- Monitor performance

## Cost Summary

| Service | Free Tier | Cost |
|---------|-----------|------|
| Netlify | Yes, 100GB/mo | Included |
| Render | Yes (limited) | $7+/mo |
| MongoDB | 512MB free | $0.30/GB |
| **Total** | Yes | ~$25/mo prod |

## Next Steps

1. Deploy frontend ✓
2. Deploy backend ✓
3. Connect them (update env vars)
4. Test all features
5. Monitor logs
6. Scale if needed

## Support

See these files for more help:
- `DEPLOYMENT_FIX.md` - 404 error fixes
- `TROUBLESHOOTING.md` - All common issues
- `README.md` - Project overview
