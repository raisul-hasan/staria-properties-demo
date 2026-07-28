import { motion } from "motion/react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  titleItalic?: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
}

export function PageHero({ eyebrow, title, titleItalic, subtitle, image, imageAlt = "" }: PageHeroProps) {
  return (
    <section className="relative h-[480px] xl:h-[540px] overflow-hidden flex flex-col justify-end">
      {/* Background image */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/55 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      {/* Gold top accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D9A11A]/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-12 xl:px-20 pb-16 xl:pb-20 pt-28 w-full">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-5"
        >
          <span className="block w-8 h-px bg-[#D9A11A]" />
          <span
            className="text-[#D9A11A] text-[0.8125rem] tracking-[0.3em] uppercase font-semibold"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="font-normal leading-[1.08] text-white mb-4"
          style={{ fontFamily: "'Gilda Display', Georgia, serif", fontSize: "clamp(34px, 3.6vw, 48px)" }}
        >
          {title}
          {titleItalic && (
            <>
              {" "}<span className="italic">{titleItalic}</span>
            </>
          )}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/55 max-w-[520px]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", lineHeight: "1.85" }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
