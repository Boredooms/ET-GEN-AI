# Vercel Production Fix Checklist

**Complete this checklist to fix all production issues:**

---

## ✅ Environment Variables to Update in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### 1️⃣ Authentication URLs (Fix "Invalid origin")

**ALL must use your actual production domain** (find it in Vercel → Deployments):

```bash
# Replace with YOUR actual production URL from Vercel
# IMPORTANT: NO trailing slash!

BETTER_AUTH_URL=https://your-app.vercel.app
SITE_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**Current Problem:**
- ❌ You might have: `https://wrong-domain.vercel.app/` (wrong domain + trailing slash)
- ✅ Should be: `https://your-actual-app.vercel.app` (your real site URL)

---

### 2️⃣ Convex URLs (Fix data sync)

**ALL must use PRODUCTION deployment:**

```bash
# Get from: https://dashboard.convex.dev/
# Use your PRODUCTION deployment
CONVEX_URL=https://your-prod-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-prod-deployment.convex.site
CONVEX_DEPLOYMENT=prod:your-deployment-name
```

**Current Problem:**
- ❌ `NEXT_PUBLIC_CONVEX_SITE_URL` might use dev deployment
- ✅ All Convex URLs should point to same PRODUCTION deployment

---

### 3️⃣ Authentication Secrets

```bash
# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=your-better-auth-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here
```

⚠️ **Generate your own secrets** - Never use example values in production!

---

### 4️⃣ AI/LLM Configuration

```bash
# Get from your Ollama provider
OLLAMA_API_KEY=your-ollama-api-key-here
OLLAMA_BASE_URL=https://api.ollama.com
```

---

### 5️⃣ Financial Provider (Zerodha)

```bash
# Get from: https://kite.zerodha.com/apps
ZERODHA_API_KEY=your-zerodha-api-key
ZERODHA_API_SECRET=your-zerodha-api-secret

# IMPORTANT: Update callback URL to production domain
ZERODHA_REDIRECT_URL=https://your-app.vercel.app/api/providers/zerodha/callback
```

**Current Problem:**
- ❌ Callback probably points to localhost or wrong domain
- ✅ Must point to production domain

**Also Update in Zerodha Dashboard:**
- Go to: https://kite.zerodha.com/apps
- Update redirect URL to match production
- Get your API key and secret from there

---

### 6️⃣ Build Configuration

```bash
NEXT_SKIP_TURBOPACK=1
```

✅ **This is correct** - keep it

---

## 📋 Step-by-Step Action Plan

### Step 1: Find Your Actual Production URL
```
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Look at the Production deployment URL
5. Copy it (e.g., https://your-app.vercel.app)
```

### Step 2: Update Environment Variables
```
1. Go to Settings → Environment Variables
2. For EACH variable in sections 1️⃣ and 2️⃣ above:
   - Click the "..." menu
   - Click "Edit"
   - Paste the CORRECT value
   - Click "Save"
3. Ensure "Production" environment is selected
```

### Step 3: Update Zerodha Dashboard
```
1. Go to https://kite.zerodha.com/apps
2. Find your app using your API key
3. Update "Redirect URL" to: https://your-app.vercel.app/api/providers/zerodha/callback
4. Save changes
```

### Step 4: Redeploy
```
1. Go to Vercel → Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete
```

### Step 5: Test
```
1. Visit your production site
2. Try to sign in → should work (no "Invalid origin")
3. Try dashboard → should load user data from Convex
4. Try Zerodha connection → should redirect properly
```

---

## 🎯 Critical Fixes Summary

| Issue | Current Value | Correct Value | Impact |
|-------|--------------|---------------|--------|
| **BETTER_AUTH_URL** | `wrong-domain.vercel.app/` | `your-app.vercel.app` | ❌ Auth broken |
| **SITE_URL** | `wrong-domain.vercel.app/` | `your-app.vercel.app` | ❌ Auth broken |
| **NEXT_PUBLIC_APP_URL** | Maybe correct? | `your-app.vercel.app` | ❌ Auth broken |
| **NEXT_PUBLIC_CONVEX_SITE_URL** | `dev-deployment...` | `prod-deployment...` | ⚠️ Wrong database |
| **ZERODHA_REDIRECT_URL** | Probably localhost | Production URL | ⚠️ OAuth broken |

---

## ✅ Verification Checklist

After deploying, verify:

- [ ] All auth URLs use the SAME production domain
- [ ] No trailing slashes on any URLs
- [ ] All Convex URLs use prod deployment (not dev)
- [ ] Zerodha redirect URL matches production domain
- [ ] Site deploys without errors
- [ ] Sign in works (no "Invalid origin" error)
- [ ] Dashboard shows correct user data
- [ ] Convex queries return data from prod deployment
- [ ] Zerodha OAuth flow works end-to-end

---

## 🆘 If Still Broken

### Check Vercel Logs
```
1. Go to Vercel → Your deployment
2. Click "Logs" tab
3. Look for errors mentioning:
   - "Invalid origin"
   - "CORS"
   - Better Auth errors
   - Convex connection errors
```

### Check Browser Console
```
1. Open DevTools (F12)
2. Go to Console tab
3. Try to sign in
4. Look for errors with:
   - 403 Forbidden
   - CORS errors
   - Network errors
```

### Common Issues

**"Invalid origin" still appearing:**
- Environment variables not loaded → wait 30s and redeploy
- Browser cache → try incognito mode
- Typo in URL → double-check all URLs match exactly

**"No data in dashboard":**
- Using dev deployment instead of prod
- Check `NEXT_PUBLIC_CONVEX_URL` points to prod deployment
- Data might not exist in prod (only in dev)

**"Zerodha OAuth fails":**
- Redirect URL mismatch
- Update BOTH Vercel env var AND Zerodha dashboard
- Ensure no trailing slashes

---

## 📚 Reference Documentation

- `VERCEL_AUTH_FIX.md` - Complete "Invalid origin" troubleshooting
- `CONVEX_DEPLOYMENTS.md` - Dev vs prod deployment explanation
- `.env.production.example` - Copy-paste template for all env vars

---

**Last Updated:** 2026-03-29  
**Estimated Time to Fix:** 15 minutes  
**Difficulty:** Easy (just updating env vars in Vercel dashboard)
