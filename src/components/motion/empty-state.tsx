"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOut } from "@/components/motion/primitives";

export function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body: ReactNode;
  actionHref?: string;
  actionLabel?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="mx-auto mt-16 max-w-md rounded-3xl border border-dashed border-line bg-surface/40 px-6 py-12 text-center"
      initial={reduce ? false : { opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: easeOut }}
    >
      <motion.div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-accent"
        animate={reduce ? undefined : { y: [0, -4, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 7h16v12H4V7Zm3-3h10l1 3H6l1-3Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      <h3 className="mt-5 font-display text-3xl tracking-wide text-ink">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="btn-accent mt-6 inline-flex"
        >
          <span className="btn-label">{actionLabel}</span>
        </Link>
      ) : null}
    </motion.div>
  );
}
