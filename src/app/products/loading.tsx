import { Container, Skeleton } from "@/components/ui";
import { ProductGridSkeleton } from "@/components/ProductSkeletons";

export default function Loading() {
  return (
    <Container className="pb-16 pt-6 md:pt-10">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="mt-4 h-9 w-56" />
      <Skeleton className="mt-2 h-4 w-20" />
      <div className="mt-6 flex gap-8">
        <div className="hidden w-64 shrink-0 space-y-4 lg:block" aria-hidden>
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Skeleton className="h-9 w-24 lg:hidden" />
            <Skeleton className="h-9 w-40 lg:h-10 lg:w-44" />
          </div>
          <ProductGridSkeleton count={12} layout="three" />
        </div>
      </div>
    </Container>
  );
}
