"use client";

import { use, useEffect, useState } from "react";
import { api, ApiError, type OrderDetail } from "@/lib/api";
import { useRequireAuth } from "@/components/useRequireAuth";
import { formatPrice, toPersianDigits } from "@/lib/format";

export default function OrderPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = use(params);
  const ready = useRequireAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready) api.orders.get(number).then(setOrder).catch((e) =>
      setError(e instanceof ApiError ? e.message : "خطایی رخ داد."));
  }, [ready, number]);

  async function pay() {
    try {
      const { payment_url } = await api.orders.pay(number);
      window.location.assign(payment_url);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "خطایی رخ داد.");
    }
  }

  if (error) return <p role="alert">{error}</p>;
  if (!ready || !order) return <p>در حال بارگذاری…</p>;
  return (
    <div className="space-y-2">
      <h1 className="font-bold">سفارش {order.number}</h1>
      <p>{order.status_display} — {order.created_at_jalali}</p>
      <ul>
        {order.items.map((i, idx) => (
          <li key={idx}>
            {i.product_name} — {i.size} / {i.color_name} — {toPersianDigits(i.quantity)} × {formatPrice(i.unit_price)} = {formatPrice(i.line_total)}
          </li>
        ))}
      </ul>
      <p>جمع کالاها: {formatPrice(order.subtotal)}</p>
      <p>تخفیف: {formatPrice(order.discount)}{order.coupon_code && ` (${order.coupon_code})`}</p>
      <p>ارسال: {formatPrice(order.shipping_fee)}</p>
      <p>مبلغ کل: {formatPrice(order.total)}</p>
      <p>آدرس: {order.address.province}، {order.address.city}، {order.address.address_line}</p>
      {order.status === "pending" && <button type="button" className="border px-2" onClick={pay}>پرداخت</button>}
    </div>
  );
}
