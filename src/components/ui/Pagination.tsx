import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import Button from "./Button";

export interface PaginationProps {
  /** Current page, 1-based. */
  page: number;
  pageCount: number;
  /** Link mode: build the href of a page (keeps the page crawlable). */
  hrefFor?: (page: number) => string;
  /** Button mode: used when hrefFor is not given. */
  onPageChange?: (page: number) => void;
  className?: string;
}

function pageList(page: number, last: number): (number | "gap")[] {
  const set = new Set([1, page - 1, page, page + 1, last].filter((n) => n >= 1 && n <= last));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

function PageItem({ n, current, href, onClick }: { n: number; current: boolean; href?: string; onClick?: () => void }) {
  const cls = cn(
    "inline-grid size-10 place-items-center rounded-md text-sm font-medium tabular-nums transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    current ? "bg-primary text-primary-contrast" : "text-ink hover:bg-surface-muted",
  );
  const common = {
    className: cls,
    "aria-current": current ? ("page" as const) : undefined,
    "aria-label": `صفحه ${toPersianDigits(n)}`,
  };
  return href ? (
    <Link href={href} {...common}>
      {toPersianDigits(n)}
    </Link>
  ) : (
    <button type="button" onClick={onClick} {...common}>
      {toPersianDigits(n)}
    </button>
  );
}

export default function Pagination({ page, pageCount, hrefFor, onPageChange, className }: PaginationProps) {
  if (pageCount <= 1) return null;
  const go = (p: number) => (hrefFor ? { href: hrefFor(p) } : { onClick: () => onPageChange?.(p) });
  const hasPrev = page > 1;
  const hasNext = page < pageCount;

  return (
    <nav aria-label="صفحه‌بندی" className={cn("mt-12 flex items-center justify-center gap-1.5", className)}>
      <Button
        variant="secondary"
        size="sm"
        iconStart={<ChevronRight />}
        className={cn(!hasPrev && "invisible")}
        tabIndex={hasPrev ? undefined : -1}
        aria-hidden={hasPrev ? undefined : true}
        {...go(page - 1)}
      >
        قبلی
      </Button>

      <span className="px-3 text-sm text-ink-muted md:hidden">
        صفحه {toPersianDigits(page)} از {toPersianDigits(pageCount)}
      </span>

      <ul className="hidden items-center gap-1.5 md:flex">
        {pageList(page, pageCount).map((n, i) =>
          n === "gap" ? (
            <li key={`gap-${i}`} className="px-1 text-ink-muted" aria-hidden>
              …
            </li>
          ) : (
            <li key={n}>
              <PageItem n={n} current={n === page} {...go(n)} />
            </li>
          ),
        )}
      </ul>

      <Button
        variant="secondary"
        size="sm"
        iconEnd={<ChevronLeft />}
        className={cn(!hasNext && "invisible")}
        tabIndex={hasNext ? undefined : -1}
        aria-hidden={hasNext ? undefined : true}
        {...go(page + 1)}
      >
        بعدی
      </Button>
    </nav>
  );
}
