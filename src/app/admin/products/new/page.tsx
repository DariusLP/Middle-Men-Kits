import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "New product · Admin" };

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="text-sm text-white/50">
        ← Products
      </Link>
      <h1 className="mt-4 font-display text-4xl tracking-wide">
        New product
      </h1>
      <ProductForm />
    </div>
  );
}
