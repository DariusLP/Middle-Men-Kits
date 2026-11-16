export function formatPrice(amount: number, currency = "ZAR") {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function kitTypeLabel(kit: string) {
  if (kit === "goalkeeper") return "Goalkeeper";
  if (kit === "special") return "Special Edition";
  return kit.charAt(0).toUpperCase() + kit.slice(1);
}

export function categoryLabel(category: string) {
  if (category === "player_version") return "Latest Season";
  if (category === "vintage") return "Vintage / Retro";
  return "Other";
}

export function availabilityLabel(status: string) {
  if (status === "available") return "Supplier listed this week";
  if (status === "check_required") return "Availability check required";
  if (status === "unavailable") return "Currently unavailable";
  return status;
}

export function productImageUrl(imagePath: string | null | undefined) {
  if (!imagePath) return null;
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("/")
  ) {
    return imagePath;
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return `/${imagePath}`;
  return `${base}/storage/v1/object/public/product-images/${imagePath}`;
}

export function productImagePaths(product: {
  image_path?: string | null;
  image_paths?: string[] | null;
}) {
  const fromArray = Array.isArray(product.image_paths)
    ? product.image_paths.filter(Boolean)
    : [];
  if (fromArray.length > 0) return [...new Set(fromArray)];
  return product.image_path ? [product.image_path] : [];
}

export function productImageUrls(product: {
  image_path?: string | null;
  image_paths?: string[] | null;
}) {
  return productImagePaths(product)
    .map((path) => productImageUrl(path))
    .filter((url): url is string => Boolean(url));
}

export function variantPrice(
  product: { base_price: number },
  variant: { price_override: number | null },
) {
  return Number(variant.price_override ?? product.base_price);
}

export function formatWeekUpdated(iso: string | null | undefined) {
  if (!iso) return "Recently updated";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
