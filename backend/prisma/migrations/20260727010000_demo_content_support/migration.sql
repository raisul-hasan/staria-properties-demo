-- AlterTable
ALTER TABLE "admin_users" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "media_assets" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "hero_slides" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "website_settings" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "company_statistics" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "client_contacts" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "amenities" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "contact_messages" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "downloads" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "newsletter_subscribers" ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "faqs" (
    "id" UUID NOT NULL,
    "question" VARCHAR(255) NOT NULL,
    "answer" TEXT NOT NULL,
    "group" VARCHAR(100),
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "faqs_status_group_sort_order_idx" ON "faqs"("status", "group", "sort_order");

-- CreateIndex
CREATE INDEX "faqs_is_demo_idx" ON "faqs"("is_demo");

-- CreateIndex
CREATE INDEX "faqs_deleted_at_idx" ON "faqs"("deleted_at");
