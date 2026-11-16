"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/components/motion/primitives";

export function CustomiseBand() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-accent" />
      <div className="pitch-lines absolute inset-0 opacity-10" />
      <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:gap-14 md:px-8 md:py-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Customise
          </p>
          <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-wide md:text-7xl">
            Make it
            <br />
            yours
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/65 md:text-lg">
            Add name and number printing for R200, badges for R100 each, then
            send the exact build on WhatsApp.
          </p>
          <Link
            href="/shop?tab=weekly"
            className="btn-accent mt-8 inline-flex"
          >
            <span className="btn-label">Start with this week</span>
          </Link>
        </motion.div>

        <motion.div
          className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-pitch"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1, ease: easeOut }}
        >
          <Image
            src="/products/chelsea-third-24-25.jpg"
            alt="Custom kit preview"
            fill
            sizes="(max-width: 768px) 90vw, 400px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pitch-deep/80 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex justify-between text-[10px] uppercase tracking-[0.16em] text-white/80">
            <span>Printing R200</span>
            <span>Badge R100</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
