const RETURN_URL_KEY = "middlemen:shopReturnUrl";
const SCROLL_SLUG_KEY = "middlemen:shopScrollSlug";

export function shopKitElementId(slug: string) {
  return `kit-${slug}`;
}

export function shopUrlFromFilters(state: {
  tab: string;
  club: string;
  country: string;
  season: string;
  kit: string;
  price: string;
}) {
  const params = new URLSearchParams();
  params.set("tab", state.tab || "weekly");
  if (state.club) params.set("club", state.club);
  if (state.country) params.set("country", state.country);
  if (state.season) params.set("season", state.season);
  if (state.kit) params.set("kit", state.kit);
  if (state.price) params.set("price", state.price);
  return `/shop?${params.toString()}`;
}

export function rememberShopReturnUrl(url: string) {
  if (typeof window === "undefined") return;
  if (!url.startsWith("/shop")) return;
  try {
    sessionStorage.setItem(RETURN_URL_KEY, url);
  } catch {
    // ignore quota / private mode
  }
}

export function readShopReturnUrl(fallback = "/shop?tab=weekly") {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = sessionStorage.getItem(RETURN_URL_KEY);
    if (saved?.startsWith("/shop")) return saved;
  } catch {
    // ignore
  }
  return fallback;
}

export function rememberShopScrollSlug(slug: string) {
  if (typeof window === "undefined") return;
  if (!slug) return;
  try {
    sessionStorage.setItem(SCROLL_SLUG_KEY, slug);
  } catch {
    // ignore
  }
}

export function readShopScrollSlug() {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(SCROLL_SLUG_KEY);
  } catch {
    return null;
  }
}

export function clearShopScrollSlug() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SCROLL_SLUG_KEY);
  } catch {
    // ignore
  }
}
