import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Building2, ArrowRight } from "lucide-react";
import { PageHero } from "../components/shared/PageHero";
import { DevelopmentSolutionsSection } from "../components/development-solutions-section";
import { PropertyManagementSection } from "../components/property-management-section";

const PROCESS_STEPS = [
  { num: "01", title: "Planning", desc: "Feasibility analysis, site studies, and master planning aligned with client vision and all regulatory requirements." },
  { num: "02", title: "Design", desc: "Architectural and interior concepts developed into precise blueprints and photorealistic 3D renders." },
  { num: "03", title: "Construction", desc: "Premium materials and skilled craftsmen under rigorous on-site supervision across every structural phase." },
  { num: "04", title: "Inspection", desc: "Multi-layer quality audits covering structural integrity, MEP systems, and finishing standards before sign-off." },
  { num: "05", title: "Delivery", desc: "Seamless handover with full documentation, client walk-through, and post-delivery support guaranteed." },
] as const;

function DevelopmentProcessSection() {
  return (
    <section className="py-28 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-7 h-px bg-[#D9A11A]" />
            <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Our Process</span>
            <span className="block w-7 h-px bg-[#D9A11A]" />
          </div>
          <h2 className="font-normal leading-[1.1] text-[#1B1B1B] mb-6" style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.5vw, 46px)" }}>
            From Vision<br /><span className="italic">To Reality</span>
          </h2>
          <p className="text-[0.95rem] leading-[1.8] text-[#555555] max-w-[420px] mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Every STARIA project follows a rigorous five-stage process designed to deliver perfection without compromise.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden xl:block absolute top-7 left-[10%] right-[10%]" style={{ height: "1px" }}>
            <div className="absolute inset-0 bg-black/[0.09]" />
            <motion.div className="absolute inset-0 bg-[#0B5E3C]" style={{ transformOrigin: "left" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <div className="xl:hidden absolute left-7 top-7 bottom-7" style={{ width: "1px" }}>
            <div className="absolute inset-0 bg-black/[0.09]" />
            <motion.div className="absolute inset-0 bg-[#0B5E3C]" style={{ transformOrigin: "top" }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} />
          </div>

          <div className="flex flex-col xl:flex-row xl:justify-between gap-10 xl:gap-0">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.3 + i * 0.14, ease: [0.22, 1, 0.36, 1] }} className="flex items-start xl:flex-col xl:items-center gap-5 xl:gap-0 xl:flex-1 group cursor-default">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.35 + i * 0.14, type: "spring", stiffness: 300, damping: 24 }}
                  className="shrink-0 relative z-10 w-14 h-14 rounded-full bg-white border-2 border-[#0B5E3C]/25 flex items-center justify-center xl:mb-8 transition-all duration-500 group-hover:border-[#0B5E3C] group-hover:bg-[#0B5E3C]"
                  style={{ boxShadow: "0 0 0 5px #ffffff" }}>
                  <span className="italic text-[#0B5E3C] transition-colors duration-500 group-hover:text-white select-none" style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "1.05rem" }}>{step.num}</span>
                </motion.div>
                <div className="text-left xl:text-center xl:px-3 pt-1 xl:pt-0">
                  <motion.span className="block h-px bg-[#D9A11A] mb-3.5 xl:mx-auto" style={{ width: 20, transformOrigin: "left" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.55 + i * 0.14 }} />
                  <h3 className="text-[#1B1B1B] mb-2.5 leading-tight transition-colors duration-300 group-hover:text-[#0B5E3C]" style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(20px, 1.8vw, 26px)", fontWeight: 400 }}>{step.title}</h3>
                  <p className="text-[#555555] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem" }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DevelopmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Development Solutions"
        title="Building Tomorrow's"
        titleItalic="Landmarks"
        subtitle="End-to-end development expertise — from residential luxury to smart commercial infrastructure, delivered with precision."
        image="https://images.unsplash.com/photo-1625447521754-764d517239e6?w=1920&h=900&fit=crop&auto=format&q=92"
      />
      <DevelopmentSolutionsSection />
      <DevelopmentProcessSection />
      <PropertyManagementSection />
    </>
  );
}
