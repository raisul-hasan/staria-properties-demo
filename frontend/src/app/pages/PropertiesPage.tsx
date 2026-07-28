import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronDown, MapPin, BedDouble, Bath, Maximize2, Building2, Search } from "lucide-react";
import { Link, useParams } from "react-router";
import { PageHero } from "../components/shared/PageHero";
import { api } from "../services/api";
import { displayLocation, displayPrice, primaryImage, useApiList } from "../services/content";

type FeaturedProperty = {
  id: string; name: string; location: string; price: string;
  type: string; status: "For Sale" | "For Rent" | "For Lease" | "Ready" | "New";
  beds: number | null; baths: number | null; area: string; image: string;
  description?: string;
};

const STATUS_BADGE: Record<FeaturedProperty["status"], string> = {
  "For Sale": "bg-[#0B5E3C] text-white",
  "For Rent": "bg-[#2A5AA5] text-white",
  "For Lease": "bg-[#7A5600] text-white",
  "Ready": "bg-white text-[#0B5E3C]",
  "New": "bg-[#D9A11A] text-[#1B1B1B]",
};

const FEATURED_PROPERTIES: FeaturedProperty[] = [
  { id: "p1", name: "STARIA Heights Penthouse", location: "Gulshan, Dhaka", price: "৳4.2 Cr", type: "Penthouse", status: "For Sale", beds: 4, baths: 4, area: "3,200", image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=700&h=500&fit=crop&auto=format&q=92" },
  { id: "p2", name: "STARIA Garden Villa", location: "Bashundhara, Dhaka", price: "৳7.8 Cr", type: "Private Villa", status: "For Sale", beds: 5, baths: 5, area: "5,800", image: "https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?w=700&h=500&fit=crop&auto=format&q=92" },
  { id: "p3", name: "STARIA Commerce One", location: "Motijheel, Dhaka", price: "৳15 Cr", type: "Commercial", status: "For Sale", beds: null, baths: null, area: "18,000", image: "https://images.unsplash.com/photo-1600531529272-023c4b821f14?w=700&h=500&fit=crop&auto=format&q=92" },
  { id: "p4", name: "STARIA Skyview Residency", location: "Banani, Dhaka", price: "৳2.9 Cr", type: "Apartment", status: "Ready", beds: 3, baths: 3, area: "1,950", image: "https://images.unsplash.com/photo-1565623833408-d77e39b88af6?w=700&h=500&fit=crop&auto=format&q=92" },
  { id: "p5", name: "STARIA Vista Villas", location: "Chittagong", price: "৳6.5 Cr", type: "Villa Estate", status: "New", beds: 4, baths: 4, area: "4,200", image: "https://images.unsplash.com/photo-1767950470198-c9cd97f8ed87?w=700&h=500&fit=crop&auto=format&q=92" },
  { id: "p6", name: "STARIA Business Hub", location: "Gulshan 2, Dhaka", price: "৳22 Cr", type: "Office Complex", status: "New", beds: null, baths: null, area: "22,000", image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=700&h=500&fit=crop&auto=format&q=92" },
];

const PROPERTY_CATEGORIES = [
  { title: "Luxury Apartments", desc: "Premium high-rise residences with panoramic city views and world-class amenities.", image: "https://images.unsplash.com/photo-1741764014072-68953e93cd48?w=800&h=600&fit=crop&auto=format&q=92" },
  { title: "Commercial Buildings", desc: "Purpose-built commercial spaces designed for modern business environments.", image: "https://images.unsplash.com/photo-1621831337128-35676ca30868?w=800&h=600&fit=crop&auto=format&q=92" },
  { title: "Land", desc: "Prime development plots and residential land in strategic locations.", image: "https://images.unsplash.com/photo-1773299567657-a4bf83503ce5?w=800&h=600&fit=crop&auto=format&q=92" },
  { title: "Office Spaces", desc: "Contemporary office environments built for productivity, collaboration, and growth.", image: "https://images.unsplash.com/photo-1562664377-709f2c337eb2?w=800&h=600&fit=crop&auto=format&q=92" },
  { title: "Villas", desc: "Exclusive private villas offering unmatched privacy, space, and architectural beauty.", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop&auto=format&q=92" },
  { title: "Investment Properties", desc: "High-yield real estate investments delivering strong returns and long-term capital appreciation.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&auto=format&q=92" },
] as const;

const SEARCH_OPTIONS = {
  types: ["Apartment", "Villa", "Commercial Building", "Office Space", "Land", "Investment Property"],
  locations: ["Gulshan, Dhaka", "Banani, Dhaka", "Dhanmondi, Dhaka", "Bashundhara, Dhaka", "Uttara, Dhaka", "Chittagong", "Sylhet"],
  budgets: ["Under ৳50 Lakh", "৳50 L – ৳1 Cr", "৳1 Cr – ৳3 Cr", "৳3 Cr – ৳7 Cr", "৳7 Cr – ৳15 Cr", "Above ৳15 Cr"],
} as const;

function PropertyCard({ id, name, location, price, type, status, beds, baths, area, image, delay }: FeaturedProperty & { delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl bg-white cursor-pointer overflow-hidden"
      style={{ boxShadow: hovered ? "0 28px 64px rgba(0,0,0,0.16), 0 0 0 2px #D9A11A" : "0 4px 20px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)", transform: hovered ? "translateY(-8px)" : "translateY(0)", transition: "box-shadow 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)" }}>
      <div className="relative h-[232px] xl:h-[248px] overflow-hidden">
        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${image})`, transform: hovered ? "scale(1.09)" : "scale(1.0)", transition: "transform 0.75s cubic-bezier(0.22,1,0.36,1)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent pointer-events-none" />
        <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[0.8125rem] font-semibold tracking-wide leading-none ${STATUS_BADGE[status]}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{status}</span>
        <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-[0.8125rem] font-semibold tracking-wide leading-none bg-black/40 text-white backdrop-blur-sm border border-white/[0.15]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{type}</span>
        <motion.span className="absolute bottom-0 left-0 h-[2px] bg-[#D9A11A]" animate={{ width: hovered ? "100%" : "0%" }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      <div className="p-5 xl:p-6">
        <h3 className="text-[#1B1B1B] leading-tight mb-1.5" style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(20px, 1.8vw, 26px)" }}>{name}</h3>
        <div className="flex items-center gap-1.5 mb-4"><MapPin size={12} className="text-[#0B5E3C] shrink-0" /><span className="text-[0.79rem] text-[#555555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{location}</span></div>
        <p className="text-[#0B5E3C] font-semibold mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(20px, 1.8vw, 26px)" }}>{price}</p>
        <span className="block w-full h-px bg-black/[0.06] mb-4" />
        <div className="flex items-center gap-0 mb-5">
          {beds !== null ? (
            <>
              <div className="flex items-center gap-1.5 flex-1 text-[#555555]"><BedDouble size={14} className="shrink-0" /><span className="text-[0.875rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{beds} Beds</span></div>
              <span className="w-px h-4 bg-black/[0.09] shrink-0" />
              <div className="flex items-center gap-1.5 flex-1 justify-center text-[#555555]"><Bath size={14} className="shrink-0" /><span className="text-[0.875rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{baths} Baths</span></div>
              <span className="w-px h-4 bg-black/[0.09] shrink-0" />
              <div className="flex items-center gap-1.5 flex-1 justify-end text-[#555555]"><Maximize2 size={13} className="shrink-0" /><span className="text-[0.875rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{area} sqft</span></div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 text-[#555555]"><Building2 size={14} className="shrink-0" /><span className="text-[0.875rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Commercial</span></div>
              <span className="w-px h-4 bg-black/[0.09] shrink-0 mx-4" />
              <div className="flex items-center gap-1.5 text-[#555555]"><Maximize2 size={13} className="shrink-0" /><span className="text-[0.875rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{area} sqft</span></div>
            </>
          )}
        </div>
        <Link to={`/properties/${id}`} className="w-full py-3 rounded-2xl border text-[1rem] font-semibold tracking-[0.02em] flex items-center justify-center gap-2 transition-colors duration-300"
          style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: hovered ? "#0B5E3C" : "transparent", borderColor: "#0B5E3C", color: hovered ? "#FFFFFF" : "#0B5E3C" }}>
          View Details <motion.span animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.3 }}><ArrowRight size={14} /></motion.span>
        </Link>
      </div>
    </motion.div>
  );
}

function SearchDropdown({ label, placeholder, value, options, isOpen, onToggle, onSelect }: { label: string; placeholder: string; value: string; options: readonly string[]; isOpen: boolean; onToggle: () => void; onSelect: (v: string) => void; }) {
  return (
    <div className="relative flex-1 min-w-0">
      <button onClick={onToggle} className={`w-full flex flex-col items-start px-5 xl:px-6 py-3.5 rounded-xl text-left transition-colors duration-200 ${isOpen ? "bg-[#F3F3F3]" : "hover:bg-[#F7F7F5]"}`}>
        <span className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase mb-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#666666" }}>{label}</span>
        <span className="flex items-center justify-between w-full gap-2">
          <span className={`text-[0.87rem] font-medium truncate ${value ? "text-[#1B1B1B]" : "text-[#999999]"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{value || placeholder}</span>
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.24 }} className="shrink-0"><ChevronDown size={14} style={{ color: "#666666" }} /></motion.span>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 mt-2.5 w-60 bg-white rounded-2xl overflow-hidden z-[200] py-1.5" style={{ boxShadow: "0 20px 56px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)" }}>
            {value && <button onClick={() => onSelect("")} className="w-full text-left px-5 py-2.5 text-[0.8rem] transition-colors duration-150 hover:bg-[#F7F7F5]" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888888" }}>Clear selection</button>}
            {options.map((opt) => (
              <button key={opt} onClick={() => onSelect(opt)} className={`w-full text-left px-5 py-2.5 text-[0.84rem] transition-all duration-150 flex items-center justify-between group/opt ${value === opt ? "bg-[#0B5E3C]/[0.07] text-[#0B5E3C] font-medium" : "text-[#222222] hover:bg-[#F7F7F5] hover:text-[#0B5E3C]"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {opt}{value === opt && <span className="w-1.5 h-1.5 rounded-full bg-[#0B5E3C] shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PropertySearchBar() {
  const [purpose, setPurpose] = useState<"buy" | "rent">("buy");
  const [selType, setSelType] = useState(""); const [selLocation, setSelLocation] = useState(""); const [selBudget, setSelBudget] = useState("");
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpenDrop(null); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section className="relative py-16 xl:py-20 overflow-hidden" style={{ background: "linear-gradient(155deg, #082D1C 0%, #082D1C 50%, #082D1C 100%)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(11, 94, 60,0.28) 0%, transparent 65%)" }} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D9A11A]/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D9A11A]/20 to-transparent" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-12 xl:px-20">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-7 h-px bg-[#D9A11A]" />
            <span className="text-[#D9A11A] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Property Search</span>
            <span className="block w-7 h-px bg-[#D9A11A]" />
          </div>
          <h2 className="font-normal leading-[1.1] text-white" style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.5vw, 46px)" }}>
            Discover Your <span className="italic">Dream Property</span>
          </h2>
        </motion.div>

        <motion.div ref={containerRef} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }} className="max-w-[960px] mx-auto">
          <div className="bg-white rounded-2xl" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-1 px-8 pt-5 border-b border-black/[0.06]">
              {(["buy", "rent"] as const).map((p) => (
                <button key={p} onClick={() => setPurpose(p)}
                  className={`relative pb-3.5 px-5 text-[0.74rem] font-bold tracking-[0.24em] uppercase transition-colors duration-300 ${purpose === p ? "text-[#0B5E3C]" : "text-[#888888] hover:text-[#555555]"}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {p === "buy" ? "Buy" : "Rent"}
                  {purpose === p && <motion.span layoutId="purpose-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0B5E3C] rounded-full" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}
                </button>
              ))}
            </div>
            <div className="p-4 xl:p-5 flex flex-col xl:flex-row gap-2 xl:gap-1">
              <div className="flex flex-col sm:flex-row xl:flex-1 divide-y sm:divide-y-0 sm:divide-x divide-black/[0.06]">
                <SearchDropdown label="Property Type" placeholder="Select type" value={selType} options={SEARCH_OPTIONS.types} isOpen={openDrop === "type"} onToggle={() => setOpenDrop(openDrop === "type" ? null : "type")} onSelect={(v) => { setSelType(v); setOpenDrop(null); }} />
                <SearchDropdown label="Location" placeholder="Select location" value={selLocation} options={SEARCH_OPTIONS.locations} isOpen={openDrop === "loc"} onToggle={() => setOpenDrop(openDrop === "loc" ? null : "loc")} onSelect={(v) => { setSelLocation(v); setOpenDrop(null); }} />
                <SearchDropdown label="Budget" placeholder="Select budget" value={selBudget} options={SEARCH_OPTIONS.budgets} isOpen={openDrop === "budget"} onToggle={() => setOpenDrop(openDrop === "budget" ? null : "budget")} onSelect={(v) => { setSelBudget(v); setOpenDrop(null); }} />
              </div>
              <div className="xl:shrink-0 xl:pl-2">
                <button className="w-full xl:w-auto h-full px-7 py-3.5 xl:py-0 bg-[#0B5E3C] hover:bg-[#09502F] text-white text-[1rem] font-semibold tracking-[0.02em] rounded-xl xl:rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 hover:gap-3.5 hover:shadow-lg hover:shadow-[#0B5E3C]/25" style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "56px" }}>
                  <Search size={16} /> Search
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function PropertiesPage() {
  const { id } = useParams();
  const { items, loading, error } = useApiList(() => api.getProperties({ limit: 100 }), []);
  const databaseProperties: FeaturedProperty[] = items.map((property) => ({
    id: property.slug,
    name: property.title,
    location: displayLocation(property.address),
    price: displayPrice(property.priceLabel, property.price, property.currency),
    type: property.categories.find((category) => category.isPrimary)?.category.name ?? property.listingType,
    status: property.listingType === "RENT" ? "For Rent" : property.listingType === "LEASE" ? "For Lease" : "For Sale",
    beds: property.bedrooms ?? null,
    baths: property.bathrooms === null || property.bathrooms === undefined ? null : Number(property.bathrooms),
    area: property.areaSqft ? Number(property.areaSqft).toLocaleString("en-BD") : "—",
    image: primaryImage(property.media, FEATURED_PROPERTIES[0].image),
    description: property.description ?? property.shortDescription ?? undefined
  }));
  const displayedProperties = databaseProperties.length > 0 ? databaseProperties : FEATURED_PROPERTIES;
  const selectedProperty = id ? displayedProperties.find((property) => property.id === id) : undefined;

  return (
    <>
      <PageHero
        eyebrow="Properties"
        title="Discover Premium"
        titleItalic="Real Estate"
        subtitle="Browse our curated portfolio of residential, commercial and investment properties across Bangladesh's most sought-after locations."
        image="https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=1920&h=900&fit=crop&auto=format&q=92"
      />
      <PropertySearchBar />
      {selectedProperty && (
        <section className="bg-white py-16 border-b border-black/[0.06]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-10 items-center">
            <img src={selectedProperty.image} alt={selectedProperty.name} className="w-full h-[380px] object-cover rounded-3xl" />
            <div><p className="text-[#0B5E3C] uppercase tracking-[.25em] text-xs font-semibold mb-4">{selectedProperty.status}</p><h1 className="text-4xl mb-3" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{selectedProperty.name}</h1><p className="text-[#666] mb-5 flex items-center gap-2"><MapPin size={15} /> {selectedProperty.location}</p><p className="text-3xl text-[#0B5E3C] font-semibold mb-6">{selectedProperty.price}</p><p className="text-[#555] leading-8 mb-7">{selectedProperty.description || "Contact our team for complete information about this property."}</p><div className="flex gap-3"><Link to="/contact" className="px-6 py-3 rounded-full bg-[#0B5E3C] text-white font-semibold">Request a viewing</Link><Link to="/properties" className="px-6 py-3 rounded-full border border-black/15 font-semibold">Close details</Link></div></div>
          </div>
        </section>
      )}

      {/* Property Categories */}
      <section className="py-28 bg-[#F7F7F5]">
        <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
          <motion.div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 mb-14" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-7 h-px bg-[#D9A11A]" />
                <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Property Categories</span>
              </div>
              <h2 className="font-normal leading-[1.1] text-[#1B1B1B]" style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.5vw, 46px)" }}>Find Your<br /><span className="italic">Perfect Property</span></h2>
            </div>
            <p className="text-[0.95rem] leading-[1.8] text-[#555555] max-w-[360px] xl:text-right xl:pb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>From premium apartments to prime land parcels — explore our full portfolio curated for every lifestyle.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {PROPERTY_CATEGORIES.map((cat, i) => (
              <motion.div key={cat.title} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="group relative h-[400px] xl:h-[430px] rounded-2xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-center bg-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" style={{ backgroundImage: `url(${cat.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/0 transition-all duration-500 group-hover:from-black/92 group-hover:via-black/55 group-hover:to-black/18" />
                <div className="absolute top-0 inset-x-0 h-[2px] bg-[#D9A11A] -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <div className="absolute inset-x-0 bottom-0 px-7 pb-7 pt-20 flex flex-col">
                  <h3 className="text-white font-normal leading-tight mb-2.5" style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(22px, 2vw, 30px)" }}>{cat.title}</h3>
                  <p className="text-[0.875rem] leading-relaxed opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.68)" }}>{cat.desc}</p>
                  <div className="mt-5 flex items-center gap-2.5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <span className="w-8 h-8 rounded-full bg-[#D9A11A] flex items-center justify-center shrink-0"><ArrowRight size={13} className="text-[#1B1B1B]" /></span>
                    <span className="text-white text-[0.81rem] font-semibold tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>Explore</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Properties */}
      <section className="py-28 bg-white">
        <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
          <motion.div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 mb-14" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-7 h-px bg-[#D9A11A]" />
                <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Featured Properties</span>
              </div>
              <h2 className="font-normal leading-[1.1] text-[#1B1B1B]" style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.5vw, 46px)" }}>Handpicked<br /><span className="italic">Premium Listings</span></h2>
            </div>
            <p className="text-[0.95rem] leading-[1.8] text-[#555555] max-w-[360px] xl:text-right xl:pb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>A curated selection of STARIA's finest residential and commercial properties across Bangladesh's premier locations.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {error && <div className="md:col-span-2 xl:col-span-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">Live database content is temporarily unavailable; representative demo listings are shown.</div>}
            {loading && <div className="md:col-span-2 xl:col-span-3 text-center text-[#777] py-4">Loading live properties…</div>}
            {displayedProperties.map((prop, i) => <PropertyCard key={prop.id} {...prop} delay={i * 0.09} />)}
          </div>
        </div>
      </section>
    </>
  );
}
