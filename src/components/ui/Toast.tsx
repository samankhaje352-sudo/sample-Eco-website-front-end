"use client";

import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import Button from "./Button";

export type ToastKind = "success" | "error" | "info";

export interface ToastAction {
  label: string;
  href: string;
}

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
  action?: ToastAction;
}

export interface ToastApi {
  success: (message: string, opts?: { action?: ToastAction }) => void;
  error: (message: string, opts?: { action?: ToastAction }) => void;
  info: (message: string, opts?: { action?: ToastAction }) => void;
}

const noop = () => {};
const ToastContext = createContext<ToastApi>({ success: noop, error: noop, info: noop });

/** `const toast = useToast(); toast.success("به سبد خرید اضافه شد.", { action: { label: "مشاهده سبد", href: "/cart" } })` */
export function useToast(): ToastApi {
  return useContext(ToastContext);
}

const ICONS = {
  success: { Icon: CircleCheck, cls: "text-success" },
  error: { Icon: CircleAlert, cls: "text-danger" },
  info: { Icon: Info, cls: "text-accent" },
} as const;

function ToastView({ item, onClose }: { item: ToastItem; onClose: (id: number) => void }) {
  const [entered, setEntered] = useState(false);
  const { Icon, cls } = ICONS[item.kind];

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    const timer = setTimeout(() => onClose(item.id), item.kind === "error" ? 6000 : 4000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [item.id, item.kind, onClose]);

  return (
    <div
      role={item.kind === "error" ? "alert" : "status"}
      aria-live={item.kind === "error" ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-ink shadow-pop transition duration-200 ease-out-soft",
        entered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      )}
    >
      <Icon className={cn("size-5 shrink-0", cls)} strokeWidth={1.75} aria-hidden />
      <p className="min-w-0 flex-1">{item.message}</p>
      {item.action && (
        <Button variant="link" size="sm" href={item.action.href} onClick={() => onClose(item.id)}>
          {item.action.label}
        </Button>
      )}
      <Button variant="ghost" size="sm" iconOnly aria-label="بستن" onClick={() => onClose(item.id)} className="-m-2">
        <X />
      </Button>
    </div>
  );
}

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const close = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const api = useMemo<ToastApi>(() => {
    const push = (kind: ToastKind) => (message: string, opts?: { action?: ToastAction }) =>
      setItems((l) => [...l.slice(-2), { id: nextId++, kind, message, action: opts?.action }]);
    return { success: push("success"), error: push("error"), info: push("info") };
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col gap-2 pb-[env(safe-area-inset-bottom)] md:inset-x-auto md:bottom-6 md:end-6 md:w-96 [&>*]:pointer-events-auto">
        {items.map((t) => (
          <ToastView key={t.id} item={t} onClose={close} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
