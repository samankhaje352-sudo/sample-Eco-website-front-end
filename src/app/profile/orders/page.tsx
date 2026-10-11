"use client";

import { ChevronLeft, Package, RotateCw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, type OrderList, type Paginated } from "@/lib/api";
import { Button, EmptyState, InlineAlert, OrderRowSkeleton, OrderStatusBadge, Pagination } from "@/components/ui";
import { formatPrice, toPersianDigits } from "@/lib/format";

const PAGE_SIZE = 12;

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paginated<OrderList> | null>(null);
  const [error, setError] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const load = useCallback((p: number) => {
    setData(null);
    setError(false);
    api.orders.list(p).then(setData).catch(() => setError(true));
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  function changePage(p: number) {
    setPage(p);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    headingRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div>
      <h1 ref={headingRef} className="mb-6 scroll-mt-24 text-xl font-bold text-ink md:text-2xl">
        سفارش‌های من
      </h1>

      {error ? (
        <InlineAlert
          kind="error"
          action={
            <Button variant="secondary" size="sm" iconStart={<RotateCw />} onClick={() => load(page)}>
              تلاش دوباره
            </Button>
          }
        >
          بارگذاری اطلاعات با خطا مواجه شد.
        </InlineAlert>
      ) : !data ? (
        <div className="space-y-3" role="status" aria-label="در حال بارگذاری">
          {Array.from({ length: 4 }, (_, i) => (
            <OrderRowSkeleton key={i} />
          ))}
        </div>
      ) : data.results.length === 0 ? (
        <EmptyState
          icon={Package}
          title="هنوز سفارشی ثبت نکرده‌اید"
          body="پس از اولین خرید، سفارش‌هایتان اینجا نمایش داده می‌شود."
          action={<Button href="/products">مشاهده محصولات</Button>}
        />
      ) : (
        <>
          <ul className="space-y-3">
            {data.results.map((o) => (
              <li key={o.number}>
                <Link
                  href={`/profile/orders/${encodeURIComponent(o.number)}`}
                  className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong"
                >
                  <div className="grid min-w-0 flex-1 gap-2 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center">
                    <p className="text-sm font-bold text-ink">
                      سفارش <span dir="ltr">{o.number}</span>
                    </p>
                    <p className="text-sm text-ink-muted">{toPersianDigits(o.created_at_jalali)}</p>
                    <p className="text-sm text-ink">
                      {toPersianDigits(o.items_count)} کالا، {formatPrice(o.total)}
                    </p>
                    <div>
                      <OrderStatusBadge status={o.status} label={o.status_display} />
                    </div>
                  </div>
                  <ChevronLeft className="size-5 shrink-0 text-ink-subtle" strokeWidth={1.75} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <Pagination page={page} pageCount={Math.ceil(data.count / PAGE_SIZE)} onPageChange={changePage} />
        </>
      )}
    </div>
  );
}
