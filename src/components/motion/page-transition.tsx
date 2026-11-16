"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { easeOut } from "@/components/motion/primitives";

export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
