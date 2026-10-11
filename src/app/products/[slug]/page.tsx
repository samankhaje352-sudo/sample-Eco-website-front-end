import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError, type ProductDetail } from "@/lib/api";
import AddToCart from "@/components/AddToCart";
import ProductGrid from "@/components/ProductGrid";
import Gallery from "@/components/product/Gallery";
import { Breadcrumb, Container, Price, SectionHeader } from "@/components/ui";

type Params = { params: Promise<{ slug: string }> };

async function load(slug: string): Promise<ProductDetail> {
  try {
    return await api.catalog.product(slug, { revalidate: 60 });
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await api.catalog.product(slug, { revalidate: 60 });
    return { title: `${p.name} | پود` };
  } catch {
    return { title: "محصول | پود" };
  }
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await load(slug);
  const images = product.images.length
    ? product.images
    : product.main_image
      ? [{ id: "main", url: product.main_image, alt: product.name }]
      : [];

  return (
    <Container className="pb-16 pt-6 md:pt-10">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: product.category.name, href: `/products?category=${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-0 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Gallery images={images} name={product.name} />
        </div>
        <div className="mt-6 flex flex-col lg:sticky lg:top-24 lg:col-span-5 lg:mt-0 lg:self-start">
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-sm text-accent hover:underline"
          >
            {product.category.name}
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-ink md:text-3xl">{product.name}</h1>
          <Price
            className="mt-4"
            size="pdp"
            price={product.price}
            finalPrice={product.final_price}
            discountPercent={product.discount_percent}
            available={product.is_available}
          />
          <hr className="my-6 border-t border-border" />
          <AddToCart product={product} />
        </div>
      </div>

      {product.description && (
        <section className="mt-12 max-w-prose md:mt-16">
          <h2 className="text-xl font-bold text-ink">توضیحات محصول</h2>
          <p className="mt-3 whitespace-pre-line text-base leading-8 text-ink">{product.description}</p>
        </section>
      )}

      {product.related.length > 0 && (
        <section className="mt-12 md:mt-16">
          <SectionHeader title="محصولات مشابه" />
          <ProductGrid products={product.related.slice(0, 4)} layout="four" />
        </section>
      )}
    </Container>
  );
}
