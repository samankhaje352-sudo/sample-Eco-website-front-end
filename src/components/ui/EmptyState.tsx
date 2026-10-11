import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body?: string;
  /** Usually a primary md <Button>. */
  action?: ReactNode;
  /** Tile colors, e.g. error state uses "bg-danger-soft text-danger". */
  tileClassName?: string;
  className?: string;
}

export default function EmptyState({ icon: Icon, title, body, action, tileClassName, className }: EmptyStateProps) {
  return (
    <div className={cn("mx-auto flex max-w-sm flex-col items-center gap-3 px-4 py-16 text-center", className)}>
      <div
        className={cn(
          "grid size-16 place-items-center rounded-full",
          tileClassName ?? "bg-surface-muted text-ink-muted",
        )}
      >
        <Icon className="size-7" strokeWidth={1.75} aria-hidden />
      </div>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      {body ? <p className="text-sm text-ink-muted">{body}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
