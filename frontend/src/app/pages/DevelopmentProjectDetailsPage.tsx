import { SiteImage } from "../components/shared/SiteImage";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ProjectPhotoGallery } from "../components/ProjectPhotoGallery";
import { ProjectVideoPlayer } from "../components/ProjectVideoPlayer";
import { DEVELOPMENT_PROJECTS, PROJECT_GALLERIES, PROJECT_VISUALISATIONS, PROJECT_STATUS_STYLE, SKS_IMAGE_SOURCE } from "../services/developmentProjects";

function ProposedDevelopment() {
  const components = [
    ["Office / Convention Facilities", "12.30 lakh sq. ft."],
    ["Hotel", "2.16 lakh sq. ft."],
    ["Commercial / Amusement", "4.60 lakh sq. ft."],
  ];

  return (
    <div className="mx-auto max-w-[1000px]">
      <section className="mb-14">
        <h2 className="mb-5 text-3xl text-[#082D1C]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Proposed Development</h2>
        <p className="mb-8 leading-8 text-[#555555]">SKS City is conceived as an integrated commercial, business, hospitality, convention, exhibition, amusement and lifestyle destination.</p>
        <p className="mb-5 text-sm leading-7 text-[#666666]">The development programme considered in the feasibility analysis includes the following approximate built-up area (BUA).</p>
        <div className="overflow-hidden rounded-2xl border border-[#0B5E3C]/15 bg-white">
          <table className="w-full text-left text-sm sm:text-base">
            <caption className="sr-only">SKS City approximate built-up area by development component</caption>
            <thead className="bg-[#0B5E3C] text-white"><tr><th scope="col" className="px-4 py-4 sm:px-6">Development Component</th><th scope="col" className="px-4 py-4 text-right sm:px-6">Approximate BUA</th></tr></thead>
            <tbody>{components.map(([label, area]) => <tr key={label} className="border-b border-black/[0.07] text-[#555555]"><th scope="row" className="px-4 py-5 font-normal sm:px-6">{label}</th><td className="px-4 py-5 text-right sm:px-6">{area}</td></tr>)}</tbody>
            <tfoot className="bg-[#0B5E3C]/[0.05] font-semibold text-[#0B5E3C]"><tr><th scope="row" className="px-4 py-5 sm:px-6">Total BUA</th><td className="px-4 py-5 text-right sm:px-6">19.06 lakh sq. ft.</td></tr></tfoot>
          </table>
        </div>
      </section>
      <section className="rounded-2xl border border-[#D9A11A]/30 bg-white p-6 sm:p-9">
        <h2 className="mb-5 text-3xl text-[#082D1C]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Integrated Development Advantage</h2>
        <p className="mb-6 leading-8 text-[#555555]">One of the strongest features of SKS City is its diversified development programme. Combining these facilities can create a mutually supporting commercial ecosystem.</p>
        <ul className="flex flex-wrap gap-2">{["Office", "Retail", "Convention", "Exhibition", "Hotel", "Meeting", "Seminar", "Amusement", "Plaza", "Parking"].map((facility) => <li key={facility} className="rounded-full bg-[#F7F7F5] px-4 py-2 text-sm font-medium text-[#0B5E3C]">{facility}</li>)}</ul>
      </section>
    </div>
  );
}

export default function DevelopmentProjectDetailsPage() {
  const { id } = useParams();
  const project = DEVELOPMENT_PROJECTS.find((item) => item.slug === id);
  const visualisation = project ? PROJECT_VISUALISATIONS[project.slug] : undefined;

  return (
    <div className="min-h-screen bg-[#F7F7F5] pt-32 pb-20 md:pt-40 md:pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 xl:px-20">
        <Link to="/projects" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0B5E3C]"><ArrowLeft aria-hidden="true" size={17} />Back to projects</Link>
        {!project ? <div className="py-16"><h1 className="text-3xl text-[#082D1C]">Project not found</h1><p className="mt-4 text-[#555555]">Browse our portfolio to find a current project.</p></div> : <article>
          <header className="mb-8 max-w-[950px]">
            <span className={`mb-5 inline-block rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ${PROJECT_STATUS_STYLE[project.status]}`}>{project.status}</span>
            <h1 className="mb-4 text-[clamp(32px,4vw,56px)] leading-[1.12] text-[#1B1B1B]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{project.title}</h1>
            {project.summary && <p className="max-w-[750px] text-[0.95rem] leading-8 text-[#555555]">{project.summary}</p>}
          </header>
          <figure className="mb-14">
            <SiteImage priority sizes="(min-width: 1440px) 1280px, calc(100vw - 48px)" src={project.image} alt={project.imageAlt} className="max-h-[620px] w-full rounded-2xl bg-[#E8E8E3] object-contain" />
            {project.imageCaption && <figcaption className="mt-3 text-xs leading-6 text-[#666666]">{project.slug === "sks-city" ? <>Illustrative image for the proposed development. Photo: <a href={SKS_IMAGE_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{SKS_IMAGE_SOURCE.credit}</a>.</> : project.imageCaption}</figcaption>}
          </figure>
          {visualisation ? (
            <div key={project.slug} className="mx-auto mb-14 max-w-[1050px] space-y-10">
              <ProjectPhotoGallery title="3D Visualisation" label={`${project.title} — 3D visualisation`} photos={visualisation.photos} imageFit="contain" />
              {visualisation.video ? (
                <section aria-labelledby="project-walkthrough-title">
                  <h2 id="project-walkthrough-title" className="mb-6 text-2xl text-[#082D1C]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>3D Walkthrough</h2>
                  <ProjectVideoPlayer key={visualisation.video.src} video={visualisation.video} labelledBy="project-walkthrough-title" />
                </section>
              ) : null}
            </div>
          ) : null}
          {project.slug === "bafwwa-cafe" && <div className="mx-auto max-w-[1050px]"><ProjectPhotoGallery title="Latest Site Progress" label="BAFWWA Café — ongoing works" photos={PROJECT_GALLERIES.cafe} /></div>}
          {project.slug === "baf-ops-office-interior" && <div className="grid items-start gap-12 lg:grid-cols-2"><ProjectPhotoGallery title="Before · In Progress" label="BAF Ops office — before / in progress" photos={PROJECT_GALLERIES.before} /><ProjectPhotoGallery title="After · Finished" label="BAF Ops office — after / finished" photos={PROJECT_GALLERIES.after} /></div>}
          {project.slug === "sks-city" && <ProposedDevelopment />}
        </article>}
      </div>
    </div>
  );
}
