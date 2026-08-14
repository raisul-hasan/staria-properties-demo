import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  Star, Heart, LayoutDashboard, Leaf,
  ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight,
  CheckCheck, Users, Eye, Paintbrush,
  Building2, Key,
} from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

// ── Design Philosophy ─────────────────────────────────────────────────────────
const PHILOSOPHY = [
  {
    icon: Star,
    title: "Timeless Aesthetics",
    desc: "Every palette, material and form is chosen to remain beautiful decades from now — design that transcends trend cycles.",
  },
  {
    icon: LayoutDashboard,
    title: "Spatial Intelligence",
    desc: "We orchestrate flow, proportion and volume so that every room feels precisely the right size for its purpose.",
  },
  {
    icon: Leaf,
    title: "Material Excellence",
    desc: "Natural stone, solid timber, bespoke metals — only the finest curated finishes, selected for beauty and longevity.",
  },
  {
    icon: Heart,
    title: "Human-Centered",
    desc: "Great interiors serve the people who inhabit them. Your lifestyle, rituals and aspirations are the genuine brief.",
  },
] as const;

// ── Interior Types ────────────────────────────────────────────────────────────
const INTERIOR_TYPES = [
  {
    num: "01",
    category: "Residential",
    title: "Living Spaces & Residences",
    subtitle: "Where Comfort Meets Elegance",
    desc: "From intimate city apartments to sprawling private villas, we create homes that balance warmth with sophistication. Every surface, fixture and light source is chosen to reflect how you actually live.",
    features: [
      "Bespoke furniture curation and placement",
      "Layered ambient, task and accent lighting",
      "Material palette and finish consultation",
      "Full 3D visualisation before execution",
    ],
    image: "https://images.unsplash.com/photo-1780257562963-3389a4105371?w=900&h=700&fit=crop&auto=format&q=92",
    alt: "Luxury modern residential living room",
    reversed: false,
  },
  {
    num: "02",
    category: "Commercial",
    title: "Restaurants & Hospitality",
    subtitle: "Atmosphere That Commands Attention",
    desc: "A restaurant interior should create anticipation before a single dish arrives. We craft hospitality spaces with visual drama, acoustic intelligence and seamless guest journey planning.",
    features: [
      "Guest flow and journey planning",
      "Acoustic design, zoning and privacy",
      "Custom joinery and artisan millwork",
      "Brand expression through material language",
    ],
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&h=700&fit=crop&auto=format&q=92",
    alt: "Luxury restaurant interior design",
    reversed: true,
  },
  {
    num: "03",
    category: "Office",
    title: "Corporate & Office Spaces",
    subtitle: "Productive Environments, Inspired Design",
    desc: "Workplaces that sharpen focus, elevate brand identity and communicate authority. Ergonomics, acoustic planning and cable management underpin a refined surface language.",
    features: [
      "Ergonomic space planning and layout",
      "Built-in joinery and cable management",
      "Brand identity and material integration",
      "Smart AV and lighting automation",
    ],
    image: "https://images.unsplash.com/photo-1715593949273-09009558300a?w=900&h=700&fit=crop&auto=format&q=92",
    alt: "Premium corporate office interior design",
    reversed: false,
  },
] as const;

// ── Portfolio items ───────────────────────────────────────────────────────────
type PortfolioCat = "All" | "Residential" | "Commercial" | "Office";
const PORTFOLIO_CATS: PortfolioCat[] = ["All", "Residential", "Commercial", "Office"];

const PORTFOLIO_ITEMS = [
  { id: 1, cat: "Residential" as const, title: "Gulshan Heights Penthouse", src: "https://images.unsplash.com/photo-1760611655987-d348d6d28174?w=700&h=900&fit=crop&auto=format&q=92" },
  { id: 2, cat: "Commercial" as const, title: "Azure Restaurant, Banani", src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&h=500&fit=crop&auto=format&q=92" },
  { id: 3, cat: "Office" as const, title: "STARIA Executive Suite", src: "https://images.unsplash.com/photo-1715593949273-09009558300a?w=700&h=500&fit=crop&auto=format&q=92" },
  { id: 4, cat: "Residential" as const, title: "Grand Salon, Bashundhara", src: "https://images.unsplash.com/photo-1648881806148-e5c51179c826?w=700&h=800&fit=crop&auto=format&q=92" },
  { id: 5, cat: "Residential" as const, title: "Marble Kitchen Residence", src: "https://images.unsplash.com/photo-1683629357963-adf2b1fa9ad9?w=700&h=500&fit=crop&auto=format&q=92" },
  { id: 6, cat: "Residential" as const, title: "Master Suite Retreat", src: "https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=700&h=800&fit=crop&auto=format&q=92" },
  { id: 7, cat: "Commercial" as const, title: "The Dining Hall, Motijheel", src: "https://images.unsplash.com/photo-1679312061521-d7d619a8cfb7?w=700&h=500&fit=crop&auto=format&q=92" },
  { id: 8, cat: "Office" as const, title: "Glass Boardroom, Gulshan 2", src: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=700&h=600&fit=crop&auto=format&q=92" },
  { id: 9, cat: "Residential" as const, title: "Bespoke Media Room", src: "https://images.unsplash.com/photo-1667510436110-79d3dabc2008?w=700&h=600&fit=crop&auto=format&q=92" },
];

// ── Design Process ────────────────────────────────────────────────────────────
const DESIGN_PROCESS = [
  {
    num: "01",
    title: "Consultation",
    desc: "A private session with our senior designers. We visit your space, listen to your vision and lifestyle, and establish a complete brief before a single concept is drawn.",
    icon: Users,
  },
  {
    num: "02",
    title: "Concept Development",
    desc: "Mood boards, spatial layouts and material palettes that distil your brief into a coherent design language — presented for your review and refinement.",
    icon: Paintbrush,
  },
  {
    num: "03",
    title: "3D Visualisation",
    desc: "Photo-realistic renders and walkthrough animations of the finished space before a single wall is touched — complete confidence before commitment.",
    icon: Eye,
  },
  {
    num: "04",
    title: "Execution",
    desc: "In-house craftsmen and vetted trade partners bring the vision to life with rigorous quality control at every structural and finishing milestone.",
    icon: Building2,
  },
  {
    num: "05",
    title: "Handover",
    desc: "A thorough walkthrough, snagging review, maintenance guide and 12-month aftercare programme — because our relationship doesn't end at completion.",
    icon: Key,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Section 1 — Hero
// ─────────────────────────────────────────────────────────────────────────────
function InteriorHeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  return (
    <div ref={ref} className="relative overflow-hidden bg-[#1B1B1B]" style={{ height: "90vh", minHeight: 600 }}>
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src="https://images.unsplash.com/photo-1776362355123-ca966d36e29c?w=1800&h=1100&fit=crop&auto=format&q=92"
          alt="Luxurious modern living room with large windows and grand staircase"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Layered gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end max-w-[1440px] mx-auto px-12 xl:px-20 pb-20 xl:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-8 h-px bg-[#D9A11A]" />
            <span
              className="text-[#D9A11A] text-[0.66rem] tracking-[0.55em] uppercase font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Interior Design
            </span>
          </div>

          {/* Headline */}
          <h2
            className="font-normal leading-[1.05] text-white mb-5"
            style={{
              fontFamily: "'Gilda Display', Georgia, serif",
              fontSize: "clamp(32px, 3.3vw, 44px)",
            }}
          >
            Spaces That Tell
            <br />
            <em
              className="not-italic italic"
              style={{ color: "#D9A11A" }}
            >
              Your Story
            </em>
          </h2>

          {/* Subtext */}
          <p
            className="text-white/60 max-w-[420px] leading-[1.85]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.02rem" }}
          >
            Premium interior design for residential, commercial and corporate
            spaces across Bangladesh's finest properties.
          </p>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-10 xl:gap-14 mt-12 pt-10 border-t border-white/[0.14]"
        >
          {[
            { val: "340+", label: "Spaces Designed" },
            { val: "18", label: "Years of Excellence" },
            { val: "98%", label: "Client Satisfaction" },
          ].map((s) => (
            <div key={s.label}>
              <p
                className="text-white leading-none mb-1.5"
                style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(24px, 2.5vw, 34px)" }}
              >
                {s.val}
              </p>
              <p
                className="text-white/45 uppercase tracking-[0.22em]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 2 — Design Philosophy
// ─────────────────────────────────────────────────────────────────────────────
function DesignPhilosophySection() {
  return (
    <section className="bg-white py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">

        {/* Split header */}
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 mb-20 items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-7 h-px bg-[#D9A11A]" />
              <span
                className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Our Philosophy
              </span>
            </div>
            <h2
              className="font-normal leading-[1.1] text-[#1B1B1B]"
              style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(32px, 3.3vw, 44px)" }}
            >
              Design That Goes
              <br />
              <span className="italic">Beyond the Surface</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#555555] leading-[1.9] lg:pb-2"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem" }}
          >
            At STARIA, interior design is not decoration — it is spatial
            storytelling. We blend architectural rigour with artistic sensitivity
            to create environments that feel inevitable, as though they could
            never have been any other way.
          </motion.p>
        </div>

        {/* 4-pillar grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {PHILOSOPHY.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group p-8 rounded-2xl border border-black/[0.06] bg-white hover:border-[#0B5E3C]/25 hover:shadow-xl hover:shadow-[#0B5E3C]/[0.06] transition-all duration-500 cursor-default"
              >
                {/* Icon box */}
                <div className="w-12 h-12 rounded-2xl bg-[#0B5E3C]/[0.07] flex items-center justify-center mb-6 transition-all duration-400 group-hover:bg-[#0B5E3C]">
                  <Icon size={22} className="text-[#0B5E3C] transition-colors duration-400 group-hover:text-white" />
                </div>
                <h3
                  className="text-[#1B1B1B] mb-3 leading-tight"
                  style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "1.2rem", fontWeight: 400 }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-[#555555] leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem" }}
                >
                  {p.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 3 — Interior Types (Residential / Commercial / Office)
// ─────────────────────────────────────────────────────────────────────────────
function InteriorTypeCard({
  num, category, title, subtitle, desc, features, image, alt, reversed,
}: typeof INTERIOR_TYPES[number]) {
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgContainerRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const [hovered, setHovered] = useState(false);

  const imageBlock = (
    <motion.div
      initial={{ opacity: 0, x: reversed ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={imgContainerRef}
        className="relative overflow-hidden rounded-3xl bg-[#D8D8D8] h-[460px] lg:h-[540px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full"
        >
          <motion.div style={{ y: imgY }} className="w-full h-full">
            <img src={image} alt={alt} className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Category badge */}
        <div className="absolute top-6 left-6">
          <span
            className="bg-[#0B5E3C] text-white text-[0.8125rem] tracking-[0.35em] uppercase px-4 py-2 rounded-full"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {category}
          </span>
        </div>

        {/* Ghost step number */}
        <div className="absolute bottom-5 right-7 select-none pointer-events-none">
          <span
            className="text-white/[0.14] leading-none"
            style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "6rem" }}
          >
            {num}
          </span>
        </div>
      </div>
    </motion.div>
  );

  const contentBlock = (
    <motion.div
      initial={{ opacity: 0, x: reversed ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="py-6 lg:py-0 flex flex-col justify-center"
    >
      <p
        className="text-[0.8125rem] tracking-[0.45em] uppercase font-semibold mb-4 text-[#0B5E3C]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {subtitle}
      </p>
      <h3
        className="text-[#1B1B1B] mb-5 leading-tight"
        style={{
          fontFamily: "'Gilda Display', Georgia, serif",
          fontSize: "clamp(20px, 2.2vw, 30px)",
          fontWeight: 400,
        }}
      >
        {title}
      </h3>
      <p
        className="text-[#555555] leading-[1.9] mb-8"
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.93rem" }}
      >
        {desc}
      </p>

      {/* Features list */}
      <ul className="space-y-3 mb-10">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <CheckCheck size={15} className="text-[#0B5E3C] mt-0.5 shrink-0" />
            <span
              className="text-[#444444] leading-snug"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem" }}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA link */}
      <button
        className="inline-flex items-center gap-2.5 text-[#0B5E3C] tracking-[0.08em] uppercase font-semibold border-b border-[#0B5E3C]/30 pb-0.5 hover:border-[#0B5E3C] hover:gap-4 transition-all duration-300 group self-start"
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem" }}
      >
        Explore This Space
        <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </motion.div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
      <div className={reversed ? "lg:order-2" : "lg:order-1"}>{imageBlock}</div>
      <div className={reversed ? "lg:order-1" : "lg:order-2"}>{contentBlock}</div>
    </div>
  );
}

function InteriorTypesSection() {
  return (
    <section className="bg-[#F7F7F5] py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">

        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-7 h-px bg-[#D9A11A]" />
            <span
              className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Design Expertise
            </span>
            <span className="block w-7 h-px bg-[#D9A11A]" />
          </div>
          <h2
            className="font-normal leading-[1.1] text-[#1B1B1B]"
            style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(30px, 3vw, 40px)" }}
          >
            What We Design
          </h2>
        </motion.div>

        {/* Alternating cards */}
        <div className="space-y-24">
          {INTERIOR_TYPES.map((item) => (
            <InteriorTypeCard key={item.num} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 4 — Before / After comparison slider
// ─────────────────────────────────────────────────────────────────────────────
const BEFORE_IMG =
  "https://images.unsplash.com/photo-1444419988131-046ed4e5ffd6?w=1200&h=700&fit=crop&auto=format&q=92";
const AFTER_IMG =
  "https://images.unsplash.com/photo-1646987916641-1f3c8992daa2?w=1200&h=700&fit=crop&auto=format&q=92";

function BeforeAfterSlider() {
  const [pos, setPos] = useState(45);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos(Math.min(97, Math.max(3, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) move(e.clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [move]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl xl:rounded-3xl select-none h-[360px] xl:h-[490px]"
      style={{ cursor: "col-resize", touchAction: "none" }}
      onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
      onTouchStart={(e) => move(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
    >
      {/* After image — full-width base layer */}
      <img
        src={AFTER_IMG}
        alt="After STARIA redesign"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before image — clipped to slider position */}
      <img
        src={BEFORE_IMG}
        alt="Before redesign"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white z-10 pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      />

      {/* Drag handle */}
      <div
        className="absolute top-1/2 z-20"
        style={{ left: `${pos}%`, transform: "translateX(-50%) translateY(-50%)" }}
      >
        <div className="w-11 h-11 rounded-full bg-white shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing">
          <ChevronLeft size={13} className="text-[#0B5E3C]" />
          <ChevronRight size={13} className="text-[#0B5E3C]" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-5 left-5 z-10">
        <span
          className="bg-black/55 backdrop-blur-sm text-white text-[0.8125rem] tracking-[0.3em] uppercase px-3.5 py-1.5 rounded-full"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Before
        </span>
      </div>
      <div className="absolute top-5 right-5 z-10">
        <span
          className="bg-[#0B5E3C]/80 backdrop-blur-sm text-white text-[0.8125rem] tracking-[0.3em] uppercase px-3.5 py-1.5 rounded-full"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          After
        </span>
      </div>
    </div>
  );
}

function BeforeAfterSection() {
  return (
    <section className="bg-white py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 xl:gap-24 items-center">

          {/* Left — text & stats */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-7 h-px bg-[#D9A11A]" />
              <span
                className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                The Transformation
              </span>
            </div>
            <h2
              className="font-normal leading-[1.1] text-[#1B1B1B] mb-6"
              style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.5vw, 48px)" }}
            >
              See the
              <br />
              <span className="italic">Difference We Make</span>
            </h2>
            <p
              className="text-[#555555] leading-[1.9] mb-10"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem" }}
            >
              Every project begins with a space full of potential. Drag the
              slider to reveal how STARIA's interior design transforms raw
              interiors into environments of refined beauty and purpose.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { val: "340+", label: "Projects Transformed" },
                { val: "85,000+", label: "Sq Ft Redesigned" },
                { val: "12", label: "Design Awards" },
                { val: "4.9 / 5", label: "Client Rating" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-5 rounded-2xl bg-[#F7F7F5] border border-black/[0.05]"
                >
                  <p
                    className="text-[#0B5E3C] leading-none mb-1.5"
                    style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "1.75rem" }}
                  >
                    {s.val}
                  </p>
                  <p
                    className="text-[#666666] uppercase tracking-[0.2em]"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — slider */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <BeforeAfterSlider />
            <p
              className="text-center text-[#888888] mt-4"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem" }}
            >
              Drag the handle to compare before and after
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 5 — Interior Portfolio masonry gallery
// ─────────────────────────────────────────────────────────────────────────────
function PortfolioGallerySection() {
  const [activeCat, setActiveCat] = useState<PortfolioCat>("All");

  const filtered =
    activeCat === "All"
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((p) => p.cat === activeCat);

  return (
    <section className="bg-[#1B1B1B] py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-7 h-px bg-[#D9A11A]" />
              <span
                className="text-[#D9A11A] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Portfolio
              </span>
            </div>
            <h2
              className="font-normal leading-[1.1] text-white"
              style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(32px, 3.3vw, 44px)" }}
            >
              Selected
              <br />
              <span className="italic">Interior Works</span>
            </h2>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex gap-2 flex-wrap"
          >
            {PORTFOLIO_CATS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className="px-5 py-2 rounded-full uppercase font-semibold transition-all duration-300"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.73rem",
                  letterSpacing: "0.15em",
                  backgroundColor: activeCat === cat ? "#D9A11A" : "rgba(255,255,255,0.06)",
                  color: activeCat === cat ? "#1B1B1B" : "rgba(255,255,255,0.55)",
                }}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Masonry grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3 }}>
              <Masonry gutter="14px">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                    className="relative overflow-hidden rounded-xl group cursor-pointer"
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Hover overlay — fades in via group-hover */}
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
                      }}
                    >
                      <p
                        className="text-[#D9A11A] mb-1.5 uppercase tracking-[0.35em]"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem" }}
                      >
                        {item.cat}
                      </p>
                      <div className="flex items-end justify-between">
                        <h4
                          className="text-white leading-tight"
                          style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "1rem", fontWeight: 400 }}
                        >
                          {item.title}
                        </h4>
                        <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center ml-3 shrink-0">
                          <ArrowUpRight size={13} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </motion.div>
        </AnimatePresence>

        {/* Portfolio CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mt-16"
        >
          <button
            className="inline-flex items-center gap-3 px-9 py-3.5 border border-white/20 text-white rounded-full uppercase tracking-[0.2em] hover:bg-white hover:text-[#1B1B1B] transition-all duration-400"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.77rem" }}
          >
            View Full Portfolio
            <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 6 — Design Process (Consultation → Handover)
// ─────────────────────────────────────────────────────────────────────────────
function DesignProcessSection() {
  return (
    <section className="bg-[#F7F7F5] py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">

        {/* Split header */}
        <div className="grid lg:grid-cols-[1fr_1.8fr] gap-12 xl:gap-20 mb-20 items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-7 h-px bg-[#D9A11A]" />
              <span
                className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                How We Work
              </span>
            </div>
            <h2
              className="font-normal leading-[1.1] text-[#1B1B1B]"
              style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(32px, 3.3vw, 44px)" }}
            >
              The Design
              <br />
              <span className="italic">Journey</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[#555555] leading-[1.9] lg:pb-2 max-w-[540px]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem" }}
          >
            From the first conversation to the final handover, every phase of
            your project is managed with transparency, precision and an
            unwavering commitment to the brief.
          </motion.p>
        </div>

        {/* Steps — vertical timeline */}
        <div className="relative max-w-[860px]">

          {/* Vertical connecting line */}
          <div
            className="absolute left-7 top-7 bottom-7"
            style={{ width: "1px" }}
          >
            <div className="absolute inset-0 bg-black/[0.09]" />
            <motion.div
              className="absolute inset-0 bg-[#0B5E3C] origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            />
          </div>

          <div className="space-y-0">
            {DESIGN_PROCESS.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === DESIGN_PROCESS.length - 1;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex gap-8 xl:gap-12 ${isLast ? "" : "pb-12"}`}
                >
                  {/* Icon node */}
                  <div className="shrink-0 relative z-10">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.45,
                        delay: 0.1 + i * 0.12,
                        type: "spring",
                        stiffness: 280,
                        damping: 22,
                      }}
                      className="w-14 h-14 rounded-full bg-white border-2 border-[#0B5E3C]/25 flex items-center justify-center group-hover:border-[#0B5E3C] transition-all duration-400"
                      style={{ boxShadow: "0 0 0 5px #F7F7F5" }}
                    >
                      <Icon size={20} className="text-[#0B5E3C]" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="pt-1 pb-2">
                    <p
                      className="text-[#7A5600] uppercase tracking-[0.45em] font-semibold mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem" }}
                    >
                      Step {step.num}
                    </p>
                    <h3
                      className="text-[#1B1B1B] mb-3 leading-tight"
                      style={{
                        fontFamily: "'Gilda Display', Georgia, serif",
                        fontSize: "clamp(20px, 2vw, 26px)",
                        fontWeight: 400,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-[#555555] leading-relaxed max-w-[560px]"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.87rem" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 7 — CTA: Book an Interior Consultation
// ─────────────────────────────────────────────────────────────────────────────
function InteriorCTASection() {
  function ripple(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget;
    const r = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    Object.assign(r.style, {
      position: "absolute",
      borderRadius: "50%",
      width: size + "px",
      height: size + "px",
      left: e.clientX - rect.left - size / 2 + "px",
      top: e.clientY - rect.top - size / 2 + "px",
      background: "rgba(255,255,255,0.22)",
      transform: "scale(0)",
      animation: "ripple-wave 0.6s ease-out forwards",
      pointerEvents: "none",
    });
    btn.appendChild(r);
    setTimeout(() => r.remove(), 700);
  }

  return (
    <section className="bg-white py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-[#0B5E3C]"
        >
          {/* Subtle background image texture */}
          <div
            className="absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1760611655987-d348d6d28174?w=1800&h=700&fit=crop&auto=format&q=50)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Corner bracket marks */}
          <span className="absolute top-6 left-6 w-9 h-9 border-t-[2px] border-l-[2px] border-white/20 rounded-tl" />
          <span className="absolute top-6 right-6 w-9 h-9 border-t-[2px] border-r-[2px] border-white/20 rounded-tr" />
          <span className="absolute bottom-6 left-6 w-9 h-9 border-b-[2px] border-l-[2px] border-white/20 rounded-bl" />
          <span className="absolute bottom-6 right-6 w-9 h-9 border-b-[2px] border-r-[2px] border-white/20 rounded-br" />

          {/* Right glow */}
          <div className="absolute right-0 top-0 w-[500px] h-full bg-gradient-to-l from-white/[0.04] to-transparent pointer-events-none" />

          <div className="relative text-center py-24 px-12">
            <p
              className="text-[#D9A11A] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Book a Consultation
            </p>
            <h2
              className="font-normal leading-[1.1] text-white mb-6"
              style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.6vw, 48px)" }}
            >
              Ready to Transform
              <br />
              <span className="italic">Your Space?</span>
            </h2>
            <p
              className="text-white/55 max-w-[440px] mx-auto mb-16 leading-[1.85]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem" }}
            >
              Book a private session with our senior designers. We visit your
              space, understand your vision and present a full concept — at
              no obligation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                onClick={ripple}
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#7A5600] hover:bg-[#7A5600] text-white font-semibold rounded-full transition-colors duration-300 shadow-xl shadow-black/20 relative overflow-hidden"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Book Interior Consultation
                <ArrowRight size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="inline-flex items-center gap-3 px-10 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                View Our Portfolio
                <ArrowUpRight size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export function InteriorDesignPage() {
  return (
    <div id="interior">
      <InteriorHeroSection />
      <DesignPhilosophySection />
      <InteriorTypesSection />
      <BeforeAfterSection />
      <PortfolioGallerySection />
      <DesignProcessSection />
      <InteriorCTASection />
    </div>
  );
}
