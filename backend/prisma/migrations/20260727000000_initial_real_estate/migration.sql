-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AdminUserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('PROPERTY', 'PROJECT', 'SERVICE', 'BLOG', 'DOWNLOAD', 'GALLERY');

-- CreateEnum
CREATE TYPE "MediaResourceType" AS ENUM ('IMAGE', 'VIDEO', 'PDF', 'RAW');

-- CreateEnum
CREATE TYPE "MediaUsageRole" AS ENUM ('PRIMARY', 'THUMBNAIL', 'GALLERY', 'LOGO', 'COVER', 'DOCUMENT', 'OG_IMAGE', 'BACKGROUND');

-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('HOME', 'ABOUT', 'PROPERTIES', 'PROJECTS', 'CATEGORIES', 'SERVICES', 'GALLERY', 'CERTIFICATES', 'CLIENTS', 'NEWS', 'CAREER', 'FACTORY', 'CONTACT', 'DOWNLOADS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PropertyListingType" AS ENUM ('SALE', 'RENT', 'LEASE');

-- CreateEnum
CREATE TYPE "PropertyAvailability" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'RENTED', 'UPCOMING');

-- CreateEnum
CREATE TYPE "FurnishingStatus" AS ENUM ('UNFURNISHED', 'SEMI_FURNISHED', 'FURNISHED');

-- CreateEnum
CREATE TYPE "ProjectDevelopmentStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'ASSIGNED', 'RESPONDED', 'CLOSED', 'SPAM');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'QUOTED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "QuoteConversationSenderType" AS ENUM ('CUSTOMER', 'ADMIN', 'SYSTEM');

-- CreateEnum
CREATE TYPE "QuoteConversationType" AS ENUM ('MESSAGE', 'INTERNAL_NOTE', 'STATUS_CHANGE', 'ASSIGNMENT', 'EMAIL');

-- CreateEnum
CREATE TYPE "CareerStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED');

-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('SUBSCRIBED', 'UNSUBSCRIBED', 'BOUNCED', 'SPAM');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('BLOG', 'NEWS');

-- CreateEnum
CREATE TYPE "AdminAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'AUTH_REFRESH', 'SESSION_REVOKED', 'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET', 'EMAIL_VERIFICATION_REQUEST', 'EMAIL_VERIFIED', 'ACCOUNT_LOCKED', 'QUOTATION_SUBMITTED', 'QUOTATION_ASSIGNED', 'QUOTATION_STATUS_CHANGED', 'QUOTATION_MESSAGE_ADDED', 'QUOTATION_EXPORTED', 'CONTACT_SUBMITTED', 'CONTACT_STATUS_CHANGED', 'NEWSLETTER_SUBSCRIBED', 'NEWSLETTER_STATUS_CHANGED', 'ROLE_ASSIGNED', 'ROLE_REVOKED', 'PERMISSION_ASSIGNED', 'PERMISSION_REVOKED', 'STATUS_CHANGE', 'PUBLISH');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "status" "AdminUserStatus" NOT NULL DEFAULT 'ACTIVE',
    "email_verified_at" TIMESTAMP(3),
    "password_changed_at" TIMESTAMP(3),
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "resource" VARCHAR(80) NOT NULL,
    "action" VARCHAR(80) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_user_roles" (
    "admin_user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_user_roles_pkey" PRIMARY KEY ("admin_user_id","role_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "admin_sessions" (
    "id" UUID NOT NULL,
    "admin_user_id" UUID NOT NULL,
    "refresh_token_hash" VARCHAR(255) NOT NULL,
    "token_family" UUID NOT NULL,
    "ip_address" VARCHAR(64),
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "replaced_by_session_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_password_reset_tokens" (
    "id" UUID NOT NULL,
    "admin_user_id" UUID NOT NULL,
    "token_hash" VARCHAR(128) NOT NULL,
    "requested_ip" VARCHAR(64),
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_email_verification_tokens" (
    "id" UUID NOT NULL,
    "admin_user_id" UUID NOT NULL,
    "token_hash" VARCHAR(128) NOT NULL,
    "requested_ip" VARCHAR(64),
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "cloudinary_public_id" VARCHAR(255) NOT NULL,
    "secure_url" TEXT NOT NULL,
    "resource_type" "MediaResourceType" NOT NULL,
    "format" VARCHAR(30),
    "bytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "folder" VARCHAR(160),
    "alt_text" VARCHAR(255),
    "caption" TEXT,
    "uploaded_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_metadata" (
    "id" UUID NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" VARCHAR(320),
    "keywords" TEXT,
    "canonical_url" TEXT,
    "robots" VARCHAR(80),
    "og_title" VARCHAR(180),
    "og_description" VARCHAR(320),
    "og_image_id" UUID,
    "structured_data" JSONB,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "page_id" UUID,
    "category_id" UUID,
    "property_id" UUID,
    "project_id" UUID,
    "service_id" UUID,
    "gallery_album_id" UUID,
    "certificate_id" UUID,
    "client_id" UUID,
    "blog_post_id" UUID,
    "job_posting_id" UUID,
    "factory_id" UUID,
    "download_id" UUID,

    CONSTRAINT "seo_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" UUID NOT NULL,
    "page_type" "PageType" NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_sections" (
    "id" UUID NOT NULL,
    "page_id" UUID NOT NULL,
    "section_key" VARCHAR(100) NOT NULL,
    "title" VARCHAR(180),
    "subtitle" VARCHAR(255),
    "body" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_section_items" (
    "id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "title" VARCHAR(180),
    "subtitle" VARCHAR(255),
    "body" TEXT,
    "link_label" VARCHAR(80),
    "link_url" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "page_section_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" UUID NOT NULL,
    "page_id" UUID,
    "media_id" UUID NOT NULL,
    "eyebrow" VARCHAR(120),
    "title" VARCHAR(180) NOT NULL,
    "subtitle" VARCHAR(320),
    "cta_label" VARCHAR(80),
    "cta_url" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_settings" (
    "id" UUID NOT NULL,
    "group" VARCHAR(80) NOT NULL,
    "key" VARCHAR(120) NOT NULL,
    "value" JSONB,
    "media_id" UUID,
    "updated_by_id" UUID,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "website_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_statistics" (
    "id" UUID NOT NULL,
    "label" VARCHAR(120) NOT NULL,
    "value" DECIMAL(18,2) NOT NULL,
    "prefix" VARCHAR(20),
    "suffix" VARCHAR(20),
    "note" VARCHAR(180),
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "company_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "parent_id" UUID,
    "category_type" "CategoryType" NOT NULL,
    "name" VARCHAR(140) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_media" (
    "category_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "role" "MediaUsageRole" NOT NULL DEFAULT 'COVER',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "category_media_pkey" PRIMARY KEY ("category_id","media_id","role")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL,
    "project_id" UUID,
    "address_id" UUID,
    "reference_code" VARCHAR(80) NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "short_description" VARCHAR(500),
    "description" TEXT,
    "listing_type" "PropertyListingType" NOT NULL,
    "availability" "PropertyAvailability" NOT NULL DEFAULT 'AVAILABLE',
    "price" DECIMAL(16,2),
    "currency" VARCHAR(10) NOT NULL DEFAULT 'BDT',
    "price_label" VARCHAR(80),
    "bedrooms" INTEGER,
    "bathrooms" DECIMAL(4,1),
    "balconies" INTEGER,
    "parking_spaces" INTEGER,
    "floor_number" INTEGER,
    "total_floors" INTEGER,
    "area_sqft" DECIMAL(12,2),
    "land_area_sqft" DECIMAL(12,2),
    "furnishing" "FurnishingStatus",
    "year_built" INTEGER,
    "available_from" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_categories" (
    "property_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "property_categories_pkey" PRIMARY KEY ("property_id","category_id")
);

-- CreateTable
CREATE TABLE "property_media" (
    "property_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "role" "MediaUsageRole" NOT NULL DEFAULT 'GALLERY',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "property_media_pkey" PRIMARY KEY ("property_id","media_id","role")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "category_id" UUID,
    "address_id" UUID,
    "title" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "summary" VARCHAR(600),
    "description" TEXT,
    "development_status" "ProjectDevelopmentStatus" NOT NULL DEFAULT 'UPCOMING',
    "completion_percent" DECIMAL(5,2),
    "start_date" TIMESTAMP(3),
    "expected_completion" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_media" (
    "project_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "role" "MediaUsageRole" NOT NULL DEFAULT 'GALLERY',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_media_pkey" PRIMARY KEY ("project_id","media_id","role")
);

-- CreateTable
CREATE TABLE "amenities" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(140) NOT NULL,
    "icon" VARCHAR(80),
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_amenities" (
    "property_id" UUID NOT NULL,
    "amenity_id" UUID NOT NULL,

    CONSTRAINT "property_amenities_pkey" PRIMARY KEY ("property_id","amenity_id")
);

-- CreateTable
CREATE TABLE "project_amenities" (
    "project_id" UUID NOT NULL,
    "amenity_id" UUID NOT NULL,

    CONSTRAINT "project_amenities_pkey" PRIMARY KEY ("project_id","amenity_id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "category_id" UUID,
    "title" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "summary" VARCHAR(600) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(80),
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_media" (
    "service_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "role" "MediaUsageRole" NOT NULL DEFAULT 'COVER',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "service_media_pkey" PRIMARY KEY ("service_id","media_id","role")
);

-- CreateTable
CREATE TABLE "gallery_albums" (
    "id" UUID NOT NULL,
    "category_id" UUID,
    "title" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "gallery_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_items" (
    "id" UUID NOT NULL,
    "album_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "title" VARCHAR(180),
    "caption" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "issuer" VARCHAR(180) NOT NULL,
    "certificate_no" VARCHAR(120),
    "issued_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_media" (
    "certificate_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "role" "MediaUsageRole" NOT NULL DEFAULT 'DOCUMENT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "certificate_media_pkey" PRIMARY KEY ("certificate_id","media_id","role")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_contacts" (
    "id" UUID NOT NULL,
    "client_id" UUID,
    "name" VARCHAR(140) NOT NULL,
    "designation" VARCHAR(140),
    "email" VARCHAR(160),
    "phone" VARCHAR(40),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "client_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_media" (
    "client_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "role" "MediaUsageRole" NOT NULL DEFAULT 'LOGO',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "client_media_pkey" PRIMARY KEY ("client_id","media_id","role")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" UUID NOT NULL,
    "client_id" UUID,
    "client_contact_id" UUID,
    "quote" TEXT NOT NULL,
    "rating" INTEGER,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_media" (
    "partner_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "role" "MediaUsageRole" NOT NULL DEFAULT 'LOGO',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "partner_media_pkey" PRIMARY KEY ("partner_id","media_id","role")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" UUID NOT NULL,
    "category_id" UUID,
    "author_id" UUID,
    "post_type" "PostType" NOT NULL DEFAULT 'BLOG',
    "title" VARCHAR(220) NOT NULL,
    "slug" VARCHAR(240) NOT NULL,
    "excerpt" VARCHAR(600),
    "body" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_tags" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post_tags" (
    "blog_post_id" UUID NOT NULL,
    "blog_tag_id" UUID NOT NULL,

    CONSTRAINT "blog_post_tags_pkey" PRIMARY KEY ("blog_post_id","blog_tag_id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(140) NOT NULL,
    "description" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_postings" (
    "id" UUID NOT NULL,
    "department_id" UUID,
    "title" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "location" VARCHAR(180),
    "employment_type" "EmploymentType" NOT NULL,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT,
    "requirements" TEXT,
    "status" "CareerStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "closes_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" UUID NOT NULL,
    "job_posting_id" UUID NOT NULL,
    "resume_media_id" UUID,
    "full_name" VARCHAR(140) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(40),
    "cover_letter" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "line1" VARCHAR(180) NOT NULL,
    "line2" VARCHAR(180),
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100),
    "postal_code" VARCHAR(40),
    "country" VARCHAR(100) NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factories" (
    "id" UUID NOT NULL,
    "address_id" UUID,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "established_year" INTEGER,
    "total_area_sqft" INTEGER,
    "employee_count" INTEGER,
    "monthly_capacity" VARCHAR(120),
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "factories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factory_capabilities" (
    "id" UUID NOT NULL,
    "factory_id" UUID NOT NULL,
    "name" VARCHAR(140) NOT NULL,
    "value" VARCHAR(180) NOT NULL,
    "unit" VARCHAR(40),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "factory_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factory_media" (
    "factory_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "role" "MediaUsageRole" NOT NULL DEFAULT 'GALLERY',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "factory_media_pkey" PRIMARY KEY ("factory_id","media_id","role")
);

-- CreateTable
CREATE TABLE "contact_locations" (
    "id" UUID NOT NULL,
    "address_id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "email" VARCHAR(160),
    "phone" VARCHAR(40),
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "contact_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" UUID NOT NULL,
    "assigned_to_id" UUID,
    "full_name" VARCHAR(140) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(40),
    "subject" VARCHAR(180),
    "message" TEXT NOT NULL,
    "source" VARCHAR(120),
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "internal_notes" TEXT,
    "consent_accepted" BOOLEAN NOT NULL DEFAULT false,
    "ip_address" VARCHAR(64),
    "user_agent" TEXT,
    "recaptcha_score" DECIMAL(5,2),
    "recaptcha_action" VARCHAR(80),
    "spam_score" INTEGER NOT NULL DEFAULT 0,
    "spam_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measurement_units" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "measurement_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_requests" (
    "id" UUID NOT NULL,
    "request_no" VARCHAR(40) NOT NULL,
    "assigned_to_id" UUID,
    "company_name" VARCHAR(180),
    "company_website" TEXT,
    "contact_person" VARCHAR(140) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(40),
    "country" VARCHAR(100),
    "source" VARCHAR(120),
    "expected_delivery_date" TIMESTAMP(3),
    "estimated_budget" DECIMAL(14,2),
    "currency" VARCHAR(10),
    "message" TEXT,
    "internal_notes" TEXT,
    "status" "QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "assigned_at" TIMESTAMP(3),
    "quoted_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "quotation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_request_items" (
    "id" UUID NOT NULL,
    "quotation_request_id" UUID NOT NULL,
    "property_id" UUID,
    "category_id" UUID,
    "unit_id" UUID,
    "item_name" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(14,2) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "quotation_request_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_conversations" (
    "id" UUID NOT NULL,
    "quotation_request_id" UUID NOT NULL,
    "admin_user_id" UUID,
    "sender_type" "QuoteConversationSenderType" NOT NULL,
    "conversation_type" "QuoteConversationType" NOT NULL DEFAULT 'MESSAGE',
    "message" TEXT NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotation_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" UUID NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "full_name" VARCHAR(140),
    "status" "NewsletterStatus" NOT NULL DEFAULT 'SUBSCRIBED',
    "source" VARCHAR(120),
    "consent_accepted" BOOLEAN NOT NULL DEFAULT false,
    "ip_address" VARCHAR(64),
    "user_agent" TEXT,
    "recaptcha_score" DECIMAL(5,2),
    "recaptcha_action" VARCHAR(80),
    "spam_score" INTEGER NOT NULL DEFAULT 0,
    "spam_reason" TEXT,
    "subscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_campaigns" (
    "id" UUID NOT NULL,
    "created_by_id" UUID,
    "subject" VARCHAR(180) NOT NULL,
    "body" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduled_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "newsletter_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_campaign_recipients" (
    "campaign_id" UUID NOT NULL,
    "subscriber_id" UUID NOT NULL,
    "sent_at" TIMESTAMP(3),
    "opened_at" TIMESTAMP(3),
    "clicked_at" TIMESTAMP(3),

    CONSTRAINT "newsletter_campaign_recipients_pkey" PRIMARY KEY ("campaign_id","subscriber_id")
);

-- CreateTable
CREATE TABLE "downloads" (
    "id" UUID NOT NULL,
    "category_id" UUID,
    "file_media_id" UUID NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "downloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_id" UUID,
    "action" "AdminAction" NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" UUID,
    "before_data" JSONB,
    "after_data" JSONB,
    "ip_address" VARCHAR(64),
    "user_agent" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_status_deleted_at_idx" ON "admin_users"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "admin_users_locked_until_idx" ON "admin_users"("locked_until");

-- CreateIndex
CREATE INDEX "admin_users_created_at_idx" ON "admin_users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_slug_key" ON "roles"("slug");

-- CreateIndex
CREATE INDEX "roles_deleted_at_idx" ON "roles"("deleted_at");

-- CreateIndex
CREATE INDEX "permissions_resource_idx" ON "permissions"("resource");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_resource_action_key" ON "permissions"("resource", "action");

-- CreateIndex
CREATE INDEX "admin_user_roles_role_id_idx" ON "admin_user_roles"("role_id");

-- CreateIndex
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "admin_sessions_admin_user_id_revoked_at_expires_at_idx" ON "admin_sessions"("admin_user_id", "revoked_at", "expires_at");

-- CreateIndex
CREATE INDEX "admin_sessions_token_family_idx" ON "admin_sessions"("token_family");

-- CreateIndex
CREATE INDEX "admin_sessions_replaced_by_session_id_idx" ON "admin_sessions"("replaced_by_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_password_reset_tokens_token_hash_key" ON "admin_password_reset_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "admin_password_reset_tokens_admin_user_id_used_at_expires_a_idx" ON "admin_password_reset_tokens"("admin_user_id", "used_at", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_verification_tokens_token_hash_key" ON "admin_email_verification_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "admin_email_verification_tokens_admin_user_id_used_at_expir_idx" ON "admin_email_verification_tokens"("admin_user_id", "used_at", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_cloudinary_public_id_key" ON "media_assets"("cloudinary_public_id");

-- CreateIndex
CREATE INDEX "media_assets_resource_type_deleted_at_idx" ON "media_assets"("resource_type", "deleted_at");

-- CreateIndex
CREATE INDEX "media_assets_uploaded_by_id_idx" ON "media_assets"("uploaded_by_id");

-- CreateIndex
CREATE INDEX "media_assets_created_at_idx" ON "media_assets"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_page_id_key" ON "seo_metadata"("page_id");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_category_id_key" ON "seo_metadata"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_property_id_key" ON "seo_metadata"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_project_id_key" ON "seo_metadata"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_service_id_key" ON "seo_metadata"("service_id");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_gallery_album_id_key" ON "seo_metadata"("gallery_album_id");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_certificate_id_key" ON "seo_metadata"("certificate_id");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_client_id_key" ON "seo_metadata"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_blog_post_id_key" ON "seo_metadata"("blog_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_job_posting_id_key" ON "seo_metadata"("job_posting_id");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_factory_id_key" ON "seo_metadata"("factory_id");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_download_id_key" ON "seo_metadata"("download_id");

-- CreateIndex
CREATE INDEX "seo_metadata_status_deleted_at_idx" ON "seo_metadata"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "seo_metadata_og_image_id_idx" ON "seo_metadata"("og_image_id");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE INDEX "pages_page_type_status_idx" ON "pages"("page_type", "status");

-- CreateIndex
CREATE INDEX "pages_deleted_at_idx" ON "pages"("deleted_at");

-- CreateIndex
CREATE INDEX "page_sections_page_id_status_sort_order_idx" ON "page_sections"("page_id", "status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "page_sections_page_id_section_key_key" ON "page_sections"("page_id", "section_key");

-- CreateIndex
CREATE INDEX "page_section_items_section_id_status_sort_order_idx" ON "page_section_items"("section_id", "status", "sort_order");

-- CreateIndex
CREATE INDEX "hero_slides_page_id_status_sort_order_idx" ON "hero_slides"("page_id", "status", "sort_order");

-- CreateIndex
CREATE INDEX "hero_slides_media_id_idx" ON "hero_slides"("media_id");

-- CreateIndex
CREATE UNIQUE INDEX "website_settings_key_key" ON "website_settings"("key");

-- CreateIndex
CREATE INDEX "website_settings_group_status_idx" ON "website_settings"("group", "status");

-- CreateIndex
CREATE INDEX "website_settings_media_id_idx" ON "website_settings"("media_id");

-- CreateIndex
CREATE INDEX "website_settings_deleted_at_idx" ON "website_settings"("deleted_at");

-- CreateIndex
CREATE INDEX "company_statistics_status_sort_order_idx" ON "company_statistics"("status", "sort_order");

-- CreateIndex
CREATE INDEX "company_statistics_deleted_at_idx" ON "company_statistics"("deleted_at");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE INDEX "categories_category_type_status_sort_order_idx" ON "categories"("category_type", "status", "sort_order");

-- CreateIndex
CREATE INDEX "categories_deleted_at_idx" ON "categories"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_type_slug_key" ON "categories"("category_type", "slug");

-- CreateIndex
CREATE INDEX "category_media_media_id_idx" ON "category_media"("media_id");

-- CreateIndex
CREATE UNIQUE INDEX "properties_address_id_key" ON "properties"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "properties_reference_code_key" ON "properties"("reference_code");

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "properties_project_id_idx" ON "properties"("project_id");

-- CreateIndex
CREATE INDEX "properties_status_availability_is_featured_sort_order_idx" ON "properties"("status", "availability", "is_featured", "sort_order");

-- CreateIndex
CREATE INDEX "properties_listing_type_price_idx" ON "properties"("listing_type", "price");

-- CreateIndex
CREATE INDEX "properties_bedrooms_bathrooms_idx" ON "properties"("bedrooms", "bathrooms");

-- CreateIndex
CREATE INDEX "properties_is_demo_idx" ON "properties"("is_demo");

-- CreateIndex
CREATE INDEX "properties_published_at_idx" ON "properties"("published_at");

-- CreateIndex
CREATE INDEX "properties_deleted_at_idx" ON "properties"("deleted_at");

-- CreateIndex
CREATE INDEX "property_categories_category_id_is_primary_idx" ON "property_categories"("category_id", "is_primary");

-- CreateIndex
CREATE INDEX "property_media_media_id_idx" ON "property_media"("media_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_address_id_key" ON "projects"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_category_id_idx" ON "projects"("category_id");

-- CreateIndex
CREATE INDEX "projects_status_development_status_is_featured_sort_order_idx" ON "projects"("status", "development_status", "is_featured", "sort_order");

-- CreateIndex
CREATE INDEX "projects_is_demo_idx" ON "projects"("is_demo");

-- CreateIndex
CREATE INDEX "projects_published_at_idx" ON "projects"("published_at");

-- CreateIndex
CREATE INDEX "projects_deleted_at_idx" ON "projects"("deleted_at");

-- CreateIndex
CREATE INDEX "project_media_media_id_idx" ON "project_media"("media_id");

-- CreateIndex
CREATE UNIQUE INDEX "amenities_name_key" ON "amenities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "amenities_slug_key" ON "amenities"("slug");

-- CreateIndex
CREATE INDEX "amenities_status_sort_order_idx" ON "amenities"("status", "sort_order");

-- CreateIndex
CREATE INDEX "property_amenities_amenity_id_idx" ON "property_amenities"("amenity_id");

-- CreateIndex
CREATE INDEX "project_amenities_amenity_id_idx" ON "project_amenities"("amenity_id");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_category_id_idx" ON "services"("category_id");

-- CreateIndex
CREATE INDEX "services_status_is_featured_sort_order_idx" ON "services"("status", "is_featured", "sort_order");

-- CreateIndex
CREATE INDEX "services_deleted_at_idx" ON "services"("deleted_at");

-- CreateIndex
CREATE INDEX "service_media_media_id_idx" ON "service_media"("media_id");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_albums_slug_key" ON "gallery_albums"("slug");

-- CreateIndex
CREATE INDEX "gallery_albums_category_id_idx" ON "gallery_albums"("category_id");

-- CreateIndex
CREATE INDEX "gallery_albums_status_sort_order_idx" ON "gallery_albums"("status", "sort_order");

-- CreateIndex
CREATE INDEX "gallery_albums_deleted_at_idx" ON "gallery_albums"("deleted_at");

-- CreateIndex
CREATE INDEX "gallery_items_album_id_status_sort_order_idx" ON "gallery_items"("album_id", "status", "sort_order");

-- CreateIndex
CREATE INDEX "gallery_items_media_id_idx" ON "gallery_items"("media_id");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_items_album_id_media_id_key" ON "gallery_items"("album_id", "media_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_slug_key" ON "certificates"("slug");

-- CreateIndex
CREATE INDEX "certificates_status_sort_order_idx" ON "certificates"("status", "sort_order");

-- CreateIndex
CREATE INDEX "certificates_expires_at_idx" ON "certificates"("expires_at");

-- CreateIndex
CREATE INDEX "certificates_deleted_at_idx" ON "certificates"("deleted_at");

-- CreateIndex
CREATE INDEX "certificate_media_media_id_idx" ON "certificate_media"("media_id");

-- CreateIndex
CREATE UNIQUE INDEX "clients_slug_key" ON "clients"("slug");

-- CreateIndex
CREATE INDEX "clients_status_sort_order_idx" ON "clients"("status", "sort_order");

-- CreateIndex
CREATE INDEX "clients_deleted_at_idx" ON "clients"("deleted_at");

-- CreateIndex
CREATE INDEX "client_contacts_client_id_idx" ON "client_contacts"("client_id");

-- CreateIndex
CREATE INDEX "client_contacts_email_idx" ON "client_contacts"("email");

-- CreateIndex
CREATE INDEX "client_media_media_id_idx" ON "client_media"("media_id");

-- CreateIndex
CREATE INDEX "testimonials_client_id_idx" ON "testimonials"("client_id");

-- CreateIndex
CREATE INDEX "testimonials_client_contact_id_idx" ON "testimonials"("client_contact_id");

-- CreateIndex
CREATE INDEX "testimonials_status_is_featured_sort_order_idx" ON "testimonials"("status", "is_featured", "sort_order");

-- CreateIndex
CREATE INDEX "testimonials_deleted_at_idx" ON "testimonials"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "partners_slug_key" ON "partners"("slug");

-- CreateIndex
CREATE INDEX "partners_status_sort_order_idx" ON "partners"("status", "sort_order");

-- CreateIndex
CREATE INDEX "partners_deleted_at_idx" ON "partners"("deleted_at");

-- CreateIndex
CREATE INDEX "partner_media_media_id_idx" ON "partner_media"("media_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_category_id_idx" ON "blog_posts"("category_id");

-- CreateIndex
CREATE INDEX "blog_posts_author_id_idx" ON "blog_posts"("author_id");

-- CreateIndex
CREATE INDEX "blog_posts_post_type_status_published_at_idx" ON "blog_posts"("post_type", "status", "published_at");

-- CreateIndex
CREATE INDEX "blog_posts_status_is_featured_published_at_idx" ON "blog_posts"("status", "is_featured", "published_at");

-- CreateIndex
CREATE INDEX "blog_posts_deleted_at_idx" ON "blog_posts"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_name_key" ON "blog_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_slug_key" ON "blog_tags"("slug");

-- CreateIndex
CREATE INDEX "blog_post_tags_blog_tag_id_idx" ON "blog_post_tags"("blog_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_slug_key" ON "departments"("slug");

-- CreateIndex
CREATE INDEX "departments_status_deleted_at_idx" ON "departments"("status", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "job_postings_slug_key" ON "job_postings"("slug");

-- CreateIndex
CREATE INDEX "job_postings_department_id_idx" ON "job_postings"("department_id");

-- CreateIndex
CREATE INDEX "job_postings_status_published_at_idx" ON "job_postings"("status", "published_at");

-- CreateIndex
CREATE INDEX "job_postings_deleted_at_idx" ON "job_postings"("deleted_at");

-- CreateIndex
CREATE INDEX "job_applications_job_posting_id_status_idx" ON "job_applications"("job_posting_id", "status");

-- CreateIndex
CREATE INDEX "job_applications_email_idx" ON "job_applications"("email");

-- CreateIndex
CREATE INDEX "job_applications_deleted_at_idx" ON "job_applications"("deleted_at");

-- CreateIndex
CREATE INDEX "addresses_city_country_idx" ON "addresses"("city", "country");

-- CreateIndex
CREATE UNIQUE INDEX "factories_address_id_key" ON "factories"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "factories_slug_key" ON "factories"("slug");

-- CreateIndex
CREATE INDEX "factories_status_deleted_at_idx" ON "factories"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "factory_capabilities_factory_id_sort_order_idx" ON "factory_capabilities"("factory_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "factory_capabilities_factory_id_name_key" ON "factory_capabilities"("factory_id", "name");

-- CreateIndex
CREATE INDEX "factory_media_media_id_idx" ON "factory_media"("media_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_locations_address_id_key" ON "contact_locations"("address_id");

-- CreateIndex
CREATE INDEX "contact_locations_status_sort_order_idx" ON "contact_locations"("status", "sort_order");

-- CreateIndex
CREATE INDEX "contact_locations_deleted_at_idx" ON "contact_locations"("deleted_at");

-- CreateIndex
CREATE INDEX "contact_messages_status_created_at_idx" ON "contact_messages"("status", "created_at");

-- CreateIndex
CREATE INDEX "contact_messages_assigned_to_id_idx" ON "contact_messages"("assigned_to_id");

-- CreateIndex
CREATE INDEX "contact_messages_email_idx" ON "contact_messages"("email");

-- CreateIndex
CREATE INDEX "contact_messages_spam_score_idx" ON "contact_messages"("spam_score");

-- CreateIndex
CREATE INDEX "contact_messages_deleted_at_idx" ON "contact_messages"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "measurement_units_name_key" ON "measurement_units"("name");

-- CreateIndex
CREATE UNIQUE INDEX "measurement_units_code_key" ON "measurement_units"("code");

-- CreateIndex
CREATE UNIQUE INDEX "quotation_requests_request_no_key" ON "quotation_requests"("request_no");

-- CreateIndex
CREATE INDEX "quotation_requests_status_created_at_idx" ON "quotation_requests"("status", "created_at");

-- CreateIndex
CREATE INDEX "quotation_requests_assigned_to_id_status_idx" ON "quotation_requests"("assigned_to_id", "status");

-- CreateIndex
CREATE INDEX "quotation_requests_email_idx" ON "quotation_requests"("email");

-- CreateIndex
CREATE INDEX "quotation_requests_country_idx" ON "quotation_requests"("country");

-- CreateIndex
CREATE INDEX "quotation_requests_last_activity_at_idx" ON "quotation_requests"("last_activity_at");

-- CreateIndex
CREATE INDEX "quotation_requests_deleted_at_idx" ON "quotation_requests"("deleted_at");

-- CreateIndex
CREATE INDEX "quotation_request_items_quotation_request_id_sort_order_idx" ON "quotation_request_items"("quotation_request_id", "sort_order");

-- CreateIndex
CREATE INDEX "quotation_request_items_property_id_idx" ON "quotation_request_items"("property_id");

-- CreateIndex
CREATE INDEX "quotation_request_items_category_id_idx" ON "quotation_request_items"("category_id");

-- CreateIndex
CREATE INDEX "quotation_conversations_quotation_request_id_created_at_idx" ON "quotation_conversations"("quotation_request_id", "created_at");

-- CreateIndex
CREATE INDEX "quotation_conversations_admin_user_id_idx" ON "quotation_conversations"("admin_user_id");

-- CreateIndex
CREATE INDEX "quotation_conversations_conversation_type_idx" ON "quotation_conversations"("conversation_type");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_status_idx" ON "newsletter_subscribers"("status");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_spam_score_idx" ON "newsletter_subscribers"("spam_score");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_deleted_at_idx" ON "newsletter_subscribers"("deleted_at");

-- CreateIndex
CREATE INDEX "newsletter_campaigns_status_scheduled_at_idx" ON "newsletter_campaigns"("status", "scheduled_at");

-- CreateIndex
CREATE INDEX "newsletter_campaigns_created_by_id_idx" ON "newsletter_campaigns"("created_by_id");

-- CreateIndex
CREATE INDEX "newsletter_campaigns_deleted_at_idx" ON "newsletter_campaigns"("deleted_at");

-- CreateIndex
CREATE INDEX "newsletter_campaign_recipients_subscriber_id_idx" ON "newsletter_campaign_recipients"("subscriber_id");

-- CreateIndex
CREATE UNIQUE INDEX "downloads_slug_key" ON "downloads"("slug");

-- CreateIndex
CREATE INDEX "downloads_category_id_idx" ON "downloads"("category_id");

-- CreateIndex
CREATE INDEX "downloads_status_sort_order_idx" ON "downloads"("status", "sort_order");

-- CreateIndex
CREATE INDEX "downloads_file_media_id_idx" ON "downloads"("file_media_id");

-- CreateIndex
CREATE INDEX "downloads_deleted_at_idx" ON "downloads"("deleted_at");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_created_at_idx" ON "audit_logs"("actor_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- AddForeignKey
ALTER TABLE "admin_user_roles" ADD CONSTRAINT "admin_user_roles_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_user_roles" ADD CONSTRAINT "admin_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_replaced_by_session_id_fkey" FOREIGN KEY ("replaced_by_session_id") REFERENCES "admin_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_password_reset_tokens" ADD CONSTRAINT "admin_password_reset_tokens_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_email_verification_tokens" ADD CONSTRAINT "admin_email_verification_tokens_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_og_image_id_fkey" FOREIGN KEY ("og_image_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_gallery_album_id_fkey" FOREIGN KEY ("gallery_album_id") REFERENCES "gallery_albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_job_posting_id_fkey" FOREIGN KEY ("job_posting_id") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_factory_id_fkey" FOREIGN KEY ("factory_id") REFERENCES "factories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_download_id_fkey" FOREIGN KEY ("download_id") REFERENCES "downloads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_section_items" ADD CONSTRAINT "page_section_items_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "page_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_settings" ADD CONSTRAINT "website_settings_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_settings" ADD CONSTRAINT "website_settings_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_media" ADD CONSTRAINT "category_media_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_media" ADD CONSTRAINT "category_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_categories" ADD CONSTRAINT "property_categories_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_categories" ADD CONSTRAINT "property_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_media" ADD CONSTRAINT "property_media_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_media" ADD CONSTRAINT "property_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_media" ADD CONSTRAINT "project_media_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_media" ADD CONSTRAINT "project_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_amenities" ADD CONSTRAINT "project_amenities_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_amenities" ADD CONSTRAINT "project_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_media" ADD CONSTRAINT "service_media_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_media" ADD CONSTRAINT "service_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_albums" ADD CONSTRAINT "gallery_albums_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "gallery_albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_media" ADD CONSTRAINT "certificate_media_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_media" ADD CONSTRAINT "certificate_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_contacts" ADD CONSTRAINT "client_contacts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_media" ADD CONSTRAINT "client_media_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_media" ADD CONSTRAINT "client_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_client_contact_id_fkey" FOREIGN KEY ("client_contact_id") REFERENCES "client_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_media" ADD CONSTRAINT "partner_media_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_media" ADD CONSTRAINT "partner_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_blog_tag_id_fkey" FOREIGN KEY ("blog_tag_id") REFERENCES "blog_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_posting_id_fkey" FOREIGN KEY ("job_posting_id") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_resume_media_id_fkey" FOREIGN KEY ("resume_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factories" ADD CONSTRAINT "factories_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factory_capabilities" ADD CONSTRAINT "factory_capabilities_factory_id_fkey" FOREIGN KEY ("factory_id") REFERENCES "factories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factory_media" ADD CONSTRAINT "factory_media_factory_id_fkey" FOREIGN KEY ("factory_id") REFERENCES "factories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factory_media" ADD CONSTRAINT "factory_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_locations" ADD CONSTRAINT "contact_locations_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_requests" ADD CONSTRAINT "quotation_requests_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_request_items" ADD CONSTRAINT "quotation_request_items_quotation_request_id_fkey" FOREIGN KEY ("quotation_request_id") REFERENCES "quotation_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_request_items" ADD CONSTRAINT "quotation_request_items_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_request_items" ADD CONSTRAINT "quotation_request_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_request_items" ADD CONSTRAINT "quotation_request_items_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "measurement_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_conversations" ADD CONSTRAINT "quotation_conversations_quotation_request_id_fkey" FOREIGN KEY ("quotation_request_id") REFERENCES "quotation_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_conversations" ADD CONSTRAINT "quotation_conversations_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_campaigns" ADD CONSTRAINT "newsletter_campaigns_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_campaign_recipients" ADD CONSTRAINT "newsletter_campaign_recipients_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "newsletter_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_campaign_recipients" ADD CONSTRAINT "newsletter_campaign_recipients_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "newsletter_subscribers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_file_media_id_fkey" FOREIGN KEY ("file_media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
