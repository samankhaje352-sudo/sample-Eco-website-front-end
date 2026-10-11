import { Shirt } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/cn";

/** 4:5 product thumbnail. The width comes from className (e.g. "w-20"). */
export default function LineThumb({
  src, alt, sizes, className,
}: { src: string | null; alt: string; sizes: string; className?: string }) {
  return (
    <div className={cn("relative aspect-[4/5] shrink-0 overflow-hidden rounded-md bg-surface-muted", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <div className="grid size-full place-items-center">
          <Shirt className="size-6 text-ink-subtle" strokeWidth={1.75} aria-hidden />
        </div>
      )}
    </div>
  );
}
