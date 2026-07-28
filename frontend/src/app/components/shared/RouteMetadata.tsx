import { useEffect } from "react";
import { useLocation } from "react-router";

const metadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Staria Properties | Premium Real Estate in Bangladesh",
    description: "Discover premium properties, development projects, and real-estate services from Staria Properties."
  },
  "/about": { title: "About Staria Properties", description: "Learn about Staria Properties, our standards, and our real-estate expertise." },
  "/development": { title: "Development Solutions | Staria Properties", description: "Explore Staria development and infrastructure solutions." },
  "/properties": { title: "Properties for Sale and Rent | Staria", description: "Browse premium residential and commercial property listings." },
  "/interior": { title: "Interior Design | Staria Properties", description: "Discover bespoke interior design services and selected work." },
  "/projects": { title: "Real Estate Projects | Staria", description: "Explore completed, ongoing, and upcoming Staria development projects." },
  "/news": { title: "News and Insights | Staria Properties", description: "Read company news, project updates, and real-estate insights." },
  "/contact": { title: "Contact Staria Properties", description: "Contact the Staria team about a property, project, or real-estate requirement." },
  "/privacy": { title: "Privacy Notice | Staria Properties", description: "How Staria Properties collects, uses, and protects personal information." },
  "/terms": { title: "Terms of Service | Staria Properties", description: "Terms governing use of the Staria Properties website." },
  "/cookies": { title: "Cookie Notice | Staria Properties", description: "Information about cookies used by the Staria Properties website." }
};

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
}

export function RouteMetadata() {
  const location = useLocation();

  useEffect(() => {
    const basePath = location.pathname.startsWith("/properties/")
      ? "/properties"
      : location.pathname.startsWith("/projects/")
        ? "/projects"
        : location.pathname.startsWith("/news/")
          ? "/news"
          : location.pathname;
    const current = metadata[basePath] ?? metadata["/"];
    const siteUrl = String(import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
    const canonical = `${siteUrl}${location.pathname === "/" ? "" : location.pathname}`;
    const allowIndexing = String(import.meta.env.VITE_ALLOW_INDEXING || "false") === "true";

    document.title = current.title;
    upsertMeta('meta[name="description"]', { name: "description", content: current.description });
    upsertMeta('meta[name="robots"]', { name: "robots", content: allowIndexing ? "index,follow" : "noindex,nofollow" });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: current.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: current.description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: location.pathname.startsWith("/news/") ? "article" : "website" });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: current.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: current.description });

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    let structuredData = document.head.querySelector<HTMLScriptElement>("#route-structured-data");
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = "route-structured-data";
      structuredData.type = "application/ld+json";
      document.head.appendChild(structuredData);
    }
    structuredData.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": basePath === "/" ? "RealEstateAgent" : "WebPage",
      name: current.title,
      description: current.description,
      url: canonical,
      areaServed: "Bangladesh"
    });
  }, [location.pathname]);

  return null;
}
