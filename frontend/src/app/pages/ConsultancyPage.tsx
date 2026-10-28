import { useState } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import { ConsultationDialog } from "../components/shared/ConsultationDialog";
import { BD_PHONE, BD_PHONE_TEL } from "../services/contactDetails";
import { CONSULTANCY_PROJECTS } from "../services/consultancyProjects";
import "./ConsultancyPage.css";

const CONSULTANCY_AREAS = [
  { title: "Project guidance", description: "Discuss your ideas, requirements and questions, whether you are planning a new project or considering your next step." },
  { title: "Service advice", description: "Ask about our development, property and interior services. Our team can help you explore the support that suits your needs." },
];

export default function ConsultancyPage() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <div className="consultancy-page" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <section className="consultancy-hero bg-[#F7F7F2] pt-32 pb-16 sm:pt-36 lg:pt-40 lg:pb-24" aria-labelledby="consultancy-title">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 sm:px-10 lg:grid-cols-2 lg:gap-14 xl:gap-20 xl:px-20">
          <div className="py-3 lg:py-8">
            <div className="mb-7 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-9 bg-[#D9A11A]" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] consultancy-accent">Consultancy</p>
            </div>
            <h1 id="consultancy-title" className="max-w-[620px] font-normal leading-[1.1] text-[#1B2D23]" style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(40px, 4.6vw, 64px)" }}>
              Guidance for your<br /><span className="italic consultancy-accent">next project.</span>
            </h1>
            <p className="mt-7 max-w-[500px] text-lg leading-8 text-[#1B2D23]">Bring your ideas and questions to STARIA. We offer consultancy for projects and services, helping you explore your options and plan your next step.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" onClick={() => setEnquiryOpen(true)} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full consultancy-primary px-7 py-4 text-base font-semibold text-[#1B2D23] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5B440]">Send an Enquiry<ArrowUpRight aria-hidden="true" size={19} /></button>
              <a href={`tel:${BD_PHONE_TEL}`} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-[#0B5E3C]/30 px-7 py-4 text-base font-semibold text-[#1B2D23] transition-colors hover:bg-[#0B5E3C]/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5B440]"><Phone aria-hidden="true" size={18} />Call Our Team</a>
            </div>
            <p className="mt-6 text-base text-[#1B2D23]">Speak with us: <a href={`tel:${BD_PHONE_TEL}`} className="ml-1 font-medium text-[#1B2D23] underline decoration-[#0B5E3C]/40 underline-offset-4 hover:text-[#1B2D23]">{BD_PHONE}</a></p>
          </div>
          <figure className="overflow-hidden rounded-xl border border-black/[0.06] bg-[#E6E7DF]">
            <img src="/images/consultancy/planning.webp" alt="A close-up of architectural plans being discussed and reviewed" width={1800} height={1350} className="aspect-[4/3] w-full object-cover lg:aspect-[4/3]" />
          </figure>
        </div>
      </section>

      <section className="consultancy-support bg-white py-16 md:py-24" aria-labelledby="consultancy-support-title">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-24 xl:px-20">
          <figure className="overflow-hidden rounded-xl bg-[#E6E7DF]">
            <img src="/images/consultancy/discussion.webp" alt="Colleagues reviewing project drawings together around a table" width={1400} height={2100} loading="lazy" className="aspect-[4/3] w-full object-cover object-center lg:aspect-[5/4]" />
          </figure>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] consultancy-accent">A little clarity goes a long way</p>
            <h2 id="consultancy-support-title" className="font-normal leading-[1.15] text-[#1B2D23]" style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(32px, 3.2vw, 44px)" }}>Your plans.<br /><span className="italic consultancy-accent">Our perspective.</span></h2>
            <div className="mt-7 divide-y divide-[#0B5E3C]/15 border-t border-[#0B5E3C]/15">
              {CONSULTANCY_AREAS.map(({ title, description }, index) => (
                <div key={title} className="flex items-start gap-5 py-6">
                  <span aria-hidden="true" className="mt-1 text-sm font-semibold consultancy-accent">0{index + 1}</span>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-[#1B2D23]">{title}</h3>
                    <p className="max-w-[480px] text-lg leading-8 text-[#1B2D23]">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setEnquiryOpen(true)} className="mt-3 inline-flex min-h-12 items-center gap-3 border-b border-[#E5B440] py-2 text-base font-semibold consultancy-accent transition-colors hover:text-[#1B2D23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5E3C]">Tell us what you have in mind<ArrowUpRight aria-hidden="true" size={18} /></button>
          </div>
        </div>
      </section>
      <section className="consultancy-projects bg-[#F7F7F2] py-16 md:py-24" aria-labelledby="consultancy-projects-title">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 xl:px-20">
          <h2 id="consultancy-projects-title" className="font-normal leading-[1.15] text-[#1B2D23]" style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(32px, 3.2vw, 44px)" }}>Consultancy Projects</h2>
          <ol className="mt-10 list-decimal border-t border-[#0B5E3C]/15 pl-6 sm:pl-8">
            {CONSULTANCY_PROJECTS.map(({ title, ongoing, image }) => (
              <li key={title} className="border-b border-[#0B5E3C]/15 py-8 pl-2 marker:text-lg marker:font-semibold marker:text-[#0B5E3C] sm:py-10 sm:pl-4">
                <div className={`grid items-start gap-6 sm:gap-8 ${image ? "lg:grid-cols-2 lg:gap-12" : ""}`}>
                  <h3 className="max-w-[960px] text-lg font-medium leading-8 text-[#1B2D23] sm:text-xl">
                    {title}{ongoing ? <span className="consultancy-accent"> (*Ongoing)</span> : null}
                  </h3>
                  {image ? (
                    <figure className="rounded-xl border border-[#0B5E3C]/10 bg-white p-3 sm:p-4">
                      <a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`View full image: ${image.alt}`} className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5E3C]">
                        <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" className="mx-auto h-auto max-h-[460px] w-auto max-w-full object-contain" />
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium consultancy-accent">View full image<ArrowUpRight aria-hidden="true" size={15} /></span>
                      </a>
                    </figure>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <ConsultationDialog key={String(enquiryOpen)} open={enquiryOpen} onOpenChange={setEnquiryOpen} initialService="Project & service consultancy" />
    </div>
  );
}
