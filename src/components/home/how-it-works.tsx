"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { SectionHeading } from "@/components/motion/section-heading";
import { easeOut } from "@/components/motion/primitives";

const steps = [
  "Browse this week's kits",
  "Customise size, printing & badges",
  "Send a WhatsApp request",
  "Confirm availability & delivery",
  "Pay once everything is locked in",
];

function StepNumber({ value, active }: { value: number; active: boolean }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }
    if (reduce) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const frames = 14;
    const id = window.setInterval(() => {
      frame += 1;
      setDisplay(Math.min(value, Math.ceil((value * frame) / frames)));
      if (frame >= frames) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [active, reduce, value]);

  return (
    <span className="font-display text-4xl tracking-wide text-accent">
      {display}
    </span>
  );
}

export function HowItWorks() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden border-y border-line bg-surface/25 px-5 py-20 md:px-8 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(225,29,46,0.05),transparent_45%)]" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow="Process" title="How It Works" />

        <div className="relative mt-14">
          <div className="pointer-events-none absolute left-[10%] right-[10%] top-0 hidden h-3 md:block">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-line" />
            <motion.div
              className="absolute left-0 top-1/2 h-px origin-left -translate-y-1/2 bg-accent"
              initial={reduce ? false : { scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.05, ease: easeOut, delay: 0.12 }}
              style={{ width: "100%" }}
            />
          </div>

          <ol
            ref={ref}
            className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:grid-cols-5 md:gap-5"
          >
            {steps.map((label, i) => (
              <motion.li
                key={label}
                className="relative flex h-full pt-0 md:pt-6"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, delay: i * 0.1, ease: easeOut }}
              >
                <div className="absolute left-1/2 top-0 z-10 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-paper md:block" />

                <motion.div
                  className="flex h-full min-h-[9.5rem] w-full flex-col rounded-2xl border border-line bg-paper p-5 shadow-[0_12px_30px_rgba(11,26,51,0.04)] md:min-h-[11rem]"
                  whileHover={reduce ? undefined : { y: -4 }}
                  transition={{ duration: 0.25, ease: easeOut }}
                >
                  <StepNumber value={i + 1} active={inView} />
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {label}
                  </p>
                </motion.div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
