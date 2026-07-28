# Phase 2 — Database-backed demo data

Phase 2 provides a repeatable stakeholder-review dataset without mixing demo records with future production content.

## Included demo content

- 12 properties with stable reference codes, addresses, categories, amenities, projects, and primary images
- 6 development projects with progress, addresses, amenities, and primary images
- 4 services, 4 company news posts, 6 FAQs, 3 testimonials, and 4 company statistics
- 3 example enquiries and 3 newsletter subscribers for the admin workflow
- Homepage, hero, company settings, and a placeholder company-profile download
- An owner account and a read-only reviewer account

All relevant seeded records have `isDemo = true`. Stable slugs, reference codes, email addresses, or UUIDs make the seed safe to rerun without creating duplicates. Existing passwords are never changed by a rerun. A preflight guard refuses to run if a matching seeded record has been converted to real data (`isDemo = false`).

## Seed locally

1. Copy `backend/.env.example` to `backend/.env` and configure PostgreSQL.
2. Set unique values for `SEED_ADMIN_PASSWORD` and `SEED_REVIEWER_PASSWORD`. Use different passwords with at least 12 characters.
3. Run:

   ```powershell
   cd backend
   npm run db:migrate
   npm run db:seed
   npm run db:seed:verify
   ```

Do not commit `backend/.env` or share the owner password with reviewers. The reviewer account is intended for shareholder access to the admin demo.

## Remove demo data before production

The cleanup command is deliberately guarded and deletes only records marked as demo:

```powershell
$env:CONFIRM_DEMO_CLEANUP="DELETE_STARIA_DEMO_DATA"
npm run db:seed:cleanup-demo
Remove-Item Env:CONFIRM_DEMO_CLEANUP
```

Back up the production database first. If a demo record has been converted to real content, set its `isDemo` value to `false` before cleanup.

## Production transition

Before public launch:

1. Back up the database.
2. Replace or verify images, prices, addresses, copy, project progress, contact details, and legal pages.
3. Mark approved records as non-demo, or run the guarded cleanup and import real records.
4. Remove the demo reviewer account and create named staff accounts with least-privilege roles.
5. Rotate all secrets and disable public admin registration.
