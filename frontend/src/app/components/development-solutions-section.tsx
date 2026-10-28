import { SiteImage } from "./shared/SiteImage";
import { Link } from "react-router";
import { DEVELOPMENT_PROJECTS } from "../services/developmentProjects";
import { DevelopmentProjectCard } from "./DevelopmentProjectCard";
import { DEVELOPMENT_SERVICES } from "../services/developmentServices";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Home, Building2, Cpu, Leaf, Users,
  ArrowRight, CheckCheck,
  LayoutDashboard, Paintbrush, Key, Search,
} from "lucide-react";

// ── Services data ──────────────────────────────────────────────────────────────
const SERVICES = DEVELOPMENT_SERVICES;

// ── Development Timeline ────────────────────────────────────────────────────────
const TIMELINE_STEPS = [
  { num: "01", icon: Search, title: "Site Acquisition", desc: "Rigorous due diligence, legal title verification and feasibility assessment before any commitment is made." },
  { num: "02", icon: LayoutDashboard, title: "Planning & Permits", desc: "Project planning and professional guidance informed by local market requirements." },
  { num: "03", icon: Paintbrush, title: "Design & Engineering", desc: "Development coordination that considers client needs and technology-enabled solutions." },
  { num: "04", icon: Building2, title: "Construction", desc: "Construction and development initiatives with a focus on responsible practices and lasting value." },
  { num: "05", icon: Key, title: "Handover & Aftersales", desc: "Project delivery and client communication guided by the agreed development scope." },
] as const;

// ── Project Showcase ──────────────────────────────────────────────────────────
function ServiceRow({
  num, category, title, subtitle, desc, features, icon: Icon, image, alt, reversed,
}: typeof SERVICES[number]) {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [-36, 36]);
  const [hovered, setHovered] = useState(false);

  const imgBlock = (
    <div
      ref={imgRef}
      className="relative overflow-hidden rounded-3xl bg-[#D0D0D0] h-[440px] lg:h-[520px] group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        <motion.div style={{ y: imgY }} className="w-full h-full">
          <SiteImage src={image} alt={alt} className="w-full h-full object-cover" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
      {/* Category badge */}
      <span
        className="absolute top-6 left-6 bg-[#0B5E3C] text-white text-[0.8125rem] tracking-[0.35em] uppercase px-4 py-2 rounded-full"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {category}
      </span>
      {/* Ghost number */}
      <span
        className="absolute bottom-4 right-6 text-white/[0.13] leading-none select-none pointer-events-none"
        style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "7rem" }}
      >
        {num}
      </span>
    </div>
  );

  const contentBlock = (
    <div className="flex flex-col justify-center py-6 lg:py-0">
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-[#0B5E3C]/[0.08] flex items-center justify-center mb-6">
        <Icon size={26} className="text-[#0B5E3C]" />
      </div>
      <p
        className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.45em] uppercase font-semibold mb-3"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {subtitle}
      </p>
      <h3
        className="text-[#1B1B1B] mb-5 leading-tight"
        style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(20px, 2.2vw, 30px)", fontWeight: 400 }}
      >
        {title}
      </h3>
      <p
        className="text-[#555555] leading-[1.9] mb-7"
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem" }}
      >
        {desc}
      </p>
      <ul className="space-y-3 mb-9">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <CheckCheck size={15} className="text-[#0B5E3C] mt-0.5 shrink-0" />
            <span className="text-[#444444] text-[0.85rem] leading-snug" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {f}
            </span>
          </li>
        ))}
      </ul>
      <Link
        to={`/development/services/${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        className="inline-flex items-center gap-2.5 text-[#0B5E3C] text-[0.8rem] tracking-[0.08em] uppercase font-semibold border-b border-[#0B5E3C]/30 pb-0.5 hover:border-[#0B5E3C] hover:gap-4 transition-all duration-300 group self-start"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Explore Service
        <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
      <motion.div
        className={reversed ? "lg:order-2" : "lg:order-1"}
        initial={{ opacity: 0, x: reversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {imgBlock}
      </motion.div>
      <motion.div
        className={reversed ? "lg:order-1" : "lg:order-2"}
        initial={{ opacity: 0, x: reversed ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        {contentBlock}
      </motion.div>
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
export function DevelopmentSolutionsSection() {
  return (
    <div id="development-solutions">

      {/* ── Section header (dark) ── */}
      <section className="bg-[#1B1B1B] py-24">
        <div className="max-w-[1440px] mx-auto px-12 xl:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="block w-8 h-px bg-[#D9A11A]" />
              <span
                className="text-[#D9A11A] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Development Solutions
              </span>
              <span className="block w-8 h-px bg-[#D9A11A]" />
            </div>
            <h2
              className="font-normal leading-[1.07] text-white mb-6"
              style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.5vw, 46px)" }}
            >
              Building Tomorrow,
              <br />
              <span className="italic text-[#D9A11A]">Delivered Today</span>
            </h2>
            <p
              className="text-white/50 max-w-[500px] mx-auto leading-[1.85]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.97rem" }}
            >
              End-to-end development from site acquisition through final handover —
              five disciplines, one uncompromising standard of excellence.
            </p>
            <p className="text-white/40 text-xs mt-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Illustrative stock imagery; client-approved project photographs will be added.</p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap justify-center gap-10 xl:gap-16 mt-16 pt-12 border-t border-white/[0.1]"
          >
            {[
              { val: null, label: "Developments Delivered" },
              { val: null, label: "Sq Ft Developed" },
              { val: null, label: "Years of Excellence" },
              { val: null, label: "Development Value" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p
                  className="text-white leading-none mb-1.5"
                  style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(20px, 2.2vw, 30px)" }}
                >
                  {s.val ?? "—"}
                </p>
                <p
                  className="text-white/40 uppercase tracking-[0.22em]"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Alternating service rows ── */}
      {SERVICES.map((svc, i) => (
        <section
          key={svc.num}
          className={i % 2 === 0 ? "bg-white py-24" : "bg-[#F7F7F5] py-24"}
        >
          <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
            <ServiceRow {...svc} />
          </div>
        </section>
      ))}

      {/* ── Development Timeline (green bg) ── */}
      <section className="bg-[#0B5E3C] py-36 overflow-hidden">
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
                className="text-[#D9A11A] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Development Timeline
              </span>
              <span className="block w-7 h-px bg-[#D9A11A]" />
            </div>
            <h2
              className="font-normal leading-[1.1] text-white"
              style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(32px, 3.3vw, 44px)" }}
            >
              Our 5-Phase
              <br />
              <span className="italic">Delivery Method</span>
            </h2>
          </motion.div>

          {/* 5-step grid */}
          <div className="relative">
            {/* Connecting line — desktop */}
            <div className="hidden xl:block absolute top-7 left-[10%] right-[10%]" style={{ height: "1px" }}>
              <div className="absolute inset-0 bg-white/20" />
              <motion.div
                className="absolute inset-0 bg-[#D9A11A] origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="flex flex-col xl:flex-row xl:justify-between gap-10 xl:gap-0">
              {TIMELINE_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: 0.2 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start xl:flex-col xl:items-center gap-5 xl:gap-0 xl:flex-1 group cursor-default"
                  >
                    {/* Node */}
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.3 + i * 0.13, type: "spring", stiffness: 280, damping: 22 }}
                      className="shrink-0 relative z-10 w-14 h-14 rounded-full bg-[#0B5E3C] border-2 border-white/30 flex items-center justify-center xl:mb-8 transition-all duration-500 group-hover:bg-[#D9A11A] group-hover:border-[#D9A11A]"
                      style={{ boxShadow: "0 0 0 5px #0B5E3C" }}
                    >
                      <Icon size={20} className="text-white" />
                    </motion.div>

                    {/* Content */}
                    <div className="xl:text-center xl:px-3 pt-1 xl:pt-0">
                      <span
                        className="block h-px bg-[#D9A11A]/40 mb-3.5 xl:mx-auto"
                        style={{ width: 20 }}
                      />
                      <h3
                        className="text-white mb-2.5 leading-tight transition-colors duration-300 group-hover:text-[#D9A11A]"
                        style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(16px, 1.4vw, 20px)", fontWeight: 400 }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="text-white/55 leading-relaxed"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem" }}
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

      {/* ── Project Showcase ── */}
      <section className="bg-white py-36">
        <div className="max-w-[1440px] mx-auto px-12 xl:px-20">

          {/* Header */}
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
                  className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Our Projects
                </span>
              </div>
              <h2
                className="font-normal leading-[1.1] text-[#1B1B1B]"
                style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(32px, 3.3vw, 44px)" }}
              >
                Development
                <br />
                <span className="italic">Projects</span>
              </h2>
            </motion.div>

            <Link to="/projects"
              className="inline-flex items-center gap-3 px-7 py-3 border border-[#0B5E3C]/30 text-[#0B5E3C] rounded-full text-[0.875rem] tracking-[0.18em] uppercase font-semibold hover:bg-[#0B5E3C] hover:text-white hover:border-[#0B5E3C] transition-all duration-300 self-start md:self-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              All Projects
              <ArrowRight size={13} />
            </Link>
          </div>


          {/* Cards */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {DEVELOPMENT_PROJECTS.map((project, i) => (
              <DevelopmentProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
