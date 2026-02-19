# Quick Fix for 404 Errors on Netlify

## The Problem

When you visit a route like `https://yoursite.netlify.app/groups`, you get a 404 error that says "Page not found". This happens because:

1. Your frontend is a Single Page Application (SPA)
2. Vue Router handles routing on the client side
3. But Netlify tries to find actual files/folders for each route
4. When it can't find them, it returns 404

## The Solution

We've already created the necessary files. Make sure they exist:

### 1. Check `_redirects` file

**Location**: `frontend/public/_redirects`

**Content**:
```
/* /index.html 200
```

This tells Netlify: "For all routes (/*), serve index.html with a 200 status code instead of 404"

### 2. Check `netlify.toml` file

**Location**: `frontend/netlify.toml`

Should contain redirect rules and build config.

### 3. Verify in Vite Config

**Location**: `frontend/vite.config.ts`

Should have:
```typescript
build: {
  outDir: 'dist',
  sourcemap: false,
  minify: 'terser'
}
```

---

## Deployment Steps (If Already Set Up)

### If deploying for the first time:

1. **Build locally first** to ensure no errors:
```bash
cd frontend
npm install
npm run build
```

2. **Deploy to Netlify**:

#### Option A: Via Git (Recommended)
```bash
# Make sure these files exist:
# - frontend/netlify.toml
# - frontend/public/_redirects

# Push to GitHub
git add .
git commit -m "Add deployment configuration"
git push origin main

# Connect GitHub repo to Netlify:
# 1. Go to netlify.com
# 2. Click "Add new site" > "Import an existing project"
# 3. Select GitHub
# 4. Choose your repository
# 5. Build settings should auto-detect (frontend folder)
# 6. Deploy!
```

#### Option B: Via Netlify CLI
```bash
npm install -g netlify-cli
cd frontend
netlify deploy --prod
```

3. **After deployment, verify**:
   - Visit your deployed URL
   - Click "View Group" button (tests routing)
   - Try manually navigating to `/groups`
   - Check Network tab if it still fails

---

## If 404 Still Appears

### Step 1: Verify files are deployed

1. Go to [Netlify](https://netlify.com) dashboard
2. Select your site
3. Go to "Netlify configuration"
4. Check "Deploy settings"
5. Look for "Public directory" - should show `frontend/dist`

### Step 2: Check Site Settings

1. Go to **Site settings** > **Build & deploy** > **Builds**
2. Verify:
   - **Base directory**: `frontend` (if monorepo) or empty (if frontend only)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

3. Look at recent **deploy logs**:
   - Click on the failed/successful deployment
   - Search for "_redirects" in logs
   - Should see it being copied to dist folder

### Step 3: Manual Fix in Netlify UI

1. Go to Site settings > Functions
2. Go to Redirects tab
3. Add this redirect rule:
   ```
   From: /*
   To: /index.html
   Status: 200
   ```
4. Redeploy the site

### Step 4: Clear Netlify Cache

1. Go to Site settings > General
2. Scroll to "Danger Zone"
3. Click "Clear cache and redeploy site"

---

## Alternative: Vercel (Even Easier!)

If Netlify keeps having issues, try Vercel (made by creators of Next.js):

```bash
npm install -g vercel
cd frontend
vercel --prod
```

Vercel automatically handles SPA routing for Vue apps - no config needed!

---

## Verify It's Fixed

Open browser DevTools (F12) and try these:

1. Go to your deployed URL
2. Click a link to navigate (should work)
3. Manually edit URL to go to `/groups`
4. If page loads (doesn't 404), you're fixed! ✓
5. Open Network tab - should see `index.html` loading, not 404

---

## API Connection Issues (After Fixing 404)

Once routing works, if API calls fail:

1. **Error**: "Failed to fetch" or CORS error
2. **Fix**: Update environment variables in Netlify

In Netlify UI:
1. Go to Site settings > Environment
2. Add variable:
   ```
   VITE_API_BASE = https://your-backend-url.com
   ```
3. Redeploy the site

---

## Need More Help?

- **Netlify Docs**: https://docs.netlify.com/routing/overview/
- **Vue Router**: https://router.vuejs.org/
- **Deployment Guide**: See `DEPLOYMENT.md` in project root

