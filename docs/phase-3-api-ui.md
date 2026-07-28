# Phase 3 — API-connected public website and admin portal

Phase 3 replaces the main hardcoded demo surfaces with database-backed API content and introduces the first functional administration interface.

## Public website

The following sections now load published records from PostgreSQL through the public API:

- homepage hero, featured properties, featured projects, services, statistics, testimonials, news, and FAQs;
- property listing and property detail routes;
- project listing, filters, progress, and project detail routes;
- news listing and news article routes;
- contact form and newsletter subscription;
- company contact details in the footer.

Representative design data remains as a graceful fallback if the API is temporarily unavailable. A warning is displayed on listing sections when a fallback is active.

## Admin portal

The admin portal is available at `/admin/login`.

- Authentication uses the backend's HTTP-only access and refresh cookies.
- Protected routes restore the current session through `/auth/me`.
- Owner and reviewer navigation is generated from RBAC permissions.
- Dashboard cards show live database totals.
- Properties, projects, services, news, FAQs, testimonials, and website settings have connected list screens.
- Authorized users can quick-edit supported fields and publish, return to draft, or archive content.
- FAQs, services, news, and website settings can be created from the admin portal.
- Enquiries are loaded from real contact submissions.
- The seeded reviewer remains read-only; write attempts return HTTP 403.

Public and admin route bundles are lazy-loaded so the admin portal does not increase the initial public website JavaScript payload.

## Environment

The frontend needs:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

For local cross-origin development, the backend must allow the frontend origin in `CORS_ORIGIN`. For a future split-domain HTTPS deployment, use secure cookies and `COOKIE_SAME_SITE=none`.

## Verification completed

- Backend TypeScript check and production build
- Frontend production build with route-level code splitting
- Public API totals for all connected content types
- Contact-form submission into PostgreSQL
- Reviewer login, session restoration, CMS reads, and rejected write access
- Owner CMS update, draft transition, public visibility change, and republish transition
- CORS origin and credential headers
- SPA fallback responses for public detail and admin routes

The browser-control runtime was unavailable in this environment because its sandbox metadata could not be initialized. HTTP-level end-to-end checks were run against the actual Vite, Express, and isolated PostgreSQL processes instead.
