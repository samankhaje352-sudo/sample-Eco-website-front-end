import { ArrowLeft, RefreshCcw, RotateCw, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { api, type HomeData, type ProductList } from "@/lib/api";
import { cn } from "@/lib/cn";
import ProductGrid from "@/components/ProductGrid";
import DiscountRail from "@/components/product/DiscountRail";
import { Button, Container, InlineAlert, SectionHeader } from "@/components/ui";

export const dynamic = "force-dynamic"; // do not require the API at build time

const HERO_SLOTS = [
  { cls: "end-[6%] top-0 w-[46%]", sizes: "(min-width:768px) 28vw, 46vw" },
  { cls: "start-[8%] top-[10%] w-[32%]", sizes: "(min-width:768px) 18vw, 30vw" },
  { cls: "start-[30%] bottom-0 z-10 w-[28%]", sizes: "(min-width:768px) 18vw, 30vw" },
];

function HeroVisual({ products }: { products: ProductList[] }) {
  const shown = products.filter((p) => p.main_image).slice(0, 3);
  if (shown.length === 0) return null;
  const single = shown.length < 3;
  return (
    <div className="relative mt-8 aspect-[5/4] md:mt-0 md:aspect-[6/5]">
      <div className="absolute inset-x-0 inset-y-[8%] rounded-lg bg-accent-soft" aria-hidden />
      {(single ? shown.slice(0, 1) : shown).map((p, i) => (
        <Link
          key={p.id}
          href={`/products/${p.slug}`}
          className={cn(
            "absolute block aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted shadow-card transition-transform duration-200 motion-safe:hover:-translate-y-1",
            single ? "start-1/2 top-0 w-[46%] -translate-x-1/2 rtl:translate-x-1/2" : HERO_SLOTS[i].cls,
          )}
        >
          <Image
            src={p.main_image!}
            alt={p.name}
            fill
            priority={i === 0}
            sizes={HERO_SLOTS[i].sizes}
            className="object-cover"
          />
        </Link>
      ))}
    </div>
  );
}

const TILES = [
  "bg-primary text-primary-contrast hover:bg-primary-hover",
  "bg-accent-soft text-ink",
  "bg-surface-muted text-ink",
];

function CategoryBento({ categories }: { categories: HomeData["categories"] }) {
  const cats = categories.slice(0, 3);
  if (cats.length === 0) return null;
  return (
    <section className="py-10 md:py-16">
      <SectionHeader title="خرید بر اساس دسته‌بندی" />
      <div className="grid grid-cols-2 gap-3 md:h-[28rem] md:grid-cols-3 md:grid-rows-2 md:gap-5">
        {cats.map((c, i) => (
          <Link
            key={c.id}
            href={`/products?category=${c.slug}`}
            className={cn(
              "group relative flex flex-col justify-between overflow-hidden rounded-lg p-5 transition-colors md:p-7",
              TILES[i],
              i === 0 ? "col-span-2 min-h-56 md:col-span-2 md:row-span-2" : "col-span-1 min-h-40",
            )}
          >
            {c.image && (
              <Image
                src={c.image}
                alt=""
                width={400}
                height={500}
                sizes="30vw"
                className="absolute bottom-0 end-0 z-0 aspect-[4/5] h-[85%] w-auto object-contain"
              />
            )}
            <span className={cn("relative z-10 text-2xl font-extrabold md:text-3xl", i === 0 && "md:text-4xl")}>
              {c.name}
            </span>
            <span className="relative z-10 inline-flex items-center gap-1.5 text-sm font-medium">
              مشاهده محصولات
              <ArrowLeft
                className="size-4 transition-transform duration-200 motion-safe:group-hover:-translate-x-1"
                strokeWidth={1.75}
                aria-hidden
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

const SERVICES = [
  { Icon: Truck, title: "ارسال رایگان", sub: "برای خریدهای بالای ۱ میلیون تومان" },
  { Icon: RefreshCcw, title: "تعویض سایز", sub: "تا ۷ روز پس از تحویل" },
  { Icon: ShieldCheck, title: "پرداخت امن", sub: "از طریق درگاه بانکی" },
];

export default async function HomePage() {
  let home: HomeData;
  try {
    home = await api.catalog.home({ revalidate: 60 });
  } catch {
    return (
      <Container className="py-10">
        <InlineAlert
          kind="error"
          action={
            <Button variant="secondary" size="sm" href="/" iconStart={<RotateCw />}>
              تلاش دوباره
            </Button>
          }
        >
          بارگذاری اطلاعات با خطا مواجه شد.
        </InlineAlert>
      </Container>
    );
  }

  return (
    <>
      <Container className="pb-10 pt-6 md:pb-16 md:pt-12">
        <div className="md:grid md:grid-cols-12 md:items-center md:gap-8">
          <div className="md:col-span-6 lg:col-span-5">
            <h1 className="text-3xl font-extrabold text-ink md:text-4xl lg:text-5xl">لباسی برای هر روزِ شما</h1>
            <p className="mt-4 max-w-md text-base text-ink-muted md:text-lg">
              مردانه، زنانه و بچگانه با قیمت منصفانه. ارسال رایگان برای خریدهای بالای یک میلیون تومان.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" href="/products?ordering=newest">
                خرید محصولات جدید
              </Button>
              <Button size="lg" variant="secondary" href="/products?ordering=discount">
                مشاهده تخفیف‌ها
              </Button>
            </div>
          </div>
          <div className="md:col-span-6 lg:col-span-7">
            <HeroVisual products={home.new_arrivals} />
          </div>
        </div>
      </Container>

      <Container>
        <CategoryBento categories={home.categories} />

        {home.new_arrivals.length > 0 && (
          <section className="py-10 md:py-16">
            <SectionHeader title="تازه‌ترین‌ها" href="/products?ordering=newest" />
            <ProductGrid
              products={home.new_arrivals.slice(0, 8)}
              layout="home"
              priorityCount={0}
              itemClassName={(i) => (i >= 6 ? "md:hidden xl:block" : undefined)}
            />
          </section>
        )}
      </Container>

      <div className="border-y border-border bg-surface">
        <Container className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-3">
          {SERVICES.map(({ Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon className="size-6 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
              <p className="text-sm">
                <b className="font-bold">{title}</b>
                <br />
                <span className="text-ink-muted">{sub}</span>
              </p>
            </div>
          ))}
        </Container>
      </div>

      {home.discounted.length > 0 && (
        <Container className="py-10 md:py-16">
          <DiscountRail products={home.discounted} />
        </Container>
      )}
    </>
  );
}
