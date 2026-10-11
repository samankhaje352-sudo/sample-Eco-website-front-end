"use client";

import { RotateCw, ShoppingBag, TicketPercent, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Button, CartLineSkeleton, Container, EmptyState, InlineAlert, Input, QtyStepper, useToast,
} from "@/components/ui";
import LineThumb from "@/components/checkout/LineThumb";
import MobileBar from "@/components/checkout/MobileBar";
import OrderTotals from "@/components/checkout/OrderTotals";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore, useCartView } from "@/stores/cartStore";

const FREE_SHIPPING_FROM = 1_000_000;
const LOGIN_FOR_CHECKOUT = "/login?next=/checkout";

export default function CartPage() {
  const toast = useToast();
  const view = useCartView();
  const hydrated = useAuthStore((s) => s.hydrated);
  const authed = useAuthStore((s) => !!s.access);
  const serverCart = useCartStore((s) => s.cart);
  const loading = useCartStore((s) => s.loading);
  const storeError = useCartStore((s) => s.error);
  const { update, remove, applyCoupon, removeCoupon, refresh } = useCartStore.getState();
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const [pending, setPending] = useState<number | null>(null);

  // A logged-in user's cart is unknown until the server answers.
  const waiting = !hydrated || (authed && !serverCart && !storeError);
  const failed = authed && !serverCart && !!storeError;

  async function changeQty(variantId: number, qty: number) {
    setPending(variantId);
    const ok = await update(variantId, qty);
    setPending(null);
    if (!ok) toast.error(useCartStore.getState().error ?? "خطایی رخ داد.");
  }

  async function removeLine(variantId: number) {
    setPending(variantId);
    const ok = await remove(variantId);
    setPending(null);
    if (ok) toast.success("از سبد خرید حذف شد.");
    else toast.error(useCartStore.getState().error ?? "خطایی رخ داد.");
  }

  async function submitCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setCouponError("");
    setCouponBusy(true);
    const ok = await applyCoupon(code.trim());
    setCouponBusy(false);
    if (ok) setCode("");
    else setCouponError("کد تخفیف معتبر نیست.");
  }

  if (waiting) {
    return (
      <Container className="pt-6 pb-16 md:pt-10">
        <div role="status" aria-label="در حال بارگذاری" className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
          {[0, 1, 2].map((i) => <CartLineSkeleton key={i} />)}
        </div>
      </Container>
    );
  }

  if (failed) {
    return (
      <Container className="max-w-xl pt-6 pb-16 md:pt-10">
        <InlineAlert
          kind="error"
          action={
            <Button variant="secondary" size="sm" iconStart={<RotateCw />} onClick={() => void refresh()}>
              تلاش دوباره
            </Button>
          }
        >
          بارگذاری اطلاعات با خطا مواجه شد.
        </InlineAlert>
      </Container>
    );
  }

  if (view.lines.length === 0) {
    return (
      <Container className="pt-6 pb-16 md:pt-10">
        <EmptyState
          icon={ShoppingBag}
          title="سبد خرید شما خالی است"
          body="محصولات دلخواهتان را پیدا کنید و به سبد اضافه کنید."
          action={<Button href="/products">مشاهده محصولات</Button>}
        />
      </Container>
    );
  }

  const remaining = FREE_SHIPPING_FROM - view.subtotal;
  const ctaHref = view.isGuest ? LOGIN_FOR_CHECKOUT : "/checkout";

  return (
    <Container className="pt-6 pb-24 md:pt-10 lg:pb-16">
      <h1 className="text-2xl font-bold text-ink md:text-3xl">
        سبد خرید
        <span className="ms-2 text-base font-normal text-ink-muted">({toPersianDigits(view.items_count)} کالا)</span>
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          {remaining > 0 ? (
            <InlineAlert kind="info" icon={Truck}>{formatPrice(remaining)} تا ارسال رایگان باقی مانده است.</InlineAlert>
          ) : (
            <InlineAlert kind="success" icon={Truck}>ارسال این سفارش رایگان است.</InlineAlert>
          )}

          <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
            {view.lines.map((l) => (
              <li key={l.variant_id} className="flex gap-4 p-4">
                <Link href={`/products/${l.product_slug}`} className="shrink-0" tabIndex={-1} aria-hidden>
                  <LineThumb src={l.image} alt="" sizes="96px" className="w-20 md:w-24" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link href={`/products/${l.product_slug}`} className="line-clamp-2 text-sm font-medium text-ink hover:text-accent-strong">
                    {l.product_name}
                  </Link>
                  <p className="flex flex-wrap gap-x-3 text-xs text-ink-muted">
                    <span>رنگ: {l.color_name}</span>
                    <span>سایز: {/^\d+$/.test(l.size) ? toPersianDigits(l.size) : l.size}</span>
                  </p>
                  <p className="text-xs text-ink-muted">قیمت واحد: {formatPrice(l.unit_price)}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                    <QtyStepper
                      value={l.quantity}
                      max={l.stock}
                      pending={pending === l.variant_id || loading}
                      onChange={(q) => void changeQty(l.variant_id, q)}
                      onRemove={() => void removeLine(l.variant_id)}
                    />
                    <span className="text-sm font-bold tabular-nums">{formatPrice(l.line_total)}</span>
                  </div>
                </div>
                <Button
                  variant="danger-ghost" size="sm" iconOnly className="self-start"
                  aria-label={`حذف ${l.product_name} از سبد`}
                  disabled={pending === l.variant_id}
                  onClick={() => void removeLine(l.variant_id)}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-surface p-5">
            {view.isGuest ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">کد تخفیف</span>
                <InlineAlert kind="info" icon={TicketPercent}>
                  برای استفاده از کد تخفیف{" "}
                  <Link href="/login?next=/cart" className="font-medium underline underline-offset-4">وارد شوید</Link>.
                </InlineAlert>
              </div>
            ) : view.coupon ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">کد تخفیف</span>
                <InlineAlert
                  kind="success"
                  icon={TicketPercent}
                  action={
                    <Button variant="link" size="sm" className="text-danger hover:text-danger" disabled={loading}
                      onClick={() => void removeCoupon()}>
                      حذف کد
                    </Button>
                  }
                >
                  کد {view.coupon.code} اعمال شد. {view.coupon.description}
                </InlineAlert>
              </div>
            ) : (
              <form onSubmit={submitCoupon} className="flex flex-col gap-1.5">
                <label htmlFor="coupon" className="text-sm font-medium text-ink">کد تخفیف</label>
                <div className="flex gap-2">
                  <Input
                    id="coupon" wrapperClassName="flex-1" dir="ltr" autoComplete="off"
                    value={code} error={couponError || undefined}
                    onChange={(e) => { setCode(e.target.value); setCouponError(""); }}
                  />
                  <Button type="submit" variant="secondary" loading={couponBusy} className="shrink-0">
                    {couponBusy ? "در حال بررسی" : "اعمال"}
                  </Button>
                </div>
              </form>
            )}

            <div className="my-5 border-t border-border" />
            <OrderTotals view={view} />

            <Button href={ctaHref} size="lg" fullWidth className="mt-5 hidden lg:flex">
              ادامه فرایند خرید
            </Button>
            {view.isGuest && (
              <p className="mt-3 text-center text-xs text-ink-muted">
                برای ثبت سفارش، وارد حساب کاربری خود شوید.
              </p>
            )}
          </div>
        </aside>
      </div>

      <MobileBar total={view.total}>
        <Button href={ctaHref}>ادامه فرایند خرید</Button>
      </MobileBar>
    </Container>
  );
}
