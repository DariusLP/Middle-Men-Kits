"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EmptyState } from "@/components/motion/empty-state";
import { easeOut } from "@/components/motion/primitives";
import { PageHeroHeading } from "@/components/motion/section-heading";
import { ProductCard } from "@/components/shop/product-card";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import {
  clearShopScrollSlug,
  readShopScrollSlug,
  rememberShopReturnUrl,
  shopKitElementId,
  shopUrlFromFilters,
} from "@/lib/shop-return";
import type { ProductWithVariants } from "@/lib/types";

const tabs = [
  { id: "weekly", label: "This Week’s Kits" },
  { id: "all", label: "All Kits" },
  { id: "player", label: "Latest Season" },
  { id: "vintage", label: "Vintage / Retro" },
] as const;

type FilterState = {
  tab: string;
  club: string;
  country: string;
  season: string;
  kit: string;
  price: string;
};

type Props = {
  products: ProductWithVariants[];
  clubs: string[];
  countries: string[];
  seasons: string[];
  initial: FilterState;
};

function matchesPrice(price: number, band: string) {
  if (!band) return true;
  if (band === "0-550") return price <= 550;
  if (band === "550-650") return price >= 550 && price <= 650;
  if (band === "650-750") return price >= 650 && price <= 750;
  if (band === "750+") return price >= 750;
  return true;
}

function syncUrl(state: FilterState) {
  const next = shopUrlFromFilters(state);
  window.history.replaceState(null, "", next);
  rememberShopReturnUrl(next);
}

export function ShopCatalogue({
  products,
  clubs,
  countries,
  seasons,
  initial,
}: Props) {
  const reduce = useReducedMotion();
  const [filters, setFilters] = useState<FilterState>(initial);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const skipUrlSync = useRef(true);
  const filterKey = [
    filters.tab,
    filters.club,
    filters.country,
    filters.season,
    filters.kit,
    filters.price,
  ].join("-");

  useEffect(() => {
    // Always remember current shop view for "Back to shop" from PDPs.
    rememberShopReturnUrl(shopUrlFromFilters(filters));
    if (skipUrlSync.current) {
      skipUrlSync.current = false;
      return;
    }
    syncUrl(filters);
  }, [filters]);

  const update = useCallback((patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const activeFilterCount = [
    filters.club,
    filters.country,
    filters.season,
    filters.kit,
    filters.price,
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.tab === "weekly" && !p.is_weekly) return false;
      if (filters.tab === "player" && p.category !== "player_version") return false;
      if (filters.tab === "vintage" && p.category !== "vintage") return false;
      if (filters.club && p.club !== filters.club) return false;
      if (filters.country && p.country !== filters.country) return false;
      if (filters.season && p.season !== filters.season) return false;
      if (filters.kit && p.kit_type !== filters.kit) return false;
      if (!matchesPrice(Number(p.base_price), filters.price)) return false;
      return true;
    });
  }, [filters, products]);

  useEffect(() => {
    const slug = readShopScrollSlug();
    if (!slug) return;

    if (!filtered.some((product) => product.slug === slug)) {
      clearShopScrollSlug();
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const tryScroll = () => {
      if (cancelled) return;
      const target = document.getElementById(shopKitElementId(slug));
      if (target) {
        target.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "center",
        });
        clearShopScrollSlug();
        return;
      }
      attempts += 1;
      if (attempts < 12) {
        window.setTimeout(tryScroll, 50);
      } else {
        clearShopScrollSlug();
      }
    };

    const timeout = window.setTimeout(tryScroll, 40);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [filtered, reduce]);

  function clearFilters() {
    update({
      club: "",
      country: "",
      season: "",
      kit: "",
      price: "",
    });
  }

  return (
    <>
      <div className="relative overflow-hidden bg-pitch-deep px-5 pb-14 pt-28 text-paper md:px-8 md:pb-16 md:pt-32">
        <div className="pitch-lines pointer-events-none absolute inset-0 opacity-15" />
        <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-accent" />
        <div className="relative mx-auto max-w-6xl">
          <PageHeroHeading
            eyebrow="Catalogue"
            title={
              <>
                Find Your
                <br />
                Next Kit
              </>
            }
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-8">
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2 rounded-2xl border border-line bg-surface/50 p-2">
            {tabs.map((item) => {
              const active = filters.tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update({ tab: item.id })}
                  className={`rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                    active
                      ? "bg-ink text-paper shadow-md shadow-ink/15"
                      : "text-ink-muted hover:bg-white/70 hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <Link
              href="/request"
              className="rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted transition-all duration-300 hover:bg-white/70 hover:text-ink"
            >
              Request a Kit
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-paper">
            <div className="flex items-center gap-3 p-3">
              <button
                type="button"
                onClick={() => setFiltersOpen((open) => !open)}
                aria-expanded={filtersOpen}
                className="flex flex-1 items-center justify-between gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-surface/70"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                    Filters
                  </span>
                  {activeFilterCount > 0 ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-ink">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </span>
                <motion.span
                  animate={{ rotate: filtersOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: easeOut }}
                  className="text-accent"
                  aria-hidden
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 5l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
              </button>
              {activeFilterCount > 0 ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="shrink-0 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted hover:text-accent"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <AnimatePresence initial={false}>
              {filtersOpen ? (
                <motion.div
                  key="filters"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: easeOut }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-3 border-t border-line p-4 sm:grid-cols-2 lg:grid-cols-5">
                    <SelectDropdown
                      label="Club"
                      value={filters.club}
                      onChange={(club) => update({ club })}
                      placeholder="All clubs"
                      options={[
                        { value: "", label: "All clubs" },
                        ...clubs.map((club) => ({ value: club, label: club })),
                      ]}
                    />
                    <SelectDropdown
                      label="Country"
                      value={filters.country}
                      onChange={(country) => update({ country })}
                      placeholder="All countries"
                      options={[
                        { value: "", label: "All countries" },
                        ...countries.map((country) => ({
                          value: country,
                          label: country,
                        })),
                      ]}
                    />
                    <SelectDropdown
                      label="Season"
                      value={filters.season}
                      onChange={(season) => update({ season })}
                      placeholder="All seasons"
                      options={[
                        { value: "", label: "All seasons" },
                        ...seasons.map((season) => ({
                          value: season,
                          label: season,
                        })),
                      ]}
                    />
                    <SelectDropdown
                      label="Kit type"
                      value={filters.kit}
                      onChange={(kit) => update({ kit })}
                      placeholder="All kit types"
                      options={[
                        { value: "", label: "All kit types" },
                        { value: "home", label: "Home" },
                        { value: "away", label: "Away" },
                        { value: "third", label: "Third" },
                        { value: "goalkeeper", label: "Goalkeeper" },
                        { value: "retro", label: "Retro" },
                        { value: "special", label: "Special" },
                      ]}
                    />
                    <SelectDropdown
                      label="Price"
                      value={filters.price}
                      onChange={(price) => update({ price })}
                      placeholder="Any price"
                      options={[
                        { value: "", label: "Any price" },
                        { value: "0-550", label: "Under R550" },
                        { value: "550-650", label: "R550–R650" },
                        { value: "650-750", label: "R650–R750" },
                        { value: "750+", label: "R750+" },
                      ]}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
            >
              <EmptyState
                title="No kits match"
                body="Try another tab or filter — or send us a custom sourcing request."
                actionHref="/request"
                actionLabel="Request a kit"
              />
            </motion.div>
          ) : (
            <motion.div
              key={filterKey}
              className="mt-12 grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 lg:grid-cols-4 md:gap-x-7"
              initial="hidden"
              animate="show"
              exit={reduce ? undefined : { opacity: 0, y: 8 }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: reduce ? 0 : 0.06,
                    delayChildren: reduce ? 0 : 0.04,
                  },
                },
              }}
            >
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: reduce
                      ? { opacity: 1 }
                      : { opacity: 0, y: 22 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: easeOut },
                    },
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
