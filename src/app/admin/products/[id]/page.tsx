import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { createClient } from "@/lib/supabase/server";
import type { Product, ProductVariant } from "@/lib/types";

type Params = Promise<{ id: string }>;

export const metadata = { title: "Edit product · Admin" };

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!product) notFound();

  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", id);

  const normalized = {
    ...(product as Product),
    badge_options: Array.isArray(product.badge_options)
      ? product.badge_options
      : [],
    country: product.country ?? null,
    category: product.category ?? "other",
    is_weekly: Boolean(product.is_weekly),
    price_on_request: Boolean(product.price_on_request),
    printing_enabled: product.printing_enabled !== false,
    availability_status: product.availability_status ?? "available",
  } as Product;

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-white/50">
        ← Products
      </Link>
      <h1 className="mt-4 font-display text-4xl tracking-wide">
        Edit product
      </h1>
      <ProductForm
        product={normalized}
        variants={(variants ?? []) as ProductVariant[]}
      />
    </div>
  );
}
