"use client";

import { X } from "lucide-react";
import type { Category, ProductQuery } from "@/lib/api";
import { formatNumber, toPersianDigits } from "@/lib/format";
import { flattenCategories, type QueryKey } from "./params";
import type { QueryPatch } from "./FilterControls";

interface Chip {
  key: string;
  label: string;
  patch: QueryPatch;
}

export interface ActiveChipsProps {
  query: ProductQuery;
  categories: Category[];
  colorNames: Record<string, string>;
  update: (patch: QueryPatch) => void;
}

export default function ActiveChips({ query, categories, colorNames, update }: ActiveChipsProps) {
  const chips: Chip[] = [];
  if (query.category) {
    const name = flattenCategories(categories).find((c) => c.slug === query.category)?.name ?? String(query.category);
    chips.push({ key: "category", label: name, patch: { category: null } });
  }
  if (query.size) {
    const s = /^\d+$/.test(query.size) ? toPersianDigits(query.size) : query.size;
    chips.push({ key: "size", label: `سایز ${s}`, patch: { size: null } });
  }
  if (query.color) {
    chips.push({ key: "color", label: colorNames[query.color] ?? String(query.color), patch: { color: null } });
  }
  if (query.min_price || query.max_price) {
    const lo = query.min_price ? formatNumber(Number(query.min_price)) : "";
    const hi = query.max_price ? formatNumber(Number(query.max_price)) : "";
    const label = lo && hi ? `${lo} تا ${hi} تومان` : lo ? `از ${lo} تومان` : `تا ${hi} تومان`;
    chips.push({ key: "price", label, patch: { min_price: null, max_price: null } as Partial<Record<QueryKey, null>> });
  }
  if (query.in_stock === "1") chips.push({ key: "in_stock", label: "فقط موجود", patch: { in_stock: null } });

  if (chips.length === 0) return null;
  return (
    <ul className="mb-5 flex flex-wrap gap-2">
      {chips.map((c) => (
        <li
          key={c.key}
          className="inline-flex h-8 items-center gap-1 rounded-full bg-surface-muted ps-3 pe-1.5 text-xs text-ink"
        >
          {c.label}
          <button
            type="button"
            onClick={() => update(c.patch)}
            aria-label={`حذف فیلتر ${c.label}`}
            className="grid size-6 place-items-center rounded-full transition-colors duration-150 hover:bg-border"
          >
            <X className="size-3.5" strokeWidth={1.75} />
          </button>
        </li>
      ))}
    </ul>
  );
}
