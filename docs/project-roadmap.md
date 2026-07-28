# Staria Properties project roadmap

Last updated: 27 July 2026

## Main objective

Build a complete real-estate website with a public interface, PostgreSQL database,
authentication, role-based administration portal, and a stakeholder-review deployment.
The review deployment will use demo data and a single shareable URL. Real business data
and the final public domain will be added later.

## Approval rule

Work is executed one phase at a time. Do not begin the next phase until the project owner
has reviewed the current phase and explicitly approved proceeding.

## Phase 1 — Real-estate foundation (complete)

- Replaced the original product/apparel domain with properties, projects, amenities,
  addresses, media, categories, and SEO fields.
- Connected quotations to properties.
- Added versioned Prisma migrations.
- Added public and CMS API foundations.
- Verified backend and frontend production builds.

Detailed record: [phase-1-foundation.md](phase-1-foundation.md)

## Phase 2 — Safe demo database and seed data (complete)

- Added demo-data markers throughout the database.
- Created repeatable seed data for properties, projects, services, FAQs, news,
  testimonials, clients, statistics, enquiries, settings, and related content.
- Added owner and read-only stakeholder-reviewer roles.
- Added guarded demo cleanup and seed verification commands.
- Verified migration, repeated seeding, cleanup, and reseeding against PostgreSQL.

Detailed record: [phase-2-demo-data.md](phase-2-demo-data.md)

## Phase 3 — Connected website and admin portal (complete)

- Connected public pages to the database-backed API with demo fallbacks.
- Connected property, project, news, contact, newsletter, services, FAQs,
  testimonials, statistics, hero, and site-setting content.
- Added `/admin/login`, authenticated sessions, role-based navigation, dashboard,
  content management, publishing controls, and enquiry viewing.
- Kept the reviewer account read-only and the owner account editable.
- Verified public APIs, database submissions, authentication, authorization,
  publishing, CORS, routes, and production builds.

Detailed record: [phase-3-api-ui.md](phase-3-api-ui.md)

## Current checkpoint

The implementation through Phase 4 is complete. Phase 5 is deployment-ready: the
production application and Render Blueprint are configured and verified, and the
deployment branch is ready for provider connection. A live stakeholder URL is waiting
only for the project owner to create/connect the Neon and Render accounts and enter the
three private values documented in
[phase-5-deployment.md](phase-5-deployment.md).

On the current development computer, PostgreSQL, the local environment, migrations, and
demo seed are configured and verified. For a fresh computer, follow
[phase-4-local-setup.md](phase-4-local-setup.md).

## Phase 4 — Full-product hardening (complete)

- Added create/edit experiences for every managed CMS resource and reorganized the
  permission-aware admin navigation.
- Added media browsing, upload, and single/multiple selection inside editors.
- Added validation feedback, loading/empty/error/success states, accessible confirmation
  dialogs, and responsive admin layouts.
- Added authenticated password change, password recovery pages, active-session viewing,
  and manual session revocation.
- Added route metadata, social previews, basic structured data, indexing controls, error
  pages, skip navigation, keyboard improvements, and accessible form semantics.
- Added explicit required privacy consent to contact and newsletter flows plus demo
  privacy, terms, and cookie notices.
- Completed build, API, database, consent, authentication, and authorization regression
  checks.
- Added complete Windows local-setup and production-environment documentation.

Detailed record: [phase-4-hardening.md](phase-4-hardening.md)

## Phase 5 — Free stakeholder demo deployment (account connection pending)

- Re-checked current provider terms and selected Neon Free PostgreSQL plus one Render
  Free web service.
- Configured Express to serve the compiled React application and API from one origin.
- Added a Render Blueprint with production builds, health checks, migrations, demo
  seeding, generated JWT secrets, secure cookies, and indexing disabled.
- Verified production SPA routes, API routing, database health, owner authentication,
  reviewer read-only authorization, privacy consent validation, secure cookies, CSP,
  and long-lived asset caching.
- Prepared the exact provider-account, secret-entry, deployment, and stakeholder
  acceptance checklist.

Detailed record and owner steps: [phase-5-deployment.md](phase-5-deployment.md)

A provider subdomain can be free. A custom `.com` normally requires purchasing and
renewing the domain, so that can wait until the real public launch.

Phase 5 becomes complete when the owner connects GitHub, Neon, and Render, and the live
acceptance checklist passes. Account creation cannot be performed by the repository
automation because it requires the owner's identity and acceptance of provider terms.

## Phase 6 — Real-data migration and public launch (later)

Planned after stakeholder approval:

- Back up the demo deployment.
- Import and validate real properties, projects, media, contact information, and legal
  content.
- Remove demo-only records using the guarded cleanup workflow.
- Review production permissions and replace all demo credentials and secrets.
- Purchase/connect the final custom domain and configure DNS.
- Add the selected production email, media storage, backups, monitoring, analytics, and
  privacy/legal configuration.
- Perform final content, security, accessibility, performance, mobile, and launch checks.

This phase is intentionally separate so that demo content can be reviewed safely before
real business data is introduced.
