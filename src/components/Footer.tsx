"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useCategories } from "@/components/useCategories";
import { Container } from "@/components/ui";

const link = "text-sm text-ink-muted transition-colors duration-150 hover:text-ink";

export default function Footer() {
  const categories = useCategories();
  return (
    <footer className="mt-16 border-t border-border bg-surface-muted">
      <Container className="grid gap-8 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">لباس روزمره، دوخت درست.</p>
          <p className="mt-4 text-sm">
            پشتیبانی:{" "}
            <a dir="ltr" href="tel:02191004827" className="font-medium">
              ۰۲۱-۹۱۰۰۴۸۲۷
            </a>
          </p>
          <p className="text-sm text-ink-muted">شنبه تا پنجشنبه، ساعت ۹ تا ۱۸</p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-sm font-bold text-ink">دسته‌بندی‌ها</h2>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/products?category=${c.slug}`} className={link}>
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products?ordering=discount" className={link}>
                  تخفیف‌ها
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-bold text-ink">خدمات مشتریان</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/profile/orders" className={link}>
                  پیگیری سفارش
                </Link>
              </li>
              <li>
                <Link href="/cart" className={link}>
                  سبد خرید
                </Link>
              </li>
              <li>
                <Link href="/profile" className={link}>
                  حساب کاربری
                </Link>
              </li>
              <li>
                <Link href="/profile/addresses" className={link}>
                  آدرس‌ها
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
      <div className="border-t border-border py-4 text-center text-xs text-ink-muted">
        © ۱۴۰۵ پود. همه حقوق محفوظ است.
      </div>
    </footer>
  );
}
