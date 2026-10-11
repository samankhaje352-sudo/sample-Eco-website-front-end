"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Button, Container, Skeleton, useToast } from "@/components/ui";
import { toPersianDigits } from "@/lib/format";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

function Result() {
  const sp = useSearchParams();
  const toast = useToast();
  const order = sp.get("order");
  const paramSuccess = sp.get("status") === "success";
  const hydrated = useAuthStore((s) => s.hydrated);
  const authed = useAuthStore((s) => !!s.access);
  const refreshCart = useCartStore((s) => s.refresh);

  // null while verifying. The query string alone is not trusted when the order can be read.
  const [success, setSuccess] = useState<boolean | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (authed) void refreshCart();
    if (!order || !authed) {
      setSuccess(paramSuccess);
      return;
    }
    let live = true;
    api.orders
      .get(order)
      .then((o) => live && setSuccess(paramSuccess && o.status !== "pending" && o.status !== "cancelled"))
      .catch(() => live && setSuccess(paramSuccess));
    return () => { live = false; };
  }, [hydrated, authed, order, paramSuccess, refreshCart]);

  async function retry() {
    if (!order) return;
    setRetrying(true);
    try {
      const { payment_url } = await api.orders.pay(order);
      window.location.href = payment_url;
    } catch (err) {
      toast.error(err instanceof ApiError && err.status !== 0
        ? err.message
        : "ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
      setRetrying(false);
    }
  }

  const card = "mx-auto flex max-w-md flex-col items-center gap-3 rounded-lg border border-border bg-surface p-6 text-center md:p-8";

  if (success === null) {
    return (
      <div role="status" className={card}>
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <p className="text-sm text-ink-muted">در حال بررسی وضعیت پرداخت</p>
      </div>
    );
  }

  const orderBox = order ? (
    <div className="mt-2 flex w-full justify-between rounded-md bg-surface-muted px-4 py-3 text-sm">
      <span>شماره سفارش</span>
      <span dir="ltr" className="font-bold">{toPersianDigits(order)}</span>
    </div>
  ) : null;

  return success ? (
    <div className={card}>
      <div className="grid size-16 place-items-center rounded-full bg-success-soft text-success">
        <CircleCheck className="size-8" strokeWidth={1.75} aria-hidden />
      </div>
      <h1 className="text-xl font-bold text-ink md:text-2xl">پرداخت با موفقیت انجام شد</h1>
      <p className="text-sm text-ink-muted">سفارش شما ثبت شد و به‌زودی آماده‌سازی می‌شود.</p>
      {orderBox}
      <div className="mt-4 grid w-full gap-3">
        <Button href={order ? `/profile/orders/${encodeURIComponent(order)}` : "/profile/orders"} size="lg" fullWidth>
          مشاهده سفارش
        </Button>
        <Button href="/" variant="ghost" fullWidth>بازگشت به فروشگاه</Button>
      </div>
    </div>
  ) : (
    <div className={card}>
      <div className="grid size-16 place-items-center rounded-full bg-danger-soft text-danger">
        <CircleX className="size-8" strokeWidth={1.75} aria-hidden />
      </div>
      <h1 className="text-xl font-bold text-ink md:text-2xl">پرداخت ناموفق بود</h1>
      <p className="text-sm text-ink-muted">
        اگر مبلغی از حساب شما کسر شده باشد، حداکثر تا ۷۲ ساعت آینده بازگردانده می‌شود.
      </p>
      {orderBox}
      <div className="mt-4 grid w-full gap-3">
        {order ? (
          <Button size="lg" fullWidth loading={retrying} onClick={() => void retry()}>
            {retrying ? "در حال انتقال به درگاه" : "تلاش دوباره"}
          </Button>
        ) : (
          <Button href="/checkout" size="lg" fullWidth>تلاش دوباره</Button>
        )}
        <Button href="/cart" variant="ghost" fullWidth>بازگشت به سبد خرید</Button>
      </div>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Container className="pt-12 pb-16 md:pt-20">
      <Suspense fallback={null}>
        <Result />
      </Suspense>
    </Container>
  );
}
