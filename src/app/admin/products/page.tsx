import { MotionLink } from "@/components/motion/motion-button";
import { AdminProductList } from "@/components/admin/product-list";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export const metadata = { title: "Products · Admin" };

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const products = (data ?? []) as Product[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl tracking-wide">
          Products
        </h1>
        <MotionLink href="/admin/products/new" variant="accent">
          Add product
        </MotionLink>
      </div>

      <AdminProductList products={products} />
    </div>
  );
}
