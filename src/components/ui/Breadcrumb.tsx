import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface BreadcrumbItem {
  label: string;
  /** Omit on the last (current) item. */
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="مسیر" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${i}-${it.label}`} className="flex items-center gap-1.5">
              {last || !it.href ? (
                <span className={cn(last && "line-clamp-1 text-ink")} aria-current={last ? "page" : undefined}>
                  {it.label}
                </span>
              ) : (
                <Link href={it.href} className="hover:text-ink">
                  {it.label}
                </Link>
              )}
              {!last && <ChevronLeft className="size-3.5 text-ink-subtle" strokeWidth={1.75} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
