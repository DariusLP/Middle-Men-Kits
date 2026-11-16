"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/components/cart/cart-context";
import { easeOut } from "@/components/motion/primitives";
import { formatPrice, variantPrice } from "@/lib/format";
import type { ProductWithVariants } from "@/lib/types";

export function AddToCart({ product }: { product: ProductWithVariants }) {
  const { addItem, justAdded } = useCart();
  const reduce = useReducedMotion();
  const inStock = product.product_variants.filter((v) => v.stock > 0);
  const [size, setSize] = useState(inStock[0]?.size ?? "");
  const selected = product.product_variants.find((v) => v.size === size);
  const price = selected
    ? variantPrice(product, selected)
    : Number(product.base_price);

  function handleAdd() {
    if (!selected || selected.stock < 1) return;
    addItem({
      variantId: selected.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      club: product.club,
      size: selected.size,
      price,
      imagePath: product.image_path,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-ink-muted">
          Size
        </p>
        <div className="flex flex-wrap gap-2">
          {product.product_variants.map((v) => {
            const disabled = v.stock < 1;
            const active = v.size === size;
            return (
              <motion.button
                key={v.id}
                type="button"
                disabled={disabled}
                onClick={() => setSize(v.size)}
                whileTap={reduce || disabled ? undefined : { scale: 0.94 }}
                transition={{ duration: 0.2, ease: easeOut }}
                className={`relative min-w-12 border px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line text-ink hover:border-ink"
                } ${disabled ? "cursor-not-allowed opacity-35" : ""}`}
              >
                {v.size}
              </motion.button>
            );
          })}
        </div>
      </div>

      <p className="font-display text-4xl tracking-wide">
        {formatPrice(price)}
      </p>

      <motion.button
        type="button"
        onClick={handleAdd}
        disabled={!selected || selected.stock < 1}
        whileHover={reduce ? undefined : { y: -2 }}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        animate={
          justAdded && !reduce
            ? { scale: [1, 1.03, 1] }
            : { scale: 1 }
        }
        transition={{ duration: 0.35, ease: easeOut }}
        className={`w-full disabled:cursor-not-allowed disabled:opacity-50 ${
          justAdded ? "btn-accent" : "btn-primary"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={justAdded ? "added" : "add"}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="inline-block"
          >
            {justAdded ? "Added to cart" : "Add to cart"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
