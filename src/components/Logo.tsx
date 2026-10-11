import Link from "next/link";
import { cn } from "@/lib/cn";

/** Brand lockup: «پ» tile plus the wordmark. Links to the home page. */
export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="پود، صفحه اصلی" className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-7 place-items-center rounded-md bg-primary text-base font-black text-primary-contrast">
        پ
      </span>
      <span className="text-xl font-black text-ink">پود</span>
    </Link>
  );
}
