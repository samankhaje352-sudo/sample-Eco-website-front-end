"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { ProductList } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Button, SectionHeader } from "@/components/ui";

/** Home «تخفیف‌دارها» scroll-snap rail with desktop prev/next buttons. */
export default function DiscountRail({ products }: { products: ProductList[] }) {
  const ref = useRef<HTMLUListElement>(null);

  function scroll(dir: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // RTL: scrollLeft is negative going toward the end, so "next" (visually left) is negative.
    el.scrollBy({ left: -dir * el.clientWidth * 0.8, behavior: smooth ? "smooth" : "auto" });
  }

  return (
    <>
      <SectionHeader
        title="تخفیف‌دارها"
        href="/products?ordering=discount"
        actions={
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="secondary" size="sm" iconOnly aria-label="قبلی" onClick={() => scroll(-1)}>
              <ChevronRight />
            </Button>
            <Button variant="secondary" size="sm" iconOnly aria-label="بعدی" onClick={() => scroll(1)}>
              <ChevronLeft />
            </Button>
          </div>
        }
      />
      <ul
        ref={ref}
        className="rail -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:gap-5 md:px-0"
      >
        {products.map((p) => (
          <li key={p.id} className="contents">
            <ProductCard product={p} variant="rail" />
          </li>
        ))}
      </ul>
    </>
  );
}
