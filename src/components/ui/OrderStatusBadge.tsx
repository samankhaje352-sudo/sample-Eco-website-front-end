import { Clock, CreditCard, PackageCheck, PackageOpen, Truck, CircleX } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { OrderStatus } from "@/lib/api";
import Badge, { type BadgeKind } from "./Badge";

const MAP: Record<OrderStatus, { kind: BadgeKind; icon: LucideIcon; text: string }> = {
  pending: { kind: "warning", icon: Clock, text: "در انتظار پرداخت" },
  paid: { kind: "accent", icon: CreditCard, text: "پرداخت شده" },
  processing: { kind: "neutral", icon: PackageOpen, text: "در حال آماده‌سازی" },
  shipped: { kind: "accent", icon: Truck, text: "ارسال شده" },
  delivered: { kind: "success", icon: PackageCheck, text: "تحویل شده" },
  cancelled: { kind: "danger", icon: CircleX, text: "لغو شده" },
};

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  /** API `status_display`; falls back to the built-in Persian label. */
  label?: string;
  className?: string;
}

export default function OrderStatusBadge({ status, label, className }: OrderStatusBadgeProps) {
  const m = MAP[status] ?? MAP.pending;
  const Icon = m.icon;
  return (
    <Badge kind={m.kind} className={className}>
      <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
      {label || m.text}
    </Badge>
  );
}
