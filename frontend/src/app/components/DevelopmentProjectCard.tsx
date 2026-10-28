import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { PROJECT_STATUS_STYLE, type DevelopmentProject } from "../services/developmentProjects";

export function DevelopmentProjectCard({ project, index = 0 }: { project: DevelopmentProject; index?: number }) {
  const thumbnail = project.thumbnail ?? { src: project.image, alt: project.imageAlt, caption: project.imageCaption };

  return (
    <motion.article initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_20px_52px_rgba(11,94,60,0.12)]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Link to={`/projects/${project.slug}`} aria-label={`View ${project.title}`} className="relative block overflow-hidden bg-[#F7F7F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#D9A11A]">
        <img src={thumbnail.src} alt={thumbnail.alt} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
        <span className={`absolute top-4 right-4 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${PROJECT_STATUS_STYLE[project.status]}`}>{project.status}</span>
        {thumbnail.caption && <span className="absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1 text-xs text-white">{thumbnail.caption}</span>}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#0B5E3C]">{project.type}</p>
        <h3 className="mb-4 text-[1.5rem] leading-tight text-[#1B1B1B]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{project.title}</h3>
        {project.summary && <p className="mb-6 text-sm leading-7 text-[#555555]">{project.summary}</p>}
        <Link to={`/projects/${project.slug}`} className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#0B5E3C]/30 px-5 py-3 font-semibold text-[#0B5E3C] transition-colors hover:border-[#0B5E3C] hover:bg-[#0B5E3C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5E3C]">
          {project.slug === "bafwwa-cafe" ? "View More" : "View Details"}<ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </motion.article>
  );
}
