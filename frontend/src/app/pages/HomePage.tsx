import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  ArrowRight, ArrowUpRight, MapPin,
  Key, Tag, Building2, Paintbrush, LayoutDashboard, TrendingUp,
  Globe, Leaf, Users, Cpu,
  BedDouble, Bath, Maximize2,
  Star, ChevronLeft, ChevronRight,
} from "lucide-react";
import { StatisticsSection, CtaBannerSection } from "../components/corporate-sections";
import { api } from "../services/api";
import { displayLocation, displayPrice, primaryImage, useApiList } from "../services/content";

// ─── Shared font strings ───────────────────────────────────────────────────────
const gilda = "'Gilda Display', Georgia, serif";
const dm = "'DM Sans', sans-serif";

// ─── Data ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  { Icon: Key, title: "Property Buying", desc: "Find and acquire your ideal property with expert guidance, precise market insights and seamless end-to-end acquisition support.", image: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&h=500&fit=crop&auto=format&q=92" },
  { Icon: Tag, title: "Property Selling", desc: "Maximise the value of your asset through proven marketing strategies, accurate valuation and powerful negotiation expertise.", image: "https://images.unsplash.com/photo-1670589953882-b94c9cb380f5?w=800&h=500&fit=crop&auto=format&q=92" },
  { Icon: Building2, title: "Property Development", desc: "From land acquisition to final handover, we deliver landmark residential and commercial developments with uncompromising precision.", image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=500&fit=crop&auto=format&q=92" },
  { Icon: Paintbrush, title: "Interior Design", desc: "Transform spaces into bespoke environments with our curated interior design, space planning and premium fit-out services.", image: "https://images.unsplash.com/photo-1646987916641-1f3c8992daa2?w=800&h=500&fit=crop&auto=format&q=92" },
  { Icon: LayoutDashboard, title: "Property Management", desc: "Comprehensive management solutions that protect, maintain and continuously grow the long-term value of your real estate portfolio.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=500&fit=crop&auto=format&q=92" },
  { Icon: TrendingUp, title: "Investment Consultancy", desc: "Strategic advisory to identify high-yield opportunities, optimise returns and build enduring wealth through real estate investment.", image: "https://images.unsplash.com/photo-1558954157-aa76c0d246c6?w=800&h=500&fit=crop&auto=format&q=92" },
];

const FEATURED_PROJECTS = [
  { id: 1, name: "Staria Heights", location: "Gulshan-2, Dhaka", type: "Luxury Apartment", status: "Ready to Move", statusBg: "bg-[#0B5E3C]", category: "Residential", image: "https://images.unsplash.com/photo-1601881403737-2a6085443ba2?w=900&h=700&fit=crop&auto=format&q=92" },
  { id: 2, name: "The Pinnacle Tower", location: "Banani, Dhaka", type: "Penthouse & Residences", status: "Under Construction", statusBg: "bg-[#D9A11A]", category: "Residential", image: "https://images.unsplash.com/photo-1777734582224-f9b002fa116c?w=900&h=700&fit=crop&auto=format&q=92" },
  { id: 3, name: "Trade Centre One", location: "Motijheel, Dhaka", type: "Commercial Complex", status: "Ready to Move", statusBg: "bg-[#0B5E3C]", category: "Commercial", image: "https://images.unsplash.com/photo-1621831337128-35676ca30868?w=900&h=700&fit=crop&auto=format&q=92" },
];

const FEATURED_PROPERTIES = [
  { id: "p1", name: "STARIA Heights Penthouse", location: "Gulshan, Dhaka", price: "৳4.2 Cr", type: "Penthouse", status: "For Sale" as const, beds: 4, baths: 4, area: "3,200", image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=700&h=500&fit=crop&auto=format&q=92" },
  { id: "p2", name: "STARIA Garden Villa", location: "Bashundhara, Dhaka", price: "৳7.8 Cr", type: "Private Villa", status: "For Sale" as const, beds: 5, baths: 5, area: "5,800", image: "https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?w=700&h=500&fit=crop&auto=format&q=92" },
  { id: "p3", name: "STARIA Commerce One", location: "Motijheel, Dhaka", price: "৳15 Cr", type: "Commercial", status: "For Sale" as const, beds: null, baths: null, area: "18,000", image: "https://images.unsplash.com/photo-1600531529272-023c4b821f14?w=700&h=500&fit=crop&auto=format&q=92" },
];

const STATUS_BADGE = {
  "For Sale": "bg-[#0B5E3C] text-white",
  "For Rent": "bg-[#2A5AA5] text-white",
  "For Lease": "bg-[#7A5600] text-white",
  "Ready": "bg-white text-[#0B5E3C]",
  "New": "bg-[#D9A11A] text-[#1B1B1B]",
};

const DIVISION_SERVICES_DEV = [
  { icon: Building2, label: "Residential Development" },
  { icon: LayoutDashboard, label: "Commercial Development" },
  { icon: Cpu, label: "Smart Infrastructure" },
  { icon: Leaf, label: "Sustainable Construction" },
  { icon: Users, label: "Project Consultancy" },
];
const DIVISION_SERVICES_PROP = [
  { icon: TrendingUp, label: "Buy & Sell Properties" },
  { icon: Key, label: "Property Management" },
  { icon: Tag, label: "Leasing" },
  { icon: Globe, label: "Investment Advisory" },
  { icon: Paintbrush, label: "Interior Design" },
];

const TESTIMONIALS = [
  { quote: "Working with STARIA was an exceptional experience from first consultation to final handover. Their precision and commitment to quality simply cannot be matched anywhere in Bangladesh.", name: "Farrukh Rahman", role: "Managing Director", company: "Rahman Group Holdings", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format&q=92" },
  { quote: "STARIA delivered our commercial tower on time and on budget — a rarity in this industry. Their transparency throughout gave us complete confidence in every decision made.", name: "Nadia Chowdhury", role: "Chief Executive Officer", company: "Apex Ventures Ltd.", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format&q=92" },
  { quote: "From the interior consultation to the final reveal, every detail was executed with artistry and care. STARIA transformed our penthouse into something truly extraordinary.", name: "Imran Hossain", role: "Co-Founder", company: "Meridian Capital Partners", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&auto=format&q=92" },
] as const;

// ─── Property Card ─────────────────────────────────────────────────────────────
function PropertyCard({ id, name, location, price, type, status, beds, baths, area, image, delay }: (Omit<typeof FEATURED_PROPERTIES[number], "status"> & { status: keyof typeof STATUS_BADGE; delay: number })) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl bg-white cursor-pointer overflow-hidden"
      style={{ boxShadow: hovered ? "0 24px 56px rgba(0,0,0,0.13), 0 0 0 1.5px #D9A11A" : "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)", transform: hovered ? "translateY(-6px)" : "translateY(0)", transition: "box-shadow 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)" }}>
      <div className="relative h-[260px] xl:h-[280px] overflow-hidden">
        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${image})`, transform: hovered ? "scale(1.06)" : "scale(1.0)", transition: "transform 0.75s cubic-bezier(0.22,1,0.36,1)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent pointer-events-none" />
        <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[0.8125rem] font-semibold tracking-wide leading-none ${STATUS_BADGE[status]}`} style={{ fontFamily: dm }}>{status}</span>
        <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-[0.8125rem] font-semibold tracking-wide leading-none bg-black/40 text-white backdrop-blur-sm border border-white/[0.15]" style={{ fontFamily: dm }}>{type}</span>
        <motion.span className="absolute bottom-0 left-0 h-[2px] bg-[#D9A11A]" animate={{ width: hovered ? "100%" : "0%" }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      <div className="p-5 xl:p-6">
        <h3 className="text-[#1B1B1B] leading-tight mb-1.5" style={{ fontFamily: gilda, fontSize: "clamp(20px, 1.8vw, 26px)" }}>{name}</h3>
        <div className="flex items-center gap-1.5 mb-4"><MapPin size={12} className="text-[#0B5E3C] shrink-0" /><span className="text-[0.79rem] text-[#555555]" style={{ fontFamily: dm }}>{location}</span></div>
        <p className="text-[#0B5E3C] font-semibold mb-4" style={{ fontFamily: dm, fontSize: "clamp(20px, 1.8vw, 26px)" }}>{price}</p>
        <span className="block w-full h-px bg-black/[0.06] mb-4" />
        <div className="flex items-center gap-0 mb-5">
          {beds !== null ? (
            <>
              <div className="flex items-center gap-1.5 flex-1 text-[#555555]"><BedDouble size={14} className="shrink-0" /><span className="text-[0.875rem]" style={{ fontFamily: dm }}>{beds} Beds</span></div>
              <span className="w-px h-4 bg-black/[0.09] shrink-0" />
              <div className="flex items-center gap-1.5 flex-1 justify-center text-[#555555]"><Bath size={14} className="shrink-0" /><span className="text-[0.875rem]" style={{ fontFamily: dm }}>{baths} Baths</span></div>
              <span className="w-px h-4 bg-black/[0.09] shrink-0" />
              <div className="flex items-center gap-1.5 flex-1 justify-end text-[#555555]"><Maximize2 size={13} className="shrink-0" /><span className="text-[0.875rem]" style={{ fontFamily: dm }}>{area} sqft</span></div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 text-[#555555]"><Building2 size={14} className="shrink-0" /><span className="text-[0.875rem]" style={{ fontFamily: dm }}>Commercial</span></div>
              <span className="w-px h-4 bg-black/[0.09] shrink-0 mx-4" />
              <div className="flex items-center gap-1.5 text-[#555555]"><Maximize2 size={13} className="shrink-0" /><span className="text-[0.875rem]" style={{ fontFamily: dm }}>{area} sqft</span></div>
            </>
          )}
        </div>
        <Link to={`/properties/${id}`} className="w-full py-3 rounded-2xl border text-[1rem] font-semibold tracking-[0.02em] flex items-center justify-center gap-2 transition-colors duration-300"
          style={{ fontFamily: dm, backgroundColor: hovered ? "#0B5E3C" : "transparent", borderColor: "#0B5E3C", color: hovered ? "#FFFFFF" : "#0B5E3C" }}>
          View Details <motion.span animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.3 }}><ArrowRight size={14} /></motion.span>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Division Card ─────────────────────────────────────────────────────────────
function DivisionCard({ brand, title, subtitle, services, cta, image, dark, imageLeft, delay, divNum }: {
  brand: string; title: string; subtitle: string;
  services: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string }[];
  cta: string; image: string; dark: boolean; imageLeft: boolean; delay: number; divNum: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className={`relative overflow-hidden rounded-3xl flex min-h-[520px] xl:min-h-[560px] ${imageLeft ? "flex-row" : "flex-row-reverse"} ${dark ? "bg-[#082D1C] border border-white/[0.07]" : "bg-white border border-black/[0.06]"}`}
      style={{ boxShadow: hovered ? (dark ? "0 28px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,166,35,0.18)" : "0 28px 64px rgba(0,0,0,0.13), 0 0 0 1px rgba(11, 94, 60,0.14)") : "0 6px 24px rgba(0,0,0,0.09)", transform: hovered ? "translateY(-4px)" : "translateY(0)", transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.55s cubic-bezier(0.22,1,0.36,1)" }}>
      <div className={`relative overflow-hidden shrink-0 ${imageLeft ? "w-[45%]" : "w-[42%]"}`}>
        <motion.div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${image})` }} animate={{ scale: hovered ? 1.08 : 1.0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 40%, rgba(0,0,0,0.35) 100%)" }} />
        <div className="absolute inset-0" style={{ background: dark ? (imageLeft ? "linear-gradient(to right, rgba(7,13,9,0) 20%, rgba(7,13,9,0.5) 68%, rgba(7,13,9,1) 100%)" : "linear-gradient(to left, rgba(7,13,9,0) 20%, rgba(7,13,9,0.5) 68%, rgba(7,13,9,1) 100%)") : (imageLeft ? "linear-gradient(to right, rgba(255,255,255,0) 20%, rgba(255,255,255,0.5) 68%, rgba(255,255,255,1) 100%)" : "linear-gradient(to left, rgba(255,255,255,0) 20%, rgba(255,255,255,0.5) 68%, rgba(255,255,255,1) 100%)") }} />
        <div className={`absolute top-7 ${imageLeft ? "left-7" : "right-7"} w-11 h-11 rounded-[14px] flex items-center justify-center text-[0.67rem] font-bold tracking-[0.22em] backdrop-blur-sm ${dark ? "bg-[#D9A11A]/15 text-[#D9A11A] border border-[#D9A11A]/28" : "bg-white/85 text-[#0B5E3C] border border-[#0B5E3C]/20"}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>{divNum}</div>
      </div>
      <div className="relative z-10 flex flex-col justify-center px-10 xl:px-14 py-12 flex-1">
        <p className={`text-[0.8125rem] tracking-[0.3em] uppercase font-semibold mb-3 ${dark ? "text-[#D9A11A]" : "text-[#7A5600]"}`} style={{ fontFamily: dm }}>{brand}</p>
        <h3 className={`font-normal leading-[1.08] mb-2.5 ${dark ? "text-white" : "text-[#1B1B1B]"}`} style={{ fontFamily: gilda, fontSize: "clamp(22px, 2.2vw, 32px)" }}>{title}</h3>
        <p className={`text-[0.84rem] leading-snug mb-7 ${dark ? "text-white/40" : "text-[#555555]"}`} style={{ fontFamily: dm }}>{subtitle}</p>
        <motion.span className={`h-px mb-7 ${dark ? "bg-[#D9A11A]/30" : "bg-[#0B5E3C]/22"}`} animate={{ width: hovered ? "100%" : "40px" }} initial={{ width: "40px" }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} style={{ display: "block" }} />
        <ul className="space-y-2.5 mb-9">
          {services.map(({ icon: Icon, label }, i) => (
            <motion.li key={label} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: delay + 0.25 + i * 0.06, duration: 0.5 }} className="flex items-center gap-3 group/item">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${dark ? "bg-[#D9A11A]/10 text-[#D9A11A] group-hover/item:bg-[#D9A11A]/22" : "bg-[#0B5E3C]/[0.08] text-[#0B5E3C] group-hover/item:bg-[#0B5E3C]/16"}`}><Icon size={13} /></span>
              <span className={`text-[0.83rem] transition-colors duration-300 ${dark ? "text-white/50 group-hover/item:text-white/82" : "text-[#444444] group-hover/item:text-[#1B1B1B]"}`} style={{ fontFamily: dm }}>{label}</span>
            </motion.li>
          ))}
        </ul>
        <motion.button className={`inline-flex items-center gap-3 text-[1rem] font-semibold tracking-[0.02em] w-fit group/cta ${dark ? "text-white" : "text-[#1B1B1B]"}`} style={{ fontFamily: dm }} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
          <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${dark ? "bg-[#D9A11A] text-[#1B1B1B] group-hover/cta:bg-white group-hover/cta:scale-110" : "bg-[#0B5E3C] text-white group-hover/cta:bg-[#7A5600] group-hover/cta:scale-110"}`}><ArrowRight size={15} /></span>
          {cta}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 80 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -dir * 80 }),
};

function TestimonialsSection() {
  const { items } = useApiList(() => api.getTestimonials(), []);
  const databaseTestimonials = items.map((testimonial, index) => ({
    quote: testimonial.quote,
    name: testimonial.clientContact?.name ?? testimonial.client?.name ?? "Staria Client",
    role: testimonial.clientContact?.designation ?? "Client",
    company: testimonial.client?.name ?? "Verified customer",
    photo: TESTIMONIALS[index % TESTIMONIALS.length].photo
  }));
  const displayedTestimonials = databaseTestimonials.length > 0 ? databaseTestimonials : TESTIMONIALS;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => { setDirection(1); setCurrent((c) => (c + 1) % displayedTestimonials.length); }, 5000);
    return () => clearInterval(id);
  }, [paused, displayedTestimonials.length]);

  const handlePrev = () => { setDirection(-1); setCurrent((c) => (c - 1 + displayedTestimonials.length) % displayedTestimonials.length); };
  const handleNext = () => { setDirection(1); setCurrent((c) => (c + 1) % displayedTestimonials.length); };
  const t = displayedTestimonials[current % displayedTestimonials.length];

  return (
    <section className="bg-[#F7F7F5] py-36 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-8 h-px bg-[#D9A11A]" />
            <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: dm }}>Client Stories</span>
            <span className="block w-8 h-px bg-[#D9A11A]" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-normal leading-[1.1] text-[#1B1B1B]"
            style={{ fontFamily: gilda, fontSize: "clamp(34px, 3.5vw, 46px)" }}>
            Words from Our <span className="italic">Clients</span>
          </motion.h2>
        </div>

        <div className="max-w-[860px] mx-auto" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="relative bg-white rounded-3xl p-12 xl:p-16 overflow-hidden" style={{ boxShadow: "0 12px 48px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)" }}>
            <div className="absolute top-8 left-10 xl:left-14 w-12 h-12 opacity-[0.06]" style={{ fontFamily: gilda, fontSize: "6rem", lineHeight: 1, color: "#0B5E3C" }}>"</div>
            <div className="flex items-center gap-1.5 mb-7">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-[#D9A11A] fill-[#D9A11A]" />)}
            </div>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.blockquote key={current} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-[#1B1B1B] mb-10 leading-[1.8]" style={{ fontFamily: gilda, fontSize: "clamp(22px, 2vw, 30px)", fontWeight: 400 }}>
                "{t.quote}"
              </motion.blockquote>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div key={`author-${current}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#0B5E3C]/20 shrink-0">
                    <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[#1B1B1B] text-[1rem] font-semibold leading-tight" style={{ fontFamily: gilda }}>{t.name}</p>
                    <p className="text-[#555555] text-[0.875rem] mt-0.5" style={{ fontFamily: dm }}>{t.role} · {t.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  {[handlePrev, handleNext].map((fn, i) => (
                    <button key={i} onClick={fn} className="w-10 h-10 rounded-full border border-black/[0.09] flex items-center justify-center text-[#555555] hover:bg-[#0B5E3C] hover:text-white hover:border-[#0B5E3C] transition-all duration-300">
                      {i === 0 ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-2 mt-7">
            {displayedTestimonials.map((_, i) => (
              <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`rounded-full transition-all duration-400 ${i === current ? "w-7 h-2 bg-[#0B5E3C]" : "w-2 h-2 bg-[#0B5E3C]/25 hover:bg-[#0B5E3C]/50"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Interior Preview ──────────────────────────────────────────────────────────
function InteriorPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [-56, 56]);

  return (
    <section className="bg-white py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div ref={ref} className="relative overflow-hidden rounded-3xl bg-[#D8D8D8] h-[600px]">
              <motion.div style={{ y: imgY, top: "-60px", left: 0, right: 0, bottom: "-60px" }} className="absolute will-change-transform">
                <img src="https://images.unsplash.com/photo-1704040686428-7534b262d0d8?w=1400&h=1000&fit=crop&auto=format&q=92" alt="Luxury living room" className="w-full h-full object-cover" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-3xl" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#D9A11A]" />
              <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: dm }}>Interior Design</span>
            </div>
            <h2 className="font-normal leading-[1.1] text-[#1B1B1B] mb-6 whitespace-pre-line" style={{ fontFamily: gilda, fontSize: "clamp(22px, 2.4vw, 32px)" }}>{"Where Comfort\nMeets Elegance"}</h2>
            <p className="text-[#555555] text-[1rem] leading-[1.85] mb-9" style={{ fontFamily: dm, maxWidth: "440px" }}>
              Our living room designs balance warmth with sophistication — curating bespoke furniture, layered lighting and thoughtful layouts that reflect the way you actually live.
            </p>
            <ul className="space-y-3 mb-10">
              {["Bespoke furniture selection & placement", "Layered ambient, task and accent lighting", "Material palette curation", "3D visualisation before execution"].map((f) => (
                <li key={f} className="flex items-center gap-3.5">
                  <span className="flex-shrink-0 w-[22px] h-[22px] rounded-full border border-[#0B5E3C]/25 bg-[#0B5E3C]/[0.06] flex items-center justify-center"><span className="w-[6px] h-[6px] rounded-full bg-[#0B5E3C]" /></span>
                  <span className="text-[#444444] text-[0.88rem]" style={{ fontFamily: dm }}>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/interior" className="inline-flex items-center gap-2 text-[#0B5E3C] text-[0.85rem] font-semibold tracking-wide group hover:gap-3 transition-all duration-300 w-fit border-b border-[#0B5E3C]/30 pb-0.5 hover:border-[#0B5E3C]" style={{ fontFamily: dm }}>
              Explore Interior Design <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  const { items } = useApiList(() => api.getHeroSlides(), []);
  const slide = items[0];
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 480], [1, 0]);
  const heroY = useTransform(scrollY, [0, 480], [0, -72]);

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      <motion.div className="absolute inset-0 will-change-transform" initial={{ scale: 1.0 }} animate={{ scale: 1.1 }} transition={{ duration: 18, ease: [0.0, 0.0, 0.2, 1] }}>
        <img src={slide?.media.secureUrl ?? "https://images.unsplash.com/photo-1762777973560-76a142ddedef?w=1920&h=1080&fit=crop&auto=format&q=92"} alt={slide?.media.altText ?? "Staria premium real estate"} className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.35) 100%)" }} />

      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-[1440px] mx-auto px-12 xl:px-20 pt-28 pb-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 mb-7">
          <span className="block w-8 h-px bg-[#D9A11A]" />
          <span className="text-[#D9A11A] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold" style={{ fontFamily: dm }}>{slide?.eyebrow ?? "Premium Real Estate · Staria Properties"}</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="text-[40px] sm:text-[52px] xl:text-[64px] font-normal leading-[1.1] text-white mb-8 max-w-[820px]"
          style={{ fontFamily: gilda }}>
          {slide?.title ?? <>Building Smarter<br />Tomorrow,{" "}<span className="italic text-white/90">Sustaining</span><br /><span>Forever<span className="text-[#D9A11A]">.</span></span></>}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/65 text-[1.05rem] leading-[1.85] max-w-[500px] mb-11" style={{ fontFamily: dm }}>
          {slide?.subtitle ?? "Premium Property Development, Interior Design, Property Management and Real Estate Solutions."}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }} className="flex items-center flex-wrap gap-4">
          <Link to="/projects"
            className="group shrink-0 flex items-center gap-2.5 px-8 py-4 bg-[#0B5E3C] hover:bg-[#09502F] text-white text-[1rem] font-semibold tracking-[0.02em] rounded-full transition-all duration-300 hover:shadow-[0_16px_48px_rgba(11,94,60,0.38)]"
            style={{ fontFamily: dm }}>
            Explore Projects
            <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 group-hover:translate-x-0.5 transition-all duration-300"><ArrowRight size={13} /></span>
          </Link>
          <Link to="/contact"
            className="shrink-0 flex items-center gap-2.5 px-8 py-4 border border-white/30 hover:border-white/60 text-white/80 hover:text-white text-[1rem] font-semibold tracking-[0.02em] rounded-full transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
            style={{ fontFamily: dm }}>
            Contact Us
          </Link>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }} className="relative z-10 shrink-0">
        <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
          <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/[0.07] to-transparent mb-0" />
        </div>
        <div className="max-w-[1440px] mx-auto px-12 xl:px-20 py-5 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-8 text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: dm }}>
            {[["500+", "Projects"], ["25 Yrs", "Experience"], ["12,000+", "Clients"]].map(([val, lbl]) => (
              <div key={lbl} className="flex items-center gap-2">
                <span className="text-white/70 font-semibold text-sm" style={{ fontFamily: gilda }}>{val}</span>
                <span>{lbl}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex flex-col items-center gap-2">
              <span className="text-white/30 text-[0.8125rem] tracking-[0.3em] uppercase" style={{ fontFamily: dm }}>Scroll</span>
              <div className="relative w-px h-10 bg-white/10 overflow-hidden rounded-full">
                <motion.div className="absolute top-0 left-0 w-full rounded-full" style={{ height: "40%", background: "linear-gradient(to bottom, #D9A11A, transparent)" }} animate={{ y: ["-100%", "350%"] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", repeatDelay: 0.3 }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Company Overview ──────────────────────────────────────────────────────────
function CompanyOverview() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 min-h-[700px]">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative overflow-hidden min-h-[480px] lg:min-h-0">
          <img src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?w=1200&h=900&fit=crop&auto=format&q=92" alt="Luxury modern office interior" className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10" />
          <motion.div initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="absolute bottom-8 left-8 bg-[#0B5E3C] text-white rounded-2xl px-6 py-4 shadow-2xl">
            <p className="text-[2rem] font-bold leading-none" style={{ fontFamily: gilda }}>1999</p>
            <p className="text-white/70 text-xs tracking-widest uppercase mt-1" style={{ fontFamily: dm }}>Established</p>
          </motion.div>
        </motion.div>

        <div className="flex flex-col justify-center px-14 xl:px-20 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 mb-5">
            <span className="block w-8 h-px bg-[#D9A11A]" />
            <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: dm }}>About Us</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-normal leading-[1.1] text-[#1B1B1B] mb-6"
            style={{ fontFamily: gilda, fontSize: "clamp(34px, 3.5vw, 46px)" }}>
            Who We <span className="italic">Are</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#555555] text-[1rem] leading-[1.85] mb-10 max-w-[480px]" style={{ fontFamily: dm }}>
            Staria is a premium real estate and development company providing property development, buying & selling, interior design, property management and investment solutions.
          </motion.p>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }} className="origin-left w-full h-px bg-black/[0.08] mb-10" />
          <div className="grid grid-cols-3 gap-5">
            {[{ number: "50+", label: "Projects", delay: 0.32 }, { number: "500+", label: "Happy Clients", delay: 0.44 }, { number: "10+", label: "Years Experience", delay: 0.56 }].map(({ number, label, delay }) => (
              <motion.div key={label} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-[#F7F7F5] hover:bg-[#0B5E3C] rounded-2xl px-7 py-8 transition-all duration-500 cursor-default overflow-hidden">
                <span className="block w-8 h-[3px] bg-[#D9A11A] rounded-full mb-4 group-hover:w-full transition-all duration-500" />
                <p className="text-[2.6rem] font-bold text-[#0B5E3C] group-hover:text-white leading-none mb-2 transition-colors duration-500" style={{ fontFamily: gilda }}>{number}</p>
                <p className="text-[#555555] group-hover:text-white/70 text-sm font-medium leading-snug transition-colors duration-500" style={{ fontFamily: dm }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Business Divisions ────────────────────────────────────────────────────────
function BusinessDivisionsSection() {
  return (
    <section className="py-28 bg-[#F7F7F5]">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-8 h-px bg-[#D9A11A]" />
            <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: dm }}>Our Business Divisions</span>
            <span className="block w-8 h-px bg-[#D9A11A]" />
          </div>
          <h2 className="font-normal leading-[1.1] text-[#1B1B1B] mb-6" style={{ fontFamily: gilda, fontSize: "clamp(34px, 3.5vw, 46px)" }}>
            Two Divisions. <span className="italic">One Standard of Excellence.</span>
          </h2>
          <p className="text-[0.95rem] leading-[1.8] text-[#555555] max-w-[520px] mx-auto" style={{ fontFamily: dm }}>
            STARIA operates through two specialized divisions — each purpose-built to deliver uncompromising quality in its domain.
          </p>
        </motion.div>
        <div className="flex flex-col gap-5">
          <DivisionCard brand="Staria" title="Development Solutions" subtitle="Smart Development & Infrastructure Solutions" services={DIVISION_SERVICES_DEV} cta="Learn More" image="https://images.unsplash.com/photo-1628012209120-d9db7abf7eab?w=1000&h=700&fit=crop&auto=format&q=92" dark={true} imageLeft={true} delay={0} divNum="01" />
          <DivisionCard brand="Staria" title="Properties" subtitle="Professional Real Estate Services" services={DIVISION_SERVICES_PROP} cta="Explore Services" image="https://images.unsplash.com/photo-1638885930125-85350348d266?w=1000&h=700&fit=crop&auto=format&q=92" dark={false} imageLeft={false} delay={0.12} divNum="02" />
        </div>
      </div>
    </section>
  );
}

// ─── Featured Projects (home - first 3) ───────────────────────────────────────
function FeaturedProjectsSection() {
  const { items } = useApiList(() => api.getProjects({ limit: 3, isFeatured: true }), []);
  const databaseProjects = items.map((project) => ({
    id: project.slug,
    name: project.title,
    location: displayLocation(project.address),
    type: project.category?.name ?? "Development",
    status: project.developmentStatus === "COMPLETED" ? "Completed" : project.developmentStatus === "ONGOING" ? "Under Construction" : "Upcoming",
    statusBg: project.developmentStatus === "COMPLETED" ? "bg-[#0B5E3C]" : project.developmentStatus === "ONGOING" ? "bg-[#D9A11A]" : "bg-[#6366F1]",
    category: project.category?.name.replace(" Projects", "") ?? "Development",
    image: primaryImage(project.media, FEATURED_PROJECTS[0].image)
  }));
  const displayedProjects = databaseProjects.length > 0 ? databaseProjects : FEATURED_PROJECTS;

  return (
    <section className="bg-[#F7F7F5] py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-[#D9A11A]" />
              <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: dm }}>Our Portfolio</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="font-normal leading-[1.1] text-[#1B1B1B]"
              style={{ fontFamily: gilda, fontSize: "clamp(34px, 3.5vw, 46px)" }}>
              Featured <span className="italic">Projects</span>
            </motion.h2>
          </div>
          <Link to="/projects" className="flex items-center gap-2 text-[0.85rem] font-semibold text-[#0B5E3C] hover:text-[#7A5600] transition-colors duration-300 group" style={{ fontFamily: dm }}>
            View All Projects <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-white rounded-2xl overflow-hidden border border-black/[0.06] hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)] transition-all duration-500 cursor-pointer">
              <div className="relative h-[320px] overflow-hidden bg-[#E0E0E0]">
                <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <span className={`absolute top-4 left-4 ${project.statusBg} text-white text-[0.68rem] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full`} style={{ fontFamily: dm }}>{project.status}</span>
                <span className="absolute top-4 right-4 bg-white/15 backdrop-blur-md border border-white/25 text-white text-[0.68rem] font-medium tracking-wider uppercase px-3 py-1.5 rounded-full" style={{ fontFamily: dm }}>{project.category}</span>
                <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#D9A11A] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-400 shadow-lg"><ArrowUpRight size={16} className="text-white" /></div>
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5"><h3 className="text-white text-[1.3rem] font-normal leading-tight" style={{ fontFamily: gilda }}>{project.name}</h3></div>
              </div>
              <div className="px-5 py-5">
                <div className="flex items-center gap-1.5 text-[#666666] text-[0.875rem] mb-4" style={{ fontFamily: dm }}><MapPin size={12} className="text-[#0B5E3C] shrink-0" /><span>{project.location}</span></div>
                <div className="flex items-center justify-between mb-5">
                  <div><p className="text-[0.8125rem] text-[#666666] uppercase tracking-widest mb-0.5" style={{ fontFamily: dm }}>Property Type</p><p className="text-[0.88rem] text-[#222222] font-medium" style={{ fontFamily: dm }}>{project.type}</p></div>
                  <div className="text-right"><p className="text-[0.8125rem] text-[#666666] uppercase tracking-widest mb-0.5" style={{ fontFamily: dm }}>Status</p><p className="text-[0.88rem] text-[#222222] font-medium" style={{ fontFamily: dm }}>{project.status}</p></div>
                </div>
                <Link to={`/projects/${project.id}`} className="w-full py-3 border border-[#0B5E3C]/25 hover:bg-[#0B5E3C] hover:border-[#0B5E3C] text-[#0B5E3C] hover:text-white text-[1rem] font-semibold tracking-[0.02em] rounded-xl flex items-center justify-center gap-2 transition-all duration-400" style={{ fontFamily: dm }}>View Details <ArrowRight size={13} /></Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Properties (home - first 3) ─────────────────────────────────────
function FeaturedPropertiesSection() {
  const { items } = useApiList(() => api.getProperties({ limit: 3, isFeatured: true }), []);
  const databaseProperties = items.map((property) => ({
    id: property.slug,
    name: property.title,
    location: displayLocation(property.address),
    price: displayPrice(property.priceLabel, property.price, property.currency),
    type: property.categories.find((category) => category.isPrimary)?.category.name ?? property.listingType,
    status: (property.listingType === "RENT" ? "For Rent" : property.listingType === "LEASE" ? "For Lease" : "For Sale") as keyof typeof STATUS_BADGE,
    beds: property.bedrooms ?? null,
    baths: property.bathrooms === null || property.bathrooms === undefined ? null : Number(property.bathrooms),
    area: property.areaSqft ? Number(property.areaSqft).toLocaleString("en-BD") : "—",
    image: primaryImage(property.media, FEATURED_PROPERTIES[0].image)
  }));
  const displayedProperties = databaseProperties.length > 0 ? databaseProperties : FEATURED_PROPERTIES;

  return (
    <section className="py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <motion.div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 mb-14" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#D9A11A]" />
              <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: dm }}>Featured Properties</span>
            </div>
            <h2 className="font-normal leading-[1.1] text-[#1B1B1B]" style={{ fontFamily: gilda, fontSize: "clamp(34px, 3.5vw, 46px)" }}>Handpicked<br /><span className="italic">Premium Listings</span></h2>
          </div>
          <div className="xl:text-right xl:pb-1.5">
            <p className="text-[0.95rem] leading-[1.8] text-[#555555] max-w-[360px] xl:ml-auto mb-5" style={{ fontFamily: dm }}>A curated selection of STARIA's finest residential and commercial properties.</p>
            <Link to="/properties" className="inline-flex items-center gap-2 text-[0.85rem] font-semibold text-[#0B5E3C] hover:text-[#7A5600] transition-colors duration-300 group" style={{ fontFamily: dm }}>
              View All Properties <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedProperties.map((prop, i) => <PropertyCard key={prop.id} {...prop} delay={i * 0.09} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Services Overview ─────────────────────────────────────────────────────────
function ServicesSection() {
  const { items } = useApiList(() => api.getServices(), []);
  const databaseServices = items.map((service, index) => ({
    Icon: SERVICES[index % SERVICES.length].Icon,
    title: service.title,
    desc: service.summary,
    image: primaryImage(service.media, SERVICES[index % SERVICES.length].image)
  }));
  const displayedServices = databaseServices.length > 0 ? databaseServices : SERVICES;

  return (
    <section className="bg-white py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-[#D9A11A]" />
              <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: dm }}>What We Offer</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="font-normal leading-[1.1] text-[#1B1B1B]"
              style={{ fontFamily: gilda, fontSize: "clamp(34px, 3.5vw, 46px)" }}>
              Premium <span className="italic">Services</span>
            </motion.h2>
          </div>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#555555] text-[0.95rem] leading-relaxed max-w-[360px] lg:text-right" style={{ fontFamily: dm }}>
            End-to-end real estate expertise — from acquisition to management, design to investment.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedServices.map((svc, i) => (
            <motion.div key={svc.title} initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.68, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-white rounded-2xl overflow-hidden border border-black/[0.07] hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.09)] transition-all duration-500 cursor-pointer">
              <span className="absolute bottom-0 left-0 z-10 h-[3px] w-0 group-hover:w-full bg-[#D9A11A] transition-all duration-500 ease-out" />
              <div className="relative h-[240px] overflow-hidden bg-[#EAEAEA]">
                <img src={svc.image} alt={svc.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.09]" />
                <div className="absolute inset-0 bg-[#0B5E3C]/0 group-hover:bg-[#0B5E3C]/15 transition-all duration-500" />
              </div>
              <div className="p-7">
                <div className="w-11 h-11 rounded-2xl bg-[#0B5E3C]/[0.07] group-hover:bg-[#0B5E3C] flex items-center justify-center mb-5 transition-all duration-500">
                  <svc.Icon size={19} className="text-[#0B5E3C] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-[1.15rem] font-normal text-[#1B1B1B] group-hover:text-[#0B5E3C] mb-3 transition-colors duration-300" style={{ fontFamily: gilda }}>{svc.title}</h3>
                <p className="text-[#666666] text-[0.875rem] leading-[1.82]" style={{ fontFamily: dm }}>{svc.desc}</p>
                <div className="flex items-center gap-1.5 mt-5 text-[#0B5E3C] text-[0.85rem] font-semibold tracking-[0.04em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400" style={{ fontFamily: dm }}>
                  Learn More <ArrowRight size={13} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HomePage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CompanyOverview />
      <BusinessDivisionsSection />
      <FeaturedPropertiesSection />
      <FeaturedProjectsSection />
      <InteriorPreview />
      <ServicesSection />
      <StatisticsSection />
      <TestimonialsSection />
      <CtaBannerSection />
    </>
  );
}
