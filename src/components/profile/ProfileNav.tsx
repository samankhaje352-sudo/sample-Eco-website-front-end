"use client";

import { Heart, LogOut, MapPin, Package, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { useAuthStore } from "@/stores/authStore";
import { useWishlistStore } from "@/stores/wishlistStore";

const ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/profile", label: "اطلاعات حساب", icon: UserRound },
  { href: "/profile/orders", label: "سفارش‌های من", icon: Package },
  { href: "/profile/wishlist", label: "علاقه‌مندی‌ها", icon: Heart },
  { href: "/profile/addresses", label: "آدرس‌ها", icon: MapPin },
];

function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  return () => {
    logout();
    useWishlistStore.getState().clear();
    router.replace("/");
  };
}

export default function ProfileNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const doLogout = useLogout();
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "کاربر پود";
  const isActive = (href: string) =>
    href === "/profile" ? pathname === "/profile" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Desktop */}
      <nav aria-label="حساب کاربری" className="hidden rounded-lg border border-border bg-surface p-2 lg:block">
        <div className="mb-2 border-b border-border px-3 py-3">
          <p className="text-sm font-bold text-ink">{name}</p>
          {user?.phone ? (
            <p dir="ltr" className="text-start text-xs text-ink-muted">
              {toPersianDigits(user.phone)}
            </p>
          ) : null}
        </div>
        <ul className="space-y-1">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
                    active ? "bg-accent-soft font-medium text-accent-strong" : "text-ink hover:bg-surface-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 border-t border-border pt-2">
          <button
            type="button"
            onClick={doLogout}
            className="flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm text-danger transition-colors duration-150 hover:bg-danger-soft"
          >
            <LogOut className="size-5" strokeWidth={1.75} aria-hidden />
            خروج
          </button>
        </div>
      </nav>

      {/* Mobile tabs */}
      <nav
        aria-label="حساب کاربری"
        className="rail -mx-4 mb-6 flex gap-2 overflow-x-auto border-b border-border px-4 pb-3 lg:hidden"
      >
        {ITEMS.map(({ href, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm transition-colors duration-150",
                active
                  ? "border-primary bg-primary text-primary-contrast"
                  : "border-border bg-surface text-ink hover:border-border-strong",
              )}
            >
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={doLogout}
          className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-sm text-danger"
        >
          خروج
        </button>
      </nav>
    </>
  );
}
