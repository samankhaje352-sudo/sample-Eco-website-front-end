import type { ProductList } from "@/lib/api";
import { cn } from "@/lib/cn";
import ProductCard from "@/components/ProductCard";

/**
 * home:  2 / 3 (md) / 4 (xl) columns, for home and general lists
 * three: 2 / 3 columns, for the catalog (with sidebar) and the wishlist
 * four:  2 / 4 (md) columns, for related products on the product page
 */
export type ProductGridLayout = "home" | "three" | "four";

const GRID: Record<ProductGridLayout, string> = {
  home: "grid-cols-2 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4 xl:gap-x-6",
  three: "grid-cols-2 md:grid-cols-3 md:gap-x-5",
  four: "grid-cols-2 md:grid-cols-4 md:gap-x-5",
};

export function productGridClasses(layout: ProductGridLayout = "home") {
  return cn("grid gap-x-3 gap-y-8", GRID[layout]);
}

export interface ProductGridProps {
  products: ProductList[];
  layout?: ProductGridLayout;
  /** Number of leading cards whose image loads with priority (default 0). */
  priorityCount?: number;
  /** Extra classes per <li>, e.g. `(i) => i >= 6 ? "md:hidden xl:block" : ""`. */
  itemClassName?: (index: number) => string | undefined;
  onWishlistChange?: (product: ProductList, wished: boolean) => void;
  className?: string;
}

/** Responsive <ul> of ProductCards. Renders nothing for an empty list (pages show an EmptyState). */
export default function ProductGrid({
  products,
  layout = "home",
  priorityCount = 0,
  itemClassName,
  onWishlistChange,
  className,
}: ProductGridProps) {
  if (products.length === 0) return null;
  return (
    <ul className={cn(productGridClasses(layout), className)}>
      {products.map((p, i) => (
        <li key={p.id} className={itemClassName?.(i)}>
          <ProductCard product={p} priority={i < priorityCount} onWishlistChange={onWishlistChange} />
        </li>
      ))}
    </ul>
  );
}
