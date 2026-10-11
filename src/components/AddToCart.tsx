"use client";

import { Heart, RefreshCcw, ShoppingBag, Truck, TriangleAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import type { Color, ProductDetail } from "@/lib/api";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { Button, ColorSwatch, QtyStepper, SizeChip, useToast } from "@/components/ui";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

const NETWORK_ERROR = "ارتباط با سرور برقرار نشد. دوباره تلاش کنید.";

/** Product page purchase panel: color, size, quantity, add to cart, wishlist. */
export default function AddToCart({ product }: { product: ProductDetail }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const add = useCartStore((s) => s.add);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.ids.includes(product.id));

  const colors = useMemo(() => {
    const seen = new Map<string, Color>();
    for (const v of product.variants) if (!seen.has(v.color.slug)) seen.set(v.color.slug, v.color);
    return [...seen.values()];
  }, [product.variants]);
  const sizes = useMemo(
    () => (product.sizes.length ? product.sizes : [...new Set(product.variants.map((v) => v.size))]),
    [product.sizes, product.variants],
  );

  const stockOf = (size: string, colorSlug: string) =>
    product.variants.find((v) => v.size === size && v.color.slug === colorSlug)?.stock ?? 0;
  const colorHasStock = (slug: string) => product.variants.some((v) => v.color.slug === slug && v.stock > 0);
  const allSoldOut = !product.variants.some((v) => v.stock > 0);

  const [colorSlug, setColorSlug] = useState(
    () => (colors.find((c) => colorHasStock(c.slug)) ?? colors[0])?.slug ?? "",
  );
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [adding, setAdding] = useState(false);
  const sizesRef = useRef<HTMLDivElement>(null);

  const color = colors.find((c) => c.slug === colorSlug);
  const variant = size ? product.variants.find((v) => v.size === size && v.color.slug === colorSlug) : undefined;
  const stock = variant?.stock ?? 0;

  function pickColor(slug: string) {
    setColorSlug(slug);
    if (size && stockOf(size, slug) === 0) setSize(null);
    setQty(1);
  }
  function pickSize(s: string) {
    setSize(s);
    setSizeError(false);
    setQty((q) => Math.min(q, Math.max(1, stockOf(s, colorSlug))));
  }

  async function onAdd() {
    if (!variant || !size) {
      setSizeError(true);
      sizesRef.current?.querySelector<HTMLElement>("button")?.focus();
      return;
    }
    setAdding(true);
    const ok = await add({
      variant_id: variant.id,
      quantity: qty,
      stock: variant.stock,
      product_name: product.name,
      product_slug: product.slug,
      image: product.main_image,
      size: variant.size,
      color_name: variant.color.name,
      unit_price: product.final_price,
    });
    setAdding(false);
    if (ok) {
      toast.success("به سبد خرید اضافه شد.", { action: { label: "مشاهده سبد", href: "/cart" } });
    } else {
      const err = useCartStore.getState().error ?? "";
      toast.error(err.includes("ارتباط با سرور") ? NETWORK_ERROR : "موجودی این کالا کافی نیست.");
    }
  }

  async function onWish() {
    const ok = await toggleWish(product.id);
    if (!ok) router.push(`/login?next=${encodeURIComponent(pathname)}`);
  }

  return (
    <div className="flex flex-col">
      {colors.length > 0 && (
        <div>
          <p className="text-sm">
            رنگ: <span className="font-bold">{color?.name}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-3 p-1">
            {colors.map((c) => (
              <ColorSwatch
                key={c.slug}
                color={c}
                selected={c.slug === colorSlug}
                unavailable={!colorHasStock(c.slug)}
                onClick={() => pickColor(c.slug)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm font-medium">سایز</p>
        <div ref={sizesRef} className="mt-3 flex flex-wrap gap-2">
          {sizes.map((s) => (
            <SizeChip
              key={s}
              size={s}
              selected={s === size}
              soldOut={stockOf(s, colorSlug) === 0}
              onClick={() => pickSize(s)}
            />
          ))}
        </div>
        {sizeError && (
          <p className="mt-2 text-sm text-danger" role="alert">
            لطفاً سایز را انتخاب کنید.
          </p>
        )}
        {variant && stock > 0 && stock <= 3 && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-warning">
            <TriangleAlert className="size-4" strokeWidth={1.75} aria-hidden />
            فقط {toPersianDigits(stock)} عدد باقی مانده
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm font-medium">تعداد</span>
        <QtyStepper value={qty} onChange={setQty} max={variant ? stock : undefined} />
      </div>

      <div className="mt-6 flex gap-3">
        {allSoldOut ? (
          <Button size="lg" className="flex-1" disabled>
            ناموجود
          </Button>
        ) : (
          <Button
            size="lg"
            className="flex-1"
            loading={adding}
            iconStart={<ShoppingBag />}
            onClick={onAdd}
          >
            {adding ? "در حال افزودن" : "افزودن به سبد خرید"}
          </Button>
        )}
        <Button
          variant="secondary"
          size="lg"
          iconOnly
          className="shrink-0 !rounded-md"
          aria-pressed={wished}
          aria-label={wished ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          onClick={onWish}
        >
          <Heart className={cn(wished && "fill-current")} />
        </Button>
      </div>

      <ul className="mt-6 space-y-2 text-sm text-ink-muted">
        <li className="flex items-center gap-2">
          <Truck className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          ارسال رایگان برای خریدهای بالای ۱ میلیون تومان
        </li>
        <li className="flex items-center gap-2">
          <RefreshCcw className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          تعویض سایز تا ۷ روز پس از تحویل
        </li>
      </ul>
    </div>
  );
}
