"use client";

import { motion, useReducedMotion } from "framer-motion";

const CLUBS = [
  "Arsenal",
  "Liverpool",
  "Chelsea",
  "Manchester United",
  "Newcastle United",
  "Bayern Munich",
  "AC Milan",
  "Ajax",
  "FC Porto",
  "England",
  "France",
  "Brazil",
  "Germany",
  "South Africa",
];

export function ClubMarquee() {
  const reduce = useReducedMotion();
  const row = [...CLUBS, ...CLUBS];

  return (
    <div className="overflow-hidden border-y border-line bg-ink py-4 text-paper">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap px-4 font-display text-2xl tracking-[0.12em] md:text-3xl"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduce
            ? undefined
            : { duration: 36, ease: "linear", repeat: Infinity }
        }
      >
        {row.map((club, i) => (
          <span key={`${club}-${i}`} className="flex items-center gap-10">
            {club}
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
