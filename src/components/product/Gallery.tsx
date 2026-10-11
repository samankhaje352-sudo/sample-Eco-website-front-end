"use client";

import { Shirt } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";

export interface GalleryImage {
  id: number | string;
  url: string;
  alt: string;
}

const SIZES = "(min-width:1024px) 55vw, 100vw";

/** Swipeable (scroll-snap) image gallery with synced thumbnails. */
export default function Gallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const railRef = useRef<HTMLUListElement>(null);
  const slideRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const n = images.length;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || n < 2) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(slideRefs.current.indexOf(e.target as HTMLLIElement));
        }
      },
      { root: rail, threshold: 0.6 },
    );
    slideRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [n]);

  function go(i: number) {
    setCurrent(i);
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    slideRefs.current[i]?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", inline: "start", block: "nearest" });
  }

  if (n === 0) {
    return (
      <div className="-mx-4 grid aspect-[4/5] place-items-center overflow-hidden bg-surface-muted md:mx-0 md:rounded-lg">
        <Shirt className="size-10 text-ink-subtle" strokeWidth={1.75} aria-hidden />
      </div>
    );
  }

  return (
    <div>
      <div className="-mx-4 overflow-hidden rounded-none md:mx-0 md:rounded-lg">
        <ul ref={railRef} className="rail flex snap-x snap-mandatory overflow-x-auto bg-surface-muted">
          {images.map((img, i) => (
            <li
              key={img.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="relative aspect-[4/5] w-full shrink-0 snap-center"
            >
              <Image
                src={img.url}
                alt={img.alt || name}
                fill
                priority={i === 0}
                sizes={SIZES}
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
      {n > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              aria-pressed={i === current}
              aria-label={`تصویر ${toPersianDigits(i + 1)} از ${toPersianDigits(n)}`}
              onClick={() => go(i)}
              className={cn(
                "relative aspect-[4/5] w-16 overflow-hidden rounded-md bg-surface-muted md:w-20",
                i === current ? "ring-2 ring-accent" : "ring-1 ring-border",
              )}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
