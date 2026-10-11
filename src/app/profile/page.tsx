"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/components/useRequireAuth";
import { useAuthStore } from "@/stores/authStore";
import { toPersianDigits } from "@/lib/format";

export default function ProfilePage() {
  const ready = useRequireAuth();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  if (!ready) return <p>در حال بارگذاری…</p>;

  return (
    <div className="space-y-2">
      <h1 className="font-bold">حساب من</h1>
      <p>{[user?.first_name, user?.last_name].filter(Boolean).join(" ") || "—"}</p>
      <p dir="ltr" className="text-right">{user ? toPersianDigits(user.phone) : ""}</p>
      <ul>
        <li><Link href="/profile/orders">سفارش‌ها</Link></li>
        <li><Link href="/profile/wishlist">علاقه‌مندی‌ها</Link></li>
        <li><Link href="/profile/addresses">آدرس‌ها</Link></li>
      </ul>
      <button type="button" className="border px-2" onClick={() => { logout(); router.replace("/"); }}>خروج</button>
    </div>
  );
}
