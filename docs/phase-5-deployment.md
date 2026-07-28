# Phase 5 stakeholder demo deployment

Last updated: 27 July 2026

## Status

The application is deployment-ready on the `full-stack-demo` branch. The production
build, single-origin hosting, database migrations, repeatable demo seed, security
headers, SPA fallbacks, owner authentication, reviewer read-only access, and consent
validation have been verified locally in production mode.

A live URL cannot be created until the project owner connects the GitHub repository to
hosting accounts. Creating those accounts and accepting their terms must be done by the
owner.

## Selected free architecture

- **Database:** Neon Free PostgreSQL.
- **Application:** one Render Free web service serving both the compiled React site and
  Express API.
- **URL:** `https://staria-properties-demo.onrender.com` if that service name is
  available.
- **Branch:** `full-stack-demo`.
- **Blueprint:** the repository-root `render.yaml`.

This keeps the browser and API on the same origin, so secure authentication cookies do
not need cross-site configuration. It also gives stakeholders one URL.

The free tiers are appropriate for a temporary stakeholder demo, not a final production
launch. Render Free services spin down when idle and can take about a minute to wake.
Neon Free has usage and storage limits. Keep the demo unindexed, use demo data only, and
move to an appropriate paid/operational setup before Phase 6.

## Accounts you need

1. A GitHub account with access to
   `https://github.com/Thouhidul07/Staria-Properties`.
2. A free Neon account: <https://console.neon.tech/>.
3. A free Render account connected to GitHub: <https://dashboard.render.com/>.

No software download is needed on this computer for Phase 5. Node.js, npm, Git,
PostgreSQL, dependencies, migrations, and the local demo database are already set up.

Cloudinary, an email provider, a custom domain, Docker, Vercel, CAPTCHA, analytics, and
payment accounts are not required for this stakeholder demo. Cloudinary is only needed
for new admin media uploads; externally hosted demo media already displays. An email
provider is only needed for automatic password-reset email. Signed-in users can still
change their password.

## 1. Create the Neon database

1. Sign in to Neon and create a project named `staria-properties-demo`.
2. Choose Singapore or the closest available region to the Render service.
3. Open **Connect**, select the default database and role, and copy the **direct**
   connection string. Use the direct connection for Prisma migrations.
4. Confirm the URL includes TLS, normally `sslmode=require`.
5. Store the complete connection string securely. Do not paste it into a repository
   file, issue, chat, or screenshot.

The connection string will be entered as Render's secret `DATABASE_URL`.

## 2. Create the Render Blueprint

1. Sign in to Render using GitHub.
2. Choose **New > Blueprint**.
3. Connect `Thouhidul07/Staria-Properties`.
4. Select the `full-stack-demo` branch and the repository-root `render.yaml`.
5. Render will ask for three values that are deliberately not stored in Git:

   - `DATABASE_URL`: the Neon direct connection string.
   - `SEED_ADMIN_PASSWORD`: a new, unique password of at least 12 characters.
   - `SEED_REVIEWER_PASSWORD`: a different new, unique password of at least 12
     characters.

6. Save both passwords in a password manager. Render generates the two JWT secrets.
7. Apply the Blueprint and wait for the health check to become healthy.

The first start automatically applies versioned migrations and runs the idempotent demo
seed. Later restarts safely reconcile the same demo records.

## If Render changes the service URL

The Blueprint expects `https://staria-properties-demo.onrender.com`. If Render assigns
another name, update these Render environment variables to the exact HTTPS URL:

- `FRONTEND_URL`
- `ADMIN_APP_URL` (add `/admin`)
- `CORS_ORIGIN`
- `VITE_SITE_URL`

Keep `VITE_API_URL=/api/v1`. Save the changes and trigger a fresh deploy so the frontend
is rebuilt with the correct site URL.

## 3. Acceptance checklist

After deployment, replace `YOUR_URL` below with the Render URL:

1. Open `YOUR_URL` and confirm the home page loads after any cold start.
2. Open `YOUR_URL/properties`, `YOUR_URL/projects`, `YOUR_URL/privacy`, and
   `YOUR_URL/admin/login`.
3. Check `YOUR_URL/api/v1/health`; it should report HTTP 200 and
   `"database":"connected"`.
4. Sign in as `owner@staria.demo` with the owner password. Create or edit a harmless
   demo record, refresh, and confirm it persists.
5. Sign out and sign in as `reviewer@staria.demo`. Confirm content can be viewed but
   create, edit, publish, and delete actions are unavailable.
6. Submit a test contact enquiry only after accepting the privacy notice. Confirm the
   owner can view it in the admin portal.
7. Reopen the site after a new browser session and test mobile-width pages.
8. Share only the Render URL and reviewer credentials with stakeholders. Do not share
   the owner password or database connection string.

## Free-tier limitations and Phase 6

Do not use the stakeholder deployment for real customer data. It does not yet include a
custom domain, formal backups, production email delivery, managed media storage,
monitoring/on-call coverage, analytics consent, finalized legal copy, or a real-data
migration. Those remain Phase 6 work after stakeholder approval.
