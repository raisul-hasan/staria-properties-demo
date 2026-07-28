# Phase 1: Real-estate foundation

## Outcome

Phase 1 replaces the apparel-oriented content model with a real-estate foundation while preserving the existing authentication, RBAC, media, forms, quotations, newsletters, careers, settings, and audit infrastructure.

## Real-estate domain

- `Property` stores listing identity, sale/rent/lease type, availability, price, rooms, area, furnishing, publishing state, featured state, and demo-data state.
- `Project` stores development status, progress, schedule, publishing state, featured state, and demo-data state.
- `Address` provides normalized location and coordinate data for properties and projects.
- `Category` supports separate `PROPERTY` and `PROJECT` categories.
- `Amenity` is reusable through property and project join tables.
- Property and project media use normalized Cloudinary-backed media joins.
- SEO metadata supports property and project one-to-one records.
- Quotation line items can reference properties.

## Demo-data safety

Both properties and projects include `isDemo`. Phase 2 seed data will:

- use stable reference codes and slugs;
- use idempotent upserts;
- set `isDemo=true`;
- never overwrite records that have been converted to real content;
- run explicitly during environment initialization, not on every application start.

## Public and CMS APIs

- Public `/content/properties` and `/content/projects` resources now map to real Prisma models.
- Public detail endpoints accept a UUID or slug.
- Public detail endpoints require published, non-deleted records.
- Admin CMS resources include `properties`, `projects`, and `amenities`.
- Property queries support category, project, listing type, availability, bedrooms, featured/demo state, and price range filters.

## Migration baseline

The first PostgreSQL migration is:

```text
backend/prisma/migrations/20260727000000_initial_real_estate/migration.sql
```

This migration targets a new demo database. No live database migration has been attempted in Phase 1.

## Phase 2 prerequisites

Phase 2 can be completed locally without hosted-service credentials. It will:

1. expand the seed into a complete real-estate demo dataset;
2. add stable owner and read-only reviewer accounts;
3. add representative properties, projects, categories, amenities, news, FAQs, testimonials, statistics, settings, leads, and media metadata;
4. verify seed idempotency;
5. document demo credentials through environment variables rather than committing passwords.

Hosted Neon, Render, Cloudinary, Resend, and Vercel credentials are not needed until the deployment phase.

## Dependency audit note

- The backend production dependency audit is clean after replacing native `bcrypt` with `bcryptjs` and upgrading Multer and Nodemailer.
- The frontend uses the latest React Router 7 release compatible with the current React 18 application. One audit advisory remains for React Router's server/RSC action handling; this Vite application is client-only and does not enable React Router server actions or RSC. React Router 8 resolves the advisory but currently requires React 19.2.7 and Node 22.22+, so that framework upgrade is deferred to a dedicated, tested phase rather than forced into the database foundation.
