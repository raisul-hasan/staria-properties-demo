import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const counts = {
    properties: await prisma.property.count({ where: { isDemo: true } }),
    projects: await prisma.project.count({ where: { isDemo: true } }),
    services: await prisma.service.count({ where: { isDemo: true } }),
    faqs: await prisma.faq.count({ where: { isDemo: true } }),
    news: await prisma.blogPost.count({ where: { isDemo: true, postType: "NEWS" } }),
    testimonials: await prisma.testimonial.count({ where: { isDemo: true } }),
    enquiries: await prisma.contactMessage.count({ where: { isDemo: true } }),
    subscribers: await prisma.newsletterSubscriber.count({ where: { isDemo: true } }),
    demoAdmins: await prisma.adminUser.count({ where: { isDemo: true } })
  };
  const minimums: Record<keyof typeof counts, number> = {
    properties: 12,
    projects: 6,
    services: 4,
    faqs: 6,
    news: 4,
    testimonials: 3,
    enquiries: 3,
    subscribers: 3,
    demoAdmins: 2
  };
  const failures = Object.entries(minimums)
    .filter(([key, minimum]) => counts[key as keyof typeof counts] < minimum)
    .map(([key, minimum]) => `${key}: expected at least ${minimum}, found ${counts[key as keyof typeof counts]}`);

  console.table(counts);
  if (failures.length) {
    throw new Error(`Demo seed verification failed:\n${failures.join("\n")}`);
  }
  console.log("Demo seed verification passed.");
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
