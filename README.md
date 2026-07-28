# Staria Properties - Enterprise Web Platform

Production-ready, high-performance web application and REST API for Staria Properties. Built with Node.js, Express, PostgreSQL, Prisma ORM, TypeScript, and React.

Project status and remaining phases: [`docs/project-roadmap.md`](docs/project-roadmap.md)

New developer setup (including a fresh Windows computer):
[`docs/phase-4-local-setup.md`](docs/phase-4-local-setup.md)

Stakeholder demo deployment:
[`docs/phase-5-deployment.md`](docs/phase-5-deployment.md)

---

## Technical Stack

- **Backend**: Node.js 20+, Express.js, TypeScript
- **Database & ORM**: PostgreSQL 16, Prisma ORM
- **Authentication & Security**: JWT (HttpOnly cookies + Bearer tokens), bcrypt, Helmet, CORS, Rate Limiting
- **Validation**: Zod (Request & Outbound Response Validation)
- **Documentation**: OpenAPI 3.0.3, Swagger UI (`/api-docs`), Postman-ready
- **Logging & Monitoring**: Winston (structured JSON + log rotation), Morgan, Response Time Monitoring
- **Deployment & Orchestration**: Docker, Docker Compose, Railway, Render, DigitalOcean, GitHub Actions CI/CD

---

## Folder Structure

```text
Staria-Properties/
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # GitHub Actions CI/CD Pipeline
├── backend/
│   ├── src/
│   │   ├── config/               # Security, Env, Logger, CORS, Mail, Cloudinary configs
│   │   ├── controllers/          # HTTP request/response handlers
│   │   ├── core/                 # Error codes & standardized API schemas
│   │   ├── docs/                 # Swagger & OpenAPI 3.0.3 specification
│   │   ├── middleware/           # Auth, Validation, Error, Rate Limiting, Cache, Performance
│   │   ├── prisma/               # Database client & seed logic
│   │   ├── repositories/         # Prisma database access layer
│   │   ├── routes/               # RESTful API route definitions (/api/v1/*)
│   │   ├── services/             # Business logic layer
│   │   ├── utils/                # Response helpers, AppError, Async Handler
│   │   ├── validators/           # Zod input validation schemas
│   │   ├── app.ts                # Express application setup
│   │   └── server.ts             # HTTP server entrypoint & Graceful Shutdown
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Versioned migration files
│   ├── Dockerfile                # Multi-stage production Dockerfile
│   ├── docker-entrypoint.sh      # Migration & application startup script
│   ├── railway.json              # Railway deployment config
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/                      # React application components & assets
│   ├── Dockerfile                # Production Nginx Dockerfile
│   └── package.json
├── docker-compose.yml            # Local & Production container orchestration
├── railway.json                  # Root Railway configuration
├── render.yaml                   # Render Blueprint infrastructure spec
├── digitalocean.app.yaml         # DigitalOcean App Platform spec
└── README.md
```

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and update values:

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | `string` | `development` | App environment (`development`, `production`, `test`) |
| `PORT` | `number` | `5000` | HTTP Server port |
| `API_PREFIX` | `string` | `/api/v1` | Base route prefix for versioned endpoints |
| `DATABASE_URL` | `string` | `postgresql://...` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | `string` | *Required* | Secret key for access JWTs (min 24 chars) |
| `JWT_REFRESH_SECRET` | `string` | *Required* | Secret key for refresh JWTs (min 24 chars) |
| `CORS_ORIGIN` | `string` | `*` | Allowed CORS origins (comma-separated or `*`) |
| `FRONTEND_URL` | `string` | `http://localhost:5173` | Public frontend URL |
| `LOG_LEVEL` | `string` | `info` | Winston log level (`debug`, `info`, `warn`, `error`) |

---

## Production Deployment Options

### Option 1: Docker Compose (Local & VPS)

Run the full production stack (PostgreSQL + Backend API + Nginx Frontend) with one command:

```bash
docker-compose up -d --build
```

Access services:
- **Frontend App**: `http://localhost`
- **Admin Portal**: `http://localhost/admin/login`
- **Backend API**: `http://localhost:5000/api/v1`
- **Swagger Documentation**: `http://localhost:5000/api-docs`
- **Health Endpoint**: `http://localhost:5000/health`

---

### Option 2: Railway Deployment

1. Install the Railway CLI or connect your GitHub repository at [railway.app](https://railway.app).
2. Create a new project and add a **PostgreSQL** service.
3. Deploy the repository. Railway will automatically detect `railway.json`.
4. Configure Environment Variables in the Railway dashboard (`DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`).
5. Migrations will execute automatically during start via `npx prisma migrate deploy`.

---

### Option 3: Render Deployment

The Phase 5 stakeholder demo uses Neon Free PostgreSQL and one Render web service. The
service serves both the compiled React site and Express API from a single HTTPS origin.

1. Create a Neon project and copy its direct TLS PostgreSQL connection URL.
2. In Render, create a Blueprint from the `full-stack-demo` branch.
3. Render parses `render.yaml` and creates the Node.js web service with `/health`.
4. Enter `DATABASE_URL`, `SEED_ADMIN_PASSWORD`, and `SEED_REVIEWER_PASSWORD` when
   prompted. Render generates the JWT secrets.
5. Follow the complete account, URL, and acceptance checklist in
   [`docs/phase-5-deployment.md`](docs/phase-5-deployment.md).

---

### Option 4: DigitalOcean App Platform

1. Log into DigitalOcean and create a new **App Platform** project.
2. Select your GitHub repository and branch (`main`).
3. Choose `digitalocean.app.yaml` as the spec file, or select Dockerfile deployment for `backend/Dockerfile`.
4. Add the managed PostgreSQL database component.
5. Deploy. DigitalOcean automatically monitors `/health` for zero-downtime rolling deploys.

---

## Database Management & Seeding

Run database migrations manually or in production:

```bash
# Apply migrations to production database
npm run db:migrate

# Seed the demo administrator accounts and stakeholder-review content
npm run db:seed
```

Before seeding, set unique passwords of at least 12 characters in `SEED_ADMIN_PASSWORD` and
`SEED_REVIEWER_PASSWORD`. Demo email addresses can be configured with `SEED_ADMIN_EMAIL` and
`SEED_REVIEWER_EMAIL`. No default passwords are stored in this repository. See
`docs/phase-2-demo-data.md` for the full seed and cleanup workflow.

---

## Health Checks & Monitoring

The API exposes a readiness and liveness health probe endpoint:

```text
GET /health
GET /api/v1/health
```

Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "ok",
    "database": "connected",
    "uptimeSeconds": 1420,
    "timestamp": "2026-07-23T01:08:17.000Z",
    "environment": "production",
    "version": "api/v1",
    "memory": {
      "rssMb": 45.2,
      "heapTotalMb": 28.4,
      "heapUsedMb": 18.1
    }
  }
}
```

If database connection fails, the endpoint responds with HTTP `503 Service Unavailable` for load balancers.

---

## Graceful Shutdown

The backend handles `SIGTERM` and `SIGINT` signals gracefully:
1. Stops listening for new incoming HTTP requests.
2. Waits for active connection requests to complete.
3. Closes Prisma PostgreSQL connection pools.
4. Enforces a 10-second safety timeout to prevent stuck worker processes.
