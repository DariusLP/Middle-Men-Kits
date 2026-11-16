"use client";

import { motion, useReducedMotion } from "framer-motion";

export function PaperAtmosphere() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <motion.div
        className="absolute inset-y-[-20%] left-[-30%] w-[160%] opacity-[0.16]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -18deg,
            transparent 0 28px,
            rgba(11, 26, 51, 0.55) 28px 31px,
            transparent 31px 62px,
            rgba(225, 29, 46, 0.28) 62px 64px
          )`,
        }}
        animate={reduce ? undefined : { x: ["0%", "-8%", "0%"] }}
        transition={{ duration: 28, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.div
        className="absolute inset-y-[-10%] right-[-40%] w-[120%] opacity-[0.08]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            12deg,
            transparent 0 48px,
            rgba(11, 26, 51, 0.7) 48px 49px
          )`,
        }}
        animate={reduce ? undefined : { x: ["0%", "6%", "0%"] }}
        transition={{
          duration: 34,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 1,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(247,242,236,0.25)_0%,rgba(247,242,236,0.78)_80%)]" />
    </div>
  );
}
