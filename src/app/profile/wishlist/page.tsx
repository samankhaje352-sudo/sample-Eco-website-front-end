"use client";

import { Heart, RotateCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api, type ProductList } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import { ProductGridSkeleton } from "@/components/ProductSkeletons";
import { Button, EmptyState, InlineAlert, useToast } from "@/components/ui";

export default function WishlistPage() {
  const toast = useToast();
  const [items, setItems] = useState<ProductList[] | null>(null);
  const [error, setError] = useState(false);
  const [leaving, setLeaving] = useState<number[]>([]);

  const load = useCallback(() => {
    setError(false);
    setItems(null);
    api.wishlist.list().then(setItems).catch(() => setError(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function onWishlistChange(p: ProductList, wished: boolean) {
    if (wished) {
      setLeaving((l) => l.filter((id) => id !== p.id));
      return;
    }
    setLeaving((l) => [...l, p.id]);
    toast.info("از علاقه‌مندی‌ها حذف شد.");
    setTimeout(() => {
      setItems((cur) => cur && cur.filter((x) => x.id !== p.id));
      setLeaving((l) => l.filter((id) => id !== p.id));
    }, 200);
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink md:text-2xl">علاقه‌مندی‌ها</h1>
      {error ? (
        <InlineAlert
          kind="error"
          action={
            <Button variant="secondary" size="sm" iconStart={<RotateCw />} onClick={load}>
              تلاش دوباره
            </Button>
          }
        >
          بارگذاری اطلاعات با خطا مواجه شد.
        </InlineAlert>
      ) : !items ? (
        <ProductGridSkeleton count={6} layout="three" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="فهرست علاقه‌مندی‌های شما خالی است"
          body="با زدن روی آیکون قلب، محصولات دلخواهتان را اینجا نگه دارید."
          action={<Button href="/products">مشاهده محصولات</Button>}
        />
      ) : (
        <ProductGrid
          products={items}
          layout="three"
          onWishlistChange={onWishlistChange}
          itemClassName={(i) =>
            leaving.includes(items[i]?.id) ? "opacity-0 transition-opacity duration-200" : "transition-opacity duration-200"
          }
        />
      )}
    </div>
  );
}
