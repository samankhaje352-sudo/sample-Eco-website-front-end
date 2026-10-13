import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError, type ProductDetail } from "@/lib/api";
import AddToCart from "@/components/AddToCart";
import JsonLd from "@/components/JsonLd";
import ProductGrid from "@/components/ProductGrid";
import Gallery from "@/components/product/Gallery";
import { Breadcrumb, Container, Price, SectionHeader } from "@/components/ui";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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
    return {
      title: p.name,
      description: (p.description || `${p.name} در فروشگاه پود`).slice(0, 160),
      alternates: { canonical: `/products/${p.slug}` },
      openGraph: {
        type: "website",
        url: `/products/${p.slug}`,
        title: p.name,
        description: (p.description || p.name).slice(0, 160),
        images: p.main_image ? [{ url: p.main_image, alt: p.name }] : undefined,
      },
    };
  } catch {
    return { title: "محصول" };
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              name: product.name,
              description: product.description || undefined,
              image: images.length ? images.map((i) => i.url) : undefined,
              sku: String(product.id),
              category: product.category.name,
              brand: { "@type": "Brand", name: SITE_NAME },
              offers: {
                "@type": "Offer",
                url: `${SITE_URL}/products/${product.slug}`,
                priceCurrency: "IRR",
                // API prices are in Toman; schema.org needs an ISO currency code, and IRR = Toman × 10.
                price: product.final_price * 10,
                availability: product.is_available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                itemCondition: "https://schema.org/NewCondition",
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "خانه", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: product.category.name, item: `${SITE_URL}/products?category=${product.category.slug}` },
                { "@type": "ListItem", position: 3, name: product.name },
              ],
            },
          ],
        }}
      />
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
