export type UserRole = "customer" | "admin";

export type KitType =
  | "home"
  | "away"
  | "third"
  | "goalkeeper"
  | "retro"
  | "special";

export type ProductCategory = "vintage" | "player_version" | "other";

export type AvailabilityStatus =
  | "available"
  | "check_required"
  | "unavailable";

export type Profile = {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  club: string;
  country: string | null;
  kit_type: KitType;
  season: string;
  category: ProductCategory;
  base_price: number;
  price_on_request: boolean;
  image_path: string | null;
  image_paths: string[];
  is_weekly: boolean;
  availability_status: AvailabilityStatus;
  badge_options: string[];
  printing_enabled: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size: string;
  sku: string;
  stock: number;
  price_override: number | null;
};

export type ProductWithVariants = Product & {
  product_variants: ProductVariant[];
};

export type KitCustomisation = {
  size: string;
  printing: boolean;
  playerName: string;
  shirtNumber: string;
  badges: string[];
  sleeve: "short" | "long" | "";
  notes: string;
};

export type CustomKitRequest = {
  club: string;
  country: string;
  season: string;
  kitType: string;
  size: string;
  sleeve: string;
  printing: boolean;
  playerName: string;
  shirtNumber: string;
  badges: string[];
  notes: string;
  hasReferenceImage: boolean;
};

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export const DEFAULT_BADGES = [
  "Premier League",
  "Champions League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "FA Cup",
  "Club World Cup",
] as const;

/** Legacy Stripe cart/order types — dormant after WhatsApp pivot */
export type OrderStatus =
  | "pending"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded";

export type GuestCartItem = {
  variantId: string;
  productId: string;
  slug?: string;
  name: string;
  club?: string;
  size: string;
  price: number;
  imagePath: string | null;
  quantity: number;
};

export type ShippingAddress = {
  fullName: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  name: string;
  size: string;
  unit_price: number;
  quantity: number;
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};
