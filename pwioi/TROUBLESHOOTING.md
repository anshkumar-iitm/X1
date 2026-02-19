# Troubleshooting Guide

## 404 Page Not Found Error

### Root Cause
Your Vue.js app is a Single Page Application (SPA). When you visit a route like `/groups`, the server looks for a file called "groups" and doesn't find it, returning 404.

### Solution 1: Netlify Redirect Configuration ✓ (DONE)

Two files handle this:

**File 1: `frontend/public/_redirects`**
```
/* /index.html 200
```

**File 2: `frontend/netlify.toml`**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Verify Files Exist
```bash
ls -la frontend/public/_redirects
ls -la frontend/netlify.toml
```

If missing, they've been created for you.

### When This Is Still Not Working

**Issue**: You've deployed but still getting 404

**Checklist**:
1. ☐ `_redirects` file is in `frontend/public/` (not just frontend root)
2. ☐ `netlify.toml` is in `frontend/` root
3. ☐ Site was re-deployed after adding these files
4. ☐ Build output includes the `_redirects` file

**Debug Steps**:
```bash
# 1. Build locally
cd frontend
npm run build

# 2. Verify _redirects is in dist folder
ls -la dist/_redirects

# 3. If missing, check Vite config copies it
cat vite.config.ts
```

**Fix if `_redirects` is missing from dist**:

Update `frontend/vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    copyPublicDir: true  // Add this line
  }
})
```

---

## API Connection Errors

### Symptoms
- "Failed to connect to API"
- "Cannot POST /api/groups"
- CORS errors in console

### Solution

**Step 1**: Verify backend is running
```bash
cd backend
npm run dev
curl http://localhost:3000/api/health
```

Should return: `{"status":"ok"}`

**Step 2**: Update frontend environment variable

If backend is deployed at `https://my-backend.onrender.com`:

**In Netlify Dashboard**:
1. Site settings → Environment
2. Add variable: `VITE_API_BASE=https://my-backend.onrender.com`
3. Redeploy the site

**Or in `frontend/.env`**:
```
VITE_API_BASE=https://my-backend.onrender.com
VITE_ALGORAND_SERVER=https://mainnet-api.algonode.cloud
```

**Step 3**: Verify API calls use correct URL

In `frontend/src/services/api.ts`, check:
```typescript
const API_BASE = '/api';  // Should work if proxy is set OR
const API_BASE = process.env.VITE_API_BASE || '/api';
```

---

## MongoDB Connection Failed

### Symptoms
- Backend logs: "MongoDB connection error"
- API returns 500 errors

### Causes & Solutions

**Cause 1**: Invalid connection string
```bash
# Check your connection string format
# Should be: mongodb+srv://USER:PASSWORD@cluster.mongodb.net/database
```

**Cause 2**: IP not whitelisted
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Add your Render/Heroku IP or allow all `0.0.0.0/0`

**Cause 3**: Wrong `.env` variable
```bash
# Verify in backend/.env:
echo $MONGODB_URI
```

**Cause 4**: Database doesn't exist
MongoDB creates it automatically, but check:
1. Go to Atlas → Collections
2. Should show `split-the-bill` database
3. If not, create it manually

**Fix**:
```bash
# 1. Test connection locally
cd backend
npm install
npm run dev

# 2. Check backend logs for errors
# 3. Update MONGODB_URI in .env
# 4. Redeploy backend
```

---

## CORS Errors

### Symptoms
- Browser console: "Access to XMLHttpRequest blocked by CORS policy"
- API returns 403/401

### Solution

**Step 1**: Update backend CORS

In `backend/src/server.ts`:
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
```

**Step 2**: Set environment variable

In backend `.env`:
```
CORS_ORIGIN=https://yourfrontend.netlify.app
```

**Step 3**: Redeploy backend

If using Render:
```bash
git push origin main  # Automatically redeploys
```

**Step 4**: Test

Browser console should no longer show CORS errors.

---

## MyAlgo Wallet Connection Issues

### Symptoms
- "Connect Wallet" button does nothing
- Browser console: "MyAlgo is not defined"

### Causes & Solutions

**Cause 1**: MyAlgo extension not installed
- Install from Chrome Web Store: "MyAlgo"
- Refresh page

**Cause 2**: MyAlgo version incompatible
```bash
cd frontend
npm list myalgo  # Check version
npm update myalgo  # Update if needed
```

**Cause 3**: Dynamic import failing

In `frontend/src/components/WalletConnect.vue`, MyAlgo is dynamically imported. This should work.

**Debug**:
```javascript
// Open browser console and try:
import('myalgo').then(m => console.log('MyAlgo loaded:', m))
```

---

## Build Errors

### TypeScript Compilation Error

**Error**: `Type 'x' is not assignable to type 'y'`

**Solution**:
```bash
# Option 1: Fix the error (recommended)
cd frontend
npm run build  # See exact error
# Fix in code

# Option 2: Disable strict mode (not recommended)
# In tsconfig.json, set "strict": false
```

### Out of Memory

**Error**: `JavaScript heap out of memory`

**Solution**:
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Missing Dependencies

**Error**: `Cannot find module 'X'`

**Solution**:
```bash
npm install
npm install missing-package-name
npm run build
```

---

## Performance Issues

### Frontend is Slow

**Causes**:
- Large bundle size
- Unoptimized components
- Network requests

**Solutions**:
```bash
# Check bundle size
cd frontend
npm run build
npm run preview

# In DevTools:
# - Lighthouse tab → Analyze
# - Performance tab → Record → interact

# Optimize:
# - Split large components
# - Lazy load routes (already done in router)
# - Minimize images
```

### API Requests are Slow

**Check**:
1. Network tab in DevTools
2. Look for slow requests
3. Check backend logs

**Solutions**:
- Add database indexes
- Optimize MongoDB queries
- Use caching
- Enable compression (`.compress()` in Express)

---

## Wallet Transactions Failing

### Symptoms
- "Payment failed" error
- No transaction created

### Causes

**Cause 1**: Insufficient balance
- Check account has enough ALGO
- Need at least 0.1 ALGO for transaction fee

**Cause 2**: Invalid recipient address
- Verify Algorand address format
- Address must be valid and exist

**Cause 3**: Network issue
- Check Algorand network status
- Verify ALGORAND_ALGOD_SERVER is accessible

**Solution**:
```typescript
// In frontend/src/services/algorand.ts
// Add better error handling:
try {
  const result = await sendPayment(...);
  console.log('Payment successful:', result);
} catch (error) {
  console.error('Payment failed:', error.message);
}
```

---

## Database Size Growing Too Fast

### Monitor

1. Go to MongoDB Atlas → Metrics
2. Check storage usage

### Reduce

1. Delete old expense data
2. Archive settled groups
3. Implement data retention policy

```javascript
// Example: Delete expenses older than 6 months
const sixMonthsAgo = new Date(Date.now() - 180*24*60*60*1000);
Expense.deleteMany({ createdAt: { $lt: sixMonthsAgo } });
```

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Page not found" | SPA routing not configured | Add `_redirects` file |
| "Cannot GET /groups" | Route doesn't exist | Check router config |
| "Failed to fetch" | API unreachable | Update VITE_API_BASE |
| "CORS error" | Frontend/backend mismatch | Set CORS_ORIGIN env var |
| "MongoError" | Database connection issue | Check MONGODB_URI |
| "MyAlgo undefined" | Extension not installed | Install MyAlgo extension |
| "Insufficient balance" | Not enough ALGO | Add funds to account |
| "Invalid address" | Wrong Algorand format | Verify address format |

---

## Getting Help

1. **Check logs**:
   - Frontend: Browser DevTools
   - Backend: Render/Heroku logs
   - Database: MongoDB Atlas logs

2. **Test locally first**:
   ```bash
   npm run dev  # Both backend and frontend
   ```

3. **Read error messages**:
   - They usually tell you what's wrong
   - Search the specific error message online

4. **Verify configuration**:
   - All `.env` variables set
   - All files in correct locations
   - All dependencies installed

5. **Check network**:
   - Is backend accessible?
   - Is database accessible?
   - Is Algorand node accessible?

