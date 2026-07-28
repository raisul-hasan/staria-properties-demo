import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, NavLink } from "react-router";
import { motion, AnimatePresence, useScroll } from "motion/react";
import {
  Menu, X, ArrowRight, MapPin,
  Facebook, Instagram, Linkedin, Twitter,
  Phone, Mail,
} from "lucide-react";
import { StariaLogo } from "./components/shared/StariaLogo";
import { LoadingScreen } from "./components/shared/LoadingScreen";
import { ScrollToTop } from "./components/shared/ScrollToTop";
import { RouteMetadata } from "./components/shared/RouteMetadata";
import { api, type SiteInfo } from "./services/api";

const NAV_CONFIG = [
  { label: "Home",        path: "/"            },
  { label: "About",       path: "/about"       },
  { label: "Development", path: "/development" },
  { label: "Properties",  path: "/properties"  },
  { label: "Interior",    path: "/interior"    },
  { label: "Projects",    path: "/projects"    },
  { label: "Insights",    path: "/news"        },
  { label: "Contact",     path: "/contact"     },
] as const;

export function createRipple(e: React.MouseEvent<HTMLButtonElement>) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  const ripple = document.createElement("span");
  ripple.style.cssText = `
    position:absolute;width:${size}px;height:${size}px;border-radius:50%;
    left:${x}px;top:${y}px;background:rgba(255,255,255,0.22);transform:scale(0);
    animation:ripple-wave 0.65s ease-out forwards;pointer-events:none;z-index:9;
  `;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ siteInfo }: { siteInfo: SiteInfo | null }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const address = String(siteInfo?.["company.address"] ?? siteInfo?.contact?.address ?? "Gulshan Avenue, Dhaka, Bangladesh");
  const phone = String(siteInfo?.["company.phone"] ?? siteInfo?.contact?.phone ?? "+880 1700 000 000");
  const contactEmail = String(siteInfo?.["company.email"] ?? siteInfo?.contact?.email ?? "info@staria.com.bd");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consentAccepted) return;
    setStatus("loading");
    try {
      await api.subscribeNewsletter(email, true);
      setStatus("success");
      setEmail("");
      setConsentAccepted(false);
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const quickLinks = [
    { label: "Home",        path: "/"            },
    { label: "About",       path: "/about"       },
    { label: "Properties",  path: "/properties"  },
    { label: "Development", path: "/development" },
    { label: "Interior",    path: "/interior"    },
    { label: "Services",    path: "/development" },
    { label: "Contact",     path: "/contact"     },
  ];
  const serviceLinks = [
    "Property Buying",
    "Property Selling",
    "Real Estate Development",
    "Interior Design",
    "Property Management",
    "Investment Consultancy",
  ];
  const socials = [
    { Icon: Facebook, label: "Facebook", href: "https://facebook.com" },
    { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
    { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
    { Icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  ];

  return (
    <footer style={{ background: "#082D1C" }}>
      <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(245,166,35,0.45), transparent)" }} />

      {/* Newsletter */}
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20 pt-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 px-10 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
          <div>
            <p className="text-white text-[0.97rem] font-semibold mb-1" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>
              Stay Ahead of the Market
            </p>
            <p className="text-white/35 text-[0.8rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Monthly insights, project launches, and market reports — direct to your inbox.
            </p>
          </div>
          <form className="w-full md:w-auto shrink-0" onSubmit={handleNewsletterSubmit}>
            <div className="flex gap-2.5">
              <label className="sr-only" htmlFor="footer-newsletter-email">Your email address</label>
              <input
                id="footer-newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 md:w-64 bg-white/[0.06] border border-white/[0.10] rounded-full px-5 py-2.5 text-white text-[0.85rem] placeholder:text-white/25 focus:outline-none focus:border-[#D9A11A]/50 transition-all duration-300"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
              <button
                type="submit"
                disabled={status === "loading" || !consentAccepted}
                className="px-6 py-2.5 bg-[#D9A11A] hover:bg-[#C08912] text-[#1B1B1B] text-[1rem] font-semibold rounded-full transition-colors duration-300 shrink-0 disabled:opacity-50"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : status === "error" ? "Try Again" : "Subscribe"}
              </button>
            </div>
            <label className="mt-2.5 flex items-start gap-2 text-white/40 text-xs max-w-md">
              <input type="checkbox" required checked={consentAccepted} onChange={(event) => setConsentAccepted(event.target.checked)} className="mt-0.5 accent-[#D9A11A]" />
              <span>I agree to receive Staria updates and understand I can unsubscribe. See the <Link to="/privacy" className="text-[#D9A11A] underline">privacy notice</Link>.</span>
            </label>
          </form>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-12 xl:px-20 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 xl:gap-16 mb-16">

          {/* Logo + tagline */}
          <div>
            <StariaLogo light />
            <p className="text-white/30 text-[0.84rem] leading-[1.82] mt-6 max-w-[230px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Bangladesh's most trusted name in luxury real estate — developing landmarks that endure.
            </p>
            <div className="flex items-center gap-2.5 mt-7">
              {socials.map(({ Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/[0.10] flex items-center justify-center text-white/35 hover:border-[#D9A11A]/55 hover:text-[#D9A11A] hover:bg-[#D9A11A]/[0.07] transition-all duration-300">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white/80 text-[0.8125rem] tracking-[0.32em] uppercase font-semibold mb-7" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-white/35 text-[0.84rem] hover:text-[#D9A11A] transition-colors duration-300 flex items-center gap-2.5 group"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <span className="block w-4 h-px bg-white/15 group-hover:w-6 group-hover:bg-[#D9A11A] transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white/80 text-[0.8125rem] tracking-[0.32em] uppercase font-semibold mb-7" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Services
            </h4>
            <ul className="space-y-4">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <Link to="/development" className="text-white/35 text-[0.84rem] hover:text-[#D9A11A] transition-colors duration-300 flex items-center gap-2.5 group" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <span className="block w-4 h-px bg-white/15 group-hover:w-6 group-hover:bg-[#D9A11A] transition-all duration-300" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/80 text-[0.8125rem] tracking-[0.32em] uppercase font-semibold mb-7" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Contact
            </h4>
            <div className="space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#0B5E3C]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={12} className="text-[#D9A11A]" />
                </div>
                <p className="text-white/35 text-[0.875rem] leading-[1.7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {address}
                </p>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#0B5E3C]/20 flex items-center justify-center shrink-0">
                  <Phone size={12} className="text-[#D9A11A]" />
                </div>
                <a href={`tel:${phone}`} className="text-white/35 text-[0.875rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{phone}</a>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#0B5E3C]/20 flex items-center justify-center shrink-0">
                  <Mail size={12} className="text-[#D9A11A]" />
                </div>
                <a href={`mailto:${contactEmail}`} className="text-white/35 text-[0.875rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{contactEmail}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/[0.055] mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/22 text-[0.77rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 STARIA Real Estate Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Cookie Policy", "/cookies"]].map(([item, path]) => (
              <Link key={item} to={path} className="text-white/22 text-[0.77rem] hover:text-white/50 transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page transition wrapper ──────────────────────────────────────────────────
function PageTransition() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const location = useLocation();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    api.getSiteInfo().then(setSiteInfo).catch(() => setSiteInfo(null));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 56);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <div className="bg-black overflow-x-hidden">
      <RouteMetadata />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] focus:bg-white focus:text-[#082D1C] focus:px-4 focus:py-3 focus:rounded-lg focus:font-semibold">
        Skip to main content
      </a>
      {/* Loading overlay */}
      <AnimatePresence>
        {!loaded && <LoadingScreen />}
      </AnimatePresence>

      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[200] pointer-events-none origin-left"
        style={{ scaleX: scrollYProgress }}
      >
        <div className="w-full h-full" style={{ background: "linear-gradient(to right, #0B5E3C, #D9A11A)" }} />
      </motion.div>

      {/* ── Navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled || !isHome
            ? "bg-[#082D1C]/97 backdrop-blur-2xl shadow-xl shadow-black/40 border-b border-white/[0.05]"
            : "bg-gradient-to-b from-black/55 via-black/20 to-transparent backdrop-blur-[2px]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-10 h-[80px] flex items-center justify-between gap-6">
          <div className="shrink-0">
            <Link to="/"><StariaLogo light /></Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-8">
            {NAV_CONFIG.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `relative text-[0.9375rem] tracking-[0.05em] uppercase font-medium transition-colors duration-300 group py-1 ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`
                }
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {({ isActive }) => (
                  <>
                    {label}
                    <span
                      className={`absolute bottom-0 left-0 h-px bg-[#D9A11A] transition-all duration-400 ease-out ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/contact"
              className="hidden xl:flex items-center gap-2 px-5 py-2.5 bg-[#D9A11A] hover:bg-[#C08912] text-[#1B1B1B] text-[1rem] font-semibold tracking-[0.02em] rounded-full transition-all duration-300 hover:shadow-[0_8px_32px_rgba(217,161,26,0.28)]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Get Consultation
              <ArrowRight size={13} />
            </Link>
            <button
              className="xl:hidden text-white p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <motion.div
          id="mobile-navigation"
          initial={false}
          animate={menuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="xl:hidden overflow-hidden bg-[#082D1C]/98 backdrop-blur-2xl border-t border-white/[0.07]"
        >
          <div className="px-8 py-7 space-y-0">
            {NAV_CONFIG.map(({ label, path }, i) => (
              <motion.div key={path}>
                <NavLink
                  to={path}
                  end={path === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between text-[0.9375rem] tracking-[0.05em] uppercase py-3.5 border-b border-white/[0.06] transition-colors ${
                      isActive ? "text-[#D9A11A]" : "text-white/65 hover:text-white"
                    }`
                  }
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      <ArrowRight size={12} className={isActive ? "text-[#D9A11A]" : "text-white/25"} />
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
            <div className="pt-5">
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="block w-full px-5 py-3.5 bg-[#D9A11A] hover:bg-[#C08912] text-[#1B1B1B] font-semibold rounded-full transition-colors text-center"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Get Consultation
              </Link>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Page content */}
      <div id="main-content" tabIndex={-1}><PageTransition /></div>

      <Footer siteInfo={siteInfo} />
      <ScrollToTop />
    </div>
  );
}
