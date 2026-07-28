# Production environment and deployment checklist

Phase 5 uses a Neon PostgreSQL database and one Render web service that serves both the
compiled React application and Express API. See
[phase-5-deployment.md](phase-5-deployment.md) for the exact owner workflow.

## Backend required values

```env
NODE_ENV=production
PORT=10000
API_PREFIX=/api/v1
DATABASE_URL=HOSTED_POSTGRESQL_CONNECTION_STRING
JWT_ACCESS_SECRET=UNIQUE_RANDOM_SECRET_AT_LEAST_32_BYTES
JWT_REFRESH_SECRET=DIFFERENT_RANDOM_SECRET_AT_LEAST_32_BYTES
FRONTEND_URL=https://staria-properties-demo.onrender.com
ADMIN_APP_URL=https://staria-properties-demo.onrender.com/admin
CORS_ORIGIN=https://staria-properties-demo.onrender.com
JWT_COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
ENABLE_REGISTRATION=false
```

The selected same-origin deployment uses `COOKIE_SAME_SITE=lax`. If the service name
changes, update all URL values to the exact Render HTTPS origin.

Set long, unique seed passwords. The demo start command runs an idempotent reconciliation
seed after migrations, so these values must remain available to the Render service.

## Recommended service values

- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
  `CLOUDINARY_API_SECRET`, and `CLOUDINARY_FOLDER`.
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`,
  `SMTP_FROM`, and `ADMIN_EMAILS`.
- Bot protection: `RECAPTCHA_SECRET_KEY`, `RECAPTCHA_REQUIRED=true`, and an appropriate
  `RECAPTCHA_MIN_SCORE`.
- Operations: an appropriate `LOG_LEVEL`, rate limits, account-lock threshold, session
  limit, and password-reset expiry.

Never put backend secrets in a `VITE_` variable. Vite values are public in the browser.

## Frontend values

```env
VITE_API_URL=/api/v1
VITE_SITE_URL=https://staria-properties-demo.onrender.com
VITE_ALLOW_INDEXING=false
```

Keep indexing disabled for the stakeholder demo. Set it to `true` only after real-data,
legal, content, canonical-domain, sitemap, and launch reviews in Phase 6.

## Release order

1. Back up the destination database.
2. Create the Neon database and enter the direct TLS connection URL as the Render
   `DATABASE_URL` secret.
3. Apply `render.yaml`; the Blueprint installs both applications, builds them, applies
   migrations, runs the approved demo seed, and starts the combined server.
4. Confirm `/api/v1/health` and the public SPA routes from the one Render URL.
5. Test API routing and same-origin secure-cookie behavior.
6. Test owner and reviewer sign-in, public listings, enquiry consent, database
   persistence, media, password recovery, session revocation, and SPA fallback routes.
7. Rotate any credential exposed during setup.

## Launch blockers that require owner input

- Final company identity and legal/privacy wording.
- Production domain and provider accounts.
- Real email sender/domain verification.
- Cloudinary account and asset policy.
- CAPTCHA provider/site key if enabled.
- Analytics choice and cookie-consent requirements.
- Retention, backups, monitoring, and named staff accounts.
