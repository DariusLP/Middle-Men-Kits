import {
  DEMO_PRODUCTS,
  WEEKLY_COLLECTION_UPDATED_AT,
} from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/server";
import type {
  AvailabilityStatus,
  ProductCategory,
  ProductVariant,
  ProductWithVariants,
} from "@/lib/types";
import { SIZES } from "@/lib/types";

const SIZE_ORDER = new Map(SIZES.map((size, index) => [size, index]));

function sortVariants(variants: ProductVariant[]) {
  return [...variants].sort(
    (a, b) =>
      (SIZE_ORDER.get(a.size as (typeof SIZES)[number]) ?? 99) -
      (SIZE_ORDER.get(b.size as (typeof SIZES)[number]) ?? 99),
  );
}

export type ProductFilters = {
  club?: string;
  country?: string;
  kitType?: string;
  season?: string;
  category?: ProductCategory | string;
  size?: string;
  weekly?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

function normalizeProduct(raw: ProductWithVariants): ProductWithVariants {
  const badge_options = Array.isArray(raw.badge_options)
    ? raw.badge_options
    : typeof raw.badge_options === "string"
      ? (() => {
          try {
            return JSON.parse(raw.badge_options as unknown as string);
          } catch {
            return [];
          }
        })()
      : [];

  const image_paths = Array.isArray(raw.image_paths)
    ? raw.image_paths.filter(Boolean)
    : raw.image_path
      ? [raw.image_path]
      : [];

  return {
    ...raw,
    country: raw.country ?? null,
    category: (raw.category as ProductCategory) || "other",
    base_price: Number(raw.base_price),
    price_on_request: Boolean(raw.price_on_request),
    image_path: image_paths[0] ?? raw.image_path ?? null,
    image_paths,
    is_weekly: Boolean(raw.is_weekly),
    availability_status:
      (raw.availability_status as AvailabilityStatus) || "available",
    badge_options,
    printing_enabled: raw.printing_enabled !== false,
    product_variants: sortVariants(raw.product_variants ?? []),
  };
}

/**
 * Storefront catalog prefers the curated local kit photos in /public/products.
 * Re-run supabase/seed.sql to keep the database in sync for admin.
 */
export async function getProducts(
  filters?: ProductFilters,
): Promise<ProductWithVariants[]> {
  const local = filterProducts(DEMO_PRODUCTS.map(normalizeProduct), filters);

  if (!isSupabaseConfigured()) {
    return local;
  }

  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("products")
      .select("*, product_variants(*)")
      .eq("active", true);

    if (!data?.length) return local;

    const remoteById = new Map(
      (data as ProductWithVariants[]).map((p) => [
        p.id,
        normalizeProduct(p),
      ]),
    );

    return filterProducts(
      DEMO_PRODUCTS.map((demo) => {
        const remote = remoteById.get(demo.id);
        if (!remote) return normalizeProduct(demo);
        return normalizeProduct({
          ...demo,
          ...remote,
          image_path: demo.image_path || remote.image_path,
          image_paths:
            demo.image_paths?.length > 0
              ? demo.image_paths
              : remote.image_paths?.length > 0
                ? remote.image_paths
                : demo.image_path
                  ? [demo.image_path]
                  : remote.image_path
                    ? [remote.image_path]
                    : [],
          product_variants:
            remote.product_variants?.length > 0
              ? remote.product_variants
              : demo.product_variants,
        });
      }),
      filters,
    );
  } catch {
    return local;
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithVariants | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getWeeklyProducts(limit?: number) {
  const products = await getProducts({ weekly: true });
  return typeof limit === "number" ? products.slice(0, limit) : products;
}

export async function getFeaturedProducts(limit = 4) {
  const weekly = await getWeeklyProducts(limit);
  if (weekly.length >= limit) return weekly;
  const all = await getProducts();
  const ids = new Set(weekly.map((p) => p.id));
  return [...weekly, ...all.filter((p) => !ids.has(p.id))].slice(0, limit);
}

export async function getRelatedProducts(slug: string, limit = 4) {
  const product = await getProductBySlug(slug);
  if (!product) return [];
  const all = await getProducts();

  const currentImage = product.image_path || "";
  const identityKey = (p: {
    id: string;
    slug: string;
    club: string;
    name: string;
    season: string;
    kit_type: string;
    image_path: string | null;
  }) =>
    [
      p.id,
      p.slug,
      `${p.club}|${p.name}|${p.season}|${p.kit_type}`.toLowerCase(),
      p.image_path || "",
    ] as const;

  const blocked = new Set<string>();
  for (const value of identityKey(product)) {
    if (value) blocked.add(value);
  }
  blocked.add(slug);

  const candidates = all
    .filter((p) => {
      if (blocked.has(p.id) || blocked.has(p.slug)) return false;
      if (p.image_path && blocked.has(p.image_path)) return false;
      const nameKey =
        `${p.club}|${p.name}|${p.season}|${p.kit_type}`.toLowerCase();
      if (blocked.has(nameKey)) return false;
      return p.club === product.club || p.category === product.category;
    })
    .sort((a, b) => {
      const aClub = a.club === product.club ? 0 : 1;
      const bClub = b.club === product.club ? 0 : 1;
      if (aClub !== bClub) return aClub - bClub;
      return a.name.localeCompare(b.name);
    });

  const related: ProductWithVariants[] = [];
  const used = new Set<string>(blocked);

  for (const candidate of candidates) {
    const [id, candidateSlug, nameKey, image] = identityKey(candidate);
    if (used.has(id) || used.has(candidateSlug) || used.has(nameKey)) continue;
    if (image && used.has(image)) continue;
    // Never show a kit that looks identical to the current one
    if (currentImage && image && image === currentImage) continue;

    used.add(id);
    used.add(candidateSlug);
    used.add(nameKey);
    if (image) used.add(image);
    related.push(candidate);
    if (related.length >= limit) break;
  }

  return related;
}

export async function getClubs() {
  const products = await getProducts();
  return [...new Set(products.map((p) => p.club))].sort();
}

export async function getCountries() {
  const products = await getProducts();
  return [
    ...new Set(
      products.map((p) => p.country).filter((c): c is string => Boolean(c)),
    ),
  ].sort();
}

export async function getSeasons() {
  const products = await getProducts();
  return [...new Set(products.map((p) => p.season))].sort().reverse();
}

export async function getWeeklyCollectionUpdatedAt() {
  if (!isSupabaseConfigured()) {
    return WEEKLY_COLLECTION_UPDATED_AT;
  }

  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "weekly_collection_updated_at")
      .maybeSingle();

    if (data?.value) return String(data.value);
  } catch {
    /* fall through */
  }

  return WEEKLY_COLLECTION_UPDATED_AT;
}

function filterProducts(
  products: ProductWithVariants[],
  filters?: ProductFilters,
) {
  return products.filter((p) => {
    if (!p.active) return false;
    if (filters?.club && p.club !== filters.club) return false;
    if (filters?.country && p.country !== filters.country) return false;
    if (filters?.kitType && p.kit_type !== filters.kitType) return false;
    if (filters?.season && p.season !== filters.season) return false;
    if (filters?.category && p.category !== filters.category) return false;
    if (filters?.weekly && !p.is_weekly) return false;
    if (
      typeof filters?.minPrice === "number" &&
      Number(p.base_price) < filters.minPrice
    ) {
      return false;
    }
    if (
      typeof filters?.maxPrice === "number" &&
      Number(p.base_price) > filters.maxPrice
    ) {
      return false;
    }
    if (
      filters?.size &&
      !p.product_variants.some((v) => v.size === filters.size)
    ) {
      return false;
    }
    return true;
  });
}
