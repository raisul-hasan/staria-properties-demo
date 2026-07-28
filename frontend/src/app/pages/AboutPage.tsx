import { motion } from "motion/react";
import { Globe, Eye, Users, Cpu, Leaf, Heart } from "lucide-react";
import { PageHero } from "../components/shared/PageHero";
import {
  VisionMissionSection,
  CoreValuesSection,
  SustainabilitySection,
  PartnersSection,
  StatisticsSection,
} from "../components/corporate-sections";

const WHY_ITEMS = [
  { Icon: Globe, title: "Global Standards", desc: "Every project is benchmarked against international best practices — delivering quality that stands tall on a world stage." },
  { Icon: Eye, title: "Transparent Process", desc: "Clear timelines, open communication and full financial visibility at every stage. No surprises, no hidden agendas." },
  { Icon: Users, title: "Experienced Team", desc: "Decades of combined expertise across architecture, development, interiors and consultancy — all under one roof." },
  { Icon: Cpu, title: "Technology Driven", desc: "Smart building systems, digital project tracking and data-led investment analysis built into every solution we deliver." },
  { Icon: Leaf, title: "Sustainable Development", desc: "Green-certified construction, energy-efficient design and materials chosen to respect both people and planet." },
  { Icon: Heart, title: "Customer First", desc: "Your vision drives every decision. Dedicated account managers, priority support and lifetime after-sales care." },
] as const;

function WhyChooseUsSection() {
  return (
    <section className="bg-white py-36">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-7 h-px bg-[#D9A11A]" />
            <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Why Choose Us</span>
            <span className="block w-7 h-px bg-[#D9A11A]" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-normal leading-[1.1] text-[#1B1B1B] mb-6 max-w-[640px] mx-auto"
            style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.5vw, 46px)" }}>
            The STARIA <span className="italic">Difference</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#555555] text-[0.95rem] leading-[1.8] max-w-[520px] mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Six commitments that set us apart — and keep our clients coming back.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_ITEMS.map(({ Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-white border border-black/[0.07] rounded-2xl p-8 cursor-default transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_0_0_1px_rgba(11, 94, 60,0.14),0_16px_56px_rgba(11, 94, 60,0.11)] hover:border-[#0B5E3C]/20">
              <span className="absolute bottom-0 left-8 right-8 h-px bg-[#D9A11A] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
              <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center mb-6 transition-all duration-400 bg-[#0B5E3C]/[0.07] group-hover:bg-[#0B5E3C]">
                <Icon size={22} className="transition-colors duration-400 text-[#0B5E3C] group-hover:text-white" strokeWidth={1.6} />
              </div>
              <h3 className="text-[1.15rem] font-normal text-[#1B1B1B] mb-3 transition-colors duration-300 group-hover:text-[#0B5E3C]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{title}</h3>
              <p className="text-[#555555] text-[0.875rem] leading-[1.85]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutDetailSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 min-h-[700px]">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative overflow-hidden min-h-[480px] lg:min-h-0">
          <img src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?w=1200&h=900&fit=crop&auto=format&q=92" alt="Luxury modern office interior" className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10" />
          <motion.div initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="absolute bottom-8 left-8 bg-[#0B5E3C] text-white rounded-2xl px-6 py-4 shadow-2xl">
            <p className="text-[2rem] font-bold leading-none" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>1999</p>
            <p className="text-white/70 text-xs tracking-widest uppercase mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Established</p>
          </motion.div>
        </motion.div>

        <div className="flex flex-col justify-center px-14 xl:px-20 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 mb-5">
            <span className="block w-7 h-px bg-[#D9A11A]" />
            <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>About Us</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-normal leading-[1.1] text-[#1B1B1B] mb-6"
            style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.5vw, 46px)" }}>
            Who We <span className="italic">Are</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#555555] text-[1rem] leading-[1.85] mb-5 max-w-[480px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            STARIA is a premium real estate and development company providing property development, buying & selling, interior design, property management and investment solutions across Bangladesh.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#555555] text-[0.9rem] leading-[1.8] mb-10 max-w-[480px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Founded in 1999 and built on a foundation of trust, craftsmanship and innovation, STARIA has grown to become the premier choice for discerning buyers, investors and developers across Bangladesh.
          </motion.p>

          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }} className="origin-left w-full h-px bg-black/[0.08] mb-10" />

          <div className="grid grid-cols-3 gap-5">
            {[{ number: "50+", label: "Projects", delay: 0.32 }, { number: "500+", label: "Happy Clients", delay: 0.44 }, { number: "25+", label: "Years Experience", delay: 0.56 }].map(({ number, label, delay }) => (
              <motion.div key={label} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-[#F7F7F5] hover:bg-[#0B5E3C] rounded-2xl px-6 py-7 transition-all duration-500 cursor-default overflow-hidden">
                <span className="block w-8 h-[3px] bg-[#D9A11A] rounded-full mb-4 group-hover:w-full transition-all duration-500" />
                <p className="text-[2.6rem] font-bold text-[#0B5E3C] group-hover:text-white leading-none mb-2 transition-colors duration-500" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{number}</p>
                <p className="text-[#555555] group-hover:text-white/70 text-sm font-medium leading-snug transition-colors duration-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About STARIA"
        title="Two Decades of"
        titleItalic="Building Excellence"
        subtitle="Founded on trust, crafted with precision — STARIA has shaped Bangladesh's premium real estate landscape since 1999."
        image="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&h=900&fit=crop&auto=format&q=92"
      />
      <AboutDetailSection />
      <StatisticsSection />
      <VisionMissionSection />
      <CoreValuesSection />
      <SustainabilitySection />
      <WhyChooseUsSection />
      <PartnersSection />
    </>
  );
}
