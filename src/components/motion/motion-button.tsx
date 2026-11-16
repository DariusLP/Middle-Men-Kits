"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import type { ReactNode } from "react";
import { easeOut } from "@/components/motion/primitives";

type Shared = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "accent" | "outline";
  disabled?: boolean;
};

const variants = {
  primary: "btn-primary",
  accent: "btn-accent",
  outline: "btn-outline",
} as const;

const hover = { y: -3, scale: 1.015 };
const tap = { y: 0, scale: 0.97 };
const transition = { duration: 0.28, ease: easeOut };

export function MotionButton({
  children,
  className = "",
  variant = "primary",
  disabled,
  type = "button",
  ...rest
}: Shared &
  Omit<HTMLMotionProps<"button">, "children" | "className"> & {
    type?: "button" | "submit" | "reset";
  }) {
  const reduce = useReducedMotion();
  const classes = `${variants[variant]} ${className}`.trim();

  if (reduce) {
    return (
      <button
        type={type}
        className={classes}
        disabled={disabled}
        {...(rest as object)}
      >
        <span className="btn-label">{children}</span>
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled}
      whileHover={disabled ? undefined : hover}
      whileTap={disabled ? undefined : tap}
      transition={transition}
      {...rest}
    >
      <span className="btn-label">{children}</span>
    </motion.button>
  );
}

export function MotionLink({
  children,
  className = "",
  variant = "primary",
  href,
  external,
}: Shared & {
  href: string;
  external?: boolean;
}) {
  const reduce = useReducedMotion();
  const classes = `${variants[variant]} ${className}`.trim();
  const fullWidth = className.includes("w-full");

  if (external) {
    if (reduce) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="btn-label">{children}</span>
        </a>
      );
    }
    return (
      <motion.a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={hover}
        whileTap={tap}
        transition={transition}
      >
        <span className="btn-label">{children}</span>
      </motion.a>
    );
  }

  if (reduce) {
    return (
      <Link href={href} className={classes}>
        <span className="btn-label">{children}</span>
      </Link>
    );
  }

  return (
    <motion.div
      className={fullWidth ? "block w-full" : "inline-flex"}
      whileHover={hover}
      whileTap={tap}
      transition={transition}
    >
      <Link href={href} className={classes}>
        <span className="btn-label">{children}</span>
      </Link>
    </motion.div>
  );
}
