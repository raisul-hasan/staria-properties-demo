import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, NavLink } from "react-router";
import { motion, AnimatePresence, useScroll } from "motion/react";
import {
  Menu, X, ArrowRight, MapPin,
  Facebook, Instagram, Linkedin,
  Phone, Mail, ChevronDown,
} from "lucide-react";
import { StariaLogo } from "./components/shared/StariaLogo";
import { ScrollToTop } from "./components/shared/ScrollToTop";
import { WhatsAppButton } from "./components/shared/WhatsAppButton";
import { RouteMetadata } from "./components/shared/RouteMetadata";
import { ConsultationDialog } from "./components/shared/ConsultationDialog";
import { EmploymentDialog } from "./components/shared/EmploymentDialog";
import { api, type SiteInfo } from "./services/api";
import { PUBLIC_INSIGHTS_ENABLED } from "./features";
import { BD_ADDRESS, BD_PHONE, BD_PHONE_TEL, CONTACT_EMAIL, US_ADDRESS, US_PHONE, US_PHONE_TEL } from "./services/contactDetails";

const NAV_CONFIG = [
  { label: "Home",        path: "/"            },
  { label: "About", children: [
    { label: "Who We Are", path: "/about/who-we-are" },
    { label: "Board of Directors", path: "/about/board-of-directors" },
    { label: "Our Team", path: "/about/our-team" },
  ] },
  { label: "WHAT WE DO", children: [
    { label: "Development", path: "/development" },
    { label: "Properties", path: "/properties" },
    { label: "Interior", path: "/interior" },
    { label: "Consultancy", path: "/consultancy" },
  ] },
  { label: "Projects",    path: "/projects"    },
  // FUTURE IMPLEMENTATION — INSIGHTS: retain the link for reactivation.
  ...(PUBLIC_INSIGHTS_ENABLED ? [{ label: "Insights", path: "/news" }] : []),
  { label: "Contact", path: "/contact" },
] as const;

const STARIA_SOCIALS = [
  { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/1MVS8t8FtR/" },
  { Icon: Instagram, label: "Instagram", href: null },
  { Icon: Linkedin, label: "LinkedIn", href: null },
  { Icon: X, label: "X", href: null },
  { Icon: Mail, label: "Email STARIA", href: `mailto:${CONTACT_EMAIL}` },
] as const;

function StariaSocialLinks({ className = "", framed = false }: { className?: string; framed?: boolean }) {
  return (
    <div role="group" aria-label="STARIA social channels" className={`flex items-center gap-1 ${className}`}>
      {STARIA_SOCIALS.map(({ Icon, label, href }) => {
        const baseClass = `inline-flex h-9 w-9 shrink-0 items-center justify-center ${framed ? "rounded-full border border-white/15" : "rounded-sm"}`;
        return href ? (
          <a key={label} href={href} aria-label={label} title={label} target={href.startsWith("https:") ? "_blank" : undefined} rel={href.startsWith("https:") ? "noopener noreferrer" : undefined} className={`${baseClass} text-white/80 transition-colors hover:text-[#D9A11A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A11A]`}>
            <Icon size={17} aria-hidden="true" />
          </a>
        ) : (
          <span key={label} role="link" aria-disabled="true" aria-label={`${label} — coming soon`} title={`${label} — coming soon`} className={`${baseClass} cursor-default text-white/30`}>
            <Icon size={17} aria-hidden="true" />
          </span>
        );
      })}
    </div>
  );
}

function NavigationDropdown({ label, links, mobile = false, onNavigate }: {
  label: string;
  links: readonly { label: string; path: string }[];
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const active = links.some(({ path }) => pathname === path || pathname.startsWith(`${path}/`));
  const panelId = `${label.toLowerCase().replace(/\s+/g, "-")}-${mobile ? "mobile" : "desktop"}`;

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  return (
    <div ref={containerRef} className="relative"
      onPointerEnter={(event) => { if (!mobile && event.pointerType === "mouse") setOpen(true); }}
      onPointerLeave={(event) => { if (!mobile && event.pointerType === "mouse") setOpen(false); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}
      onKeyDown={(event) => {
        if (event.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
      }}>
      <button ref={buttonRef} type="button" aria-expanded={open} aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`relative flex items-center justify-between gap-2 text-[0.9375rem] tracking-[0.05em] uppercase font-medium transition-colors duration-300 group ${mobile
          ? `w-full py-3.5 border-b border-white/[0.06] ${active ? "text-[#D9A11A]" : "text-white/65 hover:text-white"}`
          : `py-1 ${active || open ? "text-white" : "text-white/60 hover:text-white"}`}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {label}
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        {!mobile && <span className={`absolute bottom-0 left-0 h-px bg-[#D9A11A] transition-all duration-400 ease-out ${active || open ? "w-full" : "w-0 group-hover:w-full"}`} />}
      </button>
      <AnimatePresence>
        {open && <motion.div id={panelId}
          initial={mobile ? { height: 0, opacity: 0 } : { opacity: 0, y: -8 }}
          animate={mobile ? { height: "auto", opacity: 1 } : { opacity: 1, y: 0 }}
          exit={mobile ? { height: 0, opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={mobile ? "overflow-hidden pl-4" : "absolute top-full left-0 pt-3 min-w-[210px]"}>
          <div className={mobile ? "py-1" : "rounded-2xl border border-white/[0.07] bg-[#082D1C] p-2 shadow-xl shadow-black/40"}>
            {links.map(({ label, path }) => <NavLink key={path} to={path}
              onClick={() => { setOpen(false); onNavigate?.(); }}
              className={({ isActive }) => `flex items-center justify-between gap-4 text-[0.9375rem] tracking-[0.05em] uppercase transition-colors duration-300 ${mobile ? "py-3.5 border-b border-white/[0.06]" : "px-4 py-3 rounded-xl hover:bg-white/[0.05]"} ${isActive ? "text-[#D9A11A]" : "text-white/65 hover:text-white"}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {label}<ArrowRight size={12} />
            </NavLink>)}
          </div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

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
  const [employmentOpen, setEmploymentOpen] = useState(false);
  const bdAddress = String(siteInfo?.["company.address.bd"] ?? siteInfo?.contact?.bdAddress ?? siteInfo?.["company.address"] ?? siteInfo?.contact?.address ?? BD_ADDRESS);
  const bdPhone = String(siteInfo?.["company.phone.bd"] ?? siteInfo?.contact?.bdPhone ?? siteInfo?.["company.phone"] ?? siteInfo?.contact?.phone ?? BD_PHONE);
  const usAddress = String(siteInfo?.["company.address.us"] ?? siteInfo?.contact?.usAddress ?? US_ADDRESS);
  const usPhone = String(siteInfo?.["company.phone.us"] ?? siteInfo?.contact?.usPhone ?? US_PHONE);

  const quickLinks = [
    { label: "Home",        path: "/"            },
    { label: "About",       path: "/about"       },
    { label: "Properties",  path: "/properties"  },
    { label: "Development", path: "/development" },
    { label: "Interior",    path: "/interior"    },
    { label: "Consultancy", path: "/consultancy" },
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

  return (
    <footer style={{ background: "#082D1C" }}>
      <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(245,166,35,0.45), transparent)" }} />

      {/* Careers */}
      <div className="max-w-[1440px] mx-auto px-12 xl:px-20 pt-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 px-10 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
          <div>
            <p className="text-white text-[0.97rem] font-semibold mb-1" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>
              Drop Your CV
            </p>
            <p className="text-white/35 text-[0.8rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Build your career with STARIA. Share your experience and skills with our team.
            </p>
          </div>
          <div className="w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setEmploymentOpen(true)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-2.5 bg-[#D9A11A] hover:bg-[#C08912] text-[#1B1B1B] text-[1rem] font-semibold rounded-full transition-colors duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Submit Your CV <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
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
            <StariaSocialLinks className="mt-7" framed />
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
                  <span className="block text-white/55">BD Address</span>
                  {bdAddress}
                </p>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#0B5E3C]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={12} className="text-[#D9A11A]" />
                </div>
                <p className="text-white/35 text-[0.875rem] leading-[1.7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="block text-white/55">US Address</span>
                  {usAddress}
                </p>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#0B5E3C]/20 flex items-center justify-center shrink-0">
                  <Phone size={12} className="text-[#D9A11A]" />
                </div>
                <a href={`tel:${BD_PHONE_TEL}`} className="text-white/35 hover:text-[#D9A11A] text-[0.875rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>BD: {bdPhone}</a>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#0B5E3C]/20 flex items-center justify-center shrink-0">
                  <Phone size={12} className="text-[#D9A11A]" />
                </div>
                <a href={`tel:${US_PHONE_TEL}`} className="text-white/35 hover:text-[#D9A11A] text-[0.875rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>US: {usPhone}</a>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[#0B5E3C]/20 flex items-center justify-center shrink-0">
                  <Mail size={12} className="text-[#D9A11A]" />
                </div>
                <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-white/35 text-[0.875rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{CONTACT_EMAIL}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/[0.055] mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/22 text-[0.77rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 STARIA Real Estate Ltd. All rights reserved.
          </p>
        </div>
      </div>
      <EmploymentDialog key={String(employmentOpen)} open={employmentOpen} onOpenChange={setEmploymentOpen} />
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
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const location = useLocation();
  const { scrollYProgress } = useScroll();

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
            {NAV_CONFIG.map((item) => {
              if ("children" in item) return <NavigationDropdown key={item.label} label={item.label} links={item.children} />;
              const { label, path } = item;
              return (
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
              );
            })}
          </nav>

          {/* Social channels + hamburger */}
          <div className="flex items-center gap-4 shrink-0">
            <StariaSocialLinks className="hidden xl:flex" />
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
            {NAV_CONFIG.map((item) => {
              if ("children" in item) return <NavigationDropdown key={item.label} label={item.label} links={item.children} mobile onNavigate={() => setMenuOpen(false)} />;
              const { label, path } = item;
              return (
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
              );
            })}
            <StariaSocialLinks className="pt-5" />
          </div>
        </motion.div>
      </header>

      {/* Page content */}
      <div id="main-content" tabIndex={-1}><PageTransition /></div>

      <Footer siteInfo={siteInfo} />
      <ConsultationDialog key={String(consultationOpen)} open={consultationOpen} onOpenChange={setConsultationOpen} />
      <ScrollToTop />
      <WhatsAppButton />
    </div>
  );
}
