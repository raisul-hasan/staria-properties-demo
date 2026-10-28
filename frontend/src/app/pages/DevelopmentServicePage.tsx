import { SiteImage } from "../components/shared/SiteImage";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, CheckCheck } from "lucide-react";
import { DEVELOPMENT_SERVICES } from "../services/developmentServices";
import { ConsultationDialog } from "../components/shared/ConsultationDialog";

export default function DevelopmentServicePage() {
  const { slug } = useParams();
  const [consultationOpen, setConsultationOpen] = useState(false);
  const service = DEVELOPMENT_SERVICES.find((item) => item.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug);

  return <main className="min-h-screen bg-[#FAFAF6] pt-36 pb-24">
    <div className="mx-auto max-w-[1200px] px-6 md:px-12">
      <Link to="/development" className="mb-8 inline-flex items-center gap-2 font-semibold text-[#0B5E3C]"><ArrowLeft size={16} /> All development services</Link>
      {!service ? <div className="py-20"><h1 className="mb-4 text-3xl">Service not found</h1><p>Please return to development services to explore our current offering.</p></div> : <article>
        <p className="mb-4 text-sm uppercase tracking-widest text-[#0B5E3C]">{service.category}</p>
        <h1 className="mb-5 text-4xl md:text-5xl text-[#082D1C]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{service.title}</h1>
        <p className="mb-10 text-lg text-[#666]">{service.subtitle}</p>
        <SiteImage priority src={service.image} alt={service.alt} className="mb-12 max-h-[520px] w-full rounded-3xl object-cover" />
        <div className="grid gap-10 md:grid-cols-[1fr_300px]">
          <div><h2 className="mb-4 text-2xl text-[#082D1C]">About this service</h2><p className="mb-8 leading-8 text-[#555]">{service.desc}</p>
            <h2 className="mb-5 text-2xl text-[#082D1C]">What we offer</h2><ul className="space-y-4">{service.features.map((feature) => <li key={feature} className="flex items-start gap-3 leading-7 text-[#555]"><CheckCheck size={18} className="mt-1 shrink-0 text-[#0B5E3C]" />{feature}</li>)}</ul>
          </div>
          <aside className="h-fit rounded-2xl border border-black/10 bg-white p-6"><h2 className="mb-3 text-xl text-[#082D1C]">Discuss your project</h2><p className="mb-6 text-sm leading-6 text-[#666]">Tell our team about your requirements for {service.category.toLowerCase()}.</p><button type="button" onClick={() => setConsultationOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#D9A11A] px-5 py-3 font-semibold text-[#1B1B1B] hover:bg-[#C08912]">Get Consultation <ArrowRight size={15} /></button></aside>
        </div>
        <ConsultationDialog key={`${slug}-${consultationOpen}`} open={consultationOpen} onOpenChange={setConsultationOpen} initialService={service.category} />
      </article>}
    </div>
  </main>;
}
