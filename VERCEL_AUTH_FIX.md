# Fix "Invalid Origin" Error on Vercel Production

## Problem Diagnosis

The "Invalid origin" error occurs because:

1. **URL Mismatch**: Your production app URL (`et-gen-ai.vercel.app`) doesn't match the `BETTER_AUTH_URL` (`et-gen-ai-xi.vercel.app`)
2. **Better Auth Security**: Better Auth validates request origins to prevent CSRF attacks
3. **Missing Environment Variables**: Production environment needs properly configured URLs

## Root Cause

Looking at your Vercel environment variables screenshot:
- ❌ `BETTER_AUTH_URL` = `https://et-gen-ai-xi.vercel.app/`
- ❌ `SITE_URL` = `https://et-gen-ai-xi.vercel.app/`
- ❌ `NEXT_PUBLIC_APP_URL` = `https://et-gen-ai.vercel.app` (DIFFERENT!)

The frontend is at `et-gen-ai.vercel.app` but Better Auth expects `et-gen-ai-xi.vercel.app`.

## Solution Steps

### Step 1: Update Vercel Environment Variables

Go to your Vercel project settings → Environment Variables and **update/add** these:

#### Required Variables

```bash
# Use your ACTUAL Vercel deployment URL (check your deployment URL)
BETTER_AUTH_URL=https://et-gen-ai.vercel.app
SITE_URL=https://et-gen-ai.vercel.app
NEXT_PUBLIC_APP_URL=https://et-gen-ai.vercel.app
NEXT_PUBLIC_SITE_URL=https://et-gen-ai.vercel.app

# Keep existing values
BETTER_AUTH_SECRET=57aMUTDuP6yJfnROF2Cf6yZHW76Gw4HfhGr7rgMxKIU=
NEXTAUTH_SECRET=genzet-ai-secret-2026-change-in-production

# Convex URLs (already correct)
CONVEX_URL=https://kindred-hawk-939.eu-west-1.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://kindred-hawk-939.eu-west-1.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://rapid-schnauzer-303.eu-west-1.convex.site

# Ollama
OLLAMA_API_KEY=9052de2ac79244e8a8b43fd5be4930a1.scaIJY1AcIK_IbeFM5-SSFyX
OLLAMA_BASE_URL=https://api.ollama.com

# Zerodha (update callback URL to production)
ZERODHA_API_KEY=sthrlw2yrefhcuva
ZERODHA_API_SECRET=p2580bxcc5adv5azlwgwzotdmvvsq8i0
ZERODHA_REDIRECT_URL=https://et-gen-ai.vercel.app/api/providers/zerodha/callback

# Turbopack skip (for production builds)
NEXT_SKIP_TURBOPACK=1

# Convex deployment
CONVEX_DEPLOYMENT=prod:kindred-hawk-939
```

### Step 2: Ensure All URLs Match

**CRITICAL**: All these variables must point to **the same domain**:
- `BETTER_AUTH_URL`
- `SITE_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SITE_URL`

### Step 3: Update Better Auth Configuration

✅ **Already Fixed** in `src/lib/auth.ts`:
- Improved URL handling (removes trailing slashes)
- Collects all possible origins automatically
- Enables security checks in production
- Disables security checks only in development

### Step 4: Redeploy

After updating environment variables in Vercel:

1. **Trigger a new deployment** (Vercel will automatically use new env vars)
2. Or manually redeploy: Go to Deployments → Click "..." on latest → "Redeploy"

### Step 5: Verify the Fix

1. Visit your production URL: `https://et-gen-ai.vercel.app`
2. Try to sign in with your test account
3. The "Invalid origin" error should be gone

## How the Fix Works

### Before (Broken)
```
Frontend: https://et-gen-ai.vercel.app
         ↓ (POST /api/auth/sign-in/email)
Better Auth: Expects https://et-gen-ai-xi.vercel.app
         ↓
❌ Origin mismatch → "Invalid origin" error
```

### After (Fixed)
```
Frontend: https://et-gen-ai.vercel.app
         ↓ (POST /api/auth/sign-in/email)
Better Auth: Configured for https://et-gen-ai.vercel.app
         ↓ (checks trustedOrigins list)
✅ Origin matches → Authentication succeeds
```

## Updated Better Auth Config Features

```typescript
// src/lib/auth.ts
trustedOrigins: [
  baseURL,                          // Main production URL
  "https://*.vercel.app",           // All Vercel preview deployments
  "http://localhost:3000",          // Local development
  // + all env var URLs automatically
]

advanced: {
  // Security enabled in production
  disableOriginCheck: false,        // ✅ Enforces origin checks
  disableCSRFCheck: false,          // ✅ Enforces CSRF protection
  useSecureCookies: true,           // ✅ HTTPS-only cookies
}
```

## Common Mistakes to Avoid

1. ❌ **Trailing slashes**: Use `https://domain.com` NOT `https://domain.com/`
2. ❌ **URL mismatches**: All env vars must use the SAME domain
3. ❌ **Wrong Convex deployment**: Production should use `prod:kindred-hawk-939` not `dev:rapid-schnauzer-303`
4. ❌ **Forgetting to redeploy**: Changes to env vars require a new deployment

## Testing Checklist

After deployment:

- [ ] Sign in works without "Invalid origin" error
- [ ] Sign up creates new users successfully
- [ ] Session persists across page refreshes
- [ ] Dashboard loads after authentication
- [ ] Provider connections (Zerodha) work with production callback URL

## Troubleshooting

### Still seeing "Invalid origin"?

1. **Check actual deployment URL**:
   - Go to Vercel project → Deployments
   - Copy the actual production URL
   - Update ALL env vars to match

2. **Clear browser cache**:
   - Old cookies may cause issues
   - Open in incognito/private window

3. **Check Vercel logs**:
   - Go to Vercel → Logs
   - Look for Better Auth errors
   - Should show the allowed origins list

4. **Verify env vars loaded**:
   - Add temporary log in `src/lib/auth.ts`:
     ```typescript
     console.log('Better Auth Base URL:', baseURL);
     console.log('Trusted Origins:', getAllowedOrigins());
     ```
   - Check Vercel function logs

### Environment Variables Not Loading?

- Ensure they're set for **Production** environment (not just Preview)
- After updating, wait 30 seconds and redeploy
- Check for typos in variable names

## Security Notes

🔒 **Production Security**:
- Origin checks: **ENABLED** (prevents CSRF)
- CSRF checks: **ENABLED** (additional security layer)
- Secure cookies: **ENABLED** (HTTPS-only)
- Trusted origins: **Whitelist only** (no wildcards except Vercel previews)

🔓 **Development Security**:
- Origin checks: **DISABLED** (for localhost flexibility)
- CSRF checks: **DISABLED** (for easier testing)
- Secure cookies: **DISABLED** (HTTP localhost support)

## Need More Help?

If the issue persists:

1. Share Vercel deployment logs
2. Check Network tab in browser DevTools
3. Verify the actual production URL being used
4. Ensure you're using the latest deployment

---

**Last Updated**: 2026-03-29
**Status**: ✅ Code fixed, awaiting Vercel env var updates
