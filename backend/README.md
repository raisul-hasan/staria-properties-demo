# Staria Properties Backend

Production-ready Node.js, Express, PostgreSQL and Prisma backend for the Staria Properties React frontend.

## Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT authentication
- bcrypt
- Multer
- Cloudinary
- Nodemailer
- Zod
- Helmet, CORS, Morgan, Compression, Rate Limiter
- Winston logger
- Swagger API documentation

## Database Design

Enterprise 3NF PostgreSQL design:

```text
src/docs/database-design.md
src/docs/er-diagram.mmd
prisma/schema.prisma
```

## Architecture

```text
src/
  config/
  controllers/
  middleware/
  routes/
  services/
  repositories/
  prisma/
  utils/
  validators/
  types/
  docs/
```

Controllers only handle request/response concerns. Services contain business logic. Repositories are the only layer that talks to Prisma.

## Setup

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate:dev
npm run db:seed
npm run dev
```

API root:

```text
http://localhost:5000
```

Swagger docs:

```text
http://localhost:5000/api-docs
```

Health:

```text
http://localhost:5000/health
```

## Environment

Set these in Railway, Render, DigitalOcean, or local `.env`:

```text
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRES_IN
JWT_REFRESH_EXPIRES_IN
ACCESS_TOKEN_COOKIE_NAME
REFRESH_TOKEN_COOKIE_NAME
ACCESS_TOKEN_COOKIE_MAX_AGE_MS
REFRESH_TOKEN_COOKIE_MAX_AGE_MS
JWT_COOKIE_SECURE
COOKIE_SAME_SITE
COOKIE_DOMAIN
ADMIN_APP_URL
ENABLE_REGISTRATION
LOGIN_FAILURE_LIMIT
ACCOUNT_LOCK_MINUTES
PASSWORD_RESET_TOKEN_EXPIRES_MINUTES
EMAIL_VERIFICATION_TOKEN_EXPIRES_HOURS
MAX_ACTIVE_SESSIONS
CORS_ORIGIN
FORM_RATE_LIMIT_WINDOW_MS
FORM_RATE_LIMIT_MAX
RECAPTCHA_SECRET_KEY
RECAPTCHA_MIN_SCORE
RECAPTCHA_REQUIRED
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_FROM
ADMIN_EMAILS
```

Cloudinary and SMTP are optional for local boot, but uploads and emails require them.

## Seed Admin

The seed creates an email-verified Owner admin plus system roles and permissions:

```text
email: configured with SEED_ADMIN_EMAIL
password: configured with SEED_ADMIN_PASSWORD
```

Override with:

```text
SEED_ADMIN_EMAIL
SEED_ADMIN_PASSWORD
SEED_REVIEWER_EMAIL
SEED_REVIEWER_PASSWORD
```

Change the seeded password immediately in production.

## Main Endpoints

Public:

```text
GET    /health
GET    /api/v1/site
```

Auth:

```text
POST   /api/v1/auth/bootstrap
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/email-verification/request
POST   /api/v1/auth/email-verification/verify
GET    /api/v1/auth/me
POST   /api/v1/auth/logout
POST   /api/v1/auth/email-verification/resend
GET    /api/v1/auth/sessions
DELETE /api/v1/auth/sessions/:id
POST   /api/v1/auth/admins
```

CMS:

```text
GET    /api/v1/admin/cms/:resource
POST   /api/v1/admin/cms/:resource
GET    /api/v1/admin/cms/:resource/:id
PATCH  /api/v1/admin/cms/:resource/:id
DELETE /api/v1/admin/cms/:resource/:id
PATCH  /api/v1/admin/cms/:resource/:id/publish
PATCH  /api/v1/admin/cms/:resource/:id/draft
PATCH  /api/v1/admin/cms/:resource/:id/restore
POST   /api/v1/admin/cms/media/images
POST   /api/v1/admin/cms/media/files
```

CMS resources include hero slides, properties, projects, amenities, categories, services, gallery, blogs, news, certificates, clients, testimonials, partners, career jobs, applications, company/factory/contact information, SEO, social media, footer, menus, website settings, downloads, and company statistics.

RFQ:

```text
POST   /api/v1/quotations
GET    /api/v1/admin/quotations
GET    /api/v1/admin/quotations/export.csv
GET    /api/v1/admin/quotations/stats
GET    /api/v1/admin/quotations/sales-executives
GET    /api/v1/admin/quotations/:id
PATCH  /api/v1/admin/quotations/:id
PATCH  /api/v1/admin/quotations/:id/assign
PATCH  /api/v1/admin/quotations/:id/status
GET    /api/v1/admin/quotations/:id/conversations
POST   /api/v1/admin/quotations/:id/conversations
DELETE /api/v1/admin/quotations/:id
```

The RFQ workflow stores quote line items, generates unique quotation numbers, sends confirmation/admin emails, supports Sales Executive assignment, status changes, conversation history, CSV export, pagination/search/filtering, soft delete, and audit logs.

Forms:

```text
POST   /api/v1/contact
POST   /api/v1/newsletter/subscribe
GET    /api/v1/admin/contact-submissions
GET    /api/v1/admin/contact-submissions/stats
GET    /api/v1/admin/contact-submissions/:id
PATCH  /api/v1/admin/contact-submissions/:id
DELETE /api/v1/admin/contact-submissions/:id
GET    /api/v1/admin/newsletter-subscribers
GET    /api/v1/admin/newsletter-subscribers/stats
GET    /api/v1/admin/newsletter-subscribers/:id
PATCH  /api/v1/admin/newsletter-subscribers/:id
DELETE /api/v1/admin/newsletter-subscribers/:id
```

Contact and newsletter forms store submissions in PostgreSQL, send confirmation/admin notification emails, support Google reCAPTCHA, rate limiting, spam scoring, filtering, pagination, soft delete, and admin status management.

The active schema is designed for a real-estate website and CMS, with dedicated property, project, address, amenity, media, publishing, enquiry, quotation, and administrative domains.

All responses follow:

```json
{ "success": true, "message": "...", "data": {} }
```

Errors follow:

```json
{ "success": false, "message": "..." }
```

## Deployment

Build command:

```bash
npm install && npm run db:generate && npm run build
```

Start command:

```bash
npm run db:migrate && npm start
```
