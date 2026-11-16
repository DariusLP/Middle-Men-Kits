"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOut } from "@/components/motion/primitives";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark" | "accent";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className = "",
}: Props) {
  const reduce = useReducedMotion();
  const centered = align === "center";

  const titleColor =
    tone === "light" ? "text-ink" : "text-paper";
  const muted =
    tone === "accent"
      ? "text-accent-ink/75"
      : tone === "dark"
        ? "text-white/60"
        : "text-ink-muted";
  const eyebrowColor =
    tone === "accent" ? "text-accent-ink" : "text-accent";

  return (
    <div
      className={`relative ${centered ? "mx-auto max-w-3xl text-center" : ""} ${className}`}
    >
      {eyebrow ? (
        <motion.div
          className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <span
            className={`h-px w-8 ${tone === "accent" ? "bg-accent-ink/50" : "bg-accent"}`}
          />
          <p
            className={`text-xs font-semibold uppercase tracking-[0.28em] ${eyebrowColor}`}
          >
            {eyebrow}
          </p>
        </motion.div>
      ) : null}

      <motion.h2
        className={`mt-4 font-display text-5xl leading-[0.92] tracking-wide md:text-6xl lg:text-7xl ${titleColor}`}
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.06, ease: easeOut }}
      >
        {title}
      </motion.h2>

      <motion.div
        className={`mt-5 h-[3px] origin-left ${centered ? "mx-auto" : ""} ${
          tone === "accent" ? "bg-accent-ink" : "bg-accent"
        }`}
        style={{ width: centered ? "4.5rem" : "3.5rem" }}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, delay: 0.18, ease: easeOut }}
      />

      {description ? (
        <motion.div
          className={`mt-5 max-w-xl text-base leading-relaxed md:text-lg ${muted} ${centered ? "mx-auto" : ""}`}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.22, ease: easeOut }}
        >
          {description}
        </motion.div>
      ) : null}
    </div>
  );
}

export function PageHeroHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex items-center gap-3"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        <span className="h-px w-10 bg-accent" />
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          {eyebrow}
        </p>
      </motion.div>

      <motion.h1
        className="mt-4 font-display text-6xl leading-[0.88] tracking-wide md:text-8xl"
        initial={reduce ? false : { opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.08, ease: easeOut }}
      >
        {title}
      </motion.h1>

      <motion.div
        className="mt-6 h-[3px] w-20 origin-left bg-accent"
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.55, delay: 0.28, ease: easeOut }}
      />

      {description ? (
        <motion.div
          className="mt-5 max-w-md text-sm text-white/60 md:text-base"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease: easeOut }}
        >
          {description}
        </motion.div>
      ) : null}
    </div>
  );
}
