"use client";

import type { ReactNode } from "react";
import ProfileNav from "@/components/profile/ProfileNav";
import { Container, Skeleton } from "@/components/ui";
import { useRequireAuth } from "@/components/useRequireAuth";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const ready = useRequireAuth();

  return (
    <Container className="pb-16 pt-6 md:pt-10">
      {ready ? (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="lg:col-span-3">
            <ProfileNav />
          </aside>
          <section className="min-w-0 lg:col-span-9">{children}</section>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12" role="status" aria-label="در حال بارگذاری">
          <Skeleton className="hidden h-72 rounded-lg lg:col-span-3 lg:block" />
          <div className="space-y-4 lg:col-span-9">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      )}
    </Container>
  );
}
