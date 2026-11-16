"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EnquiryActions } from "@/components/enquiry/enquiry-actions";
import { ChoiceChip } from "@/components/motion/choice-chip";
import { FadeIn, easeOut } from "@/components/motion/primitives";
import { ProductCard } from "@/components/shop/product-card";
import { ProductImageZoom } from "@/components/shop/product-image-zoom";
import { buildProductEnquiryMessage } from "@/lib/enquiry";
import {
  availabilityLabel,
  categoryLabel,
  formatPrice,
  kitTypeLabel,
  productImageUrls,
} from "@/lib/format";
import { readShopReturnUrl, rememberShopScrollSlug } from "@/lib/shop-return";
import {
  BADGE_COST,
  PRICE_DISCLAIMER,
  PRINTING_COST,
  calculateEstimate,
} from "@/lib/pricing";
import type { KitCustomisation, ProductWithVariants } from "@/lib/types";

const empty: KitCustomisation = {
  size: "",
  printing: false,
  playerName: "",
  shirtNumber: "",
  badges: [],
  sleeve: "",
  notes: "",
};

export function ProductDetail({
  product,
  related,
}: {
  product: ProductWithVariants;
  related: ProductWithVariants[];
}) {
  const reduce = useReducedMotion();
  const [form, setForm] = useState<KitCustomisation>({
    ...empty,
    size: product.product_variants[0]?.size ?? "M",
  });
  const images = productImageUrls(product);
  const [activeImage, setActiveImage] = useState(0);
  const [shopHref, setShopHref] = useState("/shop?tab=weekly");
  const image = images[Math.min(activeImage, Math.max(images.length - 1, 0))] ?? null;

  useEffect(() => {
    setActiveImage(0);
  }, [product.id]);

  useEffect(() => {
    setShopHref(readShopReturnUrl("/shop?tab=weekly"));
    rememberShopScrollSlug(product.slug);
  }, [product.slug]);
  const badgeOptions = product.badge_options?.length
    ? product.badge_options
    : [];
  const unavailable = product.availability_status === "unavailable";

  const estimate = useMemo(
    () =>
      calculateEstimate({
        kitPrice: Number(product.base_price),
        printing: form.printing,
        badgeCount: form.badges.length,
        priceOnRequest: product.price_on_request,
      }),
    [
      form.badges.length,
      form.printing,
      product.base_price,
      product.price_on_request,
    ],
  );

  const message = useMemo(
    () =>
      buildProductEnquiryMessage({
        product,
        customisation: form,
      }),
    [form, product],
  );

  const specs = [
    ["Club", product.club],
    ["Country", product.country || "—"],
    ["Kit", kitTypeLabel(product.kit_type)],
    ["Season", product.season],
    ["Category", categoryLabel(product.category)],
  ] as const;

  function toggleBadge(badge: string) {
    setForm((prev) => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter((b) => b !== badge)
        : [...prev.badges, badge],
    }));
  }

  const previewName = form.printing
    ? form.playerName.trim() || "NAME"
    : "";
  const previewNumber = form.printing
    ? form.shirtNumber.trim() || "00"
    : "";

  return (
    <div className="bg-transparent">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-28 md:grid-cols-[1.05fr_0.95fr] md:items-start md:gap-16 md:px-8 md:pb-24 md:pt-36">
        <FadeIn y={36} className="md:sticky md:top-28 md:self-start">
          <div className="space-y-3">
            <ProductImageZoom
              src={image}
              alt={product.name}
              badge={
                product.is_weekly ? (
                  <span className="absolute left-4 top-4 z-[2] rounded-md bg-accent px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-ink">
                    Weekly Pick
                  </span>
                ) : null
              }
              overlay={
                <>
                  <AnimatePresence>
                    {form.printing ? (
                      <motion.div
                        key="preview"
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: easeOut }}
                        className="pointer-events-none absolute inset-x-0 top-[26%] z-[3] text-center"
                      >
                        <p className="font-display text-[clamp(1.8rem,5vw,2.8rem)] tracking-[0.22em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
                          {previewName}
                        </p>
                        <p className="mt-1 font-display text-[clamp(3.5rem,10vw,5.5rem)] leading-none tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
                          {previewNumber}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {form.badges.length > 0 ? (
                    <div className="absolute bottom-4 left-4 z-[3] flex flex-wrap gap-1.5">
                      {form.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-md bg-paper/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </>
              }
            />

            {images.length > 1 ? (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {images.map((src, index) => {
                  const active = index === activeImage;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                      className={`relative aspect-square overflow-hidden rounded-xl border transition-colors ${
                        active
                          ? "border-accent"
                          : "border-line hover:border-ink"
                      }`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </FadeIn>

        <FadeIn delay={0.16} y={36} className="flex flex-col">
          <Link
            href={shopHref}
            className="mb-8 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted transition-colors hover:text-accent"
          >
            ← Back to shop
          </Link>
          <p className="text-xs uppercase tracking-[0.22em] text-accent">
            {product.club}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none tracking-wide md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-4 font-display text-3xl tracking-wide text-ink">
            {product.price_on_request
              ? "Price on request"
              : formatPrice(Number(product.base_price))}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            {availabilityLabel(product.availability_status)}
          </p>
          {product.description ? (
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted md:text-lg">
              {product.description}
            </p>
          ) : null}

          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-line py-5 sm:grid-cols-3">
            {specs.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">
                Size
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.product_variants.map((variant) => (
                  <ChoiceChip
                    key={variant.id}
                    active={form.size === variant.size}
                    onClick={() =>
                      setForm((p) => ({ ...p, size: variant.size }))
                    }
                  >
                    {variant.size}
                  </ChoiceChip>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">
                Sleeve
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    ["short", "Short sleeve"],
                    ["long", "Long sleeve"],
                  ] as const
                ).map(([value, label]) => (
                  <ChoiceChip
                    key={value}
                    tone="ink"
                    active={form.sleeve === value}
                    onClick={() => setForm((p) => ({ ...p, sleeve: value }))}
                  >
                    {label}
                  </ChoiceChip>
                ))}
              </div>
            </div>

            {product.printing_enabled ? (
              <div className="space-y-3 rounded-2xl border border-line bg-surface/30 p-4">
                <label className="flex cursor-pointer items-center justify-between gap-4 text-sm">
                  <span>
                    Name & number printing
                    <span className="ml-2 text-ink-muted">
                      +{formatPrice(PRINTING_COST)}
                    </span>
                  </span>
                  <span
                    className={`relative h-7 w-12 rounded-full transition-colors ${
                      form.printing ? "bg-accent" : "bg-line"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                        form.printing ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                    <input
                      type="checkbox"
                      checked={form.printing}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, printing: e.target.checked }))
                      }
                      className="sr-only"
                    />
                  </span>
                </label>
                <AnimatePresence initial={false}>
                  {form.printing ? (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={reduce ? undefined : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: easeOut }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-3 pt-1 sm:grid-cols-2">
                        <input
                          value={form.playerName}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              playerName: e.target.value,
                            }))
                          }
                          placeholder="Name on shirt"
                          className="input-block rounded-xl"
                        />
                        <input
                          value={form.shirtNumber}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              shirtNumber: e.target.value,
                            }))
                          }
                          placeholder="Number"
                          className="input-block rounded-xl"
                        />
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}

            {badgeOptions.length > 0 ? (
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">
                  Badges{" "}
                  <span className="normal-case tracking-normal">
                    ({formatPrice(BADGE_COST)} each)
                  </span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {badgeOptions.map((badge) => (
                    <ChoiceChip
                      key={badge}
                      active={form.badges.includes(badge)}
                      onClick={() => toggleBadge(badge)}
                    >
                      {badge}
                    </ChoiceChip>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">
                Notes
              </p>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Anything else we should know?"
                className="input-block mt-3 rounded-xl"
              />
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-paper to-surface p-5">
              <div className="absolute left-0 top-0 h-full w-1 bg-accent" />
              <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">
                Estimated total
              </p>
              {product.price_on_request ? (
                <p className="mt-2 font-display text-4xl tracking-wide">
                  Price on request
                </p>
              ) : (
                <>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={estimate.estimatedTotal}
                      initial={
                        reduce ? false : { opacity: 0, y: 10, scale: 0.96 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={
                        reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }
                      }
                      transition={{ duration: 0.28, ease: easeOut }}
                      className="mt-2 font-display text-4xl tracking-wide"
                    >
                      {formatPrice(estimate.estimatedTotal)}
                    </motion.p>
                  </AnimatePresence>
                  <ul className="mt-3 space-y-1 text-sm text-ink-muted">
                    <li>Kit {formatPrice(estimate.kitPrice)}</li>
                    {estimate.printingCost ? (
                      <li>Printing {formatPrice(estimate.printingCost)}</li>
                    ) : null}
                    {estimate.badgeCost ? (
                      <li>
                        Badges ({form.badges.length}){" "}
                        {formatPrice(estimate.badgeCost)}
                      </li>
                    ) : null}
                  </ul>
                </>
              )}
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                {PRICE_DISCLAIMER}
              </p>
            </div>

            <EnquiryActions
              message={message}
              disabled={unavailable || !form.size}
              sticky
            />
          </div>
        </FadeIn>
      </div>

      {related.length > 0 ? (
        <section className="border-t border-line bg-paper/55 px-5 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-4xl tracking-wide md:text-5xl">
              Related kits
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
              {related.map((item) => (
                <ProductCard key={`${item.id}-${item.slug}`} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
