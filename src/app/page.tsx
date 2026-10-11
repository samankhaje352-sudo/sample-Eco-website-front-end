import Link from "next/link";
import { api } from "@/lib/api";
import ProductListPlain from "@/components/ProductList";

export const dynamic = "force-dynamic"; // do not require the API at build time

export default async function HomePage() {
  const home = await api.catalog.home({ revalidate: 60 });
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 font-bold">دسته‌بندی‌ها</h2>
        <ul className="flex flex-wrap gap-3">
          {home.categories.map((c) => (
            <li key={c.id}><Link href={`/products?category=${c.slug}`}>{c.name}</Link></li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-2 font-bold">تازه‌ها</h2>
        <ProductListPlain products={home.new_arrivals} />
      </section>
      <section>
        <h2 className="mb-2 font-bold">تخفیف‌دارها</h2>
        <ProductListPlain products={home.discounted} />
      </section>
    </div>
  );
}
