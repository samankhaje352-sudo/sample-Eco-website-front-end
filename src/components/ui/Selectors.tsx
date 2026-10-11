import { Minus, Plus, Trash2 } from "lucide-react";
import type { Color } from "@/lib/api";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";

export interface ColorDotsProps {
  colors: Color[];
  className?: string;
}

/** Read-only color dots for product cards. Renders nothing for 0 or 1 color. */
export function ColorDots({ colors, className }: ColorDotsProps) {
  if (colors.length < 2) return null;
  const shown = colors.slice(0, 4);
  const rest = colors.length - shown.length;
  return (
    <span
      className={cn("flex items-center gap-1.5", className)}
      role="img"
      aria-label={`رنگ‌ها: ${colors.map((c) => c.name).join("، ")}`}
    >
      {shown.map((c) => (
        <span
          key={c.slug}
          className="size-3 rounded-full ring-1 ring-inset ring-ink/15"
          style={{ backgroundColor: c.hex }}
        />
      ))}
      {rest > 0 && <span className="text-xs text-ink-muted">+{toPersianDigits(rest)}</span>}
    </span>
  );
}

export interface ColorSwatchProps {
  color: Color;
  selected?: boolean;
  /** All variants of this color are out of stock (still clickable). */
  unavailable?: boolean;
  /** "md" (size-9) for the product page, "sm" (size-8) for filters. */
  size?: "md" | "sm";
  onClick?: () => void;
  className?: string;
}

export function ColorSwatch({ color, selected = false, unavailable, size = "md", onClick, className }: ColorSwatchProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={color.name}
      title={color.name}
      onClick={onClick}
      style={{ backgroundColor: color.hex }}
      className={cn(
        "relative rounded-full ring-1 ring-inset ring-ink/15 transition-shadow duration-150 aria-pressed:outline-2 aria-pressed:outline-offset-2 aria-pressed:outline-accent",
        size === "md" ? "size-9" : "size-8",
        unavailable &&
          "opacity-40 after:absolute after:inset-x-1 after:top-1/2 after:h-px after:-rotate-45 after:bg-ink",
        className,
      )}
    />
  );
}

export interface SizeChipProps {
  size: string;
  selected?: boolean;
  soldOut?: boolean;
  /** Smaller chip used in the filter panel (h-9 min-w-11). */
  compact?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SizeChip({ size, selected = false, soldOut, compact, onClick, className }: SizeChipProps) {
  const label = /^\d+$/.test(size) ? toPersianDigits(size) : size;
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-disabled={soldOut || undefined}
      aria-label={soldOut ? `سایز ${label}، ناموجود` : undefined}
      onClick={soldOut ? undefined : onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-3 text-sm font-medium tabular-nums transition-colors duration-150",
        compact ? "h-9 min-w-11" : "h-10 min-w-12",
        soldOut
          ? "cursor-not-allowed border-border bg-surface-muted text-ink-subtle line-through"
          : selected
            ? "border-primary bg-primary text-primary-contrast"
            : "border-border-strong bg-surface text-ink hover:border-ink",
        className,
      )}
    >
      {label}
    </button>
  );
}

export interface QtyStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  /** Variant stock. */
  max?: number;
  /** Cart mode: at min, the minus button becomes a trash button that calls onRemove. */
  onRemove?: () => void;
  /** Request pending: dims and blocks input. */
  pending?: boolean;
  className?: string;
}

export function QtyStepper({ value, onChange, min = 1, max, onRemove, pending, className }: QtyStepperProps) {
  const atMin = value <= min;
  const atMax = max !== undefined && value >= max;
  const btn =
    "grid size-10 place-items-center text-ink hover:bg-surface-muted disabled:text-ink-subtle disabled:hover:bg-transparent disabled:cursor-not-allowed";
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center rounded-md border border-border-strong bg-surface",
        pending && "pointer-events-none opacity-60",
        className,
      )}
    >
      <button
        type="button"
        className={cn(btn, "rounded-s-md")}
        aria-label="افزایش تعداد"
        disabled={atMax}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" strokeWidth={1.75} />
      </button>
      <span className="w-10 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {toPersianDigits(value)}
      </span>
      {atMin && onRemove ? (
        <button type="button" className={cn(btn, "rounded-e-md")} aria-label="حذف از سبد" onClick={onRemove}>
          <Trash2 className="size-4" strokeWidth={1.75} />
        </button>
      ) : (
        <button
          type="button"
          className={cn(btn, "rounded-e-md")}
          aria-label="کاهش تعداد"
          disabled={atMin}
          onClick={() => onChange(value - 1)}
        >
          <Minus className="size-4" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}
