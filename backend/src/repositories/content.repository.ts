import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class NewsRepository {
  findMany(args: Prisma.NewsArticleFindManyArgs) {
    return prisma.newsArticle.findMany(args);
  }

  count(where: Prisma.NewsArticleWhereInput) {
    return prisma.newsArticle.count({ where });
  }

  findBySlug(slug: string, publishedOnly = true) {
    return prisma.newsArticle.findFirst({
      where: { slug, ...(publishedOnly ? { isPublished: true } : {}) }
    });
  }

  findById(id: string) {
    return prisma.newsArticle.findUnique({ where: { id } });
  }

  create(data: Prisma.NewsArticleCreateInput) {
    return prisma.newsArticle.create({ data });
  }

  update(id: string, data: Prisma.NewsArticleUpdateInput) {
    return prisma.newsArticle.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.newsArticle.delete({ where: { id } });
  }
}

export class FaqRepository {
  findMany(args: Prisma.FaqFindManyArgs) {
    return prisma.faq.findMany(args);
  }

  count(where: Prisma.FaqWhereInput) {
    return prisma.faq.count({ where });
  }

  findById(id: string) {
    return prisma.faq.findUnique({ where: { id } });
  }

  create(data: Prisma.FaqCreateInput) {
    return prisma.faq.create({ data });
  }

  update(id: string, data: Prisma.FaqUpdateInput) {
    return prisma.faq.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.faq.delete({ where: { id } });
  }
}

export class TestimonialRepository {
  findMany(args: Prisma.TestimonialFindManyArgs) {
    return prisma.testimonial.findMany(args);
  }

  count(where: Prisma.TestimonialWhereInput) {
    return prisma.testimonial.count({ where });
  }

  findById(id: string) {
    return prisma.testimonial.findUnique({ where: { id } });
  }

  create(data: Prisma.TestimonialCreateInput) {
    return prisma.testimonial.create({ data });
  }

  update(id: string, data: Prisma.TestimonialUpdateInput) {
    return prisma.testimonial.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.testimonial.delete({ where: { id } });
  }
}

export class InteriorPortfolioRepository {
  findMany(args: Prisma.InteriorPortfolioItemFindManyArgs) {
    return prisma.interiorPortfolioItem.findMany(args);
  }

  count(where: Prisma.InteriorPortfolioItemWhereInput) {
    return prisma.interiorPortfolioItem.count({ where });
  }

  findById(id: string) {
    return prisma.interiorPortfolioItem.findUnique({ where: { id } });
  }

  create(data: Prisma.InteriorPortfolioItemCreateInput) {
    return prisma.interiorPortfolioItem.create({ data });
  }

  update(id: string, data: Prisma.InteriorPortfolioItemUpdateInput) {
    return prisma.interiorPortfolioItem.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.interiorPortfolioItem.delete({ where: { id } });
  }
}
