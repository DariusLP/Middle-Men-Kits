"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EnquiryActions } from "@/components/enquiry/enquiry-actions";
import { ChoiceChip } from "@/components/motion/choice-chip";
import { easeOut } from "@/components/motion/primitives";
import { buildProductEnquiryMessage } from "@/lib/enquiry";
import { availabilityLabel, formatPrice } from "@/lib/format";
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

export function KitCustomiser({ product }: { product: ProductWithVariants }) {
  const reduce = useReducedMotion();
  const [form, setForm] = useState<KitCustomisation>({
    ...empty,
    size: product.product_variants[0]?.size ?? "M",
  });

  const estimate = useMemo(
    () =>
      calculateEstimate({
        kitPrice: Number(product.base_price),
        printing: form.printing,
        badgeCount: form.badges.length,
        priceOnRequest: product.price_on_request,
      }),
    [form.badges.length, form.printing, product.base_price, product.price_on_request],
  );

  const message = useMemo(
    () =>
      buildProductEnquiryMessage({
        product,
        customisation: form,
      }),
    [form, product],
  );

  const unavailable = product.availability_status === "unavailable";
  const badgeOptions = product.badge_options?.length
    ? product.badge_options
    : [];

  function toggleBadge(badge: string) {
    setForm((prev) => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter((b) => b !== badge)
        : [...prev.badges, badge],
    }));
  }

  return (
    <div className="space-y-8">
      {product.is_weekly ? (
        <p className="inline-block rounded-md bg-accent px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-ink">
          Weekly Pick
        </p>
      ) : null}

      <p className="text-sm text-ink-muted">
        {availabilityLabel(product.availability_status)}
      </p>

      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">
          Size
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.product_variants.map((variant) => (
            <ChoiceChip
              key={variant.id}
              active={form.size === variant.size}
              onClick={() => setForm((p) => ({ ...p, size: variant.size }))}
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
                      setForm((p) => ({ ...p, playerName: e.target.value }))
                    }
                    placeholder="Name on shirt"
                    className="input-block rounded-xl"
                  />
                  <input
                    value={form.shirtNumber}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, shirtNumber: e.target.value }))
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
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
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
                initial={reduce ? false : { opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
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
                  Badges ({form.badges.length}) {formatPrice(estimate.badgeCost)}
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
  );
}
