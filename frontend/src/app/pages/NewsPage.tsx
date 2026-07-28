import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { PageHero } from "../components/shared/PageHero";
import { NewsInsightsSection, FaqSection } from "../components/corporate-sections";
import { api, type NewsRecord } from "../services/api";

export default function NewsPage() {
  const { id } = useParams();
  const [article, setArticle] = useState<NewsRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setArticle(null);
      return;
    }
    api.getNewsById(id)
      .then((value) => {
        setArticle(value);
        setError(null);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Article could not be loaded."));
  }, [id]);

  return (
    <>
      <PageHero
        eyebrow="News & Insights"
        title="Market Intelligence &"
        titleItalic="Industry Insights"
        subtitle="Stay informed with the latest real estate news, project updates, and market analysis from Bangladesh's premium property sector."
        image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=900&fit=crop&auto=format&q=92"
      />
      {id && (
        <section className="bg-[#F7F7F5] py-20">
          <article className="max-w-4xl mx-auto px-6 md:px-12">
            {error ? <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-4">{error}</div> : !article ? <p className="text-center text-[#666]">Loading article…</p> : <>
              <p className="text-[#0B5E3C] uppercase tracking-[.24em] text-xs font-semibold mb-4">{article.category?.name ?? "Staria News"}</p>
              <h1 className="text-4xl md:text-5xl leading-tight mb-5" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{article.title}</h1>
              {article.excerpt && <p className="text-xl text-[#555] leading-8 mb-8">{article.excerpt}</p>}
              <div className="prose prose-lg max-w-none whitespace-pre-line text-[#333] leading-8">{article.body}</div>
              <Link to="/news" className="inline-flex mt-10 px-6 py-3 rounded-full border border-black/15 font-semibold">Back to all news</Link>
            </>}
          </article>
        </section>
      )}
      <NewsInsightsSection />
      <FaqSection />
    </>
  );
}
