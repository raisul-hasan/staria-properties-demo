import {
  CategoryType,
  ContentStatus,
  MediaResourceType,
  MediaUsageRole,
  PageType,
  PrismaClient,
  RecordStatus
} from "@prisma/client";
import { hashPassword } from "../utils/password";
import { createSlug } from "../utils/slug";

const prisma = new PrismaClient();

const imageBase = "https://res.cloudinary.com/demo/image/upload";
const pdfBase = "https://res.cloudinary.com/demo/raw/upload";

async function upsertMedia(input: {
  publicId: string;
  secureUrl: string;
  resourceType: MediaResourceType;
  format?: string;
  altText?: string;
}) {
  return prisma.mediaAsset.upsert({
    where: { cloudinaryPublicId: input.publicId },
    update: {
      secureUrl: input.secureUrl,
      resourceType: input.resourceType,
      format: input.format,
      altText: input.altText
    },
    create: {
      cloudinaryPublicId: input.publicId,
      secureUrl: input.secureUrl,
      resourceType: input.resourceType,
      format: input.format,
      altText: input.altText
    }
  });
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@staria.com.bd";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin12345";

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      emailVerifiedAt: new Date()
    },
    create: {
      name: "Staria Admin",
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      emailVerifiedAt: new Date()
    }
  });

  const permissionInputs = [
    { resource: "dashboard", action: "read" },
    { resource: "admins", action: "manage" },
    { resource: "roles", action: "manage" },
    { resource: "permissions", action: "manage" },
    { resource: "audit", action: "read" },
    { resource: "settings", action: "manage" },
    { resource: "seo", action: "manage" },
    { resource: "media", action: "upload" },
    { resource: "categories", action: "read" },
    { resource: "categories", action: "create" },
    { resource: "categories", action: "update" },
    { resource: "categories", action: "delete" },
    { resource: "products", action: "read" },
    { resource: "products", action: "create" },
    { resource: "products", action: "update" },
    { resource: "products", action: "delete" },
    { resource: "services", action: "read" },
    { resource: "services", action: "create" },
    { resource: "services", action: "update" },
    { resource: "services", action: "delete" },
    { resource: "blog", action: "read" },
    { resource: "blog", action: "create" },
    { resource: "blog", action: "update" },
    { resource: "blog", action: "delete" },
    { resource: "gallery", action: "read" },
    { resource: "gallery", action: "create" },
    { resource: "gallery", action: "update" },
    { resource: "gallery", action: "delete" },
    { resource: "testimonials", action: "read" },
    { resource: "testimonials", action: "create" },
    { resource: "testimonials", action: "update" },
    { resource: "testimonials", action: "delete" },
    { resource: "certificates", action: "read" },
    { resource: "certificates", action: "create" },
    { resource: "certificates", action: "update" },
    { resource: "certificates", action: "delete" },
    { resource: "clients", action: "read" },
    { resource: "clients", action: "create" },
    { resource: "clients", action: "update" },
    { resource: "clients", action: "delete" },
    { resource: "partners", action: "read" },
    { resource: "partners", action: "create" },
    { resource: "partners", action: "update" },
    { resource: "partners", action: "delete" },
    { resource: "content", action: "create" },
    { resource: "content", action: "read" },
    { resource: "content", action: "update" },
    { resource: "content", action: "delete" },
    { resource: "content", action: "publish" },
    { resource: "content", action: "manage" },
    { resource: "inquiries", action: "read" },
    { resource: "inquiries", action: "update" },
    { resource: "inquiries", action: "delete" },
    { resource: "quotations", action: "read" },
    { resource: "quotations", action: "create" },
    { resource: "quotations", action: "update" },
    { resource: "quotations", action: "assign" },
    { resource: "quotations", action: "export" },
    { resource: "quotations", action: "delete" },
    { resource: "applications", action: "read" },
    { resource: "applications", action: "create" },
    { resource: "applications", action: "update" },
    { resource: "applications", action: "delete" },
    { resource: "newsletter", action: "read" },
    { resource: "newsletter", action: "update" },
    { resource: "newsletter", action: "delete" },
    { resource: "newsletter", action: "manage" },
    { resource: "settings", action: "read" },
    { resource: "settings", action: "create" },
    { resource: "settings", action: "update" },
    { resource: "settings", action: "delete" },
    { resource: "careers", action: "manage" },
    { resource: "careers", action: "read" },
    { resource: "careers", action: "create" },
    { resource: "careers", action: "update" },
    { resource: "careers", action: "delete" },
    { resource: "contact", action: "read" },
    { resource: "contact", action: "create" },
    { resource: "contact", action: "update" },
    { resource: "contact", action: "delete" },
    { resource: "downloads", action: "manage" },
    { resource: "downloads", action: "read" },
    { resource: "downloads", action: "create" },
    { resource: "downloads", action: "update" },
    { resource: "downloads", action: "delete" },
    { resource: "factories", action: "manage" },
    { resource: "factories", action: "read" },
    { resource: "factories", action: "create" },
    { resource: "factories", action: "update" },
    { resource: "factories", action: "delete" },
    { resource: "*", action: "*" }
  ];

  const permissions = await Promise.all(
    permissionInputs.map((permission) =>
      prisma.permission.upsert({
        where: { resource_action: permission },
        update: {},
        create: permission
      })
    )
  );

  const permissionsByKey = new Map(permissions.map((permission) => [`${permission.resource}:${permission.action}`, permission]));

  const roleDefinitions = [
    {
      name: "Owner",
      slug: "owner",
      description: "Business owner with unrestricted access",
      permissionKeys: ["*:*"]
    },
    {
      name: "Super Admin",
      slug: "super-admin",
      description: "Full operational administrative access",
      permissionKeys: ["*:*"]
    },
    {
      name: "Manager",
      slug: "manager",
      description: "Manages website content, sales operations and reporting",
      permissionKeys: permissionInputs
        .map((permission) => `${permission.resource}:${permission.action}`)
        .filter((key) => !["*:*", "admins:manage", "roles:manage", "permissions:manage"].includes(key))
    },
    {
      name: "Content Editor",
      slug: "content-editor",
      description: "Creates and updates public website content",
      permissionKeys: [
        "dashboard:read",
        "media:upload",
        "categories:read",
        "products:read",
        "products:create",
        "products:update",
        "services:read",
        "services:create",
        "services:update",
        "blog:read",
        "blog:create",
        "blog:update",
        "gallery:read",
        "gallery:create",
        "gallery:update",
        "certificates:read",
        "certificates:create",
        "certificates:update",
        "clients:read",
        "clients:create",
        "clients:update",
        "partners:read",
        "partners:create",
        "partners:update",
        "testimonials:read",
        "testimonials:create",
        "testimonials:update",
        "content:read",
        "content:create",
        "content:update",
        "content:publish",
        "settings:read",
        "settings:create",
        "settings:update",
        "downloads:manage",
        "seo:manage"
      ]
    },
    {
      name: "Sales Executive",
      slug: "sales-executive",
      description: "Handles inquiries, quotation requests and newsletter leads",
      permissionKeys: [
        "dashboard:read",
        "inquiries:read",
        "inquiries:update",
        "quotations:read",
        "quotations:update",
        "quotations:assign",
        "quotations:export",
        "applications:read",
        "applications:update",
        "contact:read",
        "contact:update",
        "newsletter:read",
        "newsletter:update"
      ]
    }
  ];

  const roles = await Promise.all(
    roleDefinitions.map((role) =>
      prisma.role.upsert({
        where: { slug: role.slug },
        update: {
          name: role.name,
          description: role.description,
          isSystem: true
        },
        create: {
          name: role.name,
          slug: role.slug,
          description: role.description,
          isSystem: true
        }
      })
    )
  );

  const ownerRole = roles.find((role) => role.slug === "owner");
  if (!ownerRole) {
    throw new Error("Owner role was not seeded");
  }

  await prisma.adminUserRole.upsert({
    where: {
      adminUserId_roleId: {
        adminUserId: admin.id,
        roleId: ownerRole.id
      }
    },
    update: {},
    create: {
      adminUserId: admin.id,
      roleId: ownerRole.id
    }
  });

  await Promise.all(
    roleDefinitions.flatMap((roleDefinition) => {
      const role = roles.find((candidate) => candidate.slug === roleDefinition.slug);
      if (!role) return [];

      return roleDefinition.permissionKeys.map((permissionKey) => {
        const permission = permissionsByKey.get(permissionKey);
        if (!permission) {
          throw new Error(`Permission was not seeded: ${permissionKey}`);
        }

        return prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id
            }
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id
          }
        });
      });
    })
  );

  const heroImage = await upsertMedia({
    publicId: "staria/hero/apparel-sourcing",
    secureUrl: `${imageBase}/sample.jpg`,
    resourceType: MediaResourceType.IMAGE,
    format: "jpg",
    altText: "Premium apparel sourcing hero image"
  });

  const profilePdf = await upsertMedia({
    publicId: "staria/downloads/company-profile",
    secureUrl: `${pdfBase}/sample.pdf`,
    resourceType: MediaResourceType.PDF,
    format: "pdf",
    altText: "Staria company profile PDF"
  });

  const homePage = await prisma.page.upsert({
    where: { slug: "home" },
    update: {
      title: "Home",
      pageType: PageType.HOME,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date()
    },
    create: {
      title: "Home",
      slug: "home",
      pageType: PageType.HOME,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });

  await prisma.heroSlide.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {
      pageId: homePage.id,
      mediaId: heroImage.id,
      title: "Premium Apparel Sourcing",
      subtitle: "Enterprise-ready sourcing, merchandising and quality assurance.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date()
    },
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      pageId: homePage.id,
      mediaId: heroImage.id,
      eyebrow: "Staria Properties",
      title: "Premium Apparel Sourcing",
      subtitle: "Enterprise-ready sourcing, merchandising and quality assurance.",
      ctaLabel: "Request Quotation",
      ctaUrl: "/contact",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });

  const productCategory = await prisma.category.upsert({
    where: {
      categoryType_slug: {
        categoryType: CategoryType.PRODUCT,
        slug: "knitwear"
      }
    },
    update: {},
    create: {
      categoryType: CategoryType.PRODUCT,
      name: "Knitwear",
      slug: "knitwear",
      description: "Premium knit apparel sourcing category"
    }
  });

  const serviceCategory = await prisma.category.upsert({
    where: {
      categoryType_slug: {
        categoryType: CategoryType.SERVICE,
        slug: "sourcing"
      }
    },
    update: {},
    create: {
      categoryType: CategoryType.SERVICE,
      name: "Sourcing",
      slug: "sourcing",
      description: "End-to-end apparel sourcing services"
    }
  });

  const product = await prisma.product.upsert({
    where: { slug: "premium-cotton-t-shirt" },
    update: {
      name: "Premium Cotton T-Shirt",
      status: "ACTIVE",
      publishedAt: new Date()
    },
    create: {
      sku: "ST-KNIT-001",
      name: "Premium Cotton T-Shirt",
      slug: "premium-cotton-t-shirt",
      shortDescription: "Export-quality cotton T-shirt sourcing.",
      description: "A core knitwear product line for international buyers.",
      minimumOrderQty: 1000,
      status: "ACTIVE",
      isFeatured: true,
      publishedAt: new Date()
    }
  });

  await prisma.productCategory.upsert({
    where: {
      productId_categoryId: {
        productId: product.id,
        categoryId: productCategory.id
      }
    },
    update: { isPrimary: true },
    create: {
      productId: product.id,
      categoryId: productCategory.id,
      isPrimary: true
    }
  });

  await prisma.service.upsert({
    where: { slug: "apparel-sourcing" },
    update: {
      categoryId: serviceCategory.id,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date()
    },
    create: {
      categoryId: serviceCategory.id,
      title: "Apparel Sourcing",
      slug: "apparel-sourcing",
      summary: "End-to-end sourcing for global apparel buyers.",
      description: "Vendor selection, sampling, merchandising, compliance and shipment coordination.",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date()
    }
  });

  await prisma.companyStatistic.upsert({
    where: { id: "00000000-0000-0000-0000-000000000010" },
    update: {
      label: "Trusted Buyers",
      value: 120,
      suffix: "+"
    },
    create: {
      id: "00000000-0000-0000-0000-000000000010",
      label: "Trusted Buyers",
      value: 120,
      suffix: "+",
      status: RecordStatus.ACTIVE
    }
  });

  await prisma.download.upsert({
    where: { slug: "company-profile" },
    update: {
      fileMediaId: profilePdf.id,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date()
    },
    create: {
      title: "Company Profile",
      slug: "company-profile",
      description: "Download the Staria company profile.",
      fileMediaId: profilePdf.id,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });

  await prisma.websiteSetting.upsert({
    where: { key: "company.name" },
    update: {
      group: "company",
      value: "Staria Properties",
      updatedById: admin.id
    },
    create: {
      group: "company",
      key: "company.name",
      value: "Staria Properties",
      updatedById: admin.id
    }
  });

  await prisma.measurementUnit.upsert({
    where: { code: "PCS" },
    update: {},
    create: {
      name: "Pieces",
      code: "PCS"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
