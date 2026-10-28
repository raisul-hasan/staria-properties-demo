import { SiteImage } from "../components/shared/SiteImage";
import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight, BookOpen, Check, ChevronRight, GraduationCap, Mail } from "lucide-react";
import portrait from "../../assets/team/official/muzahid-director.jpg";
import {
  MUZAHID_PROFILE, CAREER_CONTRIBUTIONS, LEADERSHIP_EXPERIENCE,
  ACADEMIC_APPOINTMENTS, EDUCATION, PROFESSIONAL_CREDENTIALS, SELECTED_PUBLICATIONS,
} from "../services/muzahidMonirProfile";

const serif = "'Gilda Display', Georgia, serif";
const sectionTitle = "mb-5 text-[clamp(30px,3vw,42px)] font-normal leading-[1.15] text-[#1B2D23]";
const sectionLabel = "mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#0B5E3C]";

export default function MuzahidMonirProfilePage() {
  return (
    <div className="bg-white text-[#1B2D23]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <section className="bg-[#F7F7F2] pt-28 pb-14 md:pt-36 md:pb-20" aria-labelledby="profile-name">
        <div className="mx-auto max-w-[1300px] px-6 sm:px-10 xl:px-16">
          <Link to="/about/board-of-directors" className="mb-10 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0B5E3C]"><ArrowLeft aria-hidden="true" size={17} />Back to Board of Directors</Link>
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-14">
            <div>
              <p className={sectionLabel}>Leadership Profile</p>
              <h1 id="profile-name" className="mb-4 text-[clamp(36px,4.2vw,56px)] font-normal leading-[1.1] text-[#1B2D23]" style={{ fontFamily: serif }}>{MUZAHID_PROFILE.name}</h1>
              <p className="mb-3 text-base font-medium text-[#405246]">{MUZAHID_PROFILE.honours}</p>
              <p className="mb-6 text-lg font-semibold text-[#0B5E3C]">{MUZAHID_PROFILE.role}</p>
              <p className="max-w-[650px] text-lg leading-8 text-[#35483C]">{MUZAHID_PROFILE.overview}</p>
              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-3">{MUZAHID_PROFILE.expertise.map((area) => <li key={area} className="inline-flex items-center gap-2 text-sm text-[#0B5E3C]"><span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-[#D9A11A]" />{area}</li>)}</ul>
              <a href="https://www.linkedin.com/in/s-m-muzahid-monir-bb045229/" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-[#0B5E3C] underline decoration-[#0B5E3C]/30 underline-offset-4">Connect on LinkedIn<ArrowUpRight aria-hidden="true" size={17} /></a>
            </div>
            <figure className="mx-auto overflow-hidden rounded-xl border border-[#0B5E3C]/10 bg-white" style={{ width: 240, maxWidth: "100%" }}>
              <SiteImage priority src={portrait} alt="Portrait of Maj S M Muzahid Monir, Executive Director at STARIA" width={240} height={240} style={{ width: "100%", height: "auto", aspectRatio: "1 / 1", objectFit: "cover" }} />
              <figcaption className="border-t border-[#D9A11A] px-3 py-2 text-xs font-medium leading-5 text-[#0B5E3C]">Engineering. Leadership. Education.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <nav aria-label="Profile sections" className="border-y border-[#0B5E3C]/10 bg-white">
        <div className="mx-auto flex max-w-[1300px] flex-wrap gap-x-7 gap-y-1 px-6 py-4 sm:px-10 xl:px-16">
          {[["Contributions", "contributions"], ["Leadership", "leadership"], ["Academic & credentials", "credentials"], ["Publications", "publications"]].map(([label, id]) => <a key={id} href={`#${id}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-[#0B5E3C] underline-offset-4 hover:underline">{label}</a>)}
        </div>
      </nav>

      <section id="contributions" className="scroll-mt-28 py-16 md:py-24" aria-labelledby="contributions-title">
        <div className="mx-auto max-w-[1300px] px-6 sm:px-10 xl:px-16">
          <p className={sectionLabel}>Career Portfolio</p>
          <h2 id="contributions-title" className={sectionTitle} style={{ fontFamily: serif }}>Selected <span className="italic text-[#0B5E3C]">contributions</span></h2>
          <p className="mb-10 max-w-[730px] text-base leading-8 text-[#405246]">Professional roles across national infrastructure, residential master planning and hospitality development.</p>
          <div className="grid gap-7 md:grid-cols-2">
            {CAREER_CONTRIBUTIONS.map((item) => <article key={item.title} className="overflow-hidden rounded-2xl border border-[#0B5E3C]/15 bg-white">
              <figure className="mt-6 ml-6 overflow-hidden rounded-lg bg-[#F7F7F2]" style={{ width: 380, maxWidth: "calc(100% - 3rem)" }}>
                <a href={item.image} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge portfolio image for ${item.title}`} className="block"><SiteImage src={item.image} alt={item.imageAlt} loading="lazy" width={380} height={225} style={{ width: "100%", height: 225, objectFit: "contain" }} /></a>
                {item.imageCaption && <figcaption className="px-2 py-2 text-xs text-[#405246]">{item.imageCaption}</figcaption>}
              </figure>
              <div className="p-6 sm:p-7">
                <p className="mb-3 text-sm font-medium text-[#7A5600]">{item.period}</p>
                <h3 className="mb-3 text-2xl leading-tight text-[#1B2D23]" style={{ fontFamily: serif }}>{item.title}</h3>
                <p className="mb-4 text-sm font-semibold leading-6 text-[#0B5E3C]">{item.role}</p>
                <p className="text-base leading-8 text-[#405246]">{item.description}</p>
                <ul className="mt-5 space-y-3">{item.highlights.map((highlight) => <li key={highlight} className="flex items-start gap-3 text-sm leading-7 text-[#35483C]"><Check aria-hidden="true" size={15} strokeWidth={1.8} className="mt-1.5 shrink-0 text-[#0B5E3C]" />{highlight}</li>)}</ul>
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section id="leadership" className="scroll-mt-28 bg-[#F7F7F2] py-16 md:py-24" aria-labelledby="leadership-title">
        <div className="mx-auto max-w-[1300px] px-6 sm:px-10 xl:px-16">
          <p className={sectionLabel}>Experience & Service</p>
          <h2 id="leadership-title" className={sectionTitle} style={{ fontFamily: serif }}>Leadership beyond <span className="italic text-[#0B5E3C]">the project</span></h2>
          <ul className="mt-9 divide-y divide-[#0B5E3C]/15 border-y border-[#0B5E3C]/15">
            {LEADERSHIP_EXPERIENCE.map((item) => <li key={item.title} className="grid gap-3 py-7 md:grid-cols-[0.8fr_1.4fr] md:gap-10"><h3 className="flex items-start gap-2 text-lg font-semibold leading-7 text-[#1B2D23]"><ChevronRight aria-hidden="true" size={16} strokeWidth={1.8} className="mt-1.5 shrink-0 text-[#0B5E3C]" />{item.title}</h3><p className="text-base leading-8 text-[#405246]">{item.detail}</p></li>)}
          </ul>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2" style={{ maxWidth: 800 }}>
            {[
              { src: "/images/muzahid-monir/nirjhor-site-visit.webp", caption: "Nirjhor project site engagement", alt: "Military engineering personnel visiting the Nirjhor project, from the career profile" },
              { src: "/images/muzahid-monir/academic-study-visit.webp", caption: "Academic and industry engagement", alt: "University group on a bridge study visit, from the Daffodil International University career portfolio" },
            ].map((photo) => <figure key={photo.src} className="overflow-hidden rounded-lg border border-[#0B5E3C]/10 bg-white" style={{ width: 390, maxWidth: "100%" }}><a href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${photo.caption}`}><SiteImage src={photo.src} alt={photo.alt} loading="lazy" width={390} height={235} style={{ width: "100%", height: 235, objectFit: "contain" }} /></a><figcaption className="px-3 py-2 text-sm font-medium leading-6 text-[#35483C]">{photo.caption}</figcaption></figure>)}
          </div>
        </div>
      </section>

      <section id="credentials" className="scroll-mt-28 py-16 md:py-24" aria-labelledby="credentials-title">
        <div className="mx-auto max-w-[1300px] px-6 sm:px-10 xl:px-16">
          <p className={sectionLabel}>Knowledge & Professional Practice</p>
          <h2 id="credentials-title" className={sectionTitle} style={{ fontFamily: serif }}>Academic <span className="italic text-[#0B5E3C]">engagement</span></h2>
          <div className="mt-9 grid gap-5 lg:grid-cols-3">{ACADEMIC_APPOINTMENTS.map((item) => <article key={item.institution} className="rounded-xl border border-[#0B5E3C]/15 border-t-2 border-t-[#D9A11A] p-6"><h3 className="mb-4 flex items-start gap-3 text-lg font-semibold leading-7 text-[#1B2D23]"><GraduationCap aria-hidden="true" size={19} strokeWidth={1.6} className="mt-1 shrink-0 text-[#0B5E3C]" />{item.institution}</h3><p className="mb-3 text-base leading-7 text-[#0B5E3C]">{item.role}</p><p className="mb-3 text-sm leading-6 text-[#405246]">{item.period}</p><p className="text-sm leading-7 text-[#405246]">{item.detail}</p></article>)}</div>
          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div><h3 className="mb-6 text-2xl text-[#1B2D23]" style={{ fontFamily: serif }}>Education</h3><ul className="space-y-6">{EDUCATION.map((item) => <li key={item.title} className="flex items-start gap-3"><span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9A11A]" /><div><p className="font-semibold text-[#1B2D23]">{item.title}</p><p className="mt-1 text-sm leading-7 text-[#405246]">{item.institution}</p></div></li>)}</ul></div>
            <div><h3 className="mb-6 text-2xl text-[#1B2D23]" style={{ fontFamily: serif }}>Professional credentials</h3><ul className="space-y-4">{PROFESSIONAL_CREDENTIALS.map((item) => <li key={item} className="flex items-start gap-3 text-base leading-7 text-[#405246]"><Check aria-hidden="true" size={15} strokeWidth={1.8} className="mt-1.5 shrink-0 text-[#0B5E3C]" />{item}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section id="publications" className="scroll-mt-28 border-t border-[#0B5E3C]/10 bg-[#F7F7F2] py-16 md:py-20" aria-labelledby="publications-title">
        <div className="mx-auto max-w-[1300px] px-6 sm:px-10 xl:px-16">
          <p className={sectionLabel}>Selected Writing</p>
          <h2 id="publications-title" className={sectionTitle} style={{ fontFamily: serif }}>Professional <span className="italic text-[#0B5E3C]">publications</span></h2>
          <ul className="mt-9 divide-y divide-[#0B5E3C]/15">{SELECTED_PUBLICATIONS.map((item) => <li key={item.title} className="grid gap-2 py-5 sm:grid-cols-[65px_1fr]"><span className="text-base font-semibold text-[#7A5600]">{item.year}</span><div className="flex items-start gap-3"><BookOpen aria-hidden="true" size={17} strokeWidth={1.6} className="mt-1.5 shrink-0 text-[#0B5E3C]" /><div><h3 className="text-base font-medium leading-7 text-[#1B2D23]">{item.title}</h3><p className="mt-2 text-sm text-[#405246]">{item.journal}</p></div></div></li>)}</ul>
          <a href="mailto:muzahidmonir@stariadevelopment.com" className="mt-10 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#0B5E3C] px-6 py-3 text-base font-semibold text-white hover:bg-[#09502F]"><Mail aria-hidden="true" size={18} />Contact Maj S M Muzahid Monir</a>
        </div>
      </section>
    </div>
  );
}
