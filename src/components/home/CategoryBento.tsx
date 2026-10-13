import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Category, HomeData } from "@/lib/api";
import { cn } from "@/lib/cn";
import { SectionHeader } from "@/components/ui";

/** Per-tile surface, sub-category chip and image sizing. Tile 1 is the large one. */
const TILES = [
  {
    tile: "bg-primary text-primary-contrast",
    chip: "bg-primary-contrast/10 text-primary-contrast hover:bg-primary-contrast/20",
    img: "h-[78%] md:h-[88%]",
  },
  {
    tile: "bg-accent-soft text-ink",
    chip: "bg-surface/70 text-ink hover:bg-surface",
    img: "h-[62%] md:h-[88%]",
  },
  {
    tile: "bg-surface-muted text-ink",
    chip: "bg-surface text-ink hover:bg-bg",
    img: "h-[62%] md:h-[88%]",
  },
];

/** «پیراهن و تی‌شرت مردانه» under «مردانه» reads better as «پیراهن و تی‌شرت». */
function shortName(child: string, parent: string) {
  const s = child.endsWith(parent) ? child.slice(0, -parent.length).trim() : child;
  return s || child;
}

export default function CategoryBento({
  categories,
  tree,
}: {
  categories: HomeData["categories"];
  /** Full category tree (for sub-category chips); empty when that call failed. */
  tree: Category[];
}) {
  const cats = categories.slice(0, 3);
  if (cats.length === 0) return null;

  return (
    <section className="py-10 md:py-16">
      <SectionHeader title="خرید بر اساس دسته‌بندی" />
      <div className="grid grid-cols-2 gap-3 md:h-[32rem] md:grid-cols-3 md:grid-rows-2 md:gap-5">
        {cats.map((c, i) => {
          const t = TILES[i];
          const big = i === 0;
          const children = tree.find((n) => n.id === c.id)?.children ?? [];
          const href = `/products?category=${c.slug}`;
          return (
            <div
              key={c.id}
              className={cn(
                "group relative isolate flex flex-col overflow-hidden rounded-lg p-5 md:p-7",
                t.tile,
                big ? "col-span-2 min-h-72 md:row-span-2" : "col-span-1 min-h-48 md:min-h-0",
              )}
            >
              {c.image && (
                /* Garment cut-out centred on a light "stage" disc so dark garments never sink into the tile. */
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -z-10 aspect-[4/5] origin-bottom transition-transform duration-500 ease-out-soft motion-safe:group-hover:scale-[1.04]",
                    big ? "bottom-[2%] end-[6%]" : "bottom-[3%] end-[3%]",
                    t.img,
                  )}
                >
                  <span className="absolute inset-x-[6%] top-1/2 aspect-square -translate-y-1/2 rounded-full bg-stage" />
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes={big ? "(min-width:768px) 30vw, 60vw" : "(min-width:768px) 16vw, 30vw"}
                    className="object-contain"
                  />
                </div>
              )}

              {/* Stretched link: the whole tile opens the category; chips sit above it. */}
              <Link
                href={href}
                className="text-2xl font-extrabold after:absolute after:inset-0 after:rounded-lg md:text-3xl"
              >
                <span className={cn(big && "md:text-5xl md:leading-[1.3]")}>{c.name}</span>
              </Link>

              {children.length > 0 && (
                <ul className={cn("relative mt-4 flex max-w-[60%] flex-wrap gap-2", !big && "hidden md:flex")}>
                  {children.map((ch) => (
                    <li key={ch.id}>
                      <Link
                        href={`/products?category=${ch.slug}`}
                        className={cn(
                          "inline-flex h-8 items-center rounded-md px-3 text-xs font-medium transition-colors duration-150",
                          t.chip,
                        )}
                      >
                        {shortName(ch.name, c.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <span
                className={cn(
                  "pointer-events-none mt-auto items-center gap-1.5 pt-6 text-sm font-medium",
                  big ? "inline-flex" : "hidden md:inline-flex",
                )}
              >
                مشاهده محصولات
                <ArrowLeft
                  className="size-4 transition-transform duration-200 motion-safe:group-hover:-translate-x-1"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
