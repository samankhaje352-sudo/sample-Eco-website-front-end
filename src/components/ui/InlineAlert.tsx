import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type AlertKind = "info" | "error" | "success" | "warning";

const KINDS: Record<AlertKind, { cls: string; icon: LucideIcon }> = {
  info: { cls: "bg-accent-soft text-accent-strong", icon: Info },
  error: { cls: "bg-danger-soft text-danger", icon: CircleAlert },
  success: { cls: "bg-success-soft text-success", icon: CircleCheck },
  warning: { cls: "bg-warning-soft text-warning", icon: TriangleAlert },
};

export interface InlineAlertProps {
  kind?: AlertKind;
  /** Overrides the default icon of the kind. */
  icon?: LucideIcon;
  children: ReactNode;
  /** Trailing content, e.g. a retry or remove button. */
  action?: ReactNode;
  className?: string;
}

export default function InlineAlert({ kind = "info", icon, children, action, className }: InlineAlertProps) {
  const k = KINDS[kind];
  const Icon = icon ?? k.icon;
  return (
    <div
      role={kind === "error" ? "alert" : undefined}
      className={cn("flex items-start gap-2 rounded-md px-3 py-2.5 text-sm", k.cls, className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
      {action}
    </div>
  );
}
