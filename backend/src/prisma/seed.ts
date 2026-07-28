import {
  CategoryType,
  ContentStatus,
  FurnishingStatus,
  InquiryStatus,
  MediaResourceType,
  MediaUsageRole,
  NewsletterStatus,
  PageType,
  PostType,
  PrismaClient,
  ProjectDevelopmentStatus,
  PropertyAvailability,
  PropertyListingType,
  RecordStatus
} from "@prisma/client";
import { hashPassword } from "../utils/password";

const prisma = new PrismaClient();
const publishedAt = new Date("2026-01-15T08:00:00.000Z");

function requiredSeedSecret(name: "SEED_ADMIN_PASSWORD" | "SEED_REVIEWER_PASSWORD") {
  const value = process.env[name];
  if (!value || value.length < 12) {
    throw new Error(`${name} is required and must contain at least 12 characters.`);
  }
  return value;
}

function stableUuid(group: number, index: number) {
  return `${group.toString().padStart(8, "0")}-0000-4000-8000-${index.toString().padStart(12, "0")}`;
}

async function assertDemoSeedSafety(adminEmail: string, reviewerEmail: string) {
  const propertyCodes = Array.from({ length: 12 }, (_, index) => `ST-PROP-${String(index + 1).padStart(3, "0")}`);
  const projectSlugs = [
    "staria-heights",
    "pinnacle-tower",
    "trade-centre-one",
    "eco-business-park",
    "skyline-villa-retreat",
    "meridian-suite"
  ];
  const serviceSlugs = ["property-development", "property-brokerage", "interior-design", "investment-advisory"];
  const newsSlugs = [
    "staria-heights-reaches-full-handover",
    "pinnacle-tower-construction-update",
    "staria-launches-property-advisory-desk",
    "designing-better-shared-spaces"
  ];
  const clientSlugs = ["apex-holdings", "northstar-ventures", "rahman-family"];
  const settingKeys = ["company.name", "company.phone", "company.email", "company.address", "social.facebook", "demo.notice"];
  const categorySlugs = [
    "apartments",
    "villas",
    "commercial",
    "land",
    "residential-projects",
    "commercial-projects",
    "interior-projects",
    "property-services",
    "company-news"
  ];
  const amenitySlugs = [
    "swimming-pool",
    "fitness-centre",
    "dedicated-parking",
    "24-7-security",
    "high-speed-lift",
    "backup-generator",
    "rooftop-garden",
    "community-hall",
    "childrens-playground",
    "smart-home"
  ];
  const subscriberEmails = ["newsletter.one@example.com", "newsletter.two@example.com", "newsletter.three@example.com"];
  const addressIds = [
    ...Array.from({ length: 12 }, (_, index) => stableUuid(10, index + 1)),
    ...Array.from({ length: 6 }, (_, index) => stableUuid(20, index + 1))
  ];
  const clientContactIds = Array.from({ length: 3 }, (_, index) => stableUuid(41, index + 1));
  const stableIds = [
    ...Array.from({ length: 6 }, (_, index) => stableUuid(30, index + 1)),
    ...Array.from({ length: 3 }, (_, index) => stableUuid(42, index + 1)),
    ...Array.from({ length: 3 }, (_, index) => stableUuid(50, index + 1)),
    ...Array.from({ length: 4 }, (_, index) => stableUuid(70, index + 1)),
    stableUuid(60, 1)
  ];
  const checks = await Promise.all([
    prisma.adminUser.count({ where: { email: { in: [adminEmail, reviewerEmail] }, isDemo: false } }),
    prisma.property.count({ where: { referenceCode: { in: propertyCodes }, isDemo: false } }),
    prisma.project.count({ where: { slug: { in: projectSlugs }, isDemo: false } }),
    prisma.service.count({ where: { slug: { in: serviceSlugs }, isDemo: false } }),
    prisma.blogPost.count({ where: { slug: { in: newsSlugs }, isDemo: false } }),
    prisma.client.count({ where: { slug: { in: clientSlugs }, isDemo: false } }),
    prisma.clientContact.count({ where: { id: { in: clientContactIds }, isDemo: false } }),
    prisma.category.count({ where: { slug: { in: categorySlugs }, isDemo: false } }),
    prisma.amenity.count({ where: { slug: { in: amenitySlugs }, isDemo: false } }),
    prisma.address.count({ where: { id: { in: addressIds }, isDemo: false } }),
    prisma.websiteSetting.count({ where: { key: { in: settingKeys }, isDemo: false } }),
    prisma.newsletterSubscriber.count({ where: { email: { in: subscriberEmails }, isDemo: false } }),
    prisma.page.count({ where: { slug: "home", isDemo: false } }),
    prisma.download.count({ where: { slug: "company-profile", isDemo: false } }),
    prisma.faq.count({ where: { id: { in: stableIds }, isDemo: false } }),
    prisma.testimonial.count({ where: { id: { in: stableIds }, isDemo: false } }),
    prisma.contactMessage.count({ where: { id: { in: stableIds }, isDemo: false } }),
    prisma.companyStatistic.count({ where: { id: { in: stableIds }, isDemo: false } }),
    prisma.heroSlide.count({ where: { id: stableUuid(60, 1), isDemo: false } }),
    prisma.mediaAsset.count({ where: { cloudinaryPublicId: { startsWith: "staria/demo/" }, isDemo: false } })
  ]);
  const protectedRecordCount = checks.reduce((total, count) => total + count, 0);
  if (protectedRecordCount > 0) {
    throw new Error(
      `Demo seed stopped because ${protectedRecordCount} matching record(s) are marked as real data. ` +
        "Use different identifiers or explicitly convert those records back to demo before seeding."
    );
  }
}

async function upsertMedia(input: {
  publicId: string;
  secureUrl: string;
  resourceType?: MediaResourceType;
  format?: string;
  altText: string;
}) {
  return prisma.mediaAsset.upsert({
    where: { cloudinaryPublicId: input.publicId },
    update: {
      secureUrl: input.secureUrl,
      resourceType: input.resourceType ?? MediaResourceType.IMAGE,
      format: input.format ?? "jpg",
      altText: input.altText,
      folder: "staria/demo",
      isDemo: true,
      deletedAt: null
    },
    create: {
      cloudinaryPublicId: input.publicId,
      secureUrl: input.secureUrl,
      resourceType: input.resourceType ?? MediaResourceType.IMAGE,
      format: input.format ?? "jpg",
      altText: input.altText,
      folder: "staria/demo",
      isDemo: true
    }
  });
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "owner@staria.demo";
  const adminName = process.env.SEED_ADMIN_NAME ?? "Staria Demo Owner";
  const reviewerEmail = process.env.SEED_REVIEWER_EMAIL ?? "reviewer@staria.demo";
  const reviewerName = process.env.SEED_REVIEWER_NAME ?? "Shareholder Reviewer";
  const adminPassword = requiredSeedSecret("SEED_ADMIN_PASSWORD");
  const reviewerPassword = requiredSeedSecret("SEED_REVIEWER_PASSWORD");

  await assertDemoSeedSafety(adminEmail, reviewerEmail);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      emailVerifiedAt: publishedAt,
      status: RecordStatus.ACTIVE,
      isDemo: true,
      deletedAt: null
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      emailVerifiedAt: publishedAt,
      status: RecordStatus.ACTIVE,
      isDemo: true
    }
  });

  const reviewer = await prisma.adminUser.upsert({
    where: { email: reviewerEmail },
    update: {
      name: reviewerName,
      emailVerifiedAt: publishedAt,
      status: RecordStatus.ACTIVE,
      isDemo: true,
      deletedAt: null
    },
    create: {
      name: reviewerName,
      email: reviewerEmail,
      passwordHash: await hashPassword(reviewerPassword),
      emailVerifiedAt: publishedAt,
      status: RecordStatus.ACTIVE,
      isDemo: true
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
    { resource: "media", action: "read" },
    { resource: "media", action: "upload" },
    ...["categories", "properties", "projects", "services", "blog", "gallery", "testimonials", "certificates", "clients", "partners"].flatMap(
      (resource) => ["read", "create", "update", "delete"].map((action) => ({ resource, action }))
    ),
    ...["create", "read", "update", "delete", "publish", "manage"].map((action) => ({ resource: "content", action })),
    ...["read", "update", "delete"].map((action) => ({ resource: "inquiries", action })),
    ...["read", "create", "update", "assign", "export", "delete"].map((action) => ({ resource: "quotations", action })),
    ...["read", "create", "update", "delete"].map((action) => ({ resource: "applications", action })),
    ...["read", "update", "delete", "manage"].map((action) => ({ resource: "newsletter", action })),
    ...["read", "create", "update", "delete"].map((action) => ({ resource: "settings", action })),
    ...["careers", "contact", "downloads", "factories"].flatMap((resource) =>
      ["manage", "read", "create", "update", "delete"].map((action) => ({ resource, action }))
    ),
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
  const allNonSystemPermissions = permissionInputs
    .map((permission) => `${permission.resource}:${permission.action}`)
    .filter((key) => !["*:*", "admins:manage", "roles:manage", "permissions:manage"].includes(key));
  const reviewerPermissions = [
    "dashboard:read",
    "media:read",
    "categories:read",
    "properties:read",
    "projects:read",
    "services:read",
    "blog:read",
    "gallery:read",
    "testimonials:read",
    "clients:read",
    "partners:read",
    "content:read",
    "inquiries:read",
    "contact:read",
    "newsletter:read",
    "settings:read",
    "downloads:read"
  ];
  const roleDefinitions = [
    { name: "Owner", slug: "owner", description: "Business owner with unrestricted access", permissionKeys: ["*:*"] },
    { name: "Super Admin", slug: "super-admin", description: "Full operational administrative access", permissionKeys: ["*:*"] },
    {
      name: "Manager",
      slug: "manager",
      description: "Manages website content, sales operations and reporting",
      permissionKeys: allNonSystemPermissions
    },
    {
      name: "Content Editor",
      slug: "content-editor",
      description: "Creates and updates public website content",
      permissionKeys: allNonSystemPermissions.filter(
        (key) =>
          !key.startsWith("inquiries:") &&
          !key.startsWith("quotations:") &&
          !key.startsWith("applications:") &&
          !key.startsWith("newsletter:")
      )
    },
    {
      name: "Sales Executive",
      slug: "sales-executive",
      description: "Handles inquiries, quotation requests and newsletter leads",
      permissionKeys: allNonSystemPermissions.filter(
        (key) =>
          key === "dashboard:read" ||
          key.startsWith("inquiries:") ||
          key.startsWith("quotations:") ||
          key.startsWith("applications:") ||
          key.startsWith("contact:") ||
          key.startsWith("newsletter:")
      )
    },
    {
      name: "Reviewer",
      slug: "reviewer",
      description: "Read-only access for demo reviewers and shareholders",
      permissionKeys: reviewerPermissions
    }
  ];

  const roles = await Promise.all(
    roleDefinitions.map((role) =>
      prisma.role.upsert({
        where: { slug: role.slug },
        update: { name: role.name, description: role.description, isSystem: true },
        create: { name: role.name, slug: role.slug, description: role.description, isSystem: true }
      })
    )
  );

  await Promise.all(
    roleDefinitions.flatMap((definition) => {
      const role = roles.find((candidate) => candidate.slug === definition.slug);
      if (!role) throw new Error(`Role was not seeded: ${definition.slug}`);
      return definition.permissionKeys.map((permissionKey) => {
        const permission = permissionsByKey.get(permissionKey);
        if (!permission) throw new Error(`Permission was not seeded: ${permissionKey}`);
        return prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
          update: {},
          create: { roleId: role.id, permissionId: permission.id }
        });
      });
    })
  );

  const ownerRole = roles.find((role) => role.slug === "owner");
  const reviewerRole = roles.find((role) => role.slug === "reviewer");
  if (!ownerRole || !reviewerRole) throw new Error("Required demo roles were not seeded.");
  await Promise.all([
    prisma.adminUserRole.upsert({
      where: { adminUserId_roleId: { adminUserId: admin.id, roleId: ownerRole.id } },
      update: {},
      create: { adminUserId: admin.id, roleId: ownerRole.id }
    }),
    prisma.adminUserRole.upsert({
      where: { adminUserId_roleId: { adminUserId: reviewer.id, roleId: reviewerRole.id } },
      update: {},
      create: { adminUserId: reviewer.id, roleId: reviewerRole.id }
    })
  ]);

  const categoryInputs = [
    [CategoryType.PROPERTY, "Apartments", "apartments", "Premium apartments and penthouses"],
    [CategoryType.PROPERTY, "Villas", "villas", "Independent villas and luxury homes"],
    [CategoryType.PROPERTY, "Commercial", "commercial", "Commercial buildings and office spaces"],
    [CategoryType.PROPERTY, "Land", "land", "Residential and investment land"],
    [CategoryType.PROJECT, "Residential Projects", "residential-projects", "Residential development portfolio"],
    [CategoryType.PROJECT, "Commercial Projects", "commercial-projects", "Commercial development portfolio"],
    [CategoryType.PROJECT, "Interior Projects", "interior-projects", "Interior design and fit-out portfolio"],
    [CategoryType.SERVICE, "Property Services", "property-services", "End-to-end real estate services"],
    [CategoryType.BLOG, "Company News", "company-news", "News and announcements from Staria Properties"]
  ] as const;
  const categories = new Map<string, Awaited<ReturnType<typeof prisma.category.upsert>>>();
  for (const [categoryType, name, slug, description] of categoryInputs) {
    const category = await prisma.category.upsert({
      where: { categoryType_slug: { categoryType, slug } },
      update: { name, description, status: RecordStatus.ACTIVE, isDemo: true, deletedAt: null },
      create: { categoryType, name, slug, description, status: RecordStatus.ACTIVE, isDemo: true }
    });
    categories.set(`${categoryType}:${slug}`, category);
  }

  const amenityInputs = [
    ["Swimming Pool", "swimming-pool", "waves"],
    ["Fitness Centre", "fitness-centre", "dumbbell"],
    ["Dedicated Parking", "dedicated-parking", "car"],
    ["24/7 Security", "24-7-security", "shield-check"],
    ["High-speed Lift", "high-speed-lift", "arrow-up-down"],
    ["Backup Generator", "backup-generator", "zap"],
    ["Rooftop Garden", "rooftop-garden", "trees"],
    ["Community Hall", "community-hall", "users"],
    ["Children's Playground", "childrens-playground", "baby"],
    ["Smart Home", "smart-home", "house-plug"]
  ] as const;
  const amenities = new Map<string, Awaited<ReturnType<typeof prisma.amenity.upsert>>>();
  for (const [name, slug, icon] of amenityInputs) {
    const amenity = await prisma.amenity.upsert({
      where: { slug },
      update: { name, icon, status: RecordStatus.ACTIVE, isDemo: true },
      create: { name, slug, icon, status: RecordStatus.ACTIVE, isDemo: true }
    });
    amenities.set(slug, amenity);
  }

  const projectInputs = [
    {
      title: "Staria Heights",
      slug: "staria-heights",
      location: "Road 71, Gulshan 2",
      city: "Dhaka",
      category: "residential-projects",
      developmentStatus: ProjectDevelopmentStatus.COMPLETED,
      completionPercent: 100,
      summary: "A landmark collection of premium residences in the heart of Gulshan.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
      amenities: ["fitness-centre", "dedicated-parking", "24-7-security", "high-speed-lift", "backup-generator"],
      featured: true
    },
    {
      title: "Pinnacle Tower",
      slug: "pinnacle-tower",
      location: "Kemal Ataturk Avenue, Banani",
      city: "Dhaka",
      category: "residential-projects",
      developmentStatus: ProjectDevelopmentStatus.ONGOING,
      completionPercent: 65,
      summary: "Contemporary urban residences with thoughtful shared amenities.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
      amenities: ["swimming-pool", "fitness-centre", "24-7-security", "rooftop-garden"],
      featured: true
    },
    {
      title: "Trade Centre One",
      slug: "trade-centre-one",
      location: "Dilkusha Commercial Area, Motijheel",
      city: "Dhaka",
      category: "commercial-projects",
      developmentStatus: ProjectDevelopmentStatus.COMPLETED,
      completionPercent: 100,
      summary: "Grade-A commercial floors designed for ambitious businesses.",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85",
      amenities: ["dedicated-parking", "24-7-security", "high-speed-lift", "backup-generator"],
      featured: true
    },
    {
      title: "Eco Business Park",
      slug: "eco-business-park",
      location: "Sector 18, Uttara",
      city: "Dhaka",
      category: "commercial-projects",
      developmentStatus: ProjectDevelopmentStatus.UPCOMING,
      completionPercent: 10,
      summary: "A future-ready business campus with energy-conscious design.",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=85",
      amenities: ["dedicated-parking", "24-7-security", "backup-generator", "rooftop-garden"],
      featured: false
    },
    {
      title: "Skyline Villa Retreat",
      slug: "skyline-villa-retreat",
      location: "Block K, Bashundhara R/A",
      city: "Dhaka",
      category: "residential-projects",
      developmentStatus: ProjectDevelopmentStatus.ONGOING,
      completionPercent: 45,
      summary: "A private enclave of spacious family villas surrounded by greenery.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      amenities: ["swimming-pool", "dedicated-parking", "24-7-security", "childrens-playground", "smart-home"],
      featured: false
    },
    {
      title: "Meridian Suite",
      slug: "meridian-suite",
      location: "Road 12A, Dhanmondi",
      city: "Dhaka",
      category: "interior-projects",
      developmentStatus: ProjectDevelopmentStatus.COMPLETED,
      completionPercent: 100,
      summary: "A refined residential interior shaped around comfort and natural light.",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85",
      amenities: ["smart-home", "backup-generator"],
      featured: false
    }
  ];
  const projects = new Map<string, Awaited<ReturnType<typeof prisma.project.upsert>>>();
  for (const [index, input] of projectInputs.entries()) {
    const address = await prisma.address.upsert({
      where: { id: stableUuid(20, index + 1) },
      update: { line1: input.location, city: input.city, country: "Bangladesh", isDemo: true },
      create: { id: stableUuid(20, index + 1), line1: input.location, city: input.city, country: "Bangladesh", isDemo: true }
    });
    const category = categories.get(`${CategoryType.PROJECT}:${input.category}`);
    if (!category) throw new Error(`Missing project category: ${input.category}`);
    const project = await prisma.project.upsert({
      where: { slug: input.slug },
      update: {
        categoryId: category.id,
        addressId: address.id,
        title: input.title,
        summary: input.summary,
        description: `${input.summary} This is representative demo content and can be replaced from the admin dashboard before public launch.`,
        developmentStatus: input.developmentStatus,
        completionPercent: input.completionPercent,
        status: ContentStatus.PUBLISHED,
        isFeatured: input.featured,
        isDemo: true,
        sortOrder: index,
        publishedAt,
        deletedAt: null
      },
      create: {
        categoryId: category.id,
        addressId: address.id,
        title: input.title,
        slug: input.slug,
        summary: input.summary,
        description: `${input.summary} This is representative demo content and can be replaced from the admin dashboard before public launch.`,
        developmentStatus: input.developmentStatus,
        completionPercent: input.completionPercent,
        status: ContentStatus.PUBLISHED,
        isFeatured: input.featured,
        isDemo: true,
        sortOrder: index,
        publishedAt
      }
    });
    projects.set(input.slug, project);
    const media = await upsertMedia({
      publicId: `staria/demo/projects/${input.slug}`,
      secureUrl: input.image,
      altText: `${input.title} demo project`
    });
    await prisma.projectMedia.upsert({
      where: { projectId_mediaId_role: { projectId: project.id, mediaId: media.id, role: MediaUsageRole.PRIMARY } },
      update: { sortOrder: 0 },
      create: { projectId: project.id, mediaId: media.id, role: MediaUsageRole.PRIMARY, sortOrder: 0 }
    });
    for (const amenitySlug of input.amenities) {
      const amenity = amenities.get(amenitySlug);
      if (!amenity) throw new Error(`Missing amenity: ${amenitySlug}`);
      await prisma.projectAmenity.upsert({
        where: { projectId_amenityId: { projectId: project.id, amenityId: amenity.id } },
        update: {},
        create: { projectId: project.id, amenityId: amenity.id }
      });
    }
  }

  const propertyInputs = [
    ["ST-PROP-001", "Staria Heights Penthouse", "staria-heights-penthouse", "Road 71, Gulshan 2", "Dhaka", "apartments", "staria-heights", PropertyListingType.SALE, 42000000, "BDT 4.20 crore", 4, 4, 3200, FurnishingStatus.FURNISHED, true, "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85"],
    ["ST-PROP-002", "Garden Villa Bashundhara", "garden-villa-bashundhara", "Block K, Bashundhara R/A", "Dhaka", "villas", "skyline-villa-retreat", PropertyListingType.SALE, 78000000, "BDT 7.80 crore", 5, 5, 5800, FurnishingStatus.SEMI_FURNISHED, true, "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85"],
    ["ST-PROP-003", "Commerce One Full Floor", "commerce-one-full-floor", "Dilkusha Commercial Area, Motijheel", "Dhaka", "commercial", "trade-centre-one", PropertyListingType.SALE, 150000000, "BDT 15 crore", 0, 4, 18000, FurnishingStatus.UNFURNISHED, true, "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85"],
    ["ST-PROP-004", "Skyview Residency", "skyview-residency-banani", "Road 11, Banani", "Dhaka", "apartments", "pinnacle-tower", PropertyListingType.SALE, 29000000, "BDT 2.90 crore", 3, 3, 1950, FurnishingStatus.SEMI_FURNISHED, true, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=85"],
    ["ST-PROP-005", "Vista Villa Chattogram", "vista-villa-chattogram", "Khulshi Residential Area", "Chattogram", "villas", null, PropertyListingType.SALE, 65000000, "BDT 6.50 crore", 4, 4, 4200, FurnishingStatus.FURNISHED, false, "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=85"],
    ["ST-PROP-006", "Gulshan Business Hub", "gulshan-business-hub", "Gulshan Avenue", "Dhaka", "commercial", null, PropertyListingType.SALE, 220000000, "BDT 22 crore", 0, 8, 22000, FurnishingStatus.SEMI_FURNISHED, true, "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85"],
    ["ST-PROP-007", "Gulshan Lake Apartment", "gulshan-lake-apartment", "Road 103, Gulshan 2", "Dhaka", "apartments", null, PropertyListingType.SALE, 36000000, "BDT 3.60 crore", 4, 4, 2750, FurnishingStatus.FURNISHED, false, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85"],
    ["ST-PROP-008", "Uttara Family Apartment", "uttara-family-apartment", "Sector 13, Uttara", "Dhaka", "apartments", null, PropertyListingType.SALE, 18500000, "BDT 1.85 crore", 3, 3, 1650, FurnishingStatus.SEMI_FURNISHED, false, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=85"],
    ["ST-PROP-009", "Dhanmondi Corporate Office", "dhanmondi-corporate-office", "Satmasjid Road, Dhanmondi", "Dhaka", "commercial", null, PropertyListingType.LEASE, 350000, "BDT 350,000 / month", 0, 3, 4200, FurnishingStatus.FURNISHED, false, "https://images.unsplash.com/photo-1497366753845-e733c3e0ef87?auto=format&fit=crop&w=1600&q=85"],
    ["ST-PROP-010", "Bashundhara Corner Plot", "bashundhara-corner-plot", "Block M, Bashundhara R/A", "Dhaka", "land", null, PropertyListingType.SALE, 52000000, "BDT 5.20 crore", 0, 0, 7200, FurnishingStatus.UNFURNISHED, false, "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85"],
    ["ST-PROP-011", "Banani Executive Apartment", "banani-executive-apartment", "Road 17, Banani", "Dhaka", "apartments", null, PropertyListingType.RENT, 240000, "BDT 240,000 / month", 3, 3, 2200, FurnishingStatus.FURNISHED, false, "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1600&q=85"],
    ["ST-PROP-012", "Sylhet Garden Residence", "sylhet-garden-residence", "Shahjalal Uposhahar", "Sylhet", "villas", null, PropertyListingType.SALE, 48000000, "BDT 4.80 crore", 4, 4, 3900, FurnishingStatus.SEMI_FURNISHED, false, "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85"]
  ] as const;
  for (const [index, input] of propertyInputs.entries()) {
    const [referenceCode, title, slug, line1, city, categorySlug, projectSlug, listingType, price, priceLabel, bedrooms, bathrooms, areaSqft, furnishing, featured, image] = input;
    const address = await prisma.address.upsert({
      where: { id: stableUuid(10, index + 1) },
      update: { line1, city, country: "Bangladesh", isDemo: true },
      create: { id: stableUuid(10, index + 1), line1, city, country: "Bangladesh", isDemo: true }
    });
    const project = projectSlug ? projects.get(projectSlug) : undefined;
    const property = await prisma.property.upsert({
      where: { referenceCode },
      update: {
        projectId: project?.id ?? null,
        addressId: address.id,
        title,
        slug,
        shortDescription: `${title} is a curated ${listingType.toLowerCase()} opportunity in ${city}.`,
        description: "Representative demo listing with realistic information for stakeholder review. Replace with verified property data before public launch.",
        listingType,
        availability: PropertyAvailability.AVAILABLE,
        price,
        priceLabel,
        bedrooms: bedrooms || null,
        bathrooms: bathrooms || null,
        areaSqft,
        furnishing,
        status: ContentStatus.PUBLISHED,
        isFeatured: featured,
        isDemo: true,
        sortOrder: index,
        publishedAt,
        deletedAt: null
      },
      create: {
        referenceCode,
        projectId: project?.id,
        addressId: address.id,
        title,
        slug,
        shortDescription: `${title} is a curated ${listingType.toLowerCase()} opportunity in ${city}.`,
        description: "Representative demo listing with realistic information for stakeholder review. Replace with verified property data before public launch.",
        listingType,
        availability: PropertyAvailability.AVAILABLE,
        price,
        priceLabel,
        bedrooms: bedrooms || undefined,
        bathrooms: bathrooms || undefined,
        areaSqft,
        furnishing,
        status: ContentStatus.PUBLISHED,
        isFeatured: featured,
        isDemo: true,
        sortOrder: index,
        publishedAt
      }
    });
    const category = categories.get(`${CategoryType.PROPERTY}:${categorySlug}`);
    if (!category) throw new Error(`Missing property category: ${categorySlug}`);
    await prisma.propertyCategory.upsert({
      where: { propertyId_categoryId: { propertyId: property.id, categoryId: category.id } },
      update: { isPrimary: true },
      create: { propertyId: property.id, categoryId: category.id, isPrimary: true }
    });
    const media = await upsertMedia({ publicId: `staria/demo/properties/${slug}`, secureUrl: image, altText: `${title} demo property` });
    await prisma.propertyMedia.upsert({
      where: { propertyId_mediaId_role: { propertyId: property.id, mediaId: media.id, role: MediaUsageRole.PRIMARY } },
      update: { sortOrder: 0 },
      create: { propertyId: property.id, mediaId: media.id, role: MediaUsageRole.PRIMARY, sortOrder: 0 }
    });
    const propertyAmenities = categorySlug === "land" ? ["24-7-security"] : ["dedicated-parking", "24-7-security", "backup-generator"];
    for (const amenitySlug of propertyAmenities) {
      const amenity = amenities.get(amenitySlug);
      if (!amenity) throw new Error(`Missing amenity: ${amenitySlug}`);
      await prisma.propertyAmenity.upsert({
        where: { propertyId_amenityId: { propertyId: property.id, amenityId: amenity.id } },
        update: {},
        create: { propertyId: property.id, amenityId: amenity.id }
      });
    }
  }

  const serviceCategory = categories.get(`${CategoryType.SERVICE}:property-services`);
  if (!serviceCategory) throw new Error("Missing service category.");
  const serviceInputs = [
    ["Property Development", "property-development", "From land assessment to design, construction and handover.", "building-2"],
    ["Property Brokerage", "property-brokerage", "Buyer and seller representation backed by local market knowledge.", "handshake"],
    ["Interior Design", "interior-design", "Functional, refined residential and commercial interior solutions.", "sofa"],
    ["Investment Advisory", "investment-advisory", "Clear property investment analysis for better-informed decisions.", "chart-no-axes-combined"]
  ] as const;
  for (const [index, [title, slug, summary, icon]] of serviceInputs.entries()) {
    await prisma.service.upsert({
      where: { slug },
      update: {
        categoryId: serviceCategory.id,
        title,
        summary,
        description: `${summary} This service description is demo content for stakeholder review.`,
        icon,
        status: ContentStatus.PUBLISHED,
        isFeatured: index < 3,
        isDemo: true,
        sortOrder: index,
        publishedAt,
        deletedAt: null
      },
      create: {
        categoryId: serviceCategory.id,
        title,
        slug,
        summary,
        description: `${summary} This service description is demo content for stakeholder review.`,
        icon,
        status: ContentStatus.PUBLISHED,
        isFeatured: index < 3,
        isDemo: true,
        sortOrder: index,
        publishedAt
      }
    });
  }

  const heroImage = await upsertMedia({
    publicId: "staria/demo/hero/home",
    secureUrl: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=2000&q=90",
    altText: "Contemporary Staria property"
  });
  const homePage = await prisma.page.upsert({
    where: { slug: "home" },
    update: { title: "Home", pageType: PageType.HOME, status: ContentStatus.PUBLISHED, isDemo: true, publishedAt, deletedAt: null },
    create: { title: "Home", slug: "home", pageType: PageType.HOME, status: ContentStatus.PUBLISHED, isDemo: true, publishedAt }
  });
  await prisma.heroSlide.upsert({
    where: { id: stableUuid(60, 1) },
    update: {
      pageId: homePage.id,
      mediaId: heroImage.id,
      eyebrow: "Staria Properties",
      title: "Exceptional Properties. Enduring Value.",
      subtitle: "Development, brokerage, interiors and investment advisory across Bangladesh.",
      ctaLabel: "Explore Properties",
      ctaUrl: "/properties",
      status: ContentStatus.PUBLISHED,
      isDemo: true,
      sortOrder: 0,
      publishedAt,
      deletedAt: null
    },
    create: {
      id: stableUuid(60, 1),
      pageId: homePage.id,
      mediaId: heroImage.id,
      eyebrow: "Staria Properties",
      title: "Exceptional Properties. Enduring Value.",
      subtitle: "Development, brokerage, interiors and investment advisory across Bangladesh.",
      ctaLabel: "Explore Properties",
      ctaUrl: "/properties",
      status: ContentStatus.PUBLISHED,
      isDemo: true,
      sortOrder: 0,
      publishedAt
    }
  });

  const statistics = [
    ["Years of Experience", 12, "+", "Combined leadership experience"],
    ["Completed Projects", 28, "+", "Residential and commercial"],
    ["Happy Clients", 350, "+", "Across Bangladesh"],
    ["Properties Managed", 1.2, "M sqft", "Representative demo metric"]
  ] as const;
  for (const [index, [label, value, suffix, note]] of statistics.entries()) {
    await prisma.companyStatistic.upsert({
      where: { id: stableUuid(70, index + 1) },
      update: { label, value, suffix, note, status: RecordStatus.ACTIVE, isDemo: true, sortOrder: index, deletedAt: null },
      create: { id: stableUuid(70, index + 1), label, value, suffix, note, status: RecordStatus.ACTIVE, isDemo: true, sortOrder: index }
    });
  }

  const clientInputs = [
    ["Apex Holdings", "apex-holdings", "Nafisa Rahman", "Director"],
    ["Northstar Ventures", "northstar-ventures", "Tanvir Ahmed", "Managing Partner"],
    ["Rahman Family", "rahman-family", "Imran Rahman", "Homeowner"]
  ] as const;
  const testimonialQuotes = [
    "The Staria team gave us clear options, realistic timelines and dependable support from first meeting to handover.",
    "Their commercial property advice was practical and evidence-led. The process felt structured at every stage.",
    "We appreciated the attention to detail and the way every decision was explained in plain language."
  ];
  for (const [index, [clientName, clientSlug, contactName, designation]] of clientInputs.entries()) {
    const client = await prisma.client.upsert({
      where: { slug: clientSlug },
      update: { name: clientName, description: "Demo client profile", status: RecordStatus.ACTIVE, isDemo: true, sortOrder: index, deletedAt: null },
      create: { id: stableUuid(40, index + 1), name: clientName, slug: clientSlug, description: "Demo client profile", status: RecordStatus.ACTIVE, isDemo: true, sortOrder: index }
    });
    const contact = await prisma.clientContact.upsert({
      where: { id: stableUuid(41, index + 1) },
      update: { clientId: client.id, name: contactName, designation, isDemo: true, deletedAt: null },
      create: { id: stableUuid(41, index + 1), clientId: client.id, name: contactName, designation, isDemo: true }
    });
    await prisma.testimonial.upsert({
      where: { id: stableUuid(42, index + 1) },
      update: {
        clientId: client.id,
        clientContactId: contact.id,
        quote: testimonialQuotes[index],
        rating: 5,
        status: ContentStatus.PUBLISHED,
        isFeatured: true,
        isDemo: true,
        sortOrder: index,
        publishedAt,
        deletedAt: null
      },
      create: {
        id: stableUuid(42, index + 1),
        clientId: client.id,
        clientContactId: contact.id,
        quote: testimonialQuotes[index],
        rating: 5,
        status: ContentStatus.PUBLISHED,
        isFeatured: true,
        isDemo: true,
        sortOrder: index,
        publishedAt
      }
    });
  }

  const faqInputs = [
    ["Buying", "How do I arrange a property viewing?", "Use the enquiry form on any property page. A team member will confirm a suitable time.", true],
    ["Buying", "Can Staria help with legal verification?", "Yes. We can coordinate document review with qualified legal professionals before a transaction.", true],
    ["Selling", "Can I list my property with Staria?", "Yes. Submit the contact form with basic property details and the brokerage team will follow up.", false],
    ["Projects", "Are project completion dates guaranteed?", "Published dates are current estimates. Contract documents contain the authoritative delivery terms.", false],
    ["Payments", "Are the prices on this demo final?", "No. All current listings and prices are representative demo data until the production data is published.", true],
    ["Privacy", "How is my enquiry information used?", "Enquiry information is used to respond to your request and is handled according to the website privacy notice.", false]
  ] as const;
  for (const [index, [group, question, answer, isFeatured]] of faqInputs.entries()) {
    await prisma.faq.upsert({
      where: { id: stableUuid(30, index + 1) },
      update: { group, question, answer, status: ContentStatus.PUBLISHED, isFeatured, isDemo: true, sortOrder: index, publishedAt, deletedAt: null },
      create: { id: stableUuid(30, index + 1), group, question, answer, status: ContentStatus.PUBLISHED, isFeatured, isDemo: true, sortOrder: index, publishedAt }
    });
  }

  const newsCategory = categories.get(`${CategoryType.BLOG}:company-news`);
  if (!newsCategory) throw new Error("Missing news category.");
  const newsInputs = [
    ["Staria Heights Reaches Full Handover", "staria-heights-reaches-full-handover", "The final residences at Staria Heights have completed the handover milestone."],
    ["Pinnacle Tower Construction Update", "pinnacle-tower-construction-update", "Structural work continues on schedule at the Banani development."],
    ["Staria Launches Property Advisory Desk", "staria-launches-property-advisory-desk", "A new advisory service will help buyers compare residential and commercial opportunities."],
    ["Designing Better Shared Spaces", "designing-better-shared-spaces", "The project team shares the principles guiding community facilities in new developments."]
  ] as const;
  for (const [index, [title, slug, excerpt]] of newsInputs.entries()) {
    await prisma.blogPost.upsert({
      where: { slug },
      update: {
        categoryId: newsCategory.id,
        authorId: admin.id,
        postType: PostType.NEWS,
        title,
        excerpt,
        body: `${excerpt}\n\nThis is demo editorial content prepared for stakeholder review and will be replaced or verified before public launch.`,
        status: ContentStatus.PUBLISHED,
        isFeatured: index === 0,
        isDemo: true,
        publishedAt,
        deletedAt: null
      },
      create: {
        categoryId: newsCategory.id,
        authorId: admin.id,
        postType: PostType.NEWS,
        title,
        slug,
        excerpt,
        body: `${excerpt}\n\nThis is demo editorial content prepared for stakeholder review and will be replaced or verified before public launch.`,
        status: ContentStatus.PUBLISHED,
        isFeatured: index === 0,
        isDemo: true,
        publishedAt
      }
    });
  }

  const messages = [
    ["Farhana Islam", "farhana@example.com", "+8801700000001", "Viewing request", "I would like to arrange a viewing for the Gulshan Lake Apartment.", InquiryStatus.NEW],
    ["Mahmud Hasan", "mahmud@example.com", "+8801700000002", "Commercial space enquiry", "Please share floor plans and payment terms for Trade Centre One.", InquiryStatus.ASSIGNED],
    ["Samira Chowdhury", "samira@example.com", "+8801700000003", "Investment consultation", "I am comparing residential investment options in Dhaka.", InquiryStatus.RESPONDED]
  ] as const;
  for (const [index, [fullName, email, phone, subject, message, status]] of messages.entries()) {
    await prisma.contactMessage.upsert({
      where: { id: stableUuid(50, index + 1) },
      update: { assignedToId: status === InquiryStatus.NEW ? null : admin.id, fullName, email, phone, subject, message, source: "demo-seed", status, consentAccepted: true, isDemo: true, deletedAt: null },
      create: { id: stableUuid(50, index + 1), assignedToId: status === InquiryStatus.NEW ? undefined : admin.id, fullName, email, phone, subject, message, source: "demo-seed", status, consentAccepted: true, isDemo: true }
    });
  }

  const subscribers = [
    ["newsletter.one@example.com", "Arif Khan"],
    ["newsletter.two@example.com", "Maliha Sultana"],
    ["newsletter.three@example.com", "Rashed Karim"]
  ] as const;
  for (const [email, fullName] of subscribers) {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { fullName, status: NewsletterStatus.SUBSCRIBED, source: "demo-seed", consentAccepted: true, isDemo: true, deletedAt: null },
      create: { email, fullName, status: NewsletterStatus.SUBSCRIBED, source: "demo-seed", consentAccepted: true, isDemo: true, subscribedAt: publishedAt }
    });
  }

  const settingInputs = [
    ["company", "company.name", "Staria Properties"],
    ["company", "company.phone", "+880 1700-000000"],
    ["company", "company.email", "hello@staria.demo"],
    ["company", "company.address", "Gulshan Avenue, Dhaka, Bangladesh"],
    ["social", "social.facebook", "https://www.facebook.com/stariaproperties"],
    ["demo", "demo.notice", "This website currently contains representative demo data for stakeholder review."]
  ] as const;
  for (const [group, key, value] of settingInputs) {
    await prisma.websiteSetting.upsert({
      where: { key },
      update: { group, value, updatedById: admin.id, status: ContentStatus.PUBLISHED, isDemo: true, deletedAt: null },
      create: { group, key, value, updatedById: admin.id, status: ContentStatus.PUBLISHED, isDemo: true }
    });
  }

  const profilePdf = await upsertMedia({
    publicId: "staria/demo/downloads/company-profile",
    secureUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    resourceType: MediaResourceType.PDF,
    format: "pdf",
    altText: "Demo Staria company profile"
  });
  await prisma.download.upsert({
    where: { slug: "company-profile" },
    update: {
      title: "Company Profile",
      description: "Representative company profile for demo review.",
      fileMediaId: profilePdf.id,
      status: ContentStatus.PUBLISHED,
      isDemo: true,
      publishedAt,
      deletedAt: null
    },
    create: {
      title: "Company Profile",
      slug: "company-profile",
      description: "Representative company profile for demo review.",
      fileMediaId: profilePdf.id,
      status: ContentStatus.PUBLISHED,
      isDemo: true,
      publishedAt
    }
  });

  await prisma.measurementUnit.upsert({
    where: { code: "UNIT" },
    update: { name: "Unit", status: RecordStatus.ACTIVE },
    create: { name: "Unit", code: "UNIT", status: RecordStatus.ACTIVE }
  });

  console.log(
    `Demo seed complete: ${propertyInputs.length} properties, ${projectInputs.length} projects, ${faqInputs.length} FAQs, ${newsInputs.length} news posts, 2 admin accounts.`
  );
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
