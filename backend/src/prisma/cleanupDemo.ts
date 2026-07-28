import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const confirmation = "DELETE_STARIA_DEMO_DATA";

async function main() {
  if (process.env.CONFIRM_DEMO_CLEANUP !== confirmation) {
    throw new Error(`Refusing to delete demo data. Set CONFIRM_DEMO_CLEANUP=${confirmation} for this command only.`);
  }

  const result = await prisma.$transaction(async (tx) => {
    const counts: Record<string, number> = {};
    counts.contactMessages = (await tx.contactMessage.deleteMany({ where: { isDemo: true } })).count;
    counts.newsletterSubscribers = (await tx.newsletterSubscriber.deleteMany({ where: { isDemo: true } })).count;
    counts.faqs = (await tx.faq.deleteMany({ where: { isDemo: true } })).count;
    counts.blogPosts = (await tx.blogPost.deleteMany({ where: { isDemo: true } })).count;
    counts.testimonials = (await tx.testimonial.deleteMany({ where: { isDemo: true } })).count;
    counts.clientContacts = (await tx.clientContact.deleteMany({ where: { isDemo: true } })).count;
    counts.clients = (await tx.client.deleteMany({ where: { isDemo: true } })).count;
    counts.downloads = (await tx.download.deleteMany({ where: { isDemo: true } })).count;
    counts.heroSlides = (await tx.heroSlide.deleteMany({ where: { isDemo: true } })).count;
    counts.pages = (await tx.page.deleteMany({ where: { isDemo: true } })).count;
    counts.properties = (await tx.property.deleteMany({ where: { isDemo: true } })).count;
    counts.projects = (await tx.project.deleteMany({ where: { isDemo: true } })).count;
    counts.services = (await tx.service.deleteMany({ where: { isDemo: true } })).count;
    counts.companyStatistics = (await tx.companyStatistic.deleteMany({ where: { isDemo: true } })).count;
    counts.websiteSettings = (await tx.websiteSetting.deleteMany({ where: { isDemo: true } })).count;
    counts.categories = (await tx.category.deleteMany({ where: { isDemo: true } })).count;
    counts.amenities = (await tx.amenity.deleteMany({ where: { isDemo: true } })).count;
    counts.addresses = (await tx.address.deleteMany({ where: { isDemo: true } })).count;
    counts.mediaAssets = (await tx.mediaAsset.deleteMany({ where: { isDemo: true } })).count;
    counts.adminUsers = (await tx.adminUser.deleteMany({ where: { isDemo: true } })).count;
    return counts;
  });

  console.log("Demo cleanup complete.");
  console.table(result);
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
