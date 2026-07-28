import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  Award, Shield, TrendingUp, Users, Globe, Handshake,
  Leaf, Recycle, Sun, Wind, TreePine, Droplets,
  Eye, Target, Heart, Lightbulb, Gem, Compass,
  ChevronDown, ArrowRight, ArrowUpRight,
  Newspaper, Clock, Tag,
  Plus, Minus,
  Phone, Mail,
} from "lucide-react";
import { api } from "../services/api";
import { useApiList } from "../services/content";

// ─── Shared typography helper ─────────────────────────────────────────────────
const gilda = "'Gilda Display', Georgia, serif";
const dm = "'DM Sans', sans-serif";

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2200, decimals = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((ease * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration, decimals]);

  return { ref, count };
}

// ─── 1. Statistics Section ────────────────────────────────────────────────────
const STATS = [
  { value: 25, suffix: "+", label: "Years of Excellence", sub: "Established 2001" },
  { value: 50, suffix: "+", label: "Landmark Developments", sub: "Across Bangladesh" },
  { value: 12, suffix: "M+", label: "Sq Ft Delivered", sub: "Residential & Commercial" },
  { value: 5000, suffix: "Cr+", label: "Total Portfolio Value", sub: "BDT Assets Managed", prefix: "৳" },
  { value: 98.5, suffix: "%", label: "Client Satisfaction", sub: "Verified Reviews", decimals: 1 },
  { value: 800, suffix: "+", label: "Properties Managed", sub: "NRB & Resident Portfolios" },
] as const;

function StatCounter({ value, suffix, label, sub, prefix = "", decimals = 0 }: {
  value: number; suffix: string; label: string; sub: string; prefix?: string; decimals?: number;
}) {
  const { ref, count } = useCountUp(value, 2000, decimals);
  return (
    <div className="text-center group cursor-default">
      <div
        className="relative inline-flex flex-col items-center justify-center w-[196px] h-[196px] rounded-full border border-white/[0.07]
          group-hover:border-[#D9A11A]/40 transition-colors duration-500"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(11, 94, 60,0.12) 0%, transparent 70%)" }}
      >
        <span
          ref={ref}
          className="leading-none"
          style={{ fontFamily: gilda, fontSize: "2.25rem", color: "#D9A11A" }}
        >
          {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
        </span>
        <span
          className="text-white/55 text-[0.7rem] tracking-[0.3em] uppercase mt-1.5"
          style={{ fontFamily: dm }}
        >
          {label}
        </span>
      </div>
      <p className="text-white/35 text-[0.75rem] mt-3" style={{ fontFamily: dm }}>{sub}</p>
    </div>
  );
}

export function StatisticsSection() {
  const { items } = useApiList(() => api.getCompanyStats(), []);
  const databaseStats = items.map((stat) => ({
    value: Number(stat.value),
    suffix: stat.suffix ?? "",
    label: stat.label,
    sub: stat.note ?? "",
    prefix: stat.prefix ?? "",
    decimals: Number(stat.value) % 1 === 0 ? 0 : 1
  }));
  const displayedStats = databaseStats.length > 0 ? databaseStats : STATS;

  return (
    <section className="bg-[#082D1C] py-36 relative overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {/* Gold radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(245,166,35,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-[1440px] mx-auto px-12 xl:px-20 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-8 h-px bg-[#D9A11A]" />
            <span className="text-[#D9A11A] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold" style={{ fontFamily: dm }}>
              STARIA in Numbers
            </span>
            <span className="block w-8 h-px bg-[#D9A11A]" />
          </div>
          <h2 className="font-normal leading-[1.1] text-white" style={{ fontFamily: gilda, fontSize: "clamp(32px, 3.3vw, 44px)" }}>
            Two Decades of <span className="italic">Building Trust</span>
          </h2>
        </motion.div>

        {/* Counters */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8 xl:gap-6 justify-items-center">
          {displayedStats.map((s, i) => {
            const decimals = ("decimals" in s ? s.decimals : 0) as number;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <StatCounter
                  value={s.value}
                  suffix={s.suffix}
                  label={s.label}
                  sub={s.sub}
                  prefix={"prefix" in s ? s.prefix : ""}
                  decimals={decimals}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Gold rule */}
        <motion.div
          className="mt-20 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(245,166,35,0.35), transparent)" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </section>
  );
}

// ─── 2. Vision & Mission ──────────────────────────────────────────────────────
export function VisionMissionSection() {
  return (
    <section className="bg-white py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-24 items-stretch">

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&h=660&fit=crop&auto=format&q=92"
              alt="STARIA Vision — landmark architecture"
              className="w-full h-full object-cover min-h-[520px]"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,17,10,0.92) 0%, rgba(7,17,10,0.2) 60%, transparent 100%)" }} />
            <div className="absolute inset-0 flex flex-col justify-end p-10 xl:p-12">
              <div className="w-12 h-12 rounded-2xl bg-[#D9A11A] flex items-center justify-center mb-6">
                <Eye size={22} className="text-[#1B1B1B]" />
              </div>
              <p className="text-[#D9A11A] text-[0.8125rem] tracking-[0.55em] uppercase font-semibold mb-3" style={{ fontFamily: dm }}>
                Our Vision
              </p>
              <h3 className="text-white leading-[1.15] mb-4" style={{ fontFamily: gilda, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 400 }}>
                Bangladesh's Most Respected Name in Property
              </h3>
              <p className="text-white/55 leading-[1.85] text-[0.9rem]" style={{ fontFamily: dm }}>
                To be recognised across South Asia as the benchmark for integrity, innovation, and luxury in real estate development — delivering spaces that inspire generations.
              </p>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="p-10 xl:p-12 rounded-3xl bg-[#0B5E3C] flex-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[180px] h-[180px]" style={{ background: "radial-gradient(circle at 100% 0%, rgba(245,166,35,0.12) 0%, transparent 70%)" }} />
              <div className="w-12 h-12 rounded-2xl bg-white/[0.12] flex items-center justify-center mb-6">
                <Target size={22} className="text-white" />
              </div>
              <p className="text-[#D9A11A] text-[0.8125rem] tracking-[0.55em] uppercase font-semibold mb-3" style={{ fontFamily: dm }}>
                Our Mission
              </p>
              <h3 className="text-white leading-[1.15] mb-4" style={{ fontFamily: gilda, fontSize: "clamp(18px, 1.8vw, 24px)", fontWeight: 400 }}>
                Creating Extraordinary Spaces for Extraordinary Lives
              </h3>
              <p className="text-white/65 leading-[1.85] text-[0.9rem]" style={{ fontFamily: dm }}>
                We are committed to delivering real estate developments that exceed expectations at every level — from land acquisition through to post-handover care. Our clients invest their trust with us; we invest our excellence in their futures.
              </p>
            </div>

            <div className="p-10 xl:p-12 rounded-3xl bg-[#F7F7F5] flex-1">
              <div className="w-12 h-12 rounded-2xl bg-[#0B5E3C]/10 flex items-center justify-center mb-6">
                <Compass size={22} className="text-[#0B5E3C]" />
              </div>
              <p className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.55em] uppercase font-semibold mb-3" style={{ fontFamily: dm }}>
                Our Promise
              </p>
              <h3 className="text-[#1B1B1B] leading-[1.15] mb-4" style={{ fontFamily: gilda, fontSize: "clamp(18px, 1.8vw, 24px)", fontWeight: 400 }}>
                Quality Without Compromise
              </h3>
              <p className="text-[#555555] leading-[1.85] text-[0.9rem]" style={{ fontFamily: dm }}>
                From the first blueprint to the final flourish, every STARIA project is bound by an absolute commitment to premium materials, skilled craftsmanship, and transparent client relationships.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─── 3. Core Values ───────────────────────────────────────────────────────────
const VALUES = [
  { icon: Gem, title: "Excellence", desc: "We hold ourselves to the highest standards in every discipline — architecture, construction, customer service, and aftercare." },
  { icon: Shield, title: "Integrity", desc: "Transparent pricing, honest timelines, and straightforward communication. We believe trust is built through consistency, not promises." },
  { icon: Lightbulb, title: "Innovation", desc: "We embrace smart building technology, sustainable methods, and cutting-edge design to deliver future-ready spaces today." },
  { icon: Heart, title: "Client First", desc: "Every decision is made with our clients' best interests at heart. Their vision drives our work; their satisfaction defines our success." },
  { icon: Users, title: "Collaboration", desc: "We partner with world-class architects, engineers, and designers, believing that great buildings are born from great teamwork." },
  { icon: Globe, title: "Sustainability", desc: "Environmental responsibility is embedded in our DNA. Every project is designed to minimise its footprint and maximise its longevity." },
] as const;

export function CoreValuesSection() {
  return (
    <section className="bg-[#F7F7F5] py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-16 items-end mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#D9A11A]" />
              <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold" style={{ fontFamily: dm }}>
                Core Values
              </span>
            </div>
            <h2 className="font-normal leading-[1.08] text-[#1B1B1B]" style={{ fontFamily: gilda, fontSize: "clamp(34px, 3.5vw, 46px)" }}>
              What We<br /><span className="italic text-[#0B5E3C]">Stand For</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#555555] leading-[1.9] text-[0.97rem] max-w-[500px]"
            style={{ fontFamily: dm }}
          >
            Our values are not aspirations written on a wall — they are the standards we hold ourselves to on every project, with every client, every single day.
          </motion.p>
        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group p-9 rounded-2xl bg-white border border-transparent hover:border-[#0B5E3C]/15 hover:-translate-y-1.5
                hover:shadow-[0_16px_56px_rgba(11, 94, 60,0.10)] transition-all duration-500 cursor-default"
            >
              {/* Number */}
              <span className="text-[#0B5E3C]/[0.07] leading-none block mb-3 select-none" style={{ fontFamily: gilda, fontSize: "4rem" }}>
                0{i + 1}
              </span>
              {/* Icon */}
              <div className="w-[56px] h-[56px] rounded-2xl bg-[#0B5E3C]/[0.07] flex items-center justify-center mb-5
                group-hover:bg-[#0B5E3C] transition-colors duration-400">
                <Icon size={20} className="text-[#0B5E3C] group-hover:text-white transition-colors duration-400" strokeWidth={1.6} />
              </div>
              <h3 className="text-[1.15rem] font-normal text-[#1B1B1B] mb-3 group-hover:text-[#0B5E3C] transition-colors duration-300" style={{ fontFamily: gilda }}>
                {title}
              </h3>
              <p className="text-[#555555] text-[0.875rem] leading-[1.85]" style={{ fontFamily: dm }}>{desc}</p>
              {/* Bottom accent line */}
              <span className="block mt-6 w-0 h-px bg-[#D9A11A] group-hover:w-10 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 4. Sustainability Section ────────────────────────────────────────────────
const ECO_FEATURES = [
  { icon: Sun, label: "Solar Integration", value: "40% energy reduction" },
  { icon: Droplets, label: "Rainwater Harvesting", value: "60% less water waste" },
  { icon: TreePine, label: "Green Rooftops", value: "12 projects completed" },
  { icon: Wind, label: "Passive Ventilation", value: "30% lower HVAC load" },
  { icon: Recycle, label: "Material Recycling", value: "75% construction waste recycled" },
  { icon: Leaf, label: "LEED Certification", value: "4 certified developments" },
] as const;

export function SustainabilitySection() {
  return (
    <section className="bg-white py-36 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -44 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden h-[520px] lg:h-[600px]">
              <img
                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&h=700&fit=crop&auto=format&q=92"
                alt="Sustainable green architecture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,40,14,0.65) 0%, transparent 55%)" }} />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-6 -right-6 bg-[#0B5E3C] rounded-2xl p-6 text-center"
              style={{ boxShadow: "0 20px 60px rgba(11, 94, 60,0.3)" }}
            >
              <p style={{ fontFamily: gilda, fontSize: "2.6rem", color: "#D9A11A" }} className="leading-none">2030</p>
              <p className="text-white/70 text-[0.72rem] tracking-[0.35em] uppercase mt-2" style={{ fontFamily: dm }}>Carbon Neutral Target</p>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 44 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#D9A11A]" />
              <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold" style={{ fontFamily: dm }}>
                Sustainability
              </span>
            </div>
            <h2 className="font-normal leading-[1.1] text-[#1B1B1B] mb-5" style={{ fontFamily: gilda, fontSize: "clamp(34px, 3.5vw, 46px)" }}>
              Building Today for<br /><span className="italic text-[#0B5E3C]">Tomorrow's World</span>
            </h2>
            <p className="text-[#555555] leading-[1.9] text-[0.97rem] mb-10" style={{ fontFamily: dm }}>
              Environmental stewardship is not a checkbox for STARIA — it is a core design principle. Every development we deliver is engineered to reduce energy consumption, conserve natural resources, and minimise environmental impact across its entire lifecycle.
            </p>

            {/* Eco feature grid */}
            <div className="grid grid-cols-2 gap-4">
              {ECO_FEATURES.map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-[#F7F7F5] hover:bg-[#0B5E3C]/[0.06] transition-colors duration-300 group cursor-default"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0B5E3C]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0B5E3C]/20 transition-colors duration-300">
                    <Icon size={16} className="text-[#0B5E3C]" />
                  </div>
                  <div>
                    <p className="text-[#222222] text-[0.82rem] font-semibold leading-snug" style={{ fontFamily: dm }}>{label}</p>
                    <p className="text-[#0B5E3C] text-[0.75rem] mt-0.5" style={{ fontFamily: dm }}>{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─── 5. Trusted Partners ─────────────────────────────────────────────────────
const PARTNERS = [
  "BRAC", "Siemens", "Lafarge Holcim", "Bangladesh Bank", "Dutch-Bangla", "RAK Ceramics",
  "Berger Paints", "Schneider Electric", "Mitsubishi Electric", "Kone Elevators", "City Bank", "Standard Chartered",
] as const;

function PartnerLogo({ name }: { name: string }) {
  return (
    <div className="flex-shrink-0 mx-10 flex items-center justify-center h-14 group cursor-default">
      <span
        className="text-black/25 group-hover:text-[#0B5E3C] transition-colors duration-400 text-[0.85rem] tracking-[0.25em] uppercase font-semibold select-none"
        style={{ fontFamily: dm }}
      >
        {name}
      </span>
    </div>
  );
}

export function PartnersSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-[#F7F7F5] py-36 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20 mb-16">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block w-8 h-px bg-[#D9A11A]" />
          <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold" style={{ fontFamily: dm }}>
            Trusted Partners &amp; Collaborators
          </span>
          <span className="block flex-1 h-px bg-black/[0.07]" />
        </motion.div>
      </div>

      {/* Marquee container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #F7F7F5, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #F7F7F5, transparent)" }} />

        {/* Scrolling track */}
        <div className="flex overflow-hidden">
          <motion.div
            ref={trackRef}
            className="flex"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {[...PARTNERS, ...PARTNERS].map((name, i) => (
              <PartnerLogo key={`${name}-${i}`} name={name} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 6. News & Insights ───────────────────────────────────────────────────────
const NEWS_ARTICLES = [
  {
    id: "n1",
    category: "Market Report",
    date: "12 July 2026",
    readTime: "5 min read",
    title: "Dhaka's Premium Property Market Reaches Record High in Q2 2026",
    excerpt: "Analysis of Gulshan and Banani residential towers reveals a 28% year-on-year increase in per-square-foot valuations, driven by limited supply and rising NRB demand.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&h=480&fit=crop&auto=format&q=92",
  },
  {
    id: "n2",
    category: "STARIA News",
    date: "3 July 2026",
    readTime: "3 min read",
    title: "STARIA Commerce Park Achieves LEED Gold Certification",
    excerpt: "Our flagship commercial development in Motijheel has received LEED Gold certification, recognising its solar integration, passive cooling systems, and low-carbon construction methods.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=700&h=480&fit=crop&auto=format&q=92",
  },
  {
    id: "n3",
    category: "Insight",
    date: "21 June 2026",
    readTime: "7 min read",
    title: "Why NRB Investors are Turning to Professional Property Management",
    excerpt: "With over 1.2 million Bangladeshis residing abroad, the demand for trusted, tech-enabled property management services has never been greater. We explore the key drivers.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&h=480&fit=crop&auto=format&q=92",
  },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  "Market Report": "#0B5E3C",
  "STARIA News": "#7A5600",
  "Insight": "#2A5AA5",
};

export function NewsInsightsSection() {
  const { items, error } = useApiList(() => api.getNews({ limit: 6 }), []);
  const databaseArticles = items.map((article, index) => ({
    id: article.slug,
    category: article.category?.name ?? "STARIA News",
    date: article.publishedAt
      ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.publishedAt))
      : "Recently published",
    readTime: `${Math.max(2, Math.ceil(article.body.split(/\s+/).length / 220))} min read`,
    title: article.title,
    excerpt: article.excerpt ?? article.body.slice(0, 180),
    image: NEWS_ARTICLES[index % NEWS_ARTICLES.length].image
  }));
  const displayedArticles = databaseArticles.length > 0 ? databaseArticles : NEWS_ARTICLES;

  return (
    <section className="bg-white py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#D9A11A]" />
              <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold" style={{ fontFamily: dm }}>
                News &amp; Insights
              </span>
            </div>
            <h2 className="font-normal leading-[1.1] text-[#1B1B1B]" style={{ fontFamily: gilda, fontSize: "clamp(32px, 3.3vw, 44px)" }}>
              Ideas, Reports &amp;<br /><span className="italic">Market Intelligence</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-[#1B1B1B]/15 rounded-full text-[#1B1B1B] text-[1rem] font-semibold
              hover:border-[#0B5E3C] hover:text-[#0B5E3C] transition-all duration-300 self-start shrink-0"
            style={{ fontFamily: dm }}
          >
            <Link to="/news" className="inline-flex items-center gap-2.5">View All Articles <ArrowRight size={14} /></Link>
          </motion.div>
        </div>

        {/* Article cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {error && <div className="md:col-span-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">Live news is temporarily unavailable; representative demo articles are shown.</div>}
          {displayedArticles.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col rounded-2xl overflow-hidden border border-black/[0.06] hover:border-[#0B5E3C]/20
                hover:-translate-y-2 hover:shadow-[0_16px_56px_rgba(11, 94, 60,0.10)] transition-all duration-500 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Category badge */}
                <span
                  className="absolute top-4 left-4 text-white text-[0.66rem] tracking-[0.3em] uppercase font-semibold px-3 py-1.5 rounded-full"
                  style={{ fontFamily: dm, backgroundColor: CATEGORY_COLORS[article.category] ?? "#0B5E3C" }}
                >
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-7">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-1.5 text-[#666666] text-[0.75rem]" style={{ fontFamily: dm }}>
                    <Clock size={11} /> {article.date}
                  </span>
                  <span className="w-px h-3 bg-black/15" />
                  <span className="flex items-center gap-1.5 text-[#666666] text-[0.75rem]" style={{ fontFamily: dm }}>
                    <Newspaper size={11} /> {article.readTime}
                  </span>
                </div>

                <h3 className="text-[#1B1B1B] leading-[1.35] mb-3 group-hover:text-[#0B5E3C] transition-colors duration-300" style={{ fontFamily: gilda, fontSize: "1.1rem", fontWeight: 400 }}>
                  {article.title}
                </h3>

                <p className="text-[#555555] text-[0.85rem] leading-[1.8] flex-1 mb-6" style={{ fontFamily: dm }}>
                  {article.excerpt}
                </p>

                <Link to={`/news/${article.id}`} className="flex items-center gap-2 text-[#0B5E3C] text-[0.8rem] font-semibold group-hover:gap-3 transition-all duration-300" style={{ fontFamily: dm }}>
                  Read Article <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 7. FAQ Section ───────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What types of properties does STARIA develop?",
    a: "STARIA develops across three primary sectors: premium residential apartments and townhouses, Grade-A commercial and mixed-use towers, and purpose-built institutional facilities. All developments are located in prime areas of Dhaka and Chattogram.",
  },
  {
    q: "How does the property buying process work with STARIA?",
    a: "Our process begins with a personalised consultation to understand your requirements and budget. We then present a curated selection of suitable properties, arrange site visits, and support you through every legal and financial step from offer acceptance through to title deed registration.",
  },
  {
    q: "Do you offer services for Non-Resident Bangladeshis (NRBs)?",
    a: "Yes. We have a dedicated NRB Property Management division that provides end-to-end services for Bangladeshis living abroad. This includes property sourcing, legal representation via power of attorney, tenant management, rent collection, and regular reporting — all managed remotely with full transparency.",
  },
  {
    q: "Can I invest in STARIA development projects?",
    a: "We offer structured investment opportunities in select development projects, providing attractive returns underpinned by prime land assets and our 25-year track record. Speak with our Investment Consultancy team for a confidential briefing on current opportunities.",
  },
  {
    q: "What is included in your property management service?",
    a: "Our full property management package covers tenant sourcing and screening, lease administration, rent collection and arrears management, property inspections, maintenance coordination, legal documentation, and monthly financial reporting — all handled by dedicated relationship managers.",
  },
  {
    q: "How do I get started with an interior design project?",
    a: "Book a complimentary Interior Consultation via our website or by calling our design studio directly. Our team will visit your property, discuss your vision and budget, and present a concept proposal within 5 working days. Projects typically proceed from concept approval to completion in 8–24 weeks.",
  },
] as const;

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-black/[0.07] last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
      >
        <span
          className="text-[#1B1B1B] text-[0.97rem] leading-snug group-hover:text-[#0B5E3C] transition-colors duration-300"
          style={{ fontFamily: gilda }}
        >
          {q}
        </span>
        <span
          className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-400 ${
            open
              ? "bg-[#0B5E3C] border-[#0B5E3C] text-white"
              : "border-black/[0.12] text-[#444444] group-hover:border-[#0B5E3C] group-hover:text-[#0B5E3C]"
          }`}
        >
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[#555555] text-[0.9rem] leading-[1.9] pb-6" style={{ fontFamily: dm }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection() {
  const { items, error } = useApiList(() => api.getFaqs(), []);
  const databaseFaqs = items.map((faq) => ({ q: faq.question, a: faq.answer }));
  const displayedFaqs = databaseFaqs.length > 0 ? databaseFaqs : FAQS;

  return (
    <section className="bg-[#F7F7F5] py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <div className="grid lg:grid-cols-[1fr_1.55fr] gap-16 xl:gap-28">

          {/* Left: sticky heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28 self-start"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#D9A11A]" />
              <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold" style={{ fontFamily: dm }}>
                Frequently Asked
              </span>
            </div>
            <h2 className="font-normal leading-[1.1] text-[#1B1B1B] mb-7" style={{ fontFamily: gilda, fontSize: "clamp(32px, 3.3vw, 44px)" }}>
              Questions<br /><span className="italic">Answered</span>
            </h2>
            <p className="text-[#555555] text-[0.9rem] leading-[1.85] mb-9" style={{ fontFamily: dm }}>
              Can't find the answer you're looking for? Our team is available Monday to Saturday, 9am–7pm.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#0B5E3C] text-white rounded-full text-[0.85rem] font-semibold
                  hover:bg-[#09502F] transition-colors duration-300"
                style={{ fontFamily: dm }}
              >
                <Mail size={14} /> Email Us
              </a>
              <a
                href="tel:+8801700000000"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-[#1B1B1B]/15 text-[#1B1B1B] rounded-full text-[0.85rem] font-semibold
                  hover:border-[#0B5E3C] hover:text-[#0B5E3C] transition-all duration-300"
                style={{ fontFamily: dm }}
              >
                <Phone size={14} /> Call Our Team
              </a>
            </div>
          </motion.div>

          {/* Right: accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl px-8 xl:px-10 py-2"
          >
            {error && <p className="py-4 text-sm text-amber-700">Live FAQs are temporarily unavailable; representative answers are shown.</p>}
            {displayedFaqs.map((faq, i) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─── 8. CTA Banner ───────────────────────────────────────────────────────────
export function CtaBannerSection() {
  return (
    <section className="bg-white py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden"
          style={{ minHeight: "420px" }}
        >
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1400&h=500&fit=crop&auto=format&q=92"
            alt="STARIA premium architecture"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(7,17,10,0.92) 0%, rgba(7,17,10,0.72) 55%, rgba(7,17,10,0.4) 100%)" }} />

          {/* Corner brackets */}
          <span className="absolute top-7 left-7 w-9 h-9 border-t-2 border-l-2 border-[#D9A11A]/30 rounded-tl pointer-events-none" />
          <span className="absolute top-7 right-7 w-9 h-9 border-t-2 border-r-2 border-[#D9A11A]/30 rounded-tr pointer-events-none" />
          <span className="absolute bottom-7 left-7 w-9 h-9 border-b-2 border-l-2 border-[#D9A11A]/30 rounded-bl pointer-events-none" />
          <span className="absolute bottom-7 right-7 w-9 h-9 border-b-2 border-r-2 border-[#D9A11A]/30 rounded-br pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10 px-14 xl:px-20 py-20">
            <div className="w-full lg:max-w-[580px] shrink-0 lg:shrink">
              <p className="text-[#D9A11A] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold mb-4" style={{ fontFamily: dm }}>
                Start Your Journey
              </p>
              <h2 className="font-normal leading-[1.1] text-white mb-5" style={{ fontFamily: gilda, fontSize: "clamp(32px, 3.5vw, 46px)" }}>
                Ready to Invest in a Space<br />
                <span className="italic">Worth Living In?</span>
              </h2>
              <p className="text-white/55 leading-[1.85] text-[0.97rem]" style={{ fontFamily: dm }}>
                Speak with a STARIA consultant today. Whether you're buying, building, or managing — we're ready to serve your ambition.
              </p>
            </div>

            <div className="flex flex-col gap-4 shrink-0 w-full lg:w-auto">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-3 px-10 py-4 bg-[#D9A11A] hover:bg-[#C08912] text-[#1B1B1B] font-semibold rounded-full transition-colors duration-300 whitespace-nowrap"
                  style={{ fontFamily: dm, boxShadow: "0 10px 40px rgba(217,161,26,0.35)" }}
                >
                  Book a Consultation <ArrowRight size={16} />
                </Link>
              </motion.div>
              <Link
                to="/properties"
                className="flex items-center justify-center gap-2.5 px-10 py-4 border border-white/25 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 whitespace-nowrap"
                style={{ fontFamily: dm }}
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
