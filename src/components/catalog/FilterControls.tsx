"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category, FilterOptions, ProductQuery } from "@/lib/api";
import { cn } from "@/lib/cn";
import { formatNumber, toEnglishDigits, toPersianDigits } from "@/lib/format";
import { ColorSwatch, Input, SizeChip, Switch } from "@/components/ui";
import { hrefWith, type QueryKey } from "./params";

export type QueryPatch = Partial<Record<QueryKey, string | number | null>>;

export interface FilterControlsProps {
  query: ProductQuery;
  update: (patch: QueryPatch) => void;
  filters: FilterOptions;
  categories: Category[];
}

function Group({ title, first, children }: { title: string; first?: boolean; children: React.ReactNode }) {
  return (
    <section className={cn(!first && "mt-5 border-t border-border pt-5")}>
      <h3 className="mb-3 text-sm font-bold text-ink">{title}</h3>
      {children}
    </section>
  );
}

function CategoryItem({ cat, query, nested }: { cat: Category; query: ProductQuery; nested?: boolean }) {
  const active = query.category === cat.slug;
  return (
    <li className={cn(nested && "ps-4")}>
      <Link
        href={hrefWith(query, { category: cat.slug })}
        scroll={false}
        aria-current={active ? "true" : undefined}
        className={cn(
          "flex h-9 items-center rounded-md px-2 text-sm transition-colors duration-150",
          active ? "bg-accent-soft font-medium text-accent-strong" : "text-ink-muted hover:bg-surface-muted hover:text-ink",
        )}
      >
        {cat.name}
      </Link>
      {cat.children?.length > 0 && (
        <ul className="space-y-1">
          {cat.children.map((c) => (
            <CategoryItem key={c.id} cat={c} query={query} nested />
          ))}
        </ul>
      )}
    </li>
  );
}

const digitsOnly = (s: string) => toEnglishDigits(s).replace(/\D/g, "");

function PriceRange({ query, update, range }: Pick<FilterControlsProps, "query" | "update"> & { range: FilterOptions["price_range"] }) {
  const [min, setMin] = useState(query.min_price ? toPersianDigits(query.min_price) : "");
  const [max, setMax] = useState(query.max_price ? toPersianDigits(query.max_price) : "");
  const [error, setError] = useState("");

  function apply() {
    const lo = digitsOnly(min);
    const hi = digitsOnly(max);
    if (lo && hi && Number(lo) > Number(hi)) {
      setError("حداقل قیمت نباید از حداکثر بیشتر باشد.");
      return;
    }
    setError("");
    if ((lo || null) === (query.min_price ?? null) && (hi || null) === (query.max_price ?? null)) return;
    update({ min_price: lo || null, max_price: hi || null });
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      apply();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="از"
          inputMode="numeric"
          h={10}
          value={min}
          placeholder={formatNumber(range.min)}
          onChange={(e) => setMin(e.target.value)}
          onBlur={apply}
          onKeyDown={onKey}
        />
        <Input
          label="تا"
          inputMode="numeric"
          h={10}
          value={max}
          placeholder={formatNumber(range.max)}
          onChange={(e) => setMax(e.target.value)}
          onBlur={apply}
          onKeyDown={onKey}
        />
      </div>
      {error ? (
        <p className="mt-2 text-xs text-danger" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-xs text-ink-muted">
          از {formatNumber(range.min)} تا {formatNumber(range.max)} تومان
        </p>
      )}
    </div>
  );
}

/** Filter groups shared by the desktop aside and the mobile sheet. Filters apply live. */
export default function FilterControls({ query, update, filters, categories }: FilterControlsProps) {
  return (
    <div>
      <Group title="دسته‌بندی" first>
        <ul className="space-y-1">
          <li>
            <Link
              href={hrefWith(query, { category: null })}
              scroll={false}
              aria-current={!query.category ? "true" : undefined}
              className={cn(
                "flex h-9 items-center rounded-md px-2 text-sm transition-colors duration-150",
                !query.category
                  ? "bg-accent-soft font-medium text-accent-strong"
                  : "text-ink-muted hover:bg-surface-muted hover:text-ink",
              )}
            >
              همه
            </Link>
          </li>
          {categories.map((c) => (
            <CategoryItem key={c.id} cat={c} query={query} />
          ))}
        </ul>
      </Group>

      <Group title="محدوده قیمت (تومان)">
        <PriceRange
          key={`${query.min_price ?? ""}-${query.max_price ?? ""}`}
          query={query}
          update={update}
          range={filters.price_range}
        />
      </Group>

      {filters.sizes.length > 0 && (
        <Group title="سایز">
          <div className="flex flex-wrap gap-2">
            {filters.sizes.map((s) => (
              <SizeChip
                key={s}
                size={s}
                compact
                selected={query.size === s}
                onClick={() => update({ size: query.size === s ? null : s })}
              />
            ))}
          </div>
        </Group>
      )}

      {filters.colors.length > 0 && (
        <Group title="رنگ">
          <div className="flex flex-wrap gap-3 p-1">
            {filters.colors.map((c) => (
              <ColorSwatch
                key={c.slug}
                color={c}
                size="sm"
                selected={query.color === c.slug}
                onClick={() => update({ color: query.color === c.slug ? null : c.slug })}
              />
            ))}
          </div>
        </Group>
      )}

      <Group title="موجودی">
        <Switch
          label="فقط کالاهای موجود"
          checked={query.in_stock === "1"}
          onCheckedChange={(on) => update({ in_stock: on ? "1" : null })}
        />
      </Group>
    </div>
  );
}
