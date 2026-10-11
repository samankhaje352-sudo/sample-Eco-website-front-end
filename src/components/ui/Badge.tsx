import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeKind = "neutral" | "accent" | "sale" | "success" | "warning" | "danger";

const KINDS: Record<BadgeKind, string> = {
  neutral: "bg-surface-muted text-ink",
  accent: "bg-accent-soft text-accent-strong",
  sale: "bg-sale text-sale-contrast font-bold tabular-nums h-5 px-1.5",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  kind?: BadgeKind;
}

export default function Badge({ kind = "neutral", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-sm px-2 text-xs font-medium",
        KINDS[kind],
        className,
      )}
      {...rest}
    />
  );
}
