import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, MapPin, Phone, Mail, Send, CheckCheck, Loader2 } from "lucide-react";
import { api } from "../services/api";
import { Link } from "react-router";
import { EmploymentDialog } from "../components/shared/EmploymentDialog";
import { GoogleMapEmbed } from "../components/shared/GoogleMapEmbed";
import { BD_ADDRESS, BD_PHONE, BD_PHONE_TEL, CONTACT_EMAIL, MAP_COORDINATES, MAP_SHARE_URL, US_ADDRESS, US_PHONE, US_PHONE_TEL } from "../services/contactDetails";

export default function ContactPage() {
  const [employmentOpen, setEmploymentOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await api.submitContact({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
        consentAccepted: true,
      });

      setFormSent(true);
      setTimeout(() => {
        setFormSent(false);
        setFormData({ name: "", phone: "", email: "", message: "" });
        setConsentAccepted(false);
      }, 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-white/[0.06] border border-white/[0.12] rounded-2xl px-5 py-3.5 text-white text-[0.9rem] placeholder:text-white/25 focus:outline-none focus:border-[#D9A11A]/55 focus:bg-white/[0.09] transition-all duration-300";
  const labelClass = "block text-white/45 text-[0.65rem] tracking-[0.45em] uppercase font-medium mb-2.5";
  const officeContacts = [
    { label: "BD Office", address: BD_ADDRESS, phone: BD_PHONE, tel: BD_PHONE_TEL },
    { label: "US Office", address: US_ADDRESS, phone: US_PHONE, tel: US_PHONE_TEL },
  ];

  return (
    <section className="bg-[#082D1C] pt-36 pb-28">
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20">

        <div className="mb-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 mb-5">
            <span className="block w-7 h-px bg-[#D9A11A]" />
            <span className="text-[#D9A11A] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Get In Touch</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-normal leading-[1.08] text-white mb-4"
            style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(36px, 3.8vw, 50px)" }}>
            Let's Build Something <span className="italic" style={{ color: "#D9A11A" }}>Remarkable</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/45 max-w-[500px]" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", lineHeight: "1.85" }}>
            Our team is ready to help with your property needs. Fill in the form or reach out directly.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-stretch">

          {/* Map / contact info */}
          <motion.div initial={{ opacity: 0, x: -44 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[28px] border border-white/[0.08]" style={{ background: "#082D1C", minHeight: "540px" }}>
            <GoogleMapEmbed title="STARIA Bangladesh location map" query={MAP_COORDINATES} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(8,45,28,0.02), rgba(8,45,28,0.05) 45%, rgba(8,45,28,0.72) 100%)" }} />

            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/[0.1] bg-[#082D1C]/82 px-4 py-2 shadow-lg shadow-black/15 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A11A] animate-pulse" />
              <span className="text-[#D9A11A] text-[0.66rem] tracking-[0.24em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>BD Office Map</span>
            </div>

            <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
              <div className="w-full max-w-[560px] rounded-2xl border border-white/[0.12] bg-[#082D1C]/92 p-5 shadow-2xl shadow-black/25 backdrop-blur-md">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-white text-[0.95rem] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>STARIA Locations</p>
                    <p className="mt-1 text-white/45 text-[0.76rem] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>Primary map pin points to the Dhaka office.</p>
                  </div>
                  <a href={MAP_SHARE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#D9A11A]/35 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#D9A11A] transition-colors hover:bg-[#D9A11A] hover:text-[#1B1B1B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <MapPin size={13} />
                    Open Map
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {officeContacts.map((office) => (
                    <div key={office.label} className="rounded-xl border border-white/[0.08] bg-white/[0.045] p-4">
                      <p className="mb-2 text-[#D9A11A] text-[0.63rem] font-semibold uppercase tracking-[0.24em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{office.label}</p>
                      <p className="min-h-[3.15rem] text-white/62 text-[0.78rem] leading-[1.55]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{office.address}</p>
                      <a href={`tel:${office.tel}`} className="mt-3 inline-flex items-center gap-2 text-white/72 hover:text-[#D9A11A] text-[0.78rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <Phone size={13} className="text-[#D9A11A] shrink-0" />
                        {office.phone}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-white/[0.08] pt-4">
                  <Mail size={13} className="text-[#D9A11A] shrink-0" />
                  <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-white/50 text-[0.78rem] hover:text-[#D9A11A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{CONTACT_EMAIL}</a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 44 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {formSent ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#0B5E3C] flex items-center justify-center mb-7" style={{ boxShadow: "0 0 48px rgba(11, 94, 60,0.5)" }}>
                    <CheckCheck size={32} className="text-white" />
                  </div>
                  <h3 className="text-white text-[1.7rem] font-normal mb-3" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Message Received</h3>
                  <p className="text-white/40 text-[0.87rem] leading-[1.8]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Our team will be in touch within 24 hours.<br />Thank you for choosing STARIA.</p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[0.85rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {errorMsg}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-fullName" className={labelClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>Full Name</label>
                      <input id="contact-fullName" required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className={inputClass} style={{ fontFamily: "'DM Sans', sans-serif" }} />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className={labelClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>Phone</label>
                      <input id="contact-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+880 ..." className={inputClass} style={{ fontFamily: "'DM Sans', sans-serif" }} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>Email Address</label>
                    <input id="contact-email" required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} style={{ fontFamily: "'DM Sans', sans-serif" }} />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className={labelClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>Message</label>
                    <textarea id="contact-message" required name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your project or enquiry…" rows={5} className={`${inputClass} resize-none`} style={{ fontFamily: "'DM Sans', sans-serif" }} />
                  </div>
                  <label className="flex items-start gap-3 text-white/55 text-sm leading-6">
                    <input
                      type="checkbox"
                      required
                      checked={consentAccepted}
                      onChange={(event) => setConsentAccepted(event.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#D9A11A]"
                    />
                    <span>
                      I agree that Staria may use my details to respond to this enquiry, as explained in the{" "}
                      <Link to="/privacy" className="text-[#D9A11A] underline underline-offset-2">privacy notice</Link>.
                    </span>
                  </label>
                  <div className="pt-1">
                    <motion.button type="submit" disabled={isSubmitting || !consentAccepted} whileHover={{ scale: isSubmitting ? 1 : 1.025 }} whileTap={{ scale: isSubmitting ? 1 : 0.97 }} transition={{ type: "spring", stiffness: 420, damping: 22 }}
                      className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-semibold transition-all duration-300 disabled:opacity-50"
                      style={{ background: "#D9A11A", color: "#1B1B1B", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 32px rgba(245,166,35,0.28)" }}>
                      {isSubmitting ? (
                        <>Sending... <Loader2 size={16} className="animate-spin" /></>
                      ) : (
                        <>Send Message <Send size={16} /></>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 mt-20">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.25em] text-[#D9A11A]">Careers at Staria</p>
            <h2 className="mb-4 text-3xl md:text-4xl text-white" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>Join us</h2>
            <p className="text-white/65 leading-7">Build your career with Staria Properties. Share your experience and skills with our team by submitting an employment application.</p>
          </div>
          <button type="button" onClick={() => setEmploymentOpen(true)} className="shrink-0 rounded-full bg-[#D9A11A] px-10 py-4 font-semibold text-[#1B1B1B] hover:bg-[#C08912]">Apply</button>
        </div>
      </div>
      <EmploymentDialog key={String(employmentOpen)} open={employmentOpen} onOpenChange={setEmploymentOpen} />
    </section>
  );
}
