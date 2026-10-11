"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useId, useState } from "react";
import type { Category, FilterOptions } from "@/lib/api";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { Badge, Button, Drawer } from "@/components/ui";
import ActiveChips from "./ActiveChips";
import FilterControls from "./FilterControls";
import SortSelect from "./SortSelect";
import { CLEAR_FILTERS, countActiveFilters } from "./params";
import { useCatalogQuery } from "./useCatalogQuery";

export interface CatalogShellProps {
  filters: FilterOptions;
  categories: Category[];
  /** Server-rendered results (grid, empty state, pagination). */
  children: React.ReactNode;
}

/** Desktop aside, mobile toolbar and filter sheet, chips. All state lives in the URL. */
export default function CatalogShell({ filters, categories, children }: CatalogShellProps) {
  const { query, update, pending } = useCatalogQuery();
  const [sheet, setSheet] = useState(false);
  const titleId = useId();
  const active = countActiveFilters(query);
  const colorNames = Object.fromEntries(filters.colors.map((c) => [c.slug, c.name]));
  const controls = <FilterControls query={query} update={update} filters={filters} categories={categories} />;
  const sort = query.ordering ?? "newest";

  return (
    <div className="mt-6 flex gap-8">
      <aside className="hidden w-64 shrink-0 lg:block" aria-label="فیلترها">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pe-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">فیلترها</h2>
            {active > 0 && (
              <Button variant="link" size="sm" onClick={() => update(CLEAR_FILTERS)}>
                حذف همه
              </Button>
            )}
          </div>
          {controls}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-14 z-20 -mx-4 mb-5 flex items-center justify-between gap-3 bg-bg/95 px-4 py-2 backdrop-blur-sm md:-mx-6 md:px-6 lg:static lg:mx-0 lg:justify-end lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden"
            iconStart={<SlidersHorizontal />}
            onClick={() => setSheet(true)}
            aria-haspopup="dialog"
          >
            فیلترها
            {active > 0 && <Badge kind="accent" className="rounded-full">{toPersianDigits(active)}</Badge>}
          </Button>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-ink-muted lg:inline">مرتب‌سازی:</span>
            <SortSelect value={sort} onChange={(v) => update({ ordering: v })} compact />
          </div>
        </div>

        <ActiveChips query={query} categories={categories} colorNames={colorNames} update={update} />

        <div className={cn("transition-opacity duration-150", pending && "pointer-events-none opacity-60")} aria-busy={pending}>
          {children}
        </div>
      </div>

      <Drawer open={sheet} onClose={() => setSheet(false)} side="bottom" labelledBy={titleId} className="flex flex-col lg:hidden">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border-strong" aria-hidden />
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <h2 id={titleId} className="text-base font-bold text-ink">
            فیلترها
          </h2>
          <Button variant="ghost" size="sm" iconOnly aria-label="بستن" onClick={() => setSheet(false)}>
            <X />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{controls}</div>
        <div className="grid grid-cols-[1fr_2fr] gap-3 border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button variant="secondary" onClick={() => update(CLEAR_FILTERS)} disabled={active === 0}>
            حذف همه
          </Button>
          <Button onClick={() => setSheet(false)}>نمایش نتایج</Button>
        </div>
      </Drawer>
    </div>
  );
}
