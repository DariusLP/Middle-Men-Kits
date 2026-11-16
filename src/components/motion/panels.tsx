"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOut } from "@/components/motion/primitives";

export function FeaturePanel({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className="group relative overflow-hidden rounded-2xl border border-line bg-paper/80 p-7 md:p-8"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: easeOut }}
      whileHover={reduce ? undefined : { y: -6 }}
    >
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/5 transition-transform duration-500 group-hover:scale-125" />
      <p className="font-display text-4xl tracking-wide text-accent">
        0{index + 1}
      </p>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        {body}
      </p>
    </motion.article>
  );
}

export function CategoryPanel({
  href,
  title,
  body,
  index,
}: {
  href: string;
  title: string;
  body: string;
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: easeOut }}
      whileHover={reduce ? undefined : { y: -6 }}
    >
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-paper to-surface p-4 transition-colors hover:border-accent sm:p-6 md:p-8"
      >
        <span className="absolute right-3 top-3 font-display text-3xl text-ink/5 transition-colors group-hover:text-accent/20 sm:right-5 sm:top-5 sm:text-5xl">
          0{index + 1}
        </span>
        <span className="absolute bottom-0 left-0 h-full w-1 bg-accent transition-all duration-400 group-hover:w-1.5" />
        <h3 className="relative font-display text-2xl tracking-wide text-ink sm:text-3xl">
          {title}
        </h3>
        <p className="relative mt-1.5 max-w-[16rem] text-xs text-ink-muted sm:mt-3 sm:text-sm">
          {body}
        </p>
        <span className="relative mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent sm:mt-6 sm:text-xs">
          Browse
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

export function StepPanel({
  step,
  label,
  index,
}: {
  step: number;
  label: string;
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      className="group relative rounded-2xl border border-line bg-paper/70 p-5"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: easeOut }}
      whileHover={reduce ? undefined : { y: -4 }}
    >
      <p className="font-display text-4xl tracking-wide text-accent transition-transform duration-300 group-hover:scale-110 group-hover:origin-left">
        {step}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        {label}
      </p>
    </motion.li>
  );
}

export function ReviewPanel({
  quote,
  name,
  index,
}: {
  quote: string;
  name: string;
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.blockquote
      className="relative overflow-hidden rounded-2xl border border-line bg-paper p-6 md:p-7"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: easeOut }}
      whileHover={reduce ? undefined : { y: -4 }}
    >
      <span
        className="pointer-events-none absolute -left-1 -top-4 font-display text-7xl text-accent/15"
        aria-hidden
      >
        “
      </span>
      <p className="relative text-base leading-relaxed text-ink">
        {quote}
      </p>
      <footer className="relative mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-ink-muted">
        <span className="h-px w-6 bg-accent" />
        {name}
      </footer>
    </motion.blockquote>
  );
}

export function Band({
  children,
  tone = "paper",
  className = "",
}: {
  children: ReactNode;
  tone?: "paper" | "soft" | "ink" | "accent";
  className?: string;
}) {
  const tones = {
    paper: "bg-transparent",
    soft: "relative overflow-hidden border-y border-line bg-surface/60",
    ink: "relative overflow-hidden bg-ink text-paper",
    accent: "relative overflow-hidden bg-accent text-accent-ink",
  };

  return (
    <section className={`${tones[tone]} ${className}`}>
      {tone === "ink" ? (
        <>
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-accent" />
        </>
      ) : null}
      {tone === "accent" ? (
        <>
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-black/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        </>
      ) : null}
      {tone === "soft" ? (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(225,29,46,0.06),transparent_50%)]" />
      ) : null}
      <div className="relative">{children}</div>
    </section>
  );
}
