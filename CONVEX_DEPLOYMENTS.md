# Convex Development vs Production Setup

## 🎯 Quick Answer

**YES, they are different - and that's intentional!**

You have TWO separate Convex deployments:

| Environment | Deployment Name | Purpose |
|-------------|----------------|---------|
| **Local Development** | `rapid-schnauzer-303` | Testing & development |
| **Production (Vercel)** | `kindred-hawk-939` | Live users & real data |

---

## 📊 Current Setup

### Local Development (`.env.local`)
```bash
CONVEX_URL=https://rapid-schnauzer-303.eu-west-1.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://rapid-schnauzer-303.eu-west-1.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://rapid-schnauzer-303.eu-west-1.convex.site
CONVEX_DEPLOYMENT=dev:rapid-schnauzer-303
```

### Vercel Production
```bash
CONVEX_URL=https://kindred-hawk-939.eu-west-1.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://kindred-hawk-939.eu-west-1.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://kindred-hawk-939.eu-west-1.convex.site
CONVEX_DEPLOYMENT=prod:kindred-hawk-939
```

---

## ⚠️ **CRITICAL FIX NEEDED**

Your Vercel production currently has a **mismatch**:

```bash
# ❌ WRONG - This is your DEV deployment
NEXT_PUBLIC_CONVEX_SITE_URL=https://rapid-schnauzer-303.eu-west-1.convex.site

# ✅ CORRECT - Should use PROD deployment
NEXT_PUBLIC_CONVEX_SITE_URL=https://kindred-hawk-939.eu-west-1.convex.site
```

**Update this in Vercel environment variables NOW!**

---

## 🔍 Why Two Deployments?

### Benefits of Separate Dev/Prod Deployments

1. **Isolated Testing**
   - Test schema changes in dev without affecting production users
   - Break things locally without impacting live site

2. **Separate Databases**
   - Dev users don't mix with production users
   - Test data stays in dev, real data in prod

3. **Safe Schema Evolution**
   - Make breaking schema changes in dev first
   - Deploy to production only after testing

4. **Different Data**
   - Development: Test users, fake data, experiments
   - Production: Real users, real financial data, must be stable

---

## 🚀 Deployment Workflow

### 1. Making Schema Changes

```bash
# 1. Update schema in convex/schema.ts
# 2. Test locally (updates dev deployment automatically)
npx convex dev

# 3. When ready, deploy to production
npx convex deploy --prod
```

### 2. When to Deploy to Production

✅ **Safe to deploy:**
- Adding new tables
- Adding optional fields with defaults
- Adding new functions/queries/mutations
- Non-breaking schema changes

⚠️ **Requires migration:**
- Removing fields
- Changing field types
- Renaming tables
- Making optional fields required

### 3. Data Sync (If Needed)

```bash
# Export from dev
npx convex export --deployment dev:rapid-schnauzer-303 --path ./backup.zip

# Import to prod (CAREFUL!)
npx convex import --deployment prod:kindred-hawk-939 --path ./backup.zip
```

**⚠️ WARNING**: Only sync data if you're setting up production for the first time or doing a controlled migration!

---

## 🎯 **Action Items**

### Immediate Fix Required

1. **Go to Vercel** → Your Project → Settings → Environment Variables
2. **Find**: `NEXT_PUBLIC_CONVEX_SITE_URL`
3. **Change from**: `https://rapid-schnauzer-303.eu-west-1.convex.site`
4. **Change to**: `https://kindred-hawk-939.eu-west-1.convex.site`
5. **Redeploy** your site

### Verify Setup

After fixing, check:

```bash
# ✅ All three should use SAME deployment (kindred-hawk-939)
CONVEX_URL=https://kindred-hawk-939.eu-west-1.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://kindred-hawk-939.eu-west-1.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://kindred-hawk-939.eu-west-1.convex.site
```

---

## 📝 Quick Reference

### Dev Commands
```bash
npx convex dev           # Start dev server, auto-deploys to rapid-schnauzer-303
npx convex data users    # View dev deployment data
```

### Production Commands
```bash
npx convex deploy --prod           # Deploy to kindred-hawk-939
npx convex data users --prod       # View production data
npx convex logs --prod             # View production logs
```

### Check Current Deployment
```bash
# See which deployment you're connected to
cat .env.local | grep CONVEX_DEPLOYMENT
```

---

## 🔐 Security Note

**Never mix dev and prod data!**
- ❌ Don't copy production data to dev (contains real user info)
- ❌ Don't test with production deployment URLs locally
- ✅ Keep separate deployments for isolation
- ✅ Use different secrets/API keys for each environment

---

## 🐛 Troubleshooting

### "Data not appearing in production"
- You probably created data in dev deployment
- Check which deployment your production is using
- Ensure `NEXT_PUBLIC_CONVEX_URL` points to `kindred-hawk-939`

### "Users can't sign in on production"
- Could be using dev database instead of prod
- Verify all Convex URLs use `kindred-hawk-939` on Vercel
- Check Better Auth is also using correct origin URLs

### "Schema mismatch error"
- Dev schema updated but prod schema not deployed
- Run: `npx convex deploy --prod`

---

**TL;DR**: You have TWO Convex deployments on purpose. Make sure Vercel production uses `kindred-hawk-939` for ALL Convex URLs (currently using wrong SITE_URL). Update it in Vercel environment variables!
