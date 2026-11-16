import { ClubMarquee } from "@/components/home/club-marquee";
import { CustomiseBand } from "@/components/home/customise-band";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { WeeklyStrip } from "@/components/home/weekly-strip";
import { MotionLink } from "@/components/motion/motion-button";
import { Band, CategoryPanel, FeaturePanel } from "@/components/motion/panels";
import { Reveal } from "@/components/motion/primitives";
import { SectionHeading } from "@/components/motion/section-heading";
import { getInstagramUrl, getWhatsAppNumber } from "@/lib/enquiry";
import {
  getWeeklyCollectionUpdatedAt,
  getWeeklyProducts,
} from "@/lib/products";

const whyPoints = [
  {
    title: "Fresh weekly stock",
    body: "Supplier availability changes every week — we surface the best of what's in now.",
  },
  {
    title: "Live customisation pricing",
    body: "Add printing and badges and see your estimated total before you enquire.",
  },
  {
    title: "Confirmed before you pay",
    body: "WhatsApp enquiries never reserve stock. Final price and delivery are confirmed first.",
  },
];

const categories = [
  {
    href: "/shop?tab=player",
    title: "Latest Season",
    body: "Player-version kits from current drops.",
  },
  {
    href: "/shop?tab=vintage",
    title: "Vintage / Retro",
    body: "Classic seasons and collector favourites.",
  },
  {
    href: "/shop?tab=all",
    title: "All Kits",
    body: "Everything currently listed for enquiry.",
  },
];

export default async function HomePage() {
  const [weekly, updatedAt] = await Promise.all([
    getWeeklyProducts(4),
    getWeeklyCollectionUpdatedAt(),
  ]);
  const whatsapp = `https://wa.me/${getWhatsAppNumber()}`;
  const instagram = getInstagramUrl();

  return (
    <>
      <Hero />
      <ClubMarquee />
      <WeeklyStrip products={weekly} updatedAt={updatedAt} />

      <section className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="mb-8 md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Why weekly
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl tracking-wide text-ink md:text-5xl">
            Built for supplier drops, not endless catalogues.
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {whyPoints.map((point, i) => (
            <FeaturePanel
              key={point.title}
              index={i}
              title={point.title}
              body={point.body}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface/30 px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <SectionHeading eyebrow="Categories" title="Shop by Category" />
            <p className="max-w-md text-sm leading-relaxed text-ink-muted md:text-base">
              Jump straight into the drop you want — latest season player kits,
              vintage favourites, or the full list.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:gap-4 md:mt-10 md:grid-cols-3 md:gap-5">
            {categories.map((cat, i) => (
              <CategoryPanel
                key={cat.href}
                href={cat.href}
                title={cat.title}
                body={cat.body}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <CustomiseBand />

      <Band tone="accent" className="px-5 py-12 md:px-8 md:py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">
              Can&apos;t find it?
            </p>
            <h2 className="mt-2 font-display text-4xl tracking-wide md:text-5xl">
              We&apos;ll source it
            </h2>
          </div>
          <MotionLink href="/request" variant="primary">
            Request a kit
          </MotionLink>
        </div>
      </Band>

      <HowItWorks />

      <section className="relative overflow-hidden bg-pitch-deep px-5 py-14 text-paper md:px-8 md:py-16">
        <div className="pitch-lines absolute inset-0 opacity-10" />
        <Reveal>
          <div className="relative mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-accent">
                Contact
              </p>
              <h2 className="mt-2 font-display text-4xl tracking-wide md:text-5xl">
                Talk to Middle Men
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <MotionLink href={whatsapp} variant="accent" external>
                WhatsApp
              </MotionLink>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-white/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:border-accent hover:text-accent"
              >
                Instagram
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
