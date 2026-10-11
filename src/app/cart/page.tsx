"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore, useCartView } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { formatPrice, toPersianDigits } from "@/lib/format";

export default function CartPage() {
  const view = useCartView();
  const hydrated = useAuthStore((s) => s.hydrated);
  const { update, remove, applyCoupon, removeCoupon, error, loading } = useCartStore();
  const [code, setCode] = useState("");

  if (!hydrated) return <p>در حال بارگذاری…</p>;
  if (view.lines.length === 0) return <p>سبد خرید خالی است.</p>;

  return (
    <div className="space-y-4">
      <h1 className="font-bold">سبد خرید</h1>
      <ul className="space-y-2">
        {view.lines.map((l) => (
          <li key={l.variant_id}>
            <Link href={`/products/${l.product_slug}`}>{l.product_name}</Link> — {l.size} / {l.color_name} —{" "}
            {formatPrice(l.unit_price)} ×{" "}
            <button type="button" disabled={loading} onClick={() => update(l.variant_id, l.quantity - 1)}>-</button>{" "}
            {toPersianDigits(l.quantity)}{" "}
            <button type="button" disabled={loading} onClick={() => update(l.variant_id, l.quantity + 1)}>+</button>{" "}
            = {formatPrice(l.line_total)}{" "}
            <button type="button" disabled={loading} onClick={() => remove(l.variant_id)}>حذف</button>
          </li>
        ))}
      </ul>

      <div>
        {view.coupon ? (
          <p>کد {view.coupon.code}: {view.coupon.description}{" "}
            <button type="button" onClick={() => removeCoupon()}>حذف کد</button></p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); void applyCoupon(code.trim()); }}>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="کد تخفیف" className="border" />{" "}
            <button className="border px-2">اعمال</button>
          </form>
        )}
        {error && <p role="alert">{error}</p>}
      </div>

      <dl>
        <dt>جمع کل کالاها</dt><dd>{formatPrice(view.subtotal)}</dd>
        {!view.isGuest && (
          <>
            <dt>تخفیف</dt><dd>{formatPrice(view.discount)}</dd>
            <dt>هزینه ارسال</dt><dd>{formatPrice(view.shipping_fee)}</dd>
            <dt>قابل پرداخت</dt><dd>{formatPrice(view.total)}</dd>
          </>
        )}
      </dl>
      <Link href="/checkout" className="border px-2">ادامه و پرداخت</Link>
    </div>
  );
}
