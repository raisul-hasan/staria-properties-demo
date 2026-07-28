import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { Link, useParams } from "react-router";
import { PageHero } from "../components/shared/PageHero";
import { api } from "../services/api";
import { displayLocation, primaryImage, useApiList } from "../services/content";

const PROJECTS = [
  { id: 1, name: "Staria Heights", location: "Gulshan-2, Dhaka", type: "Luxury Apartment", status: "Ready to Move", statusBg: "bg-[#0B5E3C]", category: "Residential", image: "https://images.unsplash.com/photo-1601881403737-2a6085443ba2?w=900&h=700&fit=crop&auto=format&q=92" },
  { id: 2, name: "The Pinnacle Tower", location: "Banani, Dhaka", type: "Penthouse & Residences", status: "Under Construction", statusBg: "bg-[#D9A11A]", category: "Residential", image: "https://images.unsplash.com/photo-1777734582224-f9b002fa116c?w=900&h=700&fit=crop&auto=format&q=92" },
  { id: 3, name: "Trade Centre One", location: "Motijheel, Dhaka", type: "Commercial Complex", status: "Ready to Move", statusBg: "bg-[#0B5E3C]", category: "Commercial", image: "https://images.unsplash.com/photo-1621831337128-35676ca30868?w=900&h=700&fit=crop&auto=format&q=92" },
  { id: 4, name: "Eco Business Park", location: "Uttara, Dhaka", type: "Office & Retail", status: "Upcoming", statusBg: "bg-[#6366F1]", category: "Commercial", image: "https://images.unsplash.com/photo-1783705094622-f2c01a9787b5?w=900&h=700&fit=crop&auto=format&q=92" },
  { id: 5, name: "Skyline Villa Retreat", location: "Bashundhara, Dhaka", type: "Private Villa Estate", status: "Under Construction", statusBg: "bg-[#D9A11A]", category: "Development", image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=900&h=700&fit=crop&auto=format&q=92" },
  { id: 6, name: "The Meridian Suite", location: "Dhanmondi, Dhaka", type: "Interior Design", status: "Completed", statusBg: "bg-[#444444]", category: "Interior", image: "https://images.unsplash.com/photo-1663811397207-418a92396ad5?w=900&h=700&fit=crop&auto=format&q=92" },
];

const PROJECT_FILTERS = ["All", "Residential", "Commercial", "Development", "Interior"];

export default function ProjectsPage() {
  const [projectFilter, setProjectFilter] = useState("All");
  const { id } = useParams();
  const { items, loading, error } = useApiList(() => api.getProjects({ limit: 100 }), []);
  const databaseProjects = items.map((project) => {
    const category = project.category?.name.includes("Commercial")
      ? "Commercial"
      : project.category?.name.includes("Interior")
        ? "Interior"
        : "Residential";
    const status =
      project.developmentStatus === "COMPLETED"
        ? "Completed"
        : project.developmentStatus === "ONGOING"
          ? "Under Construction"
          : project.developmentStatus === "ON_HOLD"
            ? "On Hold"
            : "Upcoming";
    return {
      id: project.slug,
      name: project.title,
      location: displayLocation(project.address),
      type: project.category?.name ?? "Development",
      status,
      statusBg: project.developmentStatus === "COMPLETED" ? "bg-[#0B5E3C]" : project.developmentStatus === "ONGOING" ? "bg-[#D9A11A]" : "bg-[#6366F1]",
      category,
      image: primaryImage(project.media, PROJECTS[0].image),
      description: project.description ?? project.summary ?? "",
      completionPercent: project.completionPercent ? Number(project.completionPercent) : null
    };
  });
  const displayedProjects = databaseProjects.length > 0 ? databaseProjects : PROJECTS;
  const selectedProject = id ? displayedProjects.find((project) => String(project.id) === id) : undefined;

  return (
    <>
      <PageHero
        eyebrow="Projects & Portfolio"
        title="Our Landmark"
        titleItalic="Developments"
        subtitle="Explore STARIA's portfolio of completed, ongoing and upcoming projects across residential, commercial and interior design."
        image="https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=1920&h=900&fit=crop&auto=format&q=92"
      />
      {selectedProject && (
        <section className="bg-white py-16 border-b border-black/[0.06]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-10 items-center">
            <img src={selectedProject.image} alt={selectedProject.name} className="w-full h-[380px] object-cover rounded-3xl" />
            <div><p className="text-[#0B5E3C] uppercase tracking-[.25em] text-xs font-semibold mb-4">{selectedProject.status}</p><h1 className="text-4xl mb-3" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{selectedProject.name}</h1><p className="text-[#666] mb-6 flex items-center gap-2"><MapPin size={15} /> {selectedProject.location}</p>{"completionPercent" in selectedProject && selectedProject.completionPercent !== null && <div className="mb-6"><div className="flex justify-between text-sm mb-2"><span>Project progress</span><strong>{selectedProject.completionPercent}%</strong></div><div className="h-2 bg-black/8 rounded-full"><div className="h-full bg-[#D9A11A] rounded-full" style={{ width: `${selectedProject.completionPercent}%` }} /></div></div>}<p className="text-[#555] leading-8 mb-7">{"description" in selectedProject ? selectedProject.description : "Contact our project team for plans, schedules and availability."}</p><div className="flex gap-3"><Link to="/contact" className="px-6 py-3 rounded-full bg-[#0B5E3C] text-white font-semibold">Discuss this project</Link><Link to="/projects" className="px-6 py-3 rounded-full border border-black/15 font-semibold">Close details</Link></div></div>
          </div>
        </section>
      )}

      <section className="bg-[#F7F7F5] py-36">
        <div className="max-w-[1440px] mx-auto px-12 xl:px-20">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 mb-4">
                <span className="block w-7 h-px bg-[#D9A11A]" />
                <span className="text-[#0B5E3C] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Our Portfolio</span>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="font-normal leading-[1.1] text-[#1B1B1B]"
                style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.5vw, 46px)" }}>
                Featured <span className="italic">Projects</span>
              </motion.h2>
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-2 flex-wrap">
              {PROJECT_FILTERS.map((f) => (
                <button key={f} onClick={() => setProjectFilter(f)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${projectFilter === f ? "bg-[#0B5E3C] text-white shadow-md shadow-[#0B5E3C]/25" : "bg-white text-[#555555] hover:text-[#0B5E3C] border border-black/[0.08] hover:border-[#0B5E3C]/30"}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {f}
                  {projectFilter === f && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-[#0B5E3C] -z-10" transition={{ type: "spring", stiffness: 380, damping: 36 }} />}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Grid */}
          <motion.div key={projectFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {error && <motion.div className="md:col-span-2 lg:col-span-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">Live database content is temporarily unavailable; representative demo projects are shown.</motion.div>}
              {loading && <motion.div className="md:col-span-2 lg:col-span-3 text-center text-[#777]">Loading live projects…</motion.div>}
              {displayedProjects.filter((p) => projectFilter === "All" || p.category === projectFilter).map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group bg-white rounded-2xl overflow-hidden border border-black/[0.06] hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)] transition-all duration-500 cursor-pointer">
                  <div className="relative h-[300px] overflow-hidden bg-[#E0E0E0]">
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <span className={`absolute top-4 left-4 ${project.statusBg} text-white text-[0.68rem] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{project.status}</span>
                    <span className="absolute top-4 right-4 bg-white/15 backdrop-blur-md border border-white/25 text-white text-[0.68rem] font-medium tracking-wider uppercase px-3 py-1.5 rounded-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>{project.category}</span>
                    <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#D9A11A] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-400 shadow-lg">
                      <ArrowUpRight size={16} className="text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                      <h3 className="text-white text-[1.3rem] font-normal leading-tight" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{project.name}</h3>
                    </div>
                  </div>
                  <div className="px-5 py-5">
                    <div className="flex items-center gap-1.5 text-[#666666] text-[0.875rem] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <MapPin size={12} className="text-[#0B5E3C] shrink-0" /><span>{project.location}</span>
                    </div>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="text-[0.8125rem] text-[#666666] uppercase tracking-widest mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Property Type</p>
                        <p className="text-[0.88rem] text-[#222222] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{project.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[0.8125rem] text-[#666666] uppercase tracking-widest mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Status</p>
                        <p className="text-[0.88rem] text-[#222222] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{project.status}</p>
                      </div>
                    </div>
                    <Link to={`/projects/${project.id}`} className="w-full py-3 border border-[#0B5E3C]/25 hover:bg-[#0B5E3C] hover:border-[#0B5E3C] text-[#0B5E3C] hover:text-white text-[1rem] font-semibold tracking-[0.02em] rounded-xl flex items-center justify-center gap-2 transition-all duration-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      View Details <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>
    </>
  );
}
