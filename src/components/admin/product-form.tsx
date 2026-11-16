"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MotionButton } from "@/components/motion/motion-button";
import { productImageUrl } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { PRICE_HINTS } from "@/lib/pricing";
import {
  DEFAULT_BADGES,
  SIZES,
  type Product,
  type ProductCategory,
  type ProductVariant,
} from "@/lib/types";

type Props = {
  product?: Product;
  variants?: ProductVariant[];
};

type GalleryItem =
  | { kind: "existing"; id: string; path: string }
  | { kind: "pending"; id: string; file: File; preview: string };

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function initialGallery(product?: Product): GalleryItem[] {
  const paths = product?.image_paths?.length
    ? product.image_paths
    : product?.image_path
      ? [product.image_path]
      : [];
  return paths.map((path) => ({
    kind: "existing" as const,
    id: path,
    path,
  }));
}

export function ProductForm({ product, variants = [] }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? "player_version",
  );
  const [selectedBadges, setSelectedBadges] = useState<string[]>(
    product?.badge_options ?? [],
  );
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    initialGallery(product),
  );
  const [stockMap, setStockMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const size of SIZES) {
      map[size] = variants.find((v) => v.size === size)?.stock ?? 10;
    }
    return map;
  });

  const priceHint = useMemo(() => PRICE_HINTS[category], [category]);

  useEffect(() => {
    return () => {
      gallery.forEach((item) => {
        if (item.kind === "pending") URL.revokeObjectURL(item.preview);
      });
    };
    // Only revoke on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleBadge(badge: string) {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge],
    );
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const next: GalleryItem[] = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        kind: "pending" as const,
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      }));
    setGallery((prev) => [...prev, ...next]);
  }

  function removeItem(id: string) {
    setGallery((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.kind === "pending") URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  }

  function makeCover(id: string) {
    setGallery((prev) => {
      const target = prev.find((item) => item.id === id);
      if (!target) return prev;
      return [target, ...prev.filter((item) => item.id !== id)];
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name"));
    const slug = String(form.get("slug") || slugify(name));
    const description = String(form.get("description") || "");
    const club = String(form.get("club"));
    const country = String(form.get("country") || "");
    const kit_type = String(form.get("kit_type"));
    const season = String(form.get("season"));
    const base_price = Number(form.get("base_price"));
    const active = form.get("active") === "on";
    const is_weekly = form.get("is_weekly") === "on";
    const price_on_request = form.get("price_on_request") === "on";
    const printing_enabled = form.get("printing_enabled") === "on";
    const availability_status = String(form.get("availability_status"));

    const supabase = createClient();

    try {
      const image_paths: string[] = [];
      let uploadIndex = 0;

      for (const item of gallery) {
        if (item.kind === "existing") {
          image_paths.push(item.path);
          continue;
        }
        const ext = item.file.name.split(".").pop() || "jpg";
        const path = `${slug}-${Date.now()}-${uploadIndex}.${ext}`;
        uploadIndex += 1;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, item.file, { upsert: true });
        if (uploadError) throw uploadError;
        image_paths.push(path);
      }

      const image_path = image_paths[0] ?? null;

      const payload = {
        name,
        slug,
        description,
        club,
        country: country || null,
        kit_type,
        season,
        category,
        base_price,
        active,
        is_weekly,
        price_on_request,
        printing_enabled,
        availability_status,
        badge_options: selectedBadges,
        image_path,
        image_paths,
      };

      let productId = product?.id;

      if (productId) {
        const { error: updateError } = await supabase
          .from("products")
          .update(payload)
          .eq("id", productId);
        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();
        if (insertError || !data) throw insertError || new Error("Insert failed");
        productId = data.id;
      }

      if (is_weekly) {
        await supabase.from("site_settings").upsert({
          key: "weekly_collection_updated_at",
          value: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      for (const size of SIZES) {
        const stock = stockMap[size] ?? 0;
        const sku = `${slugify(slug)}-${size}`.toUpperCase();
        const existing = variants.find((v) => v.size === size);
        if (existing) {
          const { error: vErr } = await supabase
            .from("product_variants")
            .update({ stock, sku })
            .eq("id", existing.id);
          if (vErr) throw vErr;
        } else {
          const { error: vErr } = await supabase.from("product_variants").insert({
            product_id: productId,
            size,
            sku: `${sku}-${productId?.slice(0, 4)}`,
            stock,
          });
          if (vErr) throw vErr;
        }
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-2xl space-y-4">
      <input
        name="name"
        required
        defaultValue={product?.name}
        placeholder="Name"
        className="input-block bg-white/5 text-white placeholder:text-white/40"
      />
      <input
        name="slug"
        defaultValue={product?.slug}
        placeholder="Slug (optional)"
        className="input-block bg-white/5 text-white placeholder:text-white/40"
      />
      <textarea
        name="description"
        rows={3}
        defaultValue={product?.description ?? ""}
        placeholder="Description"
        className="input-block bg-white/5 text-white placeholder:text-white/40"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="club"
          required
          defaultValue={product?.club}
          placeholder="Club"
          className="input-block bg-white/5 text-white placeholder:text-white/40"
        />
        <input
          name="country"
          defaultValue={product?.country ?? ""}
          placeholder="Country"
          className="input-block bg-white/5 text-white placeholder:text-white/40"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="season"
          required
          defaultValue={product?.season ?? "24/25"}
          placeholder="Season"
          className="input-block bg-white/5 text-white placeholder:text-white/40"
        />
        <select
          name="kit_type"
          defaultValue={product?.kit_type ?? "home"}
          className="input-block bg-white/5 text-white"
        >
          <option value="home">Home</option>
          <option value="away">Away</option>
          <option value="third">Third</option>
          <option value="goalkeeper">Goalkeeper</option>
          <option value="retro">Retro</option>
          <option value="special">Special</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="input-block bg-white/5 text-white"
          >
            <option value="player_version">Latest Season (player)</option>
            <option value="vintage">Vintage / Retro</option>
            <option value="other">Other</option>
          </select>
          <p className="mt-2 text-xs text-white/45">{priceHint.label}</p>
        </div>
        <input
          name="base_price"
          type="number"
          step="1"
          min="0"
          required
          defaultValue={product?.base_price ?? priceHint.min}
          placeholder="Price (ZAR)"
          className="input-block bg-white/5 text-white placeholder:text-white/40"
        />
      </div>
      <select
        name="availability_status"
        defaultValue={product?.availability_status ?? "available"}
        className="input-block bg-white/5 text-white"
      >
        <option value="available">Available</option>
        <option value="check_required">Availability check required</option>
        <option value="unavailable">Unavailable</option>
      </select>

      <div>
        <p className="mb-2 text-sm text-white/70">Badge options for this kit</p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_BADGES.map((badge) => {
            const active = selectedBadges.includes(badge);
            return (
              <button
                key={badge}
                type="button"
                onClick={() => toggleBadge(badge)}
                className={`border px-3 py-1.5 text-xs ${
                  active
                    ? "border-accent text-accent"
                    : "border-white/20 text-white/60"
                }`}
              >
                {badge}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-white/70">Product images</p>
            <p className="mt-1 text-xs text-white/45">
              First image is the cover. Upload multiple angles for the product
              page gallery.
            </p>
          </div>
          <span className="text-xs uppercase tracking-[0.14em] text-white/40">
            {gallery.length} image{gallery.length === 1 ? "" : "s"}
          </span>
        </div>

        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((item, index) => {
              const src =
                item.kind === "existing"
                  ? productImageUrl(item.path)
                  : item.preview;
              return (
                <div
                  key={item.id}
                  className={`group relative aspect-[4/5] overflow-hidden rounded-xl border bg-white/5 ${
                    item.kind === "pending"
                      ? "border-dashed border-accent/40"
                      : "border-white/10"
                  }`}
                >
                  {item.kind === "existing" && src ? (
                    <Image
                      src={src}
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  ) : null}
                  {item.kind === "pending" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                  {index === 0 ? (
                    <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-ink">
                      Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makeCover(item.id)}
                      className="absolute left-2 top-2 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Make cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute right-2 top-2 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white"
                  >
                    Remove
                  </button>
                  {item.kind === "pending" ? (
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/55 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-white/80">
                      New
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-white/45">No images yet.</p>
        )}

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 px-4 py-6 text-center transition-colors hover:border-accent hover:bg-white/5">
          <span className="text-sm font-medium text-white">Add images</span>
          <span className="mt-1 text-xs text-white/45">
            Select one or more JPG/PNG files
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              addFiles(e.target.files);
              e.currentTarget.value = "";
            }}
            className="sr-only"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            name="is_weekly"
            type="checkbox"
            defaultChecked={product?.is_weekly ?? false}
          />
          This Week&apos;s collection
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            name="price_on_request"
            type="checkbox"
            defaultChecked={product?.price_on_request ?? false}
          />
          Price on request
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            name="printing_enabled"
            type="checkbox"
            defaultChecked={product?.printing_enabled ?? true}
          />
          Printing enabled
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            name="active"
            type="checkbox"
            defaultChecked={product?.active ?? true}
          />
          Active in shop
        </label>
      </div>

      <div>
        <p className="mb-2 text-sm text-white/70">
          Size availability (stock not shown on storefront)
        </p>
        <div className="grid grid-cols-5 gap-2">
          {SIZES.map((size) => (
            <label key={size} className="text-center text-xs text-white/60">
              {size}
              <input
                type="number"
                min={0}
                value={stockMap[size]}
                onChange={(e) =>
                  setStockMap((prev) => ({
                    ...prev,
                    [size]: Number(e.target.value) || 0,
                  }))
                }
                className="input-block mt-1 bg-white/5 text-center text-white"
              />
            </label>
          ))}
        </div>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <MotionButton type="submit" variant="accent" disabled={loading}>
        {loading ? "Saving…" : "Save product"}
      </MotionButton>
    </form>
  );
}
