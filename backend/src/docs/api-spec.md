# Staria Properties API Specification

Base URL: `/api/v1`

All successful responses use:

```json
{ "success": true, "message": "...", "data": {} }
```

All errors use:

```json
{ "success": false, "message": "..." }
```

Authentication supports both `Authorization: Bearer <accessToken>` and HTTP-only cookies:

- Access cookie: `staria_access_token`
- Refresh cookie: `staria_refresh_token`

## Public

- `GET /health`
- `GET /api/v1/site`

## Enterprise Auth

| Method | Path | Protection | Purpose |
|---|---|---|---|
| `POST` | `/auth/bootstrap` | Public while `ENABLE_REGISTRATION=true` and no admins exist | Create first Owner admin |
| `POST` | `/auth/login` | Public, rate limited | Admin login, sets secure HTTP-only cookies |
| `POST` | `/auth/refresh` | Refresh token cookie or body | Refresh token rotation |
| `POST` | `/auth/forgot-password` | Public, rate limited | Send password reset email if account exists |
| `POST` | `/auth/reset-password` | Reset token | Reset password and revoke sessions |
| `POST` | `/auth/change-password` | Authenticated admin | Verify current password, change it, and revoke all sessions |
| `POST` | `/auth/email-verification/request` | Public, rate limited | Request verification email by address |
| `POST` | `/auth/email-verification/verify` | Verification token | Verify email |
| `GET` | `/auth/me` | Authenticated admin | Current admin profile, roles and permissions |
| `POST` | `/auth/logout` | Authenticated admin | Revoke current session and clear cookies |
| `POST` | `/auth/email-verification/resend` | Authenticated admin | Resend verification email |
| `GET` | `/auth/sessions` | Authenticated admin | List active sessions |
| `DELETE` | `/auth/sessions/:id` | Authenticated admin | Revoke a session owned by current admin |
| `POST` | `/auth/admins` | `admins:manage` | Create admins with one or more roles |

## Roles

Seeded system roles:

- `owner`
- `super-admin`
- `manager`
- `content-editor`
- `sales-executive`

`owner` and `super-admin` receive `*:*`. Other roles receive scoped permissions seeded in `src/prisma/seed.ts`.

## Security Rules

- Access tokens include admin id, email, session id, roles and permissions.
- Refresh tokens are stored as bcrypt hashes in `admin_sessions`.
- Refresh token rotation revokes the previous session and links it to the replacement session.
- Reuse of a revoked refresh token revokes all sessions for the affected admin.
- Login is rate limited and accounts are locked after repeated failures.
- Forgot/reset password and email verification use opaque one-time tokens stored as SHA-256 hashes.
- Password reset revokes active sessions.
- Every auth security event writes to `audit_logs`.

## Admin CMS

All CMS endpoints require an authenticated admin. Permissions are checked per resource:

- `resource:read`
- `resource:create`
- `resource:update`
- `resource:delete`
- `resource:manage`
- `*:*`

Base path:

```text
/api/v1/admin/cms
```

Supported resources:

```text
hero-slides
properties
projects
amenities
categories
services
gallery
gallery-items
blogs
news
certificates
clients
testimonials
partners
career-jobs
applications
company-information
factory-information
seo
contact-details
social-media
footer
menus
website-settings
downloads
company-statistics
```

CRUD:

```text
GET    /admin/cms/:resource
POST   /admin/cms/:resource
GET    /admin/cms/:resource/:id
PATCH  /admin/cms/:resource/:id
DELETE /admin/cms/:resource/:id
PATCH  /admin/cms/:resource/:id/publish
PATCH  /admin/cms/:resource/:id/draft
PATCH  /admin/cms/:resource/:id/restore
```

List query options:

```text
page
limit
search
status
sortBy
sortOrder=asc|desc
includeDeleted=true|false
deletedOnly=true|false
categoryType
categoryId
parentId
pageId
albumId
clientId
clientContactId
departmentId
jobPostingId
group
pageType
isFeatured
isDemo
listingType
availability
developmentStatus
bedrooms
minPrice
maxPrice
createdFrom
createdTo
```

Media upload:

```text
GET /admin/cms/media
query: page, limit, search, resourceType

POST /admin/cms/media/images
field: image

POST /admin/cms/media/files
field: file
```

Uploaded files go to Cloudinary; PostgreSQL stores only `media_assets` metadata and URLs.

Common mutation conventions:

- `status` accepts native enum values plus dashboard-friendly aliases like `DRAFT` and `PUBLISHED`.
- Content models use `DRAFT`, `PUBLISHED`, `ARCHIVED`.
- Record-style models map `DRAFT` to `INACTIVE` and `PUBLISHED` to `ACTIVE`.
- Career job `PUBLISHED` maps to `OPEN`.
- Create/update payloads can include nested `seo`.
- Media-enabled resources accept `media: [{ "mediaId": "...", "role": "COVER", "sortOrder": 0 }]`.
- Properties accept real-estate details, `categoryIds`, `primaryCategoryId`, `amenityIds`, `address`, `media`, and `seo`.
- Projects accept development details, `amenityIds`, `address`, `media`, and `seo`.
- Blogs/news share the normalized `blog_posts` table; `/blogs` writes `postType=BLOG`, `/news` writes `postType=NEWS`.
- Deletes are soft deletes through `deletedAt`.

## RFQ / Quotation CRM

Public customer submission:

```text
POST /api/v1/quotations
```

The backend generates a unique quotation number such as `RFQ-20260720-0001`, stores the quotation and line items, writes the first customer conversation entry, sends a customer confirmation email, notifies admins, and writes an audit log.

Admin dashboard endpoints:

```text
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

Workflow statuses:

```text
PENDING
IN_REVIEW
QUOTED
REJECTED
COMPLETED
```

Admin list filters:

```text
page
limit
search
status
assignedToId
email
country
createdFrom
createdTo
sortBy=createdAt|updatedAt|lastActivityAt|requestNo|status|companyName
sortOrder=asc|desc
includeDeleted
deletedOnly
```

Conversation history supports:

- Customer submission messages
- Admin messages
- Internal notes
- Status changes
- Assignment events
- Customer notification emails

Permissions:

- `quotations:read`
- `quotations:update`
- `quotations:assign`
- `quotations:export`
- `quotations:delete`

## Contact And Newsletter Forms

Public endpoints:

```text
POST /api/v1/contact
POST /api/v1/newsletter/subscribe
```

Both endpoints are rate limited, validated with Zod, stored in PostgreSQL, assessed for spam, and can verify Google reCAPTCHA when configured.

Spam protection:

- Honeypot field: `honeypot`
- Link/keyword/repeated-character heuristics
- Optional Google reCAPTCHA verification using `RECAPTCHA_SECRET_KEY`
- Optional strict mode using `RECAPTCHA_REQUIRED=true`
- Stored metadata: IP address, user agent, reCAPTCHA score/action, spam score, spam reason

Admin contact submission management:

```text
GET    /api/v1/admin/contact-submissions
GET    /api/v1/admin/contact-submissions/stats
GET    /api/v1/admin/contact-submissions/:id
PATCH  /api/v1/admin/contact-submissions/:id
DELETE /api/v1/admin/contact-submissions/:id
```

Admin newsletter subscriber management:

```text
GET    /api/v1/admin/newsletter-subscribers
GET    /api/v1/admin/newsletter-subscribers/stats
GET    /api/v1/admin/newsletter-subscribers/:id
PATCH  /api/v1/admin/newsletter-subscribers/:id
DELETE /api/v1/admin/newsletter-subscribers/:id
```

Admin filters:

```text
page
limit
search
status
email
source
isSpam
createdFrom
createdTo
sortBy
sortOrder
includeDeleted
deletedOnly
```

Contact status values:

```text
NEW
ASSIGNED
RESPONDED
CLOSED
SPAM
```

Newsletter status values:

```text
SUBSCRIBED
UNSUBSCRIBED
BOUNCED
SPAM
```
