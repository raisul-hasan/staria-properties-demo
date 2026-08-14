import { PageHero } from "../components/shared/PageHero";
import { NewsInsightsSection, FaqSection } from "../components/corporate-sections";

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News & Insights"
        title="Market Intelligence &"
        titleItalic="Industry Insights"
        subtitle="Stay informed with the latest real estate news, project updates, and market analysis from Bangladesh's premium property sector."
        image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=900&fit=crop&auto=format&q=92"
      />
      <NewsInsightsSection />
      <FaqSection />
    </>
  );
}
