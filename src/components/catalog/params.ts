import type { Category, ProductQuery } from "@/lib/api";
import { toEnglishDigits } from "@/lib/format";

/** Query keys shared by the URL and the products API. */
export const QUERY_KEYS = [
  "search",
  "category",
  "min_price",
  "max_price",
  "size",
  "color",
  "in_stock",
  "ordering",
  "page",
] as const;

export type QueryKey = (typeof QUERY_KEYS)[number];

/** Keys that count as «filters» (not search, sort or page). */
export const FILTER_KEYS = ["category", "min_price", "max_price", "size", "color", "in_stock"] as const;

export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "price", label: "ارزان‌ترین" },
  { value: "-price", label: "گران‌ترین" },
  { value: "discount", label: "بیشترین تخفیف" },
] as const;

type Source = Record<string, string | string[] | undefined> | URLSearchParams;

function pick(src: Source, key: string): string | undefined {
  if (src instanceof URLSearchParams) return src.get(key) ?? undefined;
  const v = src[key];
  return Array.isArray(v) ? v[0] : v;
}

/** Reads the known keys, normalizing digits. Works with Next searchParams and URLSearchParams. */
export function parseQuery(src: Source): ProductQuery {
  const q: Record<string, string> = {};
  for (const k of QUERY_KEYS) {
    const v = pick(src, k)?.trim();
    if (v) q[k] = toEnglishDigits(v);
  }
  return q as ProductQuery;
}

export function countActiveFilters(q: ProductQuery): number {
  let n = 0;
  if (q.category) n++;
  if (q.min_price || q.max_price) n++;
  if (q.size) n++;
  if (q.color) n++;
  if (q.in_stock === "1") n++;
  return n;
}

/** Builds `/products?...` from a query plus a patch (null/empty removes a key). Resets `page`. */
export function hrefWith(q: ProductQuery, patch: Partial<Record<QueryKey, string | number | null>> = {}): string {
  const next: Record<string, string> = {};
  for (const k of QUERY_KEYS) {
    const v = q[k];
    if (v !== undefined && v !== "") next[k] = String(v);
  }
  if (!("page" in patch)) delete next.page;
  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === undefined || v === "") delete next[k];
    else next[k] = String(v);
  }
  const qs = new URLSearchParams(next).toString();
  return qs ? `/products?${qs}` : "/products";
}

/** The patch that clears every filter but keeps search and sort. */
export const CLEAR_FILTERS: Partial<Record<QueryKey, null>> = {
  category: null,
  min_price: null,
  max_price: null,
  size: null,
  color: null,
  in_stock: null,
};

export function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((c) => [c, ...flattenCategories(c.children ?? [])]);
}
