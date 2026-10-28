import { SiteImage } from "./shared/SiteImage";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";

import nurAlamPortrait from "../../assets/team/official/atm-nur-alam.jpg";
import lanjuPortrait from "../../assets/team/official/mehedi-hasan-lanju.jpg";
import bappyPortrait from "../../assets/team/official/rayhan-rashid-bappy.jpg";
import nafeezPortrait from "../../assets/team/official/nafeez-talukder.jpg";
import mahirulPortrait from "../../assets/team/official/mahirul-islam.webp";
import nihalPortrait from "../../assets/team/official/iftikarun-nur-nihal.jpg";

type TeamMember = {
  name: string;
  designation: string;
  contactCardUrl: string;
  photo: string;
};

// Official employee roster and contact-card links from Untitled document.docx.
const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    name: "A.T.M. Nur Alam",
    designation: "Manager - Admin, Hr, Accounts",
    contactCardUrl: "https://scan.page/p/U2a0ML",
    photo: nurAlamPortrait
  },
  {
    name: "MD Mehedi Hasan Lanju",
    designation: "Manager",
    contactCardUrl: "https://scan.page/p/1tj9Fv",
    photo: lanjuPortrait
  },
  {
    name: "Md Rayhan Rashid Bappy",
    designation: "Assistant Manager, Sales",
    contactCardUrl: "https://scan.page/p/1z6Vi3",
    photo: bappyPortrait
  },
  {
    name: "MD Nafeez Talukder",
    designation: "Executive, Procurement",
    contactCardUrl: "https://scan.page/p/H82diS",
    photo: nafeezPortrait
  },
  {
    name: "Mahirul Islam",
    designation: "Executive, Business Development",
    contactCardUrl: "https://scan.page/p/19IGio",
    photo: mahirulPortrait
  },
  {
    name: "Iftikarun-Nur Nihal",
    designation: "Assistant Accountant",
    contactCardUrl: "https://scan.page/p/1lTYcV",
    photo: nihalPortrait
  }
];

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_10px_35px_rgba(11,94,60,0.05)] transition-all duration-500 hover:-translate-y-1 hover:border-[#0B5E3C]/20 hover:shadow-[0_16px_44px_rgba(11,94,60,0.12)]`}
    >
      <div className="relative flex h-[320px] sm:h-[340px] items-center justify-center overflow-hidden bg-[#0B5E3C]">
        <SiteImage src={member.photo} alt={member.name} loading="lazy" className="h-full w-full object-cover object-top" />
        <span aria-hidden="true" className="absolute bottom-0 left-8 right-8 h-1 rounded-t-full bg-[#D9A11A]" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 text-[0.95rem] font-semibold uppercase tracking-[0.2em] text-[#0B5E3C]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{member.designation}</p>
        <h3 className="min-h-[3.6rem] text-[1.45rem] leading-[1.2] text-[#1B1B1B]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{member.name}</h3>

        <a href={member.contactCardUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#0B5E3C]/25 px-4 py-2.5 text-[0.8125rem] font-semibold text-[#0B5E3C] transition-colors hover:bg-[#0B5E3C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A11A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          View Contact <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}

export function OurTeamSection() {
  return (
    <section className="bg-[#F7F7F5] py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 xl:px-20">
        <div className="mb-14 max-w-[620px]">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-5 flex items-center gap-3">
            <span aria-hidden="true" className="block h-px w-7 bg-[#D9A11A]" />
            <span className="text-[0.8125rem] font-semibold uppercase tracking-[0.3em] text-[#0B5E3C]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Our Team</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }} className="mb-5 font-normal leading-[1.1] text-[#1B1B1B]" style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.5vw, 46px)" }}>
            Meet Our <span className="italic">Team</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }} className="text-[0.95rem] leading-[1.8] text-[#555555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Meet the team supporting STARIA&apos;s development and property services.
          </motion.p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member, index) => <TeamMemberCard key={member.name} member={member} index={index} />)}
        </div>
      </div>
    </section>
  );
}
