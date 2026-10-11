"use client";

import { ArrowRight, RotateCw, Shirt } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { api, ApiError, type OrderDetail } from "@/lib/api";
import { Button, InlineAlert, OrderStatusBadge, Skeleton, useToast } from "@/components/ui";
import { formatPrice, toPersianDigits } from "@/lib/format";

function Row({ label, children, strong }: { label: React.ReactNode; children: React.ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="text-ink-muted">{label}</dt>
      <dd className={strong ? "text-lg font-bold tabular-nums text-ink" : "font-medium tabular-nums text-ink"}>
        {children}
      </dd>
    </div>
  );
}

export default function OrderPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = use(params);
  const toast = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState(false);
  const [paying, setPaying] = useState(false);

  const load = useCallback(() => {
    setError(false);
    setOrder(null);
    api.orders.get(number).then(setOrder).catch(() => setError(true));
  }, [number]);

  useEffect(() => {
    load();
  }, [load]);

  async function pay() {
    setPaying(true);
    try {
      const { payment_url } = await api.orders.pay(number);
      window.location.assign(payment_url);
    } catch (e) {
      setPaying(false);
      toast.error(e instanceof ApiError && e.status !== 0 ? e.message : "ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
    }
  }

  const back = (
    <Button href="/profile/orders" variant="link" size="sm" iconStart={<ArrowRight className="size-4" />} className="mb-4">
      بازگشت به سفارش‌ها
    </Button>
  );

  if (error) {
    return (
      <div>
        {back}
        <InlineAlert
          kind="error"
          action={
            <Button variant="secondary" size="sm" iconStart={<RotateCw />} onClick={load}>
              تلاش دوباره
            </Button>
          }
        >
          بارگذاری اطلاعات با خطا مواجه شد.
        </InlineAlert>
      </div>
    );
  }

  if (!order) {
    return (
      <div role="status" aria-label="در حال بارگذاری">
        {back}
        <Skeleton className="mb-6 h-8 w-1/2" />
        <div className="grid gap-6 lg:grid-cols-12">
          <Skeleton className="h-64 rounded-lg lg:col-span-8" />
          <Skeleton className="h-64 rounded-lg lg:col-span-4" />
        </div>
      </div>
    );
  }

  const a = order.address;
  return (
    <div>
      {back}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold text-ink md:text-2xl">
            سفارش <span dir="ltr">{order.number}</span>
          </h1>
          <OrderStatusBadge status={order.status} label={order.status_display} />
        </div>
        {order.status === "pending" ? (
          <Button onClick={pay} loading={paying}>
            پرداخت
          </Button>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        ثبت شده در {toPersianDigits(order.created_at_jalali)}
        {order.paid_at ? `، پرداخت در ${toPersianDigits(order.paid_at)}` : ""}
      </p>

      {order.status === "pending" ? (
        <InlineAlert kind="warning" className="mt-4">
          این سفارش هنوز پرداخت نشده است.
        </InlineAlert>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface lg:col-span-8">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex gap-4 p-4">
              <Link
                href={`/products/${i.product_slug}`}
                className="relative block aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-md bg-surface-muted"
                tabIndex={-1}
                aria-hidden
              >
                {i.image ? (
                  <Image src={i.image} alt={i.product_name} fill sizes="64px" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center">
                    <Shirt className="size-10 text-ink-subtle" strokeWidth={1.75} />
                  </span>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${i.product_slug}`} className="text-sm font-medium text-ink hover:text-accent">
                  {i.product_name}
                </Link>
                <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-ink-muted">
                  <span>رنگ: {i.color_name}</span>
                  <span>سایز: {toPersianDigits(i.size)}</span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  {toPersianDigits(i.quantity)} عدد، قیمت واحد {formatPrice(i.unit_price)}
                </p>
              </div>
              <p className="shrink-0 self-start text-sm font-medium tabular-nums text-ink">{formatPrice(i.line_total)}</p>
            </li>
          ))}
        </ul>

        <div className="space-y-4 lg:col-span-4">
          <section className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-3 text-sm font-bold text-ink">آدرس تحویل</h2>
            <p className="text-sm font-medium text-ink">{a.receiver_name}</p>
            <p dir="ltr" className="mt-1 text-start text-sm text-ink-muted">
              {toPersianDigits(a.receiver_phone)}
            </p>
            <p className="mt-2 text-sm text-ink">
              {a.province}، {a.city}، {a.address_line}
            </p>
            {a.postal_code ? (
              <p className="mt-1 text-sm text-ink-muted">
                کد پستی: <span dir="ltr">{toPersianDigits(a.postal_code)}</span>
              </p>
            ) : null}
          </section>

          <section className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-3 text-sm font-bold text-ink">مبلغ سفارش</h2>
            <dl className="space-y-2">
              <Row label="جمع کالاها">{formatPrice(order.subtotal)}</Row>
              {order.discount > 0 ? (
                <Row
                  label={
                    <>
                      تخفیف
                      {order.coupon_code ? (
                        <span className="block text-xs">
                          کد: <span dir="ltr">{order.coupon_code}</span>
                        </span>
                      ) : null}
                    </>
                  }
                >
                  <span className="text-success">{formatPrice(order.discount)}</span>
                </Row>
              ) : null}
              <Row label="هزینه ارسال">{order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : "رایگان"}</Row>
              <div className="border-t border-border pt-3">
                <Row label="مبلغ پرداختی" strong>
                  {formatPrice(order.total)}
                </Row>
              </div>
            </dl>
          </section>

          {order.note ? (
            <section className="rounded-lg border border-border bg-surface p-4">
              <h2 className="mb-2 text-sm font-bold text-ink">توضیحات</h2>
              <p className="text-sm text-ink-muted">{order.note}</p>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
