"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

export function ScrollProgress() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  if (pathname.startsWith("/admin") || reduce) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[45] h-[3px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
