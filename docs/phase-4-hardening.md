# Phase 4: Full-product hardening

## Outcome

Phase 4 turns the Phase 3 connected demo into a review-ready product with complete admin
workflows, account security surfaces, privacy consent, accessibility improvements, SEO
metadata, and deployment preparation.

## Administration

- Every backend CMS resource now has a corresponding configurable create/edit
  experience in the admin portal.
- Admin navigation is grouped into portfolio, website content, company, and
  configuration areas and remains permission-aware.
- Editors include required fields, field constraints, API validation feedback,
  loading/empty/error states, accessible archive confirmation, success notices, and a
  responsive card view for small screens.
- Relation fields load human-readable options instead of requiring UUID entry.
- Nested address, SEO, contact, capability, and structured-data values can be edited as
  validated JSON where a dedicated relational editor would add disproportionate
  complexity.
- The media library can browse/search seeded assets, upload Cloudinary images/PDFs, and
  select one or multiple assets inside content editors.

## Account security

- Added authenticated password change with current-password verification, password
  policy enforcement, password reuse prevention, and revocation of all sessions.
- Added forgot-password and reset-password screens backed by the existing opaque,
  expiring, single-use token flow.
- Added active-session listing and manual session revocation.
- Password reset and password change clear authentication cookies.

## Public hardening

- Contact and newsletter APIs now reject submissions without affirmative privacy
  consent; the frontend exposes required unchecked consent controls.
- Added stakeholder-demo privacy, terms, and cookie notices with explicit pre-launch
  legal-review warnings.
- Added route-aware titles, descriptions, canonical URLs, Open Graph/Twitter metadata,
  indexing controls, and basic JSON-LD.
- Added route error pages, skip navigation, labelled controls, focusable dialogs,
  keyboard Escape behavior, table headers, live status/error regions, and mobile admin
  navigation/card improvements.
- The stakeholder demo remains `noindex` unless `VITE_ALLOW_INDEXING=true`.
- Vendor bundles are split to keep the main route bundle below the warning threshold.

## Verification

Completed locally against PostgreSQL 18 and the seeded `staria_properties` database:

- Backend TypeScript check and production build
- Frontend production build with route and vendor code splitting
- Migration status and demo seed verification
- Public API access
- Rejection of contact submission when consent is false (`400`)
- Owner login, media library read, and session list
- Reviewer login and rejected CMS write (`403`)
- Password-recovery enumeration-safe response for an unknown account (`200`)
- Backend production dependency audit (`0` findings)
- Frontend production dependency audit reviewed with one React Router RSC/server-action
  advisory; this Vite app is client-only and does not enable RSC or server actions

The in-app browser could not initialize because the browser surface did not receive its
required sandbox metadata. HTTP-level integration checks were run against the live Vite,
Express, PostgreSQL processes; browser-level visual review remains a local owner
acceptance step using the instructions in `phase-4-local-setup.md`.

The npm registry currently offers no React Router version that clears every high-severity
advisory: downgrading from 7.18.1 reintroduces multiple open-redirect, XSS, SSR, and
route-matching advisories, while 7.18.1 reports one RSC/server-action CSRF advisory. The
project remains on 7.18.1 because the affected server/RSC mode is not used. Re-check the
audit before Phase 5 and upgrade when a compatible patched release is available.

## External services

Cloudinary is optional for local review because seeded media can be browsed and selected.
New uploads require Cloudinary credentials. Password change works locally; emailed reset
links require SMTP credentials. Neither service is required to compile, migrate, seed,
or review the main demo.

## Documentation

- Complete Windows setup: `docs/phase-4-local-setup.md`
- Production environment preparation: `docs/production-environment.md`
- Phase record: this document
