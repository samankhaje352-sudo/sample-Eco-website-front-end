"use client";

import { ChevronDown, CircleAlert } from "lucide-react";
import { useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/** Shared wrapper props. Input, Textarea and Select all accept these directly. */
export interface FieldMeta {
  label?: ReactNode;
  /** Appends the muted «(اختیاری)» marker to the label. Required fields carry no marker. */
  optional?: boolean;
  helper?: ReactNode;
  error?: ReactNode;
  wrapperClassName?: string;
}

export interface FieldProps extends FieldMeta {
  /** Id of the control inside, used for the label and message ids. */
  id: string;
  children: ReactNode;
}

/** Label + control + helper + error. Use directly only for custom controls. */
export function Field({ id, label, optional, helper, error, wrapperClassName, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {optional && <span className="font-normal text-ink-muted"> (اختیاری)</span>}
        </label>
      ) : null}
      {children}
      {helper ? (
        <p id={`${id}-help`} className="text-xs text-ink-muted">
          {helper}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-err`} className="flex items-center gap-1.5 text-sm text-danger">
          <CircleAlert className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}

const CONTROL =
  "w-full rounded-md border bg-surface px-3 text-base text-ink placeholder:text-ink-subtle transition-colors duration-150 hover:border-ink-muted focus-visible:outline-none focus-visible:ring-3 disabled:bg-surface-muted disabled:text-ink-muted disabled:cursor-not-allowed";
const OK = "border-border-strong focus-visible:border-accent focus-visible:ring-accent/20";
const BAD = "border-danger hover:border-danger focus-visible:border-danger focus-visible:ring-danger/20";
const HEIGHTS = { 9: "h-9", 10: "h-10", 11: "h-11", 14: "h-14" } as const;
export type ControlHeight = keyof typeof HEIGHTS;

function describedBy(id: string, helper: ReactNode, error: ReactNode) {
  const ids = [helper ? `${id}-help` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ");
  return ids || undefined;
}

/** Class string of a text control, for custom inputs (e.g. the header search). */
export function controlClasses(opts: { height?: ControlHeight; invalid?: boolean; className?: string } = {}) {
  return cn(CONTROL, opts.invalid ? BAD : OK, HEIGHTS[opts.height ?? 11], opts.className);
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "height">, FieldMeta {
  /** Control height in Tailwind units. Default 11 (44px). */
  h?: ControlHeight;
}

export function Input({
  label, optional, helper, error, wrapperClassName, h = 11, className, id, ...rest
}: InputProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field id={fid} label={label} optional={optional} helper={helper} error={error} wrapperClassName={wrapperClassName}>
      <input
        id={fid}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fid, helper, error)}
        className={controlClasses({ height: h, invalid: !!error, className })}
        {...rest}
      />
    </Field>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldMeta {}

export function Textarea({
  label, optional, helper, error, wrapperClassName, className, id, ...rest
}: TextareaProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field id={fid} label={label} optional={optional} helper={helper} error={error} wrapperClassName={wrapperClassName}>
      <textarea
        id={fid}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fid, helper, error)}
        className={cn(CONTROL, error ? BAD : OK, "h-auto min-h-28 resize-y py-2.5 leading-7", className)}
        {...rest}
      />
    </Field>
  );
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">, FieldMeta {
  h?: ControlHeight;
}

/** Native select. Pass <option> elements as children. */
export function Select({
  label, optional, helper, error, wrapperClassName, h = 11, className, id, children, ...rest
}: SelectProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field id={fid} label={label} optional={optional} helper={helper} error={error} wrapperClassName={wrapperClassName}>
      <div className="relative">
        <select
          id={fid}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fid, helper, error)}
          className={controlClasses({ height: h, invalid: !!error, className: cn("appearance-none pe-10", className) })}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
    </Field>
  );
}
