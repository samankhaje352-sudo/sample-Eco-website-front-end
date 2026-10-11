import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import AddToCart from "@/components/AddToCart";
import ProductGrid from "@/components/ProductGrid";
import { formatPrice } from "@/lib/format";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await api.catalog.product(slug, { revalidate: 60 }).catch((e) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  });

  return (
    <div className="space-y-4">
      <h1 className="font-bold">{product.name}</h1>
      <p>{product.category.name}</p>
      <p>
        {product.discount_price !== null && <s>{formatPrice(product.price)} </s>}
        {formatPrice(product.final_price)}
      </p>
      <p>{product.description}</p>
      <p>سایزها: {product.sizes.join("، ")}</p>
      <p>رنگ‌ها: {product.colors.map((c) => c.name).join("، ")}</p>
      <p>تعداد تصاویر: {product.images.length}</p>
      <AddToCart product={product} />
      <h2 className="font-bold">محصولات مرتبط</h2>
      <ProductGrid products={product.related} layout="four" />
    </div>
  );
}
