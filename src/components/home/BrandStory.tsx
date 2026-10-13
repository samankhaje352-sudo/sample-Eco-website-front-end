import { Layers, Shirt, Tag } from "lucide-react";

const POINTS = [
  {
    Icon: Shirt,
    title: "اول پارچه، بعد مدل",
    body: "جنس و کاربرد هر لباس در صفحه‌ی همان محصول نوشته شده تا بدانید چه چیزی می‌خرید.",
  },
  {
    Icon: Tag,
    title: "قیمت منصفانه، تخفیف شفاف",
    body: "هر جا تخفیف هست، قیمت قبلی هم کنارش آمده تا خودتان مقایسه کنید.",
  },
  {
    Icon: Layers,
    title: "تکه‌هایی که با هم جور می‌شوند",
    body: "رنگ‌ها و مدل‌ها را ساده نگه داشته‌ایم تا لباس‌های کمدتان راحت با هم ست شوند.",
  },
];

/** Home brand block: what the name means and three concrete promises. */
export default function BrandStory() {
  return (
    <section className="py-10 md:py-16" aria-labelledby="brand-story-title">
      <div className="weave relative overflow-hidden rounded-lg bg-accent-soft p-6 md:p-12">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <p aria-hidden className="text-6xl font-black leading-none text-accent md:text-8xl">
              پود
            </p>
            <h2 id="brand-story-title" className="mt-6 text-2xl font-extrabold leading-[1.5] text-ink md:text-3xl md:leading-[1.5]">
              رشته‌ای که پارچه را نگه می‌دارد
            </h2>
            <p className="mt-4 max-w-md text-base text-ink-muted">
              در بافندگی، پود نخی است که از میان تارها می‌گذرد و پارچه را محکم می‌کند. ما هم همین را
              می‌خواهیم: لباس ساده‌ای که درست دوخته شده و زیاد می‌پوشیدش.
            </p>
          </div>

          <ul className="flex flex-col justify-center gap-4 md:col-span-7">
            {POINTS.map(({ Icon, title, body }) => (
              <li key={title} className="flex items-start gap-4 rounded-lg bg-surface p-5 shadow-card">
                <span className="grid size-11 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-strong">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
