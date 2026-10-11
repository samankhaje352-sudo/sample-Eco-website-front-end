import { formatNumber, formatPrice, toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/cn";
import Badge from "./Badge";

export type PriceSize = "card" | "pdp" | "line";

export interface PriceProps {
  /** Original price. */
  price: number;
  /** Price after discount (equals price when not discounted). */
  finalPrice: number;
  discountPercent: number;
  size?: PriceSize;
  /** false renders «ناموجود» instead of the price. */
  available?: boolean;
  className?: string;
}

const FINAL = {
  card: { sale: "text-sm font-bold text-sale", plain: "text-sm font-bold text-ink" },
  pdp: { sale: "text-2xl font-bold text-sale", plain: "text-2xl font-bold text-ink" },
  line: { sale: "text-sm font-bold text-ink", plain: "text-sm font-bold text-ink" },
};

/** The only way to render a product price (discount, percent badge, sold-out text). */
export default function Price({
  price,
  finalPrice,
  discountPercent,
  size = "card",
  available = true,
  className,
}: PriceProps) {
  const reserve = size === "card" && "min-h-[2.75rem]";
  if (!available) {
    return (
      <div className={cn(reserve, className)}>
        <span className="text-sm font-medium text-ink-muted">ناموجود</span>
      </div>
    );
  }
  const discounted = discountPercent > 0;
  const finalCls = FINAL[size][discounted ? "sale" : "plain"];
  const final =
    size === "line" ? (
      <span className={cn(finalCls, "tabular-nums")}>{formatPrice(finalPrice)}</span>
    ) : (
      <span className={cn(finalCls, "tabular-nums")}>
        {formatNumber(finalPrice)}
        <span className="ms-1 text-xs font-normal text-ink-muted">تومان</span>
      </span>
    );

  if (!discounted) {
    return <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", reserve, className)}>{final}</div>;
  }
  const original = (
    <s
      className={cn(
        "text-ink-subtle tabular-nums",
        size === "pdp" ? "text-sm" : "text-xs",
        size === "card" && "basis-full",
      )}
      aria-label={`قیمت قبل: ${formatPrice(price)}`}
    >
      {formatNumber(price)}
    </s>
  );
  const percent = <Badge kind="sale">{toPersianDigits(discountPercent)}٪</Badge>;
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      {final}
      {size === "pdp" ? (
        <>
          {original}
          {percent}
        </>
      ) : (
        <>
          {percent}
          {original}
        </>
      )}
    </div>
  );
}
