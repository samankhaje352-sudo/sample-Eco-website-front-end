import Link from "next/link";
import type { ProductList } from "@/lib/api";
import { formatPrice, toPersianDigits } from "@/lib/format";

/** Plain product list; the designer's cards replace this later. */
export default function ProductListPlain({ products }: { products: ProductList[] }) {
  if (products.length === 0) return <p>محصولی یافت نشد.</p>;
  return (
    <ul className="space-y-2">
      {products.map((p) => (
        <li key={p.id}>
          <Link href={`/products/${p.slug}`}>{p.name}</Link>
          {" — "}
          {p.discount_percent > 0 && (
            <>
              <s>{formatPrice(p.price)}</s> ({toPersianDigits(p.discount_percent)}٪){" "}
            </>
          )}
          {formatPrice(p.final_price)}
          {!p.is_available && " (ناموجود)"}
        </li>
      ))}
    </ul>
  );
}
