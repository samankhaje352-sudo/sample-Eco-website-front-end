"use client";

import { Heart, Menu, Package, Search, ShoppingBag, Truck, UserRound, X, ChevronLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useCategories } from "@/components/useCategories";
import { Button, Container, Drawer, controlClasses } from "@/components/ui";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="pointer-events-none absolute -end-0.5 -top-0.5 h-5 min-w-5 rounded-full bg-primary px-1 text-center text-[11px] font-bold leading-5 text-primary-contrast ring-2 ring-surface tabular-nums">
      {count > 99 ? "۹۹+" : toPersianDigits(count)}
    </span>
  );
}

function IconLink({ href, label, icon: Icon, count = 0 }: { href: string; label: string; icon: LucideIcon; count?: number }) {
  return (
    <div className="relative">
      <Button variant="ghost" iconOnly href={href} aria-label={label}>
        <Icon />
      </Button>
      <CountBadge count={count} />
    </div>
  );
}

function SearchForm({ initial, className, autoFocus, h }: { initial: string; className?: string; autoFocus?: boolean; h: 10 | 11 }) {
  const router = useRouter();
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  }
  return (
    <form role="search" onSubmit={onSubmit} className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
        strokeWidth={1.75}
        aria-hidden
      />
      <input
        key={initial}
        name="q"
        type="search"
        defaultValue={initial}
        autoFocus={autoFocus}
        enterKeyHint="search"
        autoComplete="off"
        placeholder="جستجو در محصولات"
        aria-label="جستجو"
        className={controlClasses({
          height: h,
          className: "ps-10 border-transparent bg-surface-muted hover:border-border-strong",
        })}
      />
    </form>
  );
}

function HeaderInner() {
  const pathname = usePathname();
  const params = useSearchParams();
  const categories = useCategories();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const authed = useAuthStore((s) => !!s.access);
  const hydrated = useAuthStore((s) => s.hydrated);
  const cartCount = useCartStore((s) => s.itemsCount());
  useCartStore((s) => s.cart);
  useCartStore((s) => s.guestItems);
  const wishCount = useWishlistStore((s) => s.ids.length);
  const cartN = hydrated ? cartCount : 0;
  const wishN = hydrated && authed ? wishCount : 0;
  const loggedIn = hydrated && authed;

  const activeCategory = pathname === "/products" ? params.get("category") : null;
  const onDiscount = pathname === "/products" && params.get("ordering") === "discount" && !activeCategory;
  const onBlog = pathname.startsWith("/blog");
  const query = pathname === "/products" ? (params.get("search") ?? "") : "";

  // Close overlays on navigation.
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const navLink =
    "inline-flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors duration-150 hover:bg-surface-muted";
  const cartLabel = `سبد خرید${cartN > 0 ? `، ${toPersianDigits(cartN)} کالا` : ""}`;
  const wishLabel = `علاقه‌مندی‌ها${wishN > 0 ? `، ${toPersianDigits(wishN)} کالا` : ""}`;

  return (
    <>
      <div className="bg-primary text-xs text-primary-contrast">
        <Container className="flex h-9 items-center justify-center gap-2">
          <Truck className="size-4" strokeWidth={1.75} aria-hidden />
          <span>ارسال رایگان برای خریدهای بالای ۱ میلیون تومان</span>
        </Container>
      </div>

      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-sm">
        <Container className="flex h-14 items-center gap-3 lg:h-16 lg:gap-6">
          <Button
            variant="ghost"
            iconOnly
            className="lg:hidden"
            aria-label="منو"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </Button>
          <Logo />

          <nav aria-label="دسته‌بندی‌ها" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {categories.map((c) => {
                const active = activeCategory === c.slug;
                return (
                  <li key={c.id}>
                    <Link
                      href={`/products?category=${c.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={cn(navLink, active ? "bg-accent-soft text-accent-strong" : "text-ink")}
                    >
                      {c.name}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/products?ordering=discount"
                  aria-current={onDiscount ? "page" : undefined}
                  className={cn(navLink, "text-sale", onDiscount && "bg-sale-soft")}
                >
                  تخفیف‌ها
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  aria-current={onBlog ? "page" : undefined}
                  className={cn(navLink, onBlog ? "bg-accent-soft text-accent-strong" : "text-ink")}
                >
                  وبلاگ
                </Link>
              </li>
            </ul>
          </nav>

          <SearchForm initial={query} h={10} className="ms-auto hidden w-full max-w-sm lg:block" />

          <div className="ms-auto flex items-center gap-1 lg:ms-0">
            <Button
              variant="ghost"
              iconOnly
              className="lg:hidden"
              aria-label="جستجو"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((o) => !o)}
            >
              <Search />
            </Button>
            <ThemeToggle />
            <div className="hidden lg:block">
              <IconLink href="/profile/wishlist" label={wishLabel} icon={Heart} count={wishN} />
            </div>
            {loggedIn ? (
              <div className="hidden lg:block">
                <IconLink href="/profile" label="حساب کاربری" icon={UserRound} />
              </div>
            ) : (
              <div className="mx-1 hidden lg:block">
                <Button variant="secondary" size="sm" href="/login">
                  ورود | ثبت‌نام
                </Button>
              </div>
            )}
            <IconLink href="/cart" label={cartLabel} icon={ShoppingBag} count={cartN} />
          </div>
        </Container>

        {searchOpen && (
          <div className="z-30 border-t border-border bg-surface px-4 py-2 lg:hidden">
            <div className="flex items-center gap-2">
              <SearchForm initial={query} h={11} autoFocus className="flex-1" />
              <Button variant="ghost" iconOnly aria-label="بستن جستجو" onClick={() => setSearchOpen(false)}>
                <X />
              </Button>
            </div>
          </div>
        )}
      </header>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} labelledBy="menu-title" className="flex flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <span id="menu-title" className="sr-only">
            منو
          </span>
          <Logo />
          <Button variant="ghost" iconOnly aria-label="بستن" onClick={() => setMenuOpen(false)}>
            <X />
          </Button>
        </div>
        <nav aria-label="منو" className="flex-1 overflow-y-auto py-2">
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <MenuRow href={`/products?category=${c.slug}`}>{c.name}</MenuRow>
                {c.children.length > 0 && (
                  <ul className="pb-1 ps-8 text-sm text-ink-muted">
                    {c.children.map((ch) => (
                      <li key={ch.id}>
                        <Link
                          href={`/products?category=${ch.slug}`}
                          className="flex h-10 items-center pe-4 hover:text-ink"
                        >
                          {ch.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li>
              <MenuRow href="/products?ordering=discount" className="text-sale">
                تخفیف‌ها
              </MenuRow>
            </li>
            <li>
              <MenuRow href="/blog">وبلاگ</MenuRow>
            </li>
          </ul>
          <ul className="my-2 border-t border-border pt-2">
            <li>
              <MenuRow href="/profile/wishlist" icon={Heart}>
                علاقه‌مندی‌ها
              </MenuRow>
            </li>
            <li>
              <MenuRow href="/profile/orders" icon={Package}>
                سفارش‌های من
              </MenuRow>
            </li>
            <li>
              {loggedIn ? (
                <MenuRow href="/profile" icon={UserRound}>
                  حساب کاربری
                </MenuRow>
              ) : (
                <MenuRow href="/login" icon={UserRound}>
                  ورود | ثبت‌نام
                </MenuRow>
              )}
            </li>
          </ul>
        </nav>
      </Drawer>
    </>
  );
}

function MenuRow({ href, children, icon: Icon, className }: { href: string; children: React.ReactNode; icon?: LucideIcon; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-12 items-center justify-between gap-3 px-4 text-base font-medium text-ink hover:bg-surface-muted",
        className,
      )}
    >
      <span className="flex items-center gap-3">
        {Icon && <Icon className="size-5 text-ink-muted" strokeWidth={1.75} aria-hidden />}
        {children}
      </span>
      <ChevronLeft className="size-4 text-ink-muted" strokeWidth={1.75} aria-hidden />
    </Link>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="h-[5.75rem] border-b border-border bg-surface lg:h-[6.25rem]" />}>
      <HeaderInner />
    </Suspense>
  );
}
