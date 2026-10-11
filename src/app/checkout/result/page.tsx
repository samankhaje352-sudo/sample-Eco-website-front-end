"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useEffect } from "react";

function Result() {
  const sp = useSearchParams();
  const order = sp.get("order");
  const success = sp.get("status") === "success";
  const refreshCart = useCartStore((s) => s.refresh);
  useEffect(() => { void refreshCart(); }, [refreshCart]);

  return (
    <div className="space-y-2">
      <h1 className="font-bold">{success ? "پرداخت موفق بود" : "پرداخت انجام نشد"}</h1>
      {order && <p>شماره سفارش: {order}</p>}
      {order && <Link href={`/profile/orders/${order}`}>مشاهده سفارش</Link>}
      {!success && <p>می‌توانید از صفحه سفارش دوباره پرداخت کنید.</p>}
    </div>
  );
}

export default function CheckoutResultPage() {
  return <Suspense fallback={null}><Result /></Suspense>;
}
