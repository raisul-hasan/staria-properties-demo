import { SiteImage } from "../components/shared/SiteImage";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Bath, BedDouble, MapPin, Maximize2 } from "lucide-react";
import { ApiError, api, type PropertyRecord } from "../services/api";
import { ConsultationDialog } from "../components/shared/ConsultationDialog";
import { displayLocation, displayPrice, primaryImage } from "../services/content";
import { ADVERTISED_PROPERTY } from "../services/advertisedProperty";

export default function PropertyDetailsPage() {
  const { id } = useParams();

  if (id === ADVERTISED_PROPERTY.slug) {
    return (
      <main className="min-h-screen bg-[#FAFAF6] pt-36 pb-24">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          <Link to="/properties" className="mb-8 inline-flex items-center gap-2 font-semibold text-[#0B5E3C]"><ArrowLeft aria-hidden="true" size={16} />Back to properties</Link>
          <h1 className="sr-only">{ADVERTISED_PROPERTY.title} — property details</h1>
          {/* Reserved for this property's details when further information is available. */}
        </div>
      </main>
    );
  }

  return <LivePropertyDetailsPage key={id} />;
}

function LivePropertyDetailsPage() {
  const { id } = useParams();
  const [viewingOpen, setViewingOpen] = useState(false);
  const [property, setProperty] = useState<PropertyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setProperty(null);
    setError("");
    setMissing(false);
    api.getPropertyById(id ?? "")
      .then((record) => { if (active) setProperty(record); })
      .catch((caught: unknown) => {
        if (!active) return;
        setMissing(caught instanceof ApiError && caught.status === 404);
        setError("Property details could not be loaded. Please refresh the page to try again.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  return <main className="min-h-screen bg-[#FAFAF6] pt-36 pb-24">
    <div className="mx-auto max-w-[1200px] px-6 md:px-12">
      <Link to="/properties" className="mb-8 inline-flex items-center gap-2 font-semibold text-[#0B5E3C]"><ArrowLeft size={16} /> Back to properties</Link>
      {loading ? <p role="status" className="py-20 text-center">Loading property details…</p> : missing ? <div className="py-20 text-center"><h1 className="text-3xl mb-4">Property unavailable</h1><p>This property is no longer available or has not been published.</p></div> : error ? <p role="alert" className="rounded-xl bg-red-50 p-6 text-red-700">{error}</p> : property && <article>
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#0B5E3C]">{property.listingType === "RENT" ? "For Rent" : property.listingType === "LEASE" ? "For Lease" : "For Sale"}</p>
          <h1 className="mb-4 text-4xl md:text-5xl text-[#082D1C]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{property.title}</h1>
          <p className="flex items-center gap-2 text-[#666]"><MapPin size={16} />{displayLocation(property.address)}</p>
        </div>
        {primaryImage(property.media, "") && <SiteImage priority src={primaryImage(property.media, "")} alt={property.title} className="mb-10 max-h-[560px] w-full rounded-3xl object-cover" />}
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-8 flex flex-wrap gap-6 border-y border-black/10 py-5 text-[#555]">
              {property.bedrooms != null && <span className="inline-flex items-center gap-2"><BedDouble size={18} />{property.bedrooms} Beds</span>}
              {property.bathrooms != null && <span className="inline-flex items-center gap-2"><Bath size={18} />{Number(property.bathrooms)} Baths</span>}
              {property.areaSqft != null && <span className="inline-flex items-center gap-2"><Maximize2 size={18} />{Number(property.areaSqft).toLocaleString()} sqft</span>}
            </div>
            <h2 className="mb-4 text-2xl text-[#082D1C]">About this property</h2>
            <p className="whitespace-pre-wrap break-words leading-8 text-[#555]">{property.description || property.shortDescription || "Contact our team for complete information about this property."}</p>
          </div>
          <aside className="h-fit rounded-2xl border border-black/10 bg-white p-6">
            <p className="mb-6 text-2xl font-semibold text-[#0B5E3C]">{displayPrice(property.priceLabel, property.price, property.currency)}</p>
            <button type="button" onClick={() => setViewingOpen(true)} className="block w-full rounded-full bg-[#D9A11A] px-5 py-3 text-center font-semibold text-[#1B1B1B] hover:bg-[#C08912]">Request a viewing</button>
          </aside>
        </div>
        {property.media.length > 1 && <section className="mt-12"><h2 className="mb-6 text-2xl text-[#082D1C]">Property gallery</h2><div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">{property.media.map((item, index) => <SiteImage key={`${item.media.secureUrl}-${index}`} src={item.media.secureUrl} alt={`${property.title} — photo ${index + 1}`} loading="lazy" className="h-64 w-full rounded-2xl object-cover" />)}</div></section>}
        <ConsultationDialog key={`${property.id}-${viewingOpen}`} open={viewingOpen} onOpenChange={setViewingOpen} property={property} />
      </article>}
    </div>
  </main>;
}
