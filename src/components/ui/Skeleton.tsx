import { cn } from "@/lib/cn";

export interface SkeletonProps {
  className?: string;
}

/** Loading block. Give it size/shape through className. */
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden className={cn("rounded-md bg-surface-muted motion-safe:animate-pulse", className)} />;
}

export function PdpSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-12" role="status" aria-label="در حال بارگذاری">
      <Skeleton className="aspect-[4/5] rounded-lg lg:col-span-7" />
      <div className="flex flex-col gap-4 lg:col-span-5">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-12" />
          ))}
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export function CartLineSkeleton() {
  return (
    <div className="flex gap-4 p-4" aria-hidden>
      <Skeleton className="aspect-[4/5] w-24" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </div>
  );
}

export function OrderRowSkeleton() {
  return <Skeleton className="h-24 rounded-lg" />;
}
