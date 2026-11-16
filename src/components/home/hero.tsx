"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { MotionLink } from "@/components/motion/motion-button";
import { easeOut } from "@/components/motion/primitives";

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[100svh] overflow-hidden bg-pitch-deep pt-16 md:pt-[4.5rem]"
    >
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y: imageY }}
      >
        <Image
          src="/products/newcastle-home-95-97.jpg"
          alt="Middle Men featured kit"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(7,18,36,0.92)_0%,rgba(7,18,36,0.72)_42%,rgba(7,18,36,0.28)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,18,36,0.75),transparent_45%)]" />
        <div className="pitch-lines absolute inset-0 opacity-20" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-end px-5 pb-16 md:min-h-[calc(100svh-4.5rem)] md:justify-center md:px-8 md:pb-24"
        style={reduce ? undefined : { y: contentY }}
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="text-xs font-semibold uppercase tracking-[0.28em] text-accent"
        >
          Weekly supplier drops
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: easeOut }}
          className="mt-4 max-w-3xl font-display text-[clamp(4.8rem,14vw,9rem)] leading-[0.82] tracking-[0.02em] text-paper"
        >
          MIDDLE
          <br />
          MEN
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease: easeOut }}
          className="mt-5 max-w-lg font-display text-3xl tracking-wide text-accent md:text-4xl"
        >
          Your Next Kit Starts Here
        </motion.p>

        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.38, ease: easeOut }}
          className="mt-6 h-[3px] w-20 origin-left bg-accent"
        />

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: easeOut }}
          className="mt-6 max-w-md text-base leading-relaxed text-white/75 md:text-lg"
        >
          Browse this week&apos;s supplier kits, customise printing and badges,
          then request on WhatsApp.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55, ease: easeOut }}
          className="mt-9 flex flex-wrap items-center gap-5"
        >
          <MotionLink href="/shop?tab=weekly" variant="accent">
            This week&apos;s kits
          </MotionLink>
          <Link
            href="/request"
            className="group text-sm font-semibold uppercase tracking-[0.14em] text-paper underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent"
          >
            Request a kit
            <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
