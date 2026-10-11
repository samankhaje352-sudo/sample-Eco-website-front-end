import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Page container (DESIGN.md 2.4): every route content sits in one. */
export default function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-page px-4 md:px-6 lg:px-8", className)} {...rest} />;
}
