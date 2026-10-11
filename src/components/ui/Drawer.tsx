"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** "start" = side drawer from the start (right in RTL) edge; "bottom" = bottom sheet. */
  side?: "start" | "bottom";
  /** id of the element that titles the dialog (or use ariaLabel). */
  labelledBy?: string;
  ariaLabel?: string;
  /** Extra classes for the panel (e.g. "flex flex-col"). */
  className?: string;
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const PANEL = {
  start: {
    cls: "inset-y-0 start-0 w-[82vw] max-w-80",
    hidden: "translate-x-full",
    shown: "translate-x-0",
  },
  bottom: {
    cls: "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-lg",
    hidden: "translate-y-full",
    shown: "translate-y-0",
  },
} as const;

/**
 * Shared dialog shell: backdrop, slide animation, focus trap, Escape, body scroll lock and
 * focus return. Used by the header menu and the catalog filter sheet.
 */
export default function Drawer({
  open,
  onClose,
  side = "start",
  labelledBy,
  ariaLabel,
  className,
  children,
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  // Mount, then animate in; animate out, then unmount.
  useEffect(() => {
    if (open) {
      returnTo.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const timer = setTimeout(() => {
      setMounted(false);
      returnTo.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, [open]);

  // Scroll lock while visible.
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  // Move focus into the panel once it is open.
  useEffect(() => {
    if (!shown) return;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();
  }, [shown]);

  if (!mounted) return null;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!nodes || nodes.length === 0) {
      e.preventDefault();
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const p = PANEL[side];
  return createPortal(
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-overlay transition-opacity duration-300",
          shown ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : ariaLabel}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={cn(
          "fixed z-50 bg-surface shadow-pop outline-none transition-transform duration-300 ease-out-soft",
          p.cls,
          shown ? p.shown : p.hidden,
          className,
        )}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
