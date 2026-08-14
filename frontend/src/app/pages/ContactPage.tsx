import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Phone, Mail, Send, CheckCheck } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: "", phone: "", email: "", message: "" });
    }, 4500);
  };

  const inputClass = "w-full bg-white/[0.06] border border-white/[0.12] rounded-2xl px-5 py-3.5 text-white text-[0.9rem] placeholder:text-white/25 focus:outline-none focus:border-[#D9A11A]/55 focus:bg-white/[0.09] transition-all duration-300";
  const labelClass = "block text-white/45 text-[0.65rem] tracking-[0.45em] uppercase font-medium mb-2.5";

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
            className="relative rounded-3xl overflow-hidden" style={{ background: "#082D1C", minHeight: "540px" }}>
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle 280px at 50% 46%, rgba(11, 94, 60,0.18) 0%, transparent 100%)" }} />

            <div className="absolute inset-0 flex flex-col items-center justify-center pb-12">
              <div className="relative flex items-center justify-center mb-8">
                <span className="absolute w-[90px] h-[90px] rounded-full animate-ping" style={{ background: "rgba(11, 94, 60,0.18)" }} />
                <span className="absolute w-[64px] h-[64px] rounded-full" style={{ background: "rgba(11, 94, 60,0.22)" }} />
                <div className="relative z-10 w-[52px] h-[52px] rounded-full bg-[#0B5E3C] flex items-center justify-center" style={{ boxShadow: "0 0 36px rgba(11, 94, 60,0.7)" }}>
                  <MapPin size={22} className="text-white" />
                </div>
              </div>
              <div className="bg-white/[0.06] border border-white/[0.09] rounded-2xl px-8 py-5 text-center backdrop-blur-sm">
                <p className="text-white text-[0.92rem] font-semibold mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>STARIA Headquarters</p>
                <p className="text-white/40 text-[0.8rem] leading-[1.65]" style={{ fontFamily: "'DM Sans', sans-serif" }}>House 14, Road 11, Gulshan-2<br />Dhaka 1212, Bangladesh</p>
              </div>
            </div>

            <div className="absolute top-6 right-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A11A] animate-pulse" />
              <span className="text-[#D9A11A]/55 text-[0.66rem] tracking-[0.38em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>Our Location</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 pt-16" style={{ background: "linear-gradient(to top, #082D1C 60%, transparent)" }}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Phone size={13} className="text-[#D9A11A] shrink-0" />
                  <span className="text-white/45 text-[0.8rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>+880 1700 000 000</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={13} className="text-[#D9A11A] shrink-0" />
                  <span className="text-white/45 text-[0.8rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>info@staria.com.bd</span>
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
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>Full Name</label>
                      <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className={inputClass} style={{ fontFamily: "'DM Sans', sans-serif" }} />
                    </div>
                    <div>
                      <label className={labelClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+880 ..." className={inputClass} style={{ fontFamily: "'DM Sans', sans-serif" }} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} style={{ fontFamily: "'DM Sans', sans-serif" }} />
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>Message</label>
                    <textarea required name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your project or enquiry…" rows={5} className={`${inputClass} resize-none`} style={{ fontFamily: "'DM Sans', sans-serif" }} />
                  </div>
                  <div className="pt-1">
                    <motion.button type="submit" whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 420, damping: 22 }}
                      className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-semibold transition-all duration-300"
                      style={{ background: "#D9A11A", color: "#1B1B1B", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 32px rgba(245,166,35,0.28)" }}>
                      Send Message <Send size={16} />
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
