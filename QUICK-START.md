# Quick Start Guide - LectureRouter

## 🚀 Fastest Way to Get Started (15 minutes)

### Step 1: Database Setup (5 min)

**Option A: Neon (Recommended)**

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project: "lecture-router"
4. Copy connection string
5. Done! ✅

```bash
# Copy this format:
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**Option B: Supabase**

1. Go to https://supabase.com
2. New project
3. Settings > Database > Connection string
4. Copy URI

---

### Step 2: Redis Setup (3 min)

**Upstash Redis (Free Tier)**

1. Go to https://upstash.com
2. Create account
3. Create Redis Database
4. Copy "Redis URL"

```bash
REDIS_URL="redis://default:xxx@xxx.upstash.io:6379"
```

---

### Step 3: Email Setup (2 min)

**Resend (Free 3k emails/month)**

1. Go to https://resend.com
2. Sign up
3. API Keys > Create
4. Copy key

```bash
RESEND_API_KEY="re_xxxxxxxxxxxx"
```

---

### Step 4: Netlify Environment Variables (3 min)

Go to: **Netlify Dashboard > Site Settings > Environment Variables**

Add these **MINIMAL** variables to get started:

```bash
# Database
DATABASE_URL="postgresql://..." # from Step 1
DATABASE_URL_UNPOOLED="postgresql://..." # same as above

# Redis
REDIS_URL="redis://..." # from Step 2

# JWT Secrets (generate random strings)
JWT_SECRET="your-long-random-string-min-32-characters-abc123"
JWT_REFRESH_SECRET="another-long-random-string-min-32-chars-xyz789"

# App URLs
NEXT_PUBLIC_APP_URL="https://your-site.netlify.app"
NEXT_PUBLIC_API_URL="https://your-site.netlify.app/api"
NODE_ENV="production"

# Email
RESEND_API_KEY="re_..." # from Step 3
EMAIL_FROM="noreply@yourdomain.com"

# Temporary placeholders (update later for payments)
STRIPE_SECRET_KEY="sk_test_placeholder"
STRIPE_PUBLISHABLE_KEY="pk_test_placeholder"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_placeholder"
STRIPE_WEBHOOK_SECRET="whsec_placeholder"
STRIPE_PRICE_ID_BASIC="price_placeholder"
STRIPE_PRICE_ID_PRO="price_placeholder"
STRIPE_PRICE_ID_ENTERPRISE="price_placeholder"

# Search (optional - skip for now)
MEILISEARCH_HOST="http://localhost:7700"
MEILISEARCH_MASTER_KEY="masterKey"
```

---

### Step 5: Run Database Migrations (2 min)

From your local machine:

```bash
# 1. Update your local .env with production DATABASE_URL
echo "DATABASE_URL=postgresql://..." > .env

# 2. Run migrations
npm run prisma:generate
npm run prisma:migrate:deploy

# 3. (Optional) Seed with sample data
npm run prisma:seed
```

---

### Step 6: Deploy! 🚀

**Trigger Redeploy in Netlify:**

1. Netlify Dashboard > Deploys
2. Click "Trigger deploy" > "Deploy site"
3. Wait 2-3 minutes
4. Done! ✅

---

## ✅ Test Your Deployment

### 1. Test Registration

```
https://your-site.netlify.app/register
```

- Create account
- Check email for verification

### 2. Test Login

```
https://your-site.netlify.app/login
```

- Login with credentials
- Should redirect to dashboard

### 3. Test API

```
https://your-site.netlify.app/api/health
```

- Should return 200 OK

---

## 🎯 What Works Now

With this minimal setup, you have:

✅ User registration & authentication  
✅ Email verification  
✅ Password reset  
✅ JWT with refresh tokens  
✅ Rate limiting  
✅ Security headers  
✅ Database with all models  
✅ Redis caching  
✅ Audit logging

---

## 🔜 What's NOT Working Yet

❌ **Stripe Payments** - Need to setup Stripe account  
❌ **Search** - Need Meilisearch instance  
❌ **WebSocket** - Need separate WebSocket server  
❌ **Custom Domain** - Using .netlify.app subdomain

---

## 🚀 Next Steps (Do Later)

### Enable Payments (30 min)

1. Create Stripe account
2. Get API keys
3. Create products & prices
4. Setup webhook
5. Update environment variables
   See: DEPLOYMENT.md > Stripe Configuration

### Enable Search (15 min)

1. Deploy Meilisearch to Railway
2. Get host URL and master key
3. Update environment variables
4. Run search index initialization
   See: DEPLOYMENT.md > Meilisearch

### Enable WebSocket (20 min)

1. Deploy WebSocket server to Railway/Render
2. Get WebSocket URL
3. Update NEXT_PUBLIC_WS_URL
   See: DEPLOYMENT.md > WebSocket Server

### Custom Domain (10 min)

1. Netlify: Domain management
2. Add your domain
3. Update DNS records
4. Update environment variables

---

## 💡 Pro Tips

### Generate Strong JWT Secrets

```bash
# On Mac/Linux:
openssl rand -hex 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 255 }))

# Online:
https://generate-secret.vercel.app/32
```

### Check Logs

```bash
# Netlify Dashboard > Functions
# Look for errors in serverless function logs
```

### Force Redeploy

```bash
# If changes not reflecting:
# Netlify > Deploys > Trigger deploy > Clear cache and deploy
```

---

## 🆘 Common Issues

### "Cannot connect to database"

```bash
# Check DATABASE_URL is correct
# Ensure ?sslmode=require is at the end
# Check Neon IP whitelist (should be 0.0.0.0/0)
```

### "Redis connection failed"

```bash
# Verify REDIS_URL format
# Check Upstash dashboard for correct URL
# Ensure password is included
```

### "Email not sending"

```bash
# Check Resend API key is correct
# Verify EMAIL_FROM domain
# Check Resend dashboard logs
```

### "JWT token invalid"

```bash
# Ensure JWT_SECRET is set
# Check it's at least 32 characters
# Clear cookies and try again
```

---

## 📊 Check Status

Create this file to check system health:

**src/app/api/health/route.ts:**

```typescript
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getRedisClient } from "@/lib/redis";

export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis
    const redis = getRedisClient();
    await redis.ping();

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      redis: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
```

Visit: `https://your-site.netlify.app/api/health`

---

## 🎉 You're Done!

Your SaaS is now live with:

- Authentication system
- Email verification
- Database
- Caching
- Security features

Add payments, search, and real-time features when you're ready!

**Questions? Check DEPLOYMENT.md for detailed guide.**
