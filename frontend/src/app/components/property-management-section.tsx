import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Users, CreditCard, Wrench, FileText, Eye, Globe, BarChart2,
  ArrowRight, CheckCheck, Shield, Star, Phone,
} from "lucide-react";

// ── Alternating detailed service rows (4 primary services) ────────────────────
const PRIMARY_SERVICES = [
  {
    num: "01",
    category: "Tenant Management",
    title: "Tenants Handled, Relationships Built",
    subtitle: "End-to-End Tenant Services",
    desc: "We manage every touchpoint of the tenant relationship — from marketing vacant properties and conducting rigorous tenant screening through to renewals and structured move-out processes. Your investment is in professional hands.",
    features: [
      "Targeted property marketing and listings management",
      "Comprehensive tenant background and credit screening",
      "Lease negotiation, drafting and execution",
      "Structured move-in, mid-tenancy and move-out protocols",
    ],
    icon: Users,
    image: "https://images.unsplash.com/photo-1741156386380-0236c72eb6f9?w=900&h=650&fit=crop&auto=format&q=92",
    alt: "Property key handover to new tenant",
    reversed: false,
  },
  {
    num: "02",
    category: "Property Maintenance",
    title: "Maintained to the Highest Standard",
    subtitle: "Proactive Asset Preservation",
    desc: "Our in-house maintenance team and vetted contractor network respond to issues within 24 hours. We carry out scheduled preventive maintenance programmes to protect asset value and ensure tenants experience a truly premium standard of living.",
    features: [
      "24-hour emergency maintenance response",
      "Planned preventive maintenance schedules",
      "Vetted contractor network — plumbing, electrical, HVAC",
      "Detailed maintenance history and cost reporting",
    ],
    icon: Wrench,
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=900&h=650&fit=crop&auto=format&q=92",
    alt: "Professional property maintenance inspection",
    reversed: true,
  },
  {
    num: "03",
    category: "NRB Property Management",
    title: "Your Bangladesh Property, Expertly Managed",
    subtitle: "Specialist Non-Resident Services",
    desc: "For Bangladeshis living abroad, managing property from overseas is complex. Our dedicated NRB team handles everything — legal compliance, rent collection, maintenance coordination and regular reporting — so you can invest with complete confidence.",
    features: [
      "Dedicated NRB relationship manager",
      "Regular video calls and digital property reports",
      "Foreign remittance facilitation and documentation",
      "Legal compliance and power of attorney management",
    ],
    icon: Globe,
    image: "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?w=900&h=650&fit=crop&auto=format&q=92",
    alt: "Professional NRB property management consultation",
    reversed: false,
  },
  {
    num: "04",
    category: "Rent Collection",
    title: "Rent On Time, Every Time",
    subtitle: "Systematic Revenue Management",
    desc: "We take full responsibility for rent collection — issuing demands, managing payments, chasing arrears and disbursing net income to owners. Our technology-enabled system provides real-time visibility into your rental income.",
    features: [
      "Online rent collection and automated reminders",
      "Arrears management and legal escalation protocols",
      "Monthly net income disbursement with full statements",
      "Rent review analysis and increase negotiation",
    ],
    icon: CreditCard,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&h=650&fit=crop&auto=format&q=92",
    alt: "Financial document signing for rent collection",
    reversed: true,
  },
] as const;

// ── Compact service cards (3 supplementary services) ──────────────────────────
const COMPACT_SERVICES = [
  {
    icon: FileText,
    title: "Legal Documentation",
    desc: "We prepare, review and execute all tenancy agreements, addenda, notices and legal correspondence in full compliance with Bangladesh tenancy law. Every document is drafted by our in-house legal team.",
    features: ["Tenancy agreement drafting", "Section 21 and possession notices", "Lease variation and addenda", "Legal dispute support"],
  },
  {
    icon: Eye,
    title: "Property Inspection",
    desc: "Systematic inspection programmes — move-in, mid-tenancy and move-out — document the condition of your property with timestamped photography, written reports and condition comparison tools.",
    features: ["Move-in inventory and condition report", "Quarterly mid-tenancy inspections", "Comprehensive move-out check", "Photographic evidence archive"],
  },
  {
    icon: BarChart2,
    title: "Monthly Reporting",
    desc: "Every owner receives a clear, comprehensive monthly statement covering income received, expenditure incurred, maintenance activity and key property metrics — accessible via our secure owner portal.",
    features: ["Monthly income and expenditure statement", "Maintenance log and cost breakdown", "Rental market benchmarking", "Annual portfolio performance report"],
  },
] as const;

// ── Reusable alternating row ──────────────────────────────────────────────────
function PrimaryServiceRow({
  num, category, title, subtitle, desc, features, icon: Icon, image, alt, reversed,
}: typeof PRIMARY_SERVICES[number]) {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [-36, 36]);
  const [hovered, setHovered] = useState(false);

  const imgBlock = (
    <div
      ref={imgRef}
      className="relative overflow-hidden rounded-3xl bg-[#D0D0D0] h-[440px] lg:h-[520px]"
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
      <span
        className="absolute top-6 left-6 bg-[#0B5E3C] text-white text-[0.8125rem] tracking-[0.35em] uppercase px-4 py-2 rounded-full"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {category}
      </span>
      <span
        className="absolute bottom-4 right-6 text-white/[0.12] leading-none select-none pointer-events-none"
        style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "7rem" }}
      >
        {num}
      </span>
    </div>
  );

  const contentBlock = (
    <div className="flex flex-col justify-center py-6 lg:py-0">
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
      <button
        className="inline-flex items-center gap-2.5 text-[#0B5E3C] text-[0.8rem] tracking-[0.08em] uppercase font-semibold border-b border-[#0B5E3C]/30 pb-0.5 hover:border-[#0B5E3C] hover:gap-4 transition-all duration-300 group self-start"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Learn More
        <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
      </button>
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

// ── Main export ───────────────────────────────────────────────────────────────
export function PropertyManagementSection() {
  return (
    <div id="property-management">

      {/* ── Section Header ── */}
      <section className="bg-white pt-28 pb-20">
        <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-28 items-center">

            {/* Left: headline */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-7 h-px bg-[#D9A11A]" />
                <span
                  className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Property Management
                </span>
              </div>
              <h2
                className="font-normal leading-[1.07] text-[#1B1B1B] mb-6"
                style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.5vw, 46px)" }}
              >
                Every Property,
                <br />
                <span className="italic text-[#0B5E3C]">Perfectly Managed</span>
              </h2>
              <p
                className="text-[#555555] leading-[1.9] max-w-[460px]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.97rem" }}
              >
                STARIA's property management division handles over 800 properties
                across Bangladesh. From tenant sourcing to monthly reporting, we
                protect and optimise the performance of your real estate portfolio.
              </p>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="inline-flex items-center gap-3 mt-10 px-9 py-4 bg-[#0B5E3C] text-white font-semibold rounded-full hover:bg-[#09502F] transition-colors duration-300 shadow-xl shadow-[#0B5E3C]/20"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Get a Free Consultation
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>

            {/* Right: stats + trust signals */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-5"
            >
              {[
                { val: "800+", label: "Managed Properties", icon: Shield, color: "#0B5E3C" },
                { val: "98.5%", label: "Rent Collection Rate", icon: CreditCard, color: "#D9A11A" },
                { val: "4.8 / 5", label: "Owner Satisfaction", icon: Star, color: "#0B5E3C" },
                { val: "< 24h", label: "Maintenance Response", icon: Wrench, color: "#D9A11A" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="p-6 rounded-2xl border border-black/[0.06] bg-white shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: s.color + "14" }}
                    >
                      <Icon size={18} style={{ color: s.color }} />
                    </div>
                    <p
                      className="leading-none mb-1.5"
                      style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "1.9rem", color: s.color }}
                    >
                      {s.val}
                    </p>
                    <p
                      className="text-[#666666] uppercase tracking-[0.2em]"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem" }}
                    >
                      {s.label}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4 Primary alternating service rows ── */}
      {PRIMARY_SERVICES.map((svc, i) => (
        <section
          key={svc.num}
          className={i % 2 === 0 ? "bg-[#F7F7F5] py-24" : "bg-white py-24"}
        >
          <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
            <PrimaryServiceRow {...svc} />
          </div>
        </section>
      ))}

      {/* ── 3 Compact service cards (dark bg) ── */}
      <section className="bg-[#1B1B1B] py-36">
        <div className="max-w-[1440px] mx-auto px-12 xl:px-20">

          {/* Header */}
          <motion.div
            className="text-center mb-16"
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
                Additional Services
              </span>
              <span className="block w-7 h-px bg-[#D9A11A]" />
            </div>
            <h2
              className="font-normal leading-[1.1] text-white"
              style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(28px, 2.8vw, 38px)" }}
            >
              Complete Coverage,
              <br />
              <span className="italic">No Gaps</span>
            </h2>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {COMPACT_SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="group p-8 rounded-2xl border border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#D9A11A]/30 transition-all duration-500 cursor-default"
                >
                  {/* Icon */}
                  <div className="w-13 h-13 rounded-2xl bg-[#D9A11A]/10 flex items-center justify-center mb-6 w-[52px] h-[52px] transition-colors duration-400 group-hover:bg-[#D9A11A]/20">
                    <Icon size={24} className="text-[#D9A11A]" />
                  </div>

                  {/* Gold dash */}
                  <span className="block w-5 h-px bg-[#D9A11A]/40 mb-5 group-hover:bg-[#D9A11A] transition-colors duration-400" />

                  {/* Title */}
                  <h3
                    className="text-white mb-4 leading-tight"
                    style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "1.3rem", fontWeight: 400 }}
                  >
                    {svc.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-white/50 leading-relaxed mb-6"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem" }}
                  >
                    {svc.desc}
                  </p>

                  {/* Feature list */}
                  <ul className="space-y-2.5">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#D9A11A] shrink-0" />
                        <span
                          className="text-white/45 text-[0.8rem] leading-snug group-hover:text-white/60 transition-colors duration-300"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-36">
        <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl bg-[#0B5E3C]"
          >
            {/* BG texture */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: "url(https://images.unsplash.com/photo-1741156386380-0236c72eb6f9?w=1600&h=600&fit=crop&auto=format&q=50)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Corner brackets */}
            <span className="absolute top-6 left-6 w-9 h-9 border-t-[2px] border-l-[2px] border-white/20 rounded-tl" />
            <span className="absolute top-6 right-6 w-9 h-9 border-t-[2px] border-r-[2px] border-white/20 rounded-tr" />
            <span className="absolute bottom-6 left-6 w-9 h-9 border-b-[2px] border-l-[2px] border-white/20 rounded-bl" />
            <span className="absolute bottom-6 right-6 w-9 h-9 border-b-[2px] border-r-[2px] border-white/20 rounded-br" />
            <div className="absolute right-0 top-0 w-[400px] h-full bg-gradient-to-l from-white/[0.04] to-transparent pointer-events-none" />

            <div className="relative grid lg:grid-cols-[1fr_auto] gap-12 items-center px-12 xl:px-20 py-20">
              <div>
                <p
                  className="text-[#D9A11A] text-[0.8125rem] tracking-[0.32em] uppercase font-semibold mb-5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Partner with STARIA
                </p>
                <h2
                  className="font-normal leading-[1.1] text-white mb-5"
                  style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(28px, 2.8vw, 38px)" }}
                >
                  Let Us Manage Your
                  <br />
                  <span className="italic">Property Portfolio</span>
                </h2>
                <p
                  className="text-white/55 leading-[1.85] max-w-[480px]"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.97rem" }}
                >
                  Join over 800 property owners who trust STARIA to protect and
                  grow their real estate investments. Speak with our management
                  team today.
                </p>
              </div>

              <div className="flex flex-col gap-4 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="inline-flex items-center gap-3 px-9 py-4 bg-[#7A5600] hover:bg-[#7A5600] text-white font-semibold rounded-full transition-colors duration-300 shadow-xl shadow-black/20 whitespace-nowrap"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Book Free Consultation
                  <ArrowRight size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center justify-center gap-2.5 px-9 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 whitespace-nowrap"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Phone size={15} />
                  Call Our Team
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
