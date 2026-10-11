import { Skeleton } from "@/components/ui";
import { productGridClasses, type ProductGridLayout } from "@/components/ProductGrid";
import { cn } from "@/lib/cn";

export function ProductCardSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="aspect-[4/5] rounded-lg" />
      <Skeleton className="mt-3 h-3 w-1/3" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>
  );
}

export interface ProductGridSkeletonProps {
  /** 8 on home, 12 on the catalog. */
  count?: number;
  layout?: ProductGridLayout;
  className?: string;
}

export function ProductGridSkeleton({ count = 8, layout = "home", className }: ProductGridSkeletonProps) {
  return (
    <ul className={cn(productGridClasses(layout), className)} role="status" aria-label="در حال بارگذاری">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
