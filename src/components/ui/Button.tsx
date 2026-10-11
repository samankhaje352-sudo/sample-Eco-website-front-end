import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger-ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner in place of iconStart, sets aria-busy and disables the button. */
  loading?: boolean;
  fullWidth?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  /** Square round button; children is the icon and `aria-label` is required. */
  iconOnly?: boolean;
  /** When set, renders a next/link anchor with identical classes. */
  href?: string;
}

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[color,background-color,border-color,transform] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50";
const PRESS = "active:scale-[0.98] disabled:active:scale-100";

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm rounded-md [&_svg]:size-4",
  md: "h-11 px-5 text-sm rounded-md [&_svg]:size-5",
  lg: "h-12 px-6 text-base rounded-md [&_svg]:size-5",
};
const ICON_ONLY: Record<ButtonSize, string> = {
  sm: "size-9 p-0 rounded-full [&_svg]:size-5",
  md: "size-11 p-0 rounded-full [&_svg]:size-5",
  lg: "size-12 p-0 rounded-full [&_svg]:size-5",
};
const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-contrast hover:bg-primary-hover",
  secondary: "bg-surface text-ink border border-border-strong hover:bg-surface-muted",
  ghost: "bg-transparent text-ink hover:bg-surface-muted",
  "danger-ghost": "bg-transparent text-danger hover:bg-danger-soft",
  link: "h-auto px-0 text-accent underline-offset-4 hover:underline hover:text-accent-strong [&_svg]:size-4",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
  iconOnly,
  className,
}: Pick<ButtonProps, "variant" | "size" | "fullWidth" | "iconOnly" | "className">): string {
  const isLink = variant === "link";
  return cn(
    BASE,
    !isLink && PRESS,
    isLink ? (size === "lg" ? "text-base" : "text-sm") : iconOnly ? ICON_ONLY[size] : SIZES[size],
    VARIANTS[variant],
    fullWidth && "w-full",
    className,
  );
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth,
  iconStart,
  iconEnd,
  iconOnly,
  href,
  className,
  children,
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  const classes = buttonClasses({ variant, size, fullWidth, iconOnly, className });
  const spinner = <Loader2 className="size-4 motion-safe:animate-spin" strokeWidth={1.75} />;
  const content = iconOnly ? (
    loading ? spinner : children
  ) : (
    <>
      {loading ? spinner : iconStart}
      {children}
      {iconEnd}
    </>
  );

  if (href !== undefined) {
    return (
      <Link
        href={href}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={disabled || loading || undefined}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
}
