# Phase 4: Complete local setup for Windows

This guide assumes nothing has been installed or configured. Follow it from top to bottom
on a new Windows computer. On the current development computer, Node.js, npm, Git,
PostgreSQL 18, both dependency folders, `backend/.env`, the migrated database, and the
demo seed are already present and verified.

## 1. Install the required software

Install these applications:

1. **Git for Windows** — needed to download and update the repository.
2. **Node.js 22 LTS** — includes npm. The backend requires Node.js 20 or newer.
3. **PostgreSQL 18** — install the PostgreSQL server, command-line tools, and pgAdmin.
4. **A code editor** such as Visual Studio Code — optional but convenient.

Docker, Cloudinary, an SMTP service, and a paid hosting account are **not required** to
run the demo locally.

After installation, open a new PowerShell window and verify:

```powershell
git --version
node --version
npm --version
psql --version
```

If `psql` is not recognized, PostgreSQL can still be managed through pgAdmin. You may
also add `C:\Program Files\PostgreSQL\18\bin` to the Windows `Path`.

## 2. Open the project

If you already have the `Staria-Properties` folder, open PowerShell in that folder.
Otherwise clone the repository URL supplied by the project owner:

```powershell
git clone YOUR_REPOSITORY_URL Staria-Properties
Set-Location Staria-Properties
```

Install exact locked dependencies:

```powershell
Set-Location backend
npm ci
Set-Location ..\frontend
npm ci
Set-Location ..
```

Do not download `node_modules` from another person. `npm ci` recreates it correctly.

## 3. Create the PostgreSQL database

Using pgAdmin:

1. Open pgAdmin and connect to the local PostgreSQL server.
2. Enter the PostgreSQL password chosen during installation.
3. Right-click **Databases**, choose **Create > Database**.
4. Set the database name to `staria_properties` and save.

Or use `psql`:

```powershell
psql -U postgres -d postgres -c "CREATE DATABASE staria_properties;"
```

If PostgreSQL is stopped, open Windows **Services**, find the PostgreSQL service, and
start it.

## 4. Configure the backend

Create the private environment file:

```powershell
Copy-Item backend\.env.example backend\.env
```

Open `backend\.env` and update at least:

```env
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/staria_properties?schema=public
JWT_ACCESS_SECRET=PASTE_A_LONG_RANDOM_VALUE
JWT_REFRESH_SECRET=PASTE_A_DIFFERENT_LONG_RANDOM_VALUE
SEED_ADMIN_PASSWORD=CHOOSE_A_UNIQUE_OWNER_PASSWORD
SEED_REVIEWER_PASSWORD=CHOOSE_A_DIFFERENT_REVIEWER_PASSWORD
```

Generate each JWT secret separately in PowerShell:

```powershell
$secretBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($secretBytes)
[Convert]::ToHexString($secretBytes)
```

Passwords used by the seed must contain at least 12 characters. For admin login
validation, use uppercase, lowercase, a number, and a special character. Never commit or
send `backend/.env`.

If the PostgreSQL password contains characters such as `@`, `:`, `/`, `?`, or `#`,
URL-encode the password in `DATABASE_URL`.

For the normal single frontend:

```env
FRONTEND_URL=http://localhost:5173
ADMIN_APP_URL=http://localhost:5173/admin
CORS_ORIGIN=http://localhost:5173
JWT_COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

## 5. Configure the frontend

```powershell
Copy-Item frontend\.env.example frontend\.env
```

For local use:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SITE_URL=http://localhost:5173
VITE_ALLOW_INDEXING=false
```

Keep indexing disabled for a stakeholder demo.

## 6. Migrate and seed

```powershell
Set-Location backend
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed:verify
Set-Location ..
```

The verification command should report 12 properties, 6 projects, 4 services, 6 FAQs,
4 news posts, 3 testimonials, 3 enquiries, 3 subscribers, and 2 demo admins.

The seed is repeatable. It will not replace passwords on an existing seeded account and
will stop if a matching demo record has been converted to real data.

## 7. Start the website

Open two PowerShell windows.

Backend window:

```powershell
Set-Location path\to\Staria-Properties\backend
npm run dev
```

Frontend window:

```powershell
Set-Location path\to\Staria-Properties\frontend
npm run dev
```

Open:

- Public website: `http://localhost:5173`
- Admin login: `http://localhost:5173/admin/login`
- API health: `http://localhost:5000/api/v1/health`
- API documentation: `http://localhost:5000/api-docs`

Use the owner and reviewer emails from `backend/.env` and the passwords you chose before
the first seed. The reviewer is deliberately read-only.

## 8. Optional media upload

The seeded images appear in the media library without any extra setup. Uploading a new
file requires a Cloudinary account. In Cloudinary, copy the cloud name, API key, and API
secret into:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=staria-properties
```

Restart the backend after changing environment values. The admin accepts images up to
5 MB and images/PDFs up to 15 MB.

## 9. Optional password-reset email

Changing a password while signed in works without email. “Forgot password” needs SMTP
credentials to deliver its reset link:

```env
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Staria Properties <no-reply@your-domain.example>"
```

Use an application-specific SMTP credential, not a personal email password. Restart the
backend after configuration.

## 10. Common problems

- **Database authentication failed:** check the PostgreSQL password and URL encoding in
  `DATABASE_URL`.
- **Port already in use:** stop the other process, or change `PORT` and update
  `VITE_API_URL`.
- **CORS error:** make `CORS_ORIGIN` exactly match the frontend origin.
- **Admin login fails after reseeding:** existing seed passwords are intentionally not
  overwritten. Use the original password or recreate only the local demo database.
- **Upload says Cloudinary is not configured:** add the three Cloudinary credentials or
  continue selecting the seeded media.
- **Reset email does not arrive:** SMTP is optional and must be configured separately.

## 11. Before sharing publicly

Do not expose this local development setup to the internet. Phase 5 will choose current
hosting providers, configure HTTPS, secure cookies, production secrets, hosted
PostgreSQL, and a shareable stakeholder URL.
