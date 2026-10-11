import Link from "next/link";
import { api, type ProductQuery } from "@/lib/api";
import ProductListPlain from "@/components/ProductList";
import { toEnglishDigits, toPersianDigits } from "@/lib/format";

type SP = Record<string, string | string[] | undefined>;
const KEYS = ["search", "category", "min_price", "max_price", "size", "color", "in_stock", "ordering", "page"] as const;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const query: ProductQuery = {};
  for (const k of KEYS) {
    const v = Array.isArray(sp[k]) ? sp[k]![0] : sp[k];
    if (v) (query as Record<string, string>)[k] = toEnglishDigits(v);
  }

  const [data, filters, categories] = await Promise.all([
    api.catalog.products(query, { revalidate: 60 }),
    api.catalog.filters({ revalidate: 60 }),
    api.catalog.categories({ revalidate: 60 }),
  ]);

  const page = Number(query.page ?? 1);
  const pageHref = (p: number) => {
    const u = new URLSearchParams(query as Record<string, string>);
    u.set("page", String(p));
    return `/products?${u.toString()}`;
  };

  return (
    <div className="space-y-4">
      <h1 className="font-bold">محصولات ({toPersianDigits(data.count)})</h1>
      <form method="get" className="flex flex-wrap items-end gap-2">
        <input name="search" defaultValue={query.search} placeholder="جستجو" className="border" />
        <select name="category" defaultValue={query.category ?? ""}>
          <option value="">همه دسته‌ها</option>
          {categories.flatMap((c) => [c, ...c.children]).map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select name="size" defaultValue={query.size ?? ""}>
          <option value="">همه سایزها</option>
          {filters.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="color" defaultValue={query.color ?? ""}>
          <option value="">همه رنگ‌ها</option>
          {filters.colors.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <input name="min_price" defaultValue={query.min_price} placeholder={`حداقل (${filters.price_range.min})`} className="w-28 border" />
        <input name="max_price" defaultValue={query.max_price} placeholder={`حداکثر (${filters.price_range.max})`} className="w-28 border" />
        <select name="ordering" defaultValue={query.ordering ?? "newest"}>
          <option value="newest">جدیدترین</option>
          <option value="price">ارزان‌ترین</option>
          <option value="-price">گران‌ترین</option>
          <option value="discount">بیشترین تخفیف</option>
        </select>
        <label><input type="checkbox" name="in_stock" value="1" defaultChecked={query.in_stock === "1"} /> فقط موجود</label>
        <button className="border px-2">اعمال</button>
      </form>
      <ProductListPlain products={data.results} />
      <p className="flex gap-4">
        {data.previous && <Link href={pageHref(page - 1)}>قبلی</Link>}
        {data.next && <Link href={pageHref(page + 1)}>بعدی</Link>}
      </p>
    </div>
  );
}
