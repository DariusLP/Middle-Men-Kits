"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/components/motion/primitives";
import { formatPrice, productImageUrl } from "@/lib/format";
import type { Product } from "@/lib/types";

export function AdminProductList({ products }: { products: Product[] }) {
  const reduce = useReducedMotion();

  if (products.length === 0) {
    return (
      <motion.div
        className="mt-8 rounded-2xl border border-dashed border-white/20 p-8 text-center text-white/60"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        No products yet. Add your first kit.
      </motion.div>
    );
  }

  return (
    <motion.ul
      className="mt-8 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: reduce ? 0 : 0.05 },
        },
      }}
    >
      {products.map((product) => {
        const image = productImageUrl(product.image_path);
        return (
          <motion.li
            key={product.id}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-white/5"
            variants={{
              hidden: reduce ? { opacity: 1 } : { opacity: 0, x: -12 },
              show: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.35, ease: easeOut },
              },
            }}
            whileHover={reduce ? undefined : { x: 4 }}
          >
            <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-white/10">
              {image ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{product.name}</p>
              <p className="text-sm text-white/50">
                {product.club}
                {product.is_weekly ? " · Weekly" : ""}
                {" · "}
                {product.price_on_request
                  ? "POR"
                  : formatPrice(Number(product.base_price))}
                {" · "}
                {product.availability_status}
                {" · "}
                {product.active ? "Active" : "Hidden"}
              </p>
            </div>
            <Link
              href={`/admin/products/${product.id}`}
              className="text-sm text-accent transition-colors hover:text-white"
            >
              Edit
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
