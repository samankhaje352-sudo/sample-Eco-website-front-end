"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type OrderList } from "@/lib/api";
import { useRequireAuth } from "@/components/useRequireAuth";
import { formatPrice, toPersianDigits } from "@/lib/format";

export default function OrdersPage() {
  const ready = useRequireAuth();
  const [orders, setOrders] = useState<OrderList[] | null>(null);
  useEffect(() => {
    if (ready) api.orders.list().then((r) => setOrders(r.results)).catch(() => setOrders([]));
  }, [ready]);

  if (!ready || !orders) return <p>در حال بارگذاری…</p>;
  if (orders.length === 0) return <p>سفارشی ثبت نشده است.</p>;
  return (
    <div>
      <h1 className="font-bold">سفارش‌ها</h1>
      <ul>
        {orders.map((o) => (
          <li key={o.number}>
            <Link href={`/profile/orders/${o.number}`}>{o.number}</Link> — {o.status_display} —{" "}
            {formatPrice(o.total)} — {o.created_at_jalali} — {toPersianDigits(o.items_count)} کالا
          </li>
        ))}
      </ul>
    </div>
  );
}
