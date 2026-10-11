"use client";

import { useState } from "react";
import type { ProductDetail } from "@/lib/api";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toPersianDigits } from "@/lib/format";

export default function AddToCart({ product }: { product: ProductDetail }) {
  const inStock = product.variants.filter((v) => v.stock > 0);
  const [variantId, setVariantId] = useState<number | "">(inStock[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const add = useCartStore((s) => s.add);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.ids.includes(product.id));

  async function onAdd() {
    const v = product.variants.find((x) => x.id === variantId);
    if (!v) return;
    const ok = await add({
      variant_id: v.id,
      quantity: qty,
      stock: v.stock,
      product_name: product.name,
      product_slug: product.slug,
      image: product.main_image,
      size: v.size,
      color_name: v.color.name,
      unit_price: product.final_price,
    });
    setMessage(ok ? "به سبد خرید اضافه شد." : useCartStore.getState().error ?? "");
  }

  async function onWish() {
    const ok = await toggleWish(product.id);
    if (!ok) setMessage("برای افزودن به علاقه‌مندی‌ها وارد شوید.");
  }

  if (inStock.length === 0) return <p>ناموجود</p>;
  return (
    <div className="space-y-2">
      <select value={variantId} onChange={(e) => setVariantId(Number(e.target.value))}>
        {inStock.map((v) => (
          <option key={v.id} value={v.id}>
            {v.size} / {v.color.name} (موجودی: {toPersianDigits(v.stock)})
          </option>
        ))}
      </select>{" "}
      <input type="number" min={1} value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-16 border" />{" "}
      <button type="button" onClick={onAdd} className="border px-2">افزودن به سبد</button>{" "}
      <button type="button" onClick={onWish} className="border px-2">
        {wished ? "حذف از علاقه‌مندی" : "علاقه‌مندی"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
