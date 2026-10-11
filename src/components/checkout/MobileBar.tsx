import type { ReactNode } from "react";
import { formatPrice } from "@/lib/format";

/** Sticky bottom bar shown below lg: total plus the page CTA. */
export default function MobileBar({ total, children }: { total: number; children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-border bg-surface px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      <div>
        <p className="text-xs text-ink-muted">مبلغ قابل پرداخت</p>
        <p className="text-base font-bold tabular-nums">{formatPrice(total)}</p>
      </div>
      {children}
    </div>
  );
}
