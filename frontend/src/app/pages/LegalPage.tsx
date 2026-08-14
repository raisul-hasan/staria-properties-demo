import { useLocation } from "react-router";
import { PageHero } from "../components/shared/PageHero";

const content = {
  "/privacy": {
    title: "Privacy Notice",
    eyebrow: "Your information",
    intro: "This notice explains what information the Staria Properties website collects and how it is used.",
    sections: [
      ["Information we collect", "When you submit an enquiry or newsletter form, we collect the details you enter, such as your name, email address, phone number, and message. Basic technical information may also be retained for security and spam prevention."],
      ["How we use it", "We use enquiry information to respond to you, operate the requested service, protect the website, and maintain an audit trail. Newsletter information is used only to deliver updates you requested."],
      ["Sharing and retention", "Information should be shared only with service providers needed to operate this website or when required by law. Production retention periods and service-provider details must be finalized with the business before public launch."],
      ["Your choices", "You may ask Staria to correct or delete your information, or withdraw newsletter consent, using the contact details shown on this website."],
      ["Pre-launch notice", "This is a stakeholder-demo privacy notice. The business owner must review it with qualified legal advice and add final company, retention, and regulatory details before public launch."]
    ]
  },
  "/terms": {
    title: "Terms of Service",
    eyebrow: "Website use",
    intro: "These preliminary terms govern use of the Staria Properties stakeholder-demo website.",
    sections: [
      ["Property information", "Demo listings, prices, availability, measurements, images, and project dates are illustrative and must not be treated as a binding offer or professional advice."],
      ["Acceptable use", "Do not misuse the website, attempt unauthorized access, submit unlawful content, or interfere with availability or security."],
      ["No transaction formed", "Submitting an enquiry does not reserve a property, create an agency relationship, or complete a transaction. Final terms require written agreements and appropriate professional review."],
      ["Pre-launch notice", "These terms require business and legal review before the website is made public or real transactions are accepted."]
    ]
  },
  "/cookies": {
    title: "Cookie Notice",
    eyebrow: "Browser storage",
    intro: "The website uses limited browser storage needed to provide its features.",
    sections: [
      ["Essential authentication", "The admin portal uses secure HTTP-only cookies to maintain authenticated sessions and protect restricted pages."],
      ["Public website", "The current public demo does not intentionally set advertising cookies. Hosting, security, or future analytics services may require this notice and a consent control to be updated."],
      ["Your controls", "You can remove or block cookies through your browser settings, although doing so may prevent the admin portal from working."],
      ["Pre-launch notice", "Complete a final cookie scan after production providers and analytics are selected."]
    ]
  }
} as const;

export default function LegalPage() {
  const location = useLocation();
  const page = content[location.pathname as keyof typeof content] ?? content["/privacy"];
  return (
    <main id="main-content" className="bg-white min-h-screen">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.intro}
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1800&h=900&fit=crop&auto=format&q=85"
        imageAlt=""
      />
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <p className="text-sm text-[#777] mb-10">Last reviewed: 27 July 2026</p>
        <div className="space-y-10">
          {page.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="text-2xl text-[#1B1B1B] mb-3" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>{heading}</h2>
              <p className="text-[#555] leading-8">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
