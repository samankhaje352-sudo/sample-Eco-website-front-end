"use client";

import { Circle, CircleCheck } from "lucide-react";
import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
}

export function Checkbox({ label, className, ...rest }: CheckboxProps) {
  return (
    <label className={cn("flex min-h-10 cursor-pointer items-center gap-2.5 text-sm text-ink", className)}>
      <input
        type="checkbox"
        className="size-5 shrink-0 rounded-sm border-border-strong accent-[var(--accent)]"
        {...rest}
      />
      {label}
    </label>
  );
}

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** Labelled on/off switch row (label at start, track at end). */
export function Switch({ checked, onCheckedChange, label, disabled, className }: SwitchProps) {
  const id = useId();
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <span id={id} className="text-sm text-ink">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-accent" : "bg-border-strong",
        )}
      >
        <span
          className={cn(
            "absolute start-0.5 top-0.5 size-5 rounded-full bg-surface shadow-card transition-transform duration-200 ease-out-soft",
            checked && "-translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

export interface RadioCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> {
  children: ReactNode;
  className?: string;
}

/** Selectable card (address picker). Pass name, value, checked, onChange like a radio input. */
export function RadioCard({ children, className, ...rest }: RadioCardProps) {
  return (
    <label className="group/radio relative block cursor-pointer">
      <input type="radio" className="peer sr-only" {...rest} />
      <span
        className={cn(
          "block rounded-lg border border-border bg-surface p-4 transition-colors duration-150 hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft/50 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
          className,
        )}
      >
        {children}
      </span>
      <Circle
        className="absolute end-4 top-4 size-5 text-border-strong peer-checked:hidden"
        strokeWidth={1.75}
        aria-hidden
      />
      <CircleCheck
        className="absolute end-4 top-4 hidden size-5 text-accent peer-checked:block"
        strokeWidth={1.75}
        aria-hidden
      />
    </label>
  );
}
