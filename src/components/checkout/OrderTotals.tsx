import { formatPrice } from "@/lib/format";
import type { CartView } from "@/stores/cartStore";

/** Totals rows shared by cart and checkout. Guests only see the subtotal. */
export default function OrderTotals({ view }: { view: CartView }) {
  const row = "flex items-baseline justify-between gap-3";
  const val = "font-medium tabular-nums";
  return (
    <dl className="space-y-3 text-sm">
      <div className={row}>
        <dt>جمع کالاها</dt>
        <dd className={val}>{formatPrice(view.subtotal)}</dd>
      </div>
      {!view.isGuest && view.discount > 0 && (
        <div className={row}>
          <dt>تخفیف</dt>
          <dd className={`${val} text-success`}>{formatPrice(view.discount)}</dd>
        </div>
      )}
      {!view.isGuest && (
        <div className={row}>
          <dt>هزینه ارسال</dt>
          <dd className={view.shipping_fee === 0 ? `${val} text-success` : val}>
            {view.shipping_fee === 0 ? "رایگان" : formatPrice(view.shipping_fee)}
          </dd>
        </div>
      )}
      <div className={`${row} border-t border-border pt-3`}>
        <dt className="text-base font-bold">مبلغ قابل پرداخت</dt>
        <dd className="text-lg font-bold tabular-nums">{formatPrice(view.total)}</dd>
      </div>
    </dl>
  );
}
