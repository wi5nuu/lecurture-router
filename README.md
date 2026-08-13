# LectureRouter - Production-Ready SaaS Platform

Platform agregator materi kuliah dari seluruh dunia dengan fitur realtime, subscription management, dan advanced search.

## 🚀 Tech Stack

### Core

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM (users, auth, subscriptions, bookmarks)
- **Catalog:** Firebase Firestore (materials, providers, categories - text-only, runs on the free Spark plan)
- **Cache:** Redis
- **Search:** Meilisearch
- **Realtime:** Socket.IO (WebSocket)

### Infrastructure

- **Payment:** Stripe
- **Email:** Resend
- **Error Tracking:** Sentry
- **Monitoring:** Custom logging system
- **Testing:** Vitest + Playwright

### Features

- ✅ JWT Authentication with refresh tokens
- ✅ Email verification
- ✅ Password reset
- ✅ Role-based access control (USER, ADMIN, MODERATOR)
- ✅ Subscription management (FREE, BASIC, PRO, ENTERPRISE)
- ✅ Real-time notifications via WebSocket
- ✅ Rate limiting & security headers
- ✅ Full-text search with Meilisearch
- ✅ Admin dashboard & user management
- ✅ Audit logging
- ✅ API key authentication
- ✅ Usage metrics tracking
- ✅ Stripe webhook integration
- ✅ Comprehensive error handling

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Meilisearch 1.6+
- Firebase Project (free Spark plan is sufficient - text-only catalog)
- Stripe Account
- Resend Account (for emails)

## 🛠️ Setup

### 1. Clone and Install Dependencies

\`\`\`bash
git clone https://github.com/yourusername/lecture-router.git
cd lecture-router
npm install
\`\`\`

### 2. Environment Configuration

Copy \`.env.example\` to \`.env\` and configure:

\`\`\`bash
cp .env.example .env
\`\`\`

Update the following critical variables:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET` & `JWT_REFRESH_SECRET`: Strong random strings
- `STRIPE_SECRET_KEY`: From Stripe dashboard
- `RESEND_API_KEY`: From Resend dashboard
- `MEILISEARCH_MASTER_KEY`: Meilisearch master key
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`: From Firebase service account (see below)

### Firebase Setup (Catalog: materials, providers, categories)

The catalog is stored in **Firebase Firestore**. Since it only contains text (no photos/files), it fits comfortably in the **free Spark plan** (1 GiB storage, 50K reads/day, 20K writes/day).

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a project.
2. Open **Project Settings → Service accounts**.
3. Click **Generate new private key** (a JSON service account file downloads).
4. Copy the `project_id`, `client_email`, and `private_key` values into your `.env`:

```
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"
```

> The `\n` escape sequences in the private key must stay intact.
> Alternatively, paste the entire service account JSON into a single `FIREBASE_SERVICE_ACCOUNT` variable.

5. Open **Firestore Database** in the console and choose **Production mode**.
6. Seed the catalog (categories, providers, materials) into Firestore:

```bash
npm run firebase:seed
```

### 3. Database Setup

\`\`\`bash

# Generate Prisma Client

npm run prisma:generate

# Run migrations

npm run prisma:migrate

# Seed database (optional)

npm run prisma:seed
\`\`\`

### 4. Start Development Servers

\`\`\`bash

# Start all services (Next.js + WebSocket)

npm run dev:all

# Or start separately:

npm run dev # Next.js app
npm run dev:ws # WebSocket server
\`\`\`

## 🐳 Docker Deployment

### Development

\`\`\`bash
docker-compose up -d
\`\`\`

### Production

\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## 🧪 Testing

\`\`\`bash

# Unit tests

npm test

# Unit tests with UI

npm run test:ui

# E2E tests

npm run test:e2e
\`\`\`

## 📊 Data Architecture

### PostgreSQL (Prisma) - User & business data

- **User**: User accounts with role-based permissions
- **Subscription**: User subscriptions with Stripe integration
- **Bookmark**: User bookmarks
- **Notification**: Real-time notifications
- **RefreshToken**: JWT refresh tokens
- **Invoice**: Stripe invoices
- **AuditLog**: Admin action logs
- **ApiKey**: API access keys
- **UsageMetric**: Usage tracking

### Firebase Firestore - Catalog (text-only)

- **materials**: Educational materials (title, description, tags, URL, full content)
- **providers**: Content providers
- **categories**: Material categories

## 🔐 API Authentication

### JWT Authentication

\`\`\`typescript
// Register
POST /api/auth/register
Body: { email, password, firstName, lastName }

// Login
POST /api/auth/login
Body: { email, password }
Response: { accessToken, refreshToken, user }

// Refresh Token
POST /api/auth/refresh
Body: { refreshToken }

// Verify Email
GET /api/auth/verify-email?token=xxx
\`\`\`

### API Key Authentication

\`\`\`typescript
Headers: {
'X-API-Key': 'your-api-key'
}
\`\`\`

## 💳 Subscription Plans

| Plan           | Price     | Features                                                |
| -------------- | --------- | ------------------------------------------------------- |
| **FREE**       | $0        | 1,000 materials, 5 bookmarks, Basic search              |
| **BASIC**      | $9.99/mo  | 10,000 materials, Unlimited bookmarks, Advanced search  |
| **PRO**        | $29.99/mo | All materials, AI search, API access, Real-time updates |
| **ENTERPRISE** | $99.99/mo | Everything + Custom integrations, SLA, Analytics        |

### Subscription API

\`\`\`typescript
// Create checkout session
POST /api/subscriptions/checkout
Body: { plan: 'PRO' }

// Manage subscription
POST /api/subscriptions/manage
Body: { action: 'cancel' | 'resume' }

// Billing portal
POST /api/subscriptions/portal
\`\`\`

## 🔍 Search API

\`\`\`typescript
// Search materials
GET /api/search?q=machine+learning&category=ai&format=pdf&limit=20

// Search suggestions (autocomplete)
GET /api/search/suggestions?q=mac
\`\`\`

## 🔌 WebSocket Events

### Client → Server

- \`subscribe\`: Subscribe to channel
- \`unsubscribe\`: Unsubscribe from channel
- \`notification:read\`: Mark notification as read
- \`ping\`: Health check

### Server → Client

- \`connected\`: Connection established
- \`notification\`: New notification
- \`material:update\`: Material updated
- \`material:new\`: New material added
- \`pong\`: Health check response

## 👨‍💼 Admin API

### Statistics

\`\`\`typescript
GET /api/admin/stats?days=30
\`\`\`

### User Management

\`\`\`typescript
// List users
GET /api/admin/users?page=1&limit=20&search=john

// Get user
GET /api/admin/users/:id

// Update user
PATCH /api/admin/users/:id
Body: { role: 'ADMIN', isActive: true }

// Delete user
DELETE /api/admin/users/:id
\`\`\`

## 📈 Monitoring & Logging

The application uses Sentry for error tracking and a custom logging system:

\`\`\`typescript
import { logger } from '@/lib/logger';

logger.info('User action', { userId, action });
logger.error('Operation failed', error, { context });
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

\`\`\`bash
npm install -g vercel
vercel deploy --prod
\`\`\`

### Manual Deployment

1. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`

2. Start production server:
   \`\`\`bash
   npm start
   \`\`\`

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:

- Database credentials
- Redis URL
- Stripe keys
- Resend API key
- JWT secrets
- Meilisearch configuration
- Firebase service account (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)

## 📝 Scripts

- \`npm run dev\`: Start development server
- \`npm run dev:ws\`: Start WebSocket server
- \`npm run dev:all\`: Start both servers
- \`npm run build\`: Build for production
- \`npm start\`: Start production server
- \`npm test\`: Run unit tests
- \`npm run test:e2e\`: Run E2E tests
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:studio`: Open Prisma Studio
- `npm run firebase:seed`: Seed catalog (categories/providers/materials) into Firestore
- `npm run format`: Format code with Prettier

## 🔒 Security Features

- JWT with refresh token rotation
- Password hashing with bcrypt (12 rounds)
- Rate limiting per IP/user
- CORS protection
- Security headers (CSP, HSTS, etc.)
- SQL injection prevention (Prisma)
- XSS protection
- Email verification
- Audit logging
- API key authentication

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [WebSocket Protocol](./docs/WEBSOCKET.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Email: support@lecturerouter.com
- Documentation: https://docs.lecturerouter.com
- GitHub Issues: https://github.com/yourusername/lecture-router/issues

## 🙏 Acknowledgments

- Next.js team
- Prisma team
- Stripe
- Resend
- Meilisearch
- Socket.IO community
