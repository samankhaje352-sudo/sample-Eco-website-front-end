"use client";

import { RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type PostList } from "@/lib/api";
import Logo from "@/components/Logo";
import { useCategories } from "@/components/useCategories";
import { Container } from "@/components/ui";

const link = "text-sm text-ink-muted transition-colors duration-150 hover:text-ink";
const heading = "mb-3 text-sm font-bold text-ink";

const PROMISES = [
  { Icon: Truck, text: "ارسال رایگان بالای ۱ میلیون تومان" },
  { Icon: RefreshCcw, text: "تعویض سایز تا ۷ روز" },
  { Icon: ShieldCheck, text: "پرداخت از درگاه بانکی" },
];

/** Latest post titles for the footer; an error just leaves the list with its «همه‌ی مقاله‌ها» link. */
function useLatestPosts(n: number): PostList[] {
  const [posts, setPosts] = useState<PostList[]>([]);
  useEffect(() => {
    let alive = true;
    api.blog
      .posts()
      .then((r) => alive && setPosts(r.results.slice(0, n)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [n]);
  return posts;
}

export default function Footer() {
  const categories = useCategories();
  const posts = useLatestPosts(3);

  return (
    <footer className="mt-16 border-t border-border bg-surface-muted">
      <Container className="grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-7 text-ink-muted">
            لباس روزمره، دوخت درست. پود فروشگاه اینترنتی پوشاک مردانه، زنانه و بچگانه است؛ لباس‌های ساده
            با قیمت منصفانه که هر روز می‌پوشید.
          </p>
          <ul className="mt-5 space-y-2">
            {PROMISES.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-sm text-ink">
                <Icon className="size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
          <div>
            <h2 className={heading}>دسته‌بندی‌ها</h2>
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
            <h2 className={heading}>خدمات مشتریان</h2>
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
          <div className="col-span-2 sm:col-span-1">
            <h2 className={heading}>از وبلاگ</h2>
            <ul className="space-y-2">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link href={`/blog/${p.slug}`} className={`${link} line-clamp-1`}>
                    {p.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/blog" className="text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-strong">
                  همه‌ی مقاله‌ها
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-4 text-xs text-ink-muted sm:flex-row">
          <span>© ۱۴۰۵ پود. همه حقوق محفوظ است.</span>
          <span>
            پشتیبانی:{" "}
            <a dir="ltr" href="tel:02191004827" className="font-medium text-ink">
              ۰۲۱-۹۱۰۰۴۸۲۷
            </a>
            <span className="ms-2">شنبه تا پنجشنبه، ۹ تا ۱۸</span>
          </span>
        </Container>
      </div>
    </footer>
  );
}
