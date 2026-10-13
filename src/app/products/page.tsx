import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { api, ApiError, type Paginated, type ProductList } from "@/lib/api";
import { toPersianDigits } from "@/lib/format";
import ProductGrid from "@/components/ProductGrid";
import { Breadcrumb, Button, Container, EmptyState, Pagination } from "@/components/ui";
import CatalogShell from "@/components/catalog/CatalogShell";
import ClearFiltersButton from "@/components/catalog/ClearFiltersButton";
import { PAGE_SIZE, countActiveFilters, flattenCategories, hrefWith, parseQuery } from "@/components/catalog/params";

export const metadata: Metadata = { title: "محصولات" };

type SP = Record<string, string | string[] | undefined>;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const query = parseQuery(await searchParams);

  const [data, filters, categories] = await Promise.all([
    api.catalog.products(query, { revalidate: 60 }).catch((e): Paginated<ProductList> => {
      // A page number beyond the last one is a 404 from the API: show it as an empty result.
      if (e instanceof ApiError && e.status === 404) return { count: 0, next: null, previous: null, results: [] };
      throw e;
    }),
    api.catalog.filters({ revalidate: 60 }),
    api.catalog.categories({ revalidate: 60 }),
  ]);

  const category = query.category ? flattenCategories(categories).find((c) => c.slug === query.category) : undefined;
  const title = category?.name ?? (query.search ? `نتایج جستجو برای «${query.search}»` : "همه محصولات");
  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const pageCount = Math.ceil(data.count / PAGE_SIZE);
  const filtered = countActiveFilters(query) > 0;

  return (
    <Container className="pb-16 pt-6 md:pt-10">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "محصولات", href: category ? "/products" : undefined },
          ...(category ? [{ label: category.name }] : []),
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold text-ink md:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-ink-muted">{toPersianDigits(data.count)} محصول</p>

      <CatalogShell filters={filters} categories={categories}>
        {data.results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="محصولی با این مشخصات پیدا نشد"
            body="فیلترها را تغییر دهید یا عبارت دیگری را جستجو کنید."
            action={
              filtered ? (
                <ClearFiltersButton />
              ) : (
                <Button href="/products">مشاهده همه محصولات</Button>
              )
            }
          />
        ) : (
          <>
            <ProductGrid products={data.results} layout="three" priorityCount={4} />
            <Pagination page={page} pageCount={pageCount} hrefFor={(p) => hrefWith(query, { page: p })} />
          </>
        )}
      </CatalogShell>
    </Container>
  );
}
