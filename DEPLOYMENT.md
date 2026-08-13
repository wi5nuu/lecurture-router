# Deployment Guide - LectureRouter

## 🚀 Deployment Checklist

### ✅ Yang Sudah Selesai

- [x] Aplikasi di-deploy ke Netlify
- [x] Database schema lengkap dengan 12+ models
- [x] Authentication system dengan JWT & refresh tokens
- [x] Stripe integration untuk payment
- [x] WebSocket server untuk realtime features
- [x] Email service dengan Resend
- [x] Search engine dengan Meilisearch
- [x] Admin panel & API routes
- [x] Docker configuration
- [x] CI/CD pipeline

### 🔧 Yang Perlu Dikonfigurasi

#### 1. Database PostgreSQL (Prioritas Tinggi)

Netlify tidak menyediakan database. Anda perlu setup database eksternal:

**Pilihan A: Neon (Recommended for Free Tier)**

```bash
# 1. Buat account di https://neon.tech
# 2. Create new project
# 3. Copy connection string
# 4. Update di Netlify Environment Variables:
DATABASE_URL="postgresql://user:pass@hostname.neon.tech/dbname?sslmode=require"
```

**Pilihan B: Supabase**

```bash
# 1. Buat account di https://supabase.com
# 2. Create new project
# 3. Go to Settings > Database
# 4. Copy connection string
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Pilihan C: Railway**

```bash
# 1. Buat account di https://railway.app
# 2. New Project > Provision PostgreSQL
# 3. Copy DATABASE_URL
```

**Pilihan D: Render**

```bash
# 1. Buat account di https://render.com
# 2. New PostgreSQL Database
# 3. Copy Internal/External Database URL
```

#### 2. Redis (Prioritas Tinggi)

**Pilihan A: Upstash (Recommended - Free Tier)**

```bash
# 1. Buat account di https://upstash.com
# 2. Create Redis Database
# 3. Copy REST URL atau Redis URL
REDIS_URL="redis://default:[PASSWORD]@[HOSTNAME]:6379"
```

**Pilihan B: Redis Cloud**

```bash
# https://redis.com/try-free
```

#### 3. Meilisearch

**Pilihan A: Meilisearch Cloud**

```bash
# 1. https://meilisearch.com/cloud
# 2. Create project
# 3. Get host and API key
MEILISEARCH_HOST="https://ms-[hash].meilisearch.io"
MEILISEARCH_MASTER_KEY="[YOUR-MASTER-KEY]"
```

**Pilihan B: Self-hosted di Railway/Render**

```bash
# Deploy Meilisearch container
```

#### 4. WebSocket Server

**Pilihan A: Deploy ke Railway**

```bash
# 1. Push code ke GitHub
# 2. https://railway.app
# 3. New Project > Deploy from GitHub
# 4. Select repository
# 5. Add Environment Variables
# 6. Deploy
```

**Pilihan B: Deploy ke Render**

```bash
# 1. https://render.com
# 2. New Web Service
# 3. Connect repository
# 4. Build Command: npm install
# 5. Start Command: npm run dev:ws
```

#### 5. Stripe Configuration

```bash
# 1. Login ke https://dashboard.stripe.com
# 2. Get API Keys dari Developers > API keys
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# 3. Create Products & Prices
# Dashboard > Products > Add product
# - Basic Plan: $9.99/month
# - Pro Plan: $29.99/month
# - Enterprise: $99.99/month

# Copy Price IDs
STRIPE_PRICE_ID_BASIC="price_..."
STRIPE_PRICE_ID_PRO="price_..."
STRIPE_PRICE_ID_ENTERPRISE="price_..."

# 4. Setup Webhook
# Dashboard > Webhooks > Add endpoint
# URL: https://your-domain.com/api/webhooks/stripe
# Events: Select all subscription & invoice events
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### 6. Resend (Email Service)

```bash
# 1. Buat account di https://resend.com
# 2. Get API Key dari Settings > API Keys
RESEND_API_KEY="re_..."

# 3. Verify domain (Optional tapi recommended)
# Settings > Domains > Add domain
EMAIL_FROM="noreply@yourdomain.com"
```

#### 7. Sentry (Error Tracking - Optional)

```bash
# 1. https://sentry.io/signup
# 2. Create new project (Next.js)
# 3. Copy DSN
SENTRY_DSN="https://[key]@[org].ingest.sentry.io/[project]"
NEXT_PUBLIC_SENTRY_DSN="https://[key]@[org].ingest.sentry.io/[project]"
```

#### 8. Firebase (Catalog - Materials, Providers, Categories)

Katalog (materi, provider, kategori) disimpan di **Firebase Firestore** dan hanya berisi teks, sehingga muat di **free Spark plan** (1 GiB storage, 50K reads/day, 20K writes/day). Tidak perlu upgrade berbayar.

```bash
# 1. Buat project di https://console.firebase.google.com
# 2. Project Settings > Service accounts > Generate new private key
#    (file JSON service account akan ter-download)
# 3. Copy 3 nilai berikut ke environment variables:

FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"

# (PENTING: jaga karakter \n di dalam private key tetap utuh.
#  Alternatif: paste seluruh isi JSON service account ke FIREBASE_SERVICE_ACCOUNT)

# 4. Console > Firestore Database > Create database > Production mode
# 5. Setelah deploy, sinkronkan katalog dari source data:
npm run firebase:seed
```

---

## 🔐 Netlify Environment Variables

Masuk ke Netlify Dashboard > Site settings > Environment variables

### Critical Variables (Required)

```bash
# Database
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."

# Redis
REDIS_URL="redis://..."

# JWT Secrets (Generate dengan: openssl rand -hex 32)
JWT_SECRET="your-32-char-random-string"
JWT_REFRESH_SECRET="your-32-char-random-string"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# App URLs
NEXT_PUBLIC_APP_URL="https://your-site.netlify.app"
NEXT_PUBLIC_API_URL="https://your-site.netlify.app/api"
NODE_ENV="production"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID_BASIC="price_..."
STRIPE_PRICE_ID_PRO="price_..."
STRIPE_PRICE_ID_ENTERPRISE="price_..."

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"

# Search
MEILISEARCH_HOST="https://..."
MEILISEARCH_MASTER_KEY="..."
NEXT_PUBLIC_MEILISEARCH_HOST="https://..."
NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY="..."

# Firebase (catalog: materials, providers, categories)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"

# WebSocket (URL WebSocket server Anda)
WS_PORT="3001"
NEXT_PUBLIC_WS_URL="wss://your-websocket-server.railway.app"
```

### Optional Variables

```bash
# Sentry
SENTRY_DSN="https://..."
NEXT_PUBLIC_SENTRY_DSN="https://..."

# Feature Flags
ENABLE_ANALYTICS="true"
ENABLE_REALTIME="true"
ENABLE_SEARCH="true"

# Logging
LOG_LEVEL="info"
ENABLE_MONITORING="true"

# Rate Limiting
RATE_LIMIT_WINDOW="15m"
RATE_LIMIT_MAX_REQUESTS="100"

# Admin
ADMIN_EMAIL="admin@yourdomain.com"
```

---

## 🗄️ Database Migration

Setelah database PostgreSQL ready:

```bash
# 1. Set DATABASE_URL di local .env
DATABASE_URL="postgresql://..."

# 2. Generate Prisma Client
npm run prisma:generate

# 3. Push schema ke database
npm run prisma:migrate:deploy

# 4. Sinkronkan katalog ke Firebase Firestore (materials, providers, categories)
npm run firebase:seed

# 5. (Optional) Seed data
npm run prisma:seed
```

---

## 🔍 Initialize Search Index

Setelah Meilisearch ready:

```bash
# Create API route untuk initialize
# GET /api/admin/search/init

# Atau run via Prisma Studio console
```

---

## 🌐 Custom Domain Setup

### Netlify Custom Domain

1. Site settings > Domain management
2. Add custom domain
3. Update DNS records di domain provider
4. Enable HTTPS (automatic)

### Update Environment Variables

```bash
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_API_URL="https://yourdomain.com/api"
```

### Update Stripe Webhook URL

```bash
# Stripe Dashboard > Webhooks
# Update URL ke: https://yourdomain.com/api/webhooks/stripe
```

---

## ✅ Post-Deployment Checklist

### 1. Test Authentication

- [ ] Register new user
- [ ] Verify email received
- [ ] Login works
- [ ] Token refresh works
- [ ] Password reset works

### 2. Test Subscription

- [ ] Checkout flow works
- [ ] Payment successful
- [ ] Subscription activated
- [ ] Billing portal accessible
- [ ] Webhook received

### 3. Test Search

- [ ] Search returns results
- [ ] Filters work
- [ ] Autocomplete works

### 4. Test Realtime

- [ ] WebSocket connects
- [ ] Notifications received
- [ ] Real-time updates work

### 5. Test Admin

- [ ] Admin login works
- [ ] Dashboard loads
- [ ] User management works
- [ ] Statistics display

### 6. Test Performance

- [ ] Page load < 3s
- [ ] API response < 500ms
- [ ] Database queries optimized
- [ ] Redis caching works

### 7. Security Check

- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] Rate limiting works
- [ ] CORS configured
- [ ] JWT secrets are strong

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check DATABASE_URL format
# Ensure SSL mode: ?sslmode=require
# Check IP whitelist (Neon/Supabase)
```

### Redis Connection Error

```bash
# Verify REDIS_URL
# Check authentication
# Ensure TLS enabled if required
```

### Stripe Webhook Failed

```bash
# Verify webhook secret
# Check endpoint URL is public
# Review Stripe webhook logs
# Test with Stripe CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Email Not Sending

```bash
# Verify Resend API key
# Check domain verification
# Review Resend logs
# Check email in spam folder
```

### WebSocket Not Connecting

```bash
# Verify WS_PORT and NEXT_PUBLIC_WS_URL
# Check CORS configuration
# Ensure WebSocket server is running
# Check firewall rules
```

---

## 📊 Monitoring & Maintenance

### Daily Tasks

- Check Sentry for errors
- Review Stripe dashboard
- Monitor database usage

### Weekly Tasks

- Review audit logs
- Check subscription metrics
- Analyze search queries
- Review user growth

### Monthly Tasks

- Database backup
- Update dependencies
- Security audit
- Performance optimization

---

## 🚀 Scaling Considerations

### When to Scale Database

- Connection pool exhausted
- Query performance degrading
- Storage > 80%

### When to Scale Redis

- Memory usage > 80%
- Evictions happening
- Connection limits reached

### When to Add Load Balancer

- Traffic > 10k req/hour
- Multiple regions needed
- High availability required

---

## 💰 Cost Estimation (Monthly)

### Minimum (Free Tier)

- Netlify: $0 (Free tier)
- Neon PostgreSQL: $0 (Free tier, 0.5GB)
- Upstash Redis: $0 (Free tier, 10k commands/day)
- Meilisearch Cloud: $0 (Sandbox)
- Resend: $0 (3k emails/month)
- Railway WebSocket: $5 (Hobby)
**Total: ~$5/month**

### Production (Starter)

- Netlify: $0-19 (Pro if needed)
- Neon: $19 (Launch tier)
- Upstash: $10 (Pay-as-you-go)
- Meilisearch: $29 (Starter)
- Resend: $20 (50k emails)
- Railway: $10 (Pro)
**Total: ~$88/month**

### Production (Growth)

- Netlify: $19 (Pro)
- Supabase: $25 (Pro)
- Upstash: $30
- Meilisearch: $99 (Growth)
- Resend: $50 (100k emails)
- Railway: $20
**Total: ~$243/month**

---

## 📞 Support

Jika ada masalah:

1. Check logs di Netlify Dashboard
2. Check Sentry untuk errors
3. Review Stripe webhook logs
4. Check database connection
5. Verify all environment variables

**Good luck dengan deployment! 🚀**
