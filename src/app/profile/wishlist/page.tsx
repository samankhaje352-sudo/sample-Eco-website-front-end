"use client";

import { useEffect, useState } from "react";
import { api, type ProductList } from "@/lib/api";
import ProductListPlain from "@/components/ProductList";
import { useRequireAuth } from "@/components/useRequireAuth";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function WishlistPage() {
  const ready = useRequireAuth();
  const [items, setItems] = useState<ProductList[] | null>(null);
  const ids = useWishlistStore((s) => s.ids); // refetch when toggled elsewhere
  const toggle = useWishlistStore((s) => s.toggle);

  useEffect(() => {
    if (ready) api.wishlist.list().then(setItems).catch(() => setItems([]));
  }, [ready, ids.length]);

  if (!ready || !items) return <p>در حال بارگذاری…</p>;
  return (
    <div className="space-y-2">
      <h1 className="font-bold">علاقه‌مندی‌ها</h1>
      <ProductListPlain products={items} />
      <ul>
        {items.map((p) => (
          <li key={p.id}>{p.name} <button type="button" onClick={() => toggle(p.id)}>حذف</button></li>
        ))}
      </ul>
    </div>
  );
}
