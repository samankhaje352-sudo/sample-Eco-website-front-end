"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { toPersianDigits } from "@/lib/format";

export default function Header() {
  const authed = useAuthStore((s) => !!s.access);
  const hydrated = useAuthStore((s) => s.hydrated);
  const count = useCartStore((s) => s.itemsCount());
  // subscribe to inputs so the count re-renders
  useCartStore((s) => s.cart);
  useCartStore((s) => s.guestItems);

  return (
    <header className="border-b p-4">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-4">
        <Link href="/" className="font-bold">فروشگاه</Link>
        <Link href="/products">محصولات</Link>
        <span className="flex-1" />
        <Link href="/cart">سبد خرید ({toPersianDigits(hydrated ? count : 0)})</Link>
        {hydrated && authed ? (
          <Link href="/profile">حساب من</Link>
        ) : (
          <Link href="/login">ورود</Link>
        )}
      </nav>
    </header>
  );
}
