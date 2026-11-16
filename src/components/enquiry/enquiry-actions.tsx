"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  MotionButton,
  MotionLink,
} from "@/components/motion/motion-button";
import { easeOut } from "@/components/motion/primitives";
import { getInstagramUrl, whatsappLink } from "@/lib/enquiry";

type Props = {
  message: string;
  disabled?: boolean;
  primaryLabel?: string;
  className?: string;
  sticky?: boolean;
};

export function EnquiryActions({
  message,
  disabled,
  primaryLabel = "Request on WhatsApp",
  className = "",
  sticky = false,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();
  const href = whatsappLink(message);
  const instagram = getInstagramUrl();

  useEffect(() => {
    if (!sticky || reduce) return;
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 6) return;
      setVisible(delta < 0 || y < 80);
      lastY = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky, reduce]);

  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const actions = (
    <div className={`flex flex-col gap-3 ${className}`}>
      {disabled ? (
        <span className="btn-accent pointer-events-none text-center opacity-50">
          <span className="btn-label">{primaryLabel}</span>
        </span>
      ) : (
        <MotionLink
          href={href}
          variant="accent"
          external
          className="text-center"
        >
          {primaryLabel}
        </MotionLink>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <MotionButton
          type="button"
          variant="outline"
          onClick={copyDetails}
          disabled={disabled}
          className="w-full"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "copied" : "copy"}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: easeOut }}
              className="inline-flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M3 7.5 5.8 10.2 11 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Copied
                </>
              ) : (
                "Copy enquiry details"
              )}
            </motion.span>
          </AnimatePresence>
        </MotionButton>
        <MotionLink
          href={instagram}
          variant="outline"
          external
          className="w-full text-center"
        >
          Open Instagram
        </MotionLink>
      </div>
      <p className="text-xs leading-relaxed text-ink-muted">
        Prefer Instagram? Copy your enquiry details, then paste them into a DM.
        Enquiries do not reserve stock.
      </p>
    </div>
  );

  if (!sticky) return actions;

  return (
    <>
      <div className="hidden md:block">{actions}</div>
      <motion.div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-4 backdrop-blur-md md:hidden"
        initial={false}
        animate={
          reduce
            ? undefined
            : {
                y: visible ? 0 : 110,
                opacity: visible ? 1 : 0.4,
              }
        }
        transition={{ duration: 0.28, ease: easeOut }}
      >
        {disabled ? (
          <span className="btn-accent pointer-events-none block w-full text-center opacity-50">
            <span className="btn-label">{primaryLabel}</span>
          </span>
        ) : (
          <MotionLink
            href={href}
            variant="accent"
            external
            className="w-full text-center"
          >
            {primaryLabel}
          </MotionLink>
        )}
      </motion.div>
      <div className="h-20 md:hidden" />
    </>
  );
}
