"use client";

import Image from "next/image";
import {
  useCallback,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/components/motion/primitives";

type Props = {
  src: string | null;
  alt: string;
  badge?: ReactNode;
  overlay?: ReactNode;
};

export function ProductImageZoom({ src, alt, badge, overlay }: Props) {
  const reduce = useReducedMotion();
  const [origin, setOrigin] = useState("50% 50%");
  const [zooming, setZooming] = useState(false);

  const onMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (reduce) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      setOrigin(`${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%`);
    },
    [reduce],
  );

  return (
    <div
      className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-pitch-deep ${
        reduce ? "" : "cursor-zoom-in"
      }`}
      onMouseEnter={() => {
        if (!reduce) setZooming(true);
      }}
      onMouseLeave={() => {
        setZooming(false);
        setOrigin("50% 50%");
      }}
      onMouseMove={onMove}
    >
      <div className="pitch-lines absolute inset-0 z-[1] opacity-20 mix-blend-overlay" />
      <AnimatePresence mode="wait" initial={false}>
        {src ? (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 ease-out will-change-transform"
              style={{
                transformOrigin: origin,
                transform: zooming && !reduce ? "scale(1.85)" : "scale(1)",
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="absolute left-0 top-0 z-[2] h-full w-1.5 bg-accent" />
      {badge}
      {overlay}
    </div>
  );
}
