import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/product-detail";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/products";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.name ?? "Kit",
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (
    await getRelatedProducts(slug, 4)
  ).filter(
    (item, index, list) =>
      item.id !== product.id &&
      item.slug !== product.slug &&
      item.image_path !== product.image_path &&
      list.findIndex((entry) => entry.id === item.id) === index &&
      list.findIndex((entry) => entry.slug === item.slug) === index,
  );

  return <ProductDetail product={product} related={related} />;
}
