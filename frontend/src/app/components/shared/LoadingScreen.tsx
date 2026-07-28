import { motion } from "motion/react";
import { StariaLogo } from "./StariaLogo";

export function LoadingScreen() {
  return (
    <motion.div
      key="loader"
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center"
      style={{ background: "#082D1C" }}
      exit={{ opacity: 0, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } }}
    >
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(to right, transparent, rgba(245,166,35,0.6), transparent)",
          transformOrigin: "left",
        }}
      />
      {[
        "absolute top-8 left-8 w-8 h-8 border-l border-t",
        "absolute top-8 right-8 w-8 h-8 border-r border-t",
        "absolute bottom-8 left-8 w-8 h-8 border-l border-b",
        "absolute bottom-8 right-8 w-8 h-8 border-r border-b",
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={cls}
          style={{ borderColor: "rgba(245,166,35,0.35)" }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <StariaLogo light />
      </motion.div>

      <div
        className="relative rounded-full overflow-hidden"
        style={{ width: "210px", height: "1px", background: "rgba(255,255,255,0.07)" }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: "linear-gradient(to right, #0B5E3C, #D9A11A)" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.8, duration: 1.0 }}
        className="mt-6 text-white text-[0.8125rem] tracking-[0.75em] uppercase"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Premium Real Estate
      </motion.p>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(to right, transparent, rgba(245,166,35,0.35), transparent)",
          transformOrigin: "right",
        }}
      />
    </motion.div>
  );
}
