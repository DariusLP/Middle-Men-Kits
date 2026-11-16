"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  tone?: "accent" | "ink";
};

export function ChoiceChip({
  active,
  onClick,
  children,
  className = "",
  tone = "accent",
}: Props) {
  const reduce = useReducedMotion();
  const activeClasses =
    tone === "ink"
      ? "border-ink bg-ink text-paper"
      : "border-accent bg-accent text-accent-ink";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      animate={
        reduce
          ? undefined
          : active
            ? { scale: 1.04 }
            : { scale: 1 }
      }
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className={`relative min-w-12 overflow-hidden rounded-xl border px-3 py-2 text-sm font-medium ${
        active
          ? activeClasses
          : "border-line text-ink hover:border-ink"
      } ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
