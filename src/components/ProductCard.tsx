"use client";

import { Heart, Shirt } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ProductList } from "@/lib/api";
import { cn } from "@/lib/cn";
import { ColorDots, Price } from "@/components/ui";
import { useWishlistStore } from "@/stores/wishlistStore";

export interface ProductCardProps {
  product: ProductList;
  /** Use for the first row of images above the fold. */
  priority?: boolean;
  /** "rail" gives the fixed-width scroll-snap variant for horizontal rails. */
  variant?: "grid" | "rail";
  /** Called after the heart was toggled by a logged-in user; `wished` is the new state. */
  onWishlistChange?: (product: ProductList, wished: boolean) => void;
  className?: string;
}

const SIZES = "(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw";

export default function ProductCard({
  product: p,
  priority,
  variant = "grid",
  onWishlistChange,
  className,
}: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const wished = useWishlistStore((s) => s.ids.includes(p.id));
  const toggle = useWishlistStore((s) => s.toggle);
  const href = `/products/${p.slug}`;

  async function onHeart() {
    const ok = await toggle(p.id);
    if (!ok) {
      const next = pathname + window.location.search;
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    onWishlistChange?.(p, useWishlistStore.getState().has(p.id));
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col",
        variant === "rail" && "w-[44vw] max-w-56 shrink-0 snap-start md:w-60",
        className,
      )}
    >
      <Link href={href} className="well-edge relative block aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted" tabIndex={-1}>
        {p.main_image ? (
          <Image
            src={p.main_image}
            alt={p.name}
            fill
            sizes={variant === "rail" ? "(min-width:768px) 240px, 44vw" : SIZES}
            priority={priority}
            className={cn(
              "object-cover transition-transform duration-500 ease-out-soft motion-safe:group-hover:scale-[1.03]",
              !p.is_available && "opacity-60 grayscale-[30%]",
            )}
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center">
            <Shirt className="size-10 text-ink-subtle" strokeWidth={1.75} />
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={onHeart}
        aria-pressed={wished}
        aria-label={wished ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        className="absolute end-2 top-2 z-10 grid size-9 place-items-center rounded-full bg-surface/90 text-ink shadow-card transition-colors duration-150 hover:bg-surface active:scale-95"
      >
        <Heart className={cn("size-[18px]", wished && "fill-current")} strokeWidth={1.75} />
      </button>

      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-ink-muted">{p.category.name}</span>
          <ColorDots colors={p.colors} />
        </div>
        <h3>
          <Link
            href={href}
            className="line-clamp-2 min-h-12 text-sm font-medium text-ink transition-colors hover:text-accent-strong"
          >
            {p.name}
          </Link>
        </h3>
        <Price
          size="card"
          price={p.price}
          finalPrice={p.final_price}
          discountPercent={p.discount_percent}
          available={p.is_available}
        />
      </div>
    </article>
  );
}
