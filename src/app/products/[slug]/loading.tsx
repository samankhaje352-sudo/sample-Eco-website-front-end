import { Container, PdpSkeleton, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <Container className="pb-16 pt-6 md:pt-10">
      <Skeleton className="mb-6 h-4 w-56" />
      <PdpSkeleton />
    </Container>
  );
}
