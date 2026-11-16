"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ProductCard } from "@/components/shop/product-card";
import { easeOut } from "@/components/motion/primitives";
import { formatPrice, formatWeekUpdated, productImageUrl } from "@/lib/format";
import type { ProductWithVariants } from "@/lib/types";

export function WeeklyStrip({
  products,
  updatedAt,
}: {
  products: ProductWithVariants[];
  updatedAt: string;
}) {
  const reduce = useReducedMotion();
  const featured = products[0];
  const rest = products.slice(1, 4);
  const featuredImage = featured ? productImageUrl(featured.image_path) : null;

  return (
    <section className="relative overflow-hidden">
      {featured ? (
        <div className="relative min-h-[70vh] bg-pitch-deep text-paper md:min-h-[75vh]">
          {featuredImage ? (
            <Image
              src={featuredImage}
              alt={featured.name}
              fill
              sizes="100vw"
              className="object-cover object-center opacity-55"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,18,36,0.95)_0%,rgba(7,18,36,0.7)_50%,rgba(7,18,36,0.35)_100%)]" />
          <div className="pitch-lines absolute inset-0 opacity-15" />

          <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-5 py-16 md:min-h-[75vh] md:px-8 md:py-20">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                This week · {formatWeekUpdated(updatedAt)}
              </p>
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-white/60">
                {featured.club} · {featured.season}
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-5xl leading-[0.9] tracking-wide md:text-7xl">
                {featured.name}
              </h2>
              <p className="mt-4 font-display text-3xl tracking-wide text-accent">
                {featured.price_on_request
                  ? "Price on request"
                  : formatPrice(Number(featured.base_price))}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={`/shop/${featured.slug}`} className="btn-accent">
                  <span className="btn-label">View kit</span>
                </Link>
                <Link
                  href="/shop?tab=weekly"
                  className="border border-white/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:border-accent hover:text-accent"
                >
                  All weekly picks
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}

      {rest.length > 0 ? (
        <div className="bg-paper/50 px-5 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h3 className="font-display text-3xl tracking-wide text-ink md:text-4xl">
                More this week
              </h3>
              <Link
                href="/shop?tab=weekly"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-accent"
              >
                Shop weekly →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
              {rest.map((product, i) => (
                <motion.div
                  key={product.id}
                  className="min-w-[72%] sm:min-w-[48%] md:min-w-0"
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.08,
                    ease: easeOut,
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
