import { Phone, Plus } from "lucide-react";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

interface FaqItem {
  q: string;
  a: string;
  link?: { href: string; label: string };
}

/** Facts here must match the store policy shown elsewhere (header strip, PDP, checkout). */
const FAQ: FaqItem[] = [
  {
    q: "هزینه‌ی ارسال چقدر است؟",
    a: "برای خریدهای بالای ۱ میلیون تومان ارسال رایگان است. برای سفارش‌های کمتر از این مبلغ، هزینه‌ی ارسال ثابت و ۵۰ هزار تومان است.",
  },
  {
    q: "اگر سایز اندازه نبود، چه کار کنم؟",
    a: "تا ۷ روز پس از تحویل می‌توانید لباس را با سایز دیگری از همان محصول تعویض کنید. برای درخواست تعویض با پشتیبانی تماس بگیرید.",
    link: { href: "/blog/how-to-choose-clothing-size", label: "راهنمای انتخاب سایز" },
  },
  {
    q: "پرداخت چطور انجام می‌شود؟",
    a: "پرداخت آنلاین و از طریق درگاه بانکی انجام می‌شود. بعد از ثبت سفارش به صفحه‌ی درگاه منتقل می‌شوید و با کارت بانکی پرداخت می‌کنید.",
  },
  {
    q: "امکان مرجوع کردن لباس هست؟",
    a: "اگر لباس آسیب دیده یا با سفارش شما فرق دارد، با پشتیبانی تماس بگیرید تا موضوع را بررسی کنیم. اگر فقط سایز اندازه نیست، از تعویض سایز استفاده کنید.",
  },
  {
    q: "سفارشم را کجا پیگیری کنم؟",
    a: "در حساب کاربری، بخش «سفارش‌های من» وضعیت هر سفارش را می‌بینید.",
    link: { href: "/profile/orders", label: "پیگیری سفارش" },
  },
];

/** Home FAQ: native <details> accordion plus FAQPage structured data. */
export default function Faq() {
  return (
    <section className="py-10 md:py-16" aria-labelledby="faq-title">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "fa-IR",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <div className="grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-4">
          <h2 id="faq-title" className="text-xl font-bold text-ink md:text-2xl">
            پرسش‌های پرتکرار
          </h2>
          <p className="mt-3 max-w-sm text-base text-ink-muted">
            جواب کوتاه سؤال‌هایی که بیشتر از ما می‌پرسند. اگر جوابتان اینجا نبود، با ما تماس بگیرید.
          </p>
          <a
            href="tel:02191004827"
            className="mt-6 flex w-fit items-center gap-3 rounded-lg border border-border bg-surface p-4 transition-colors duration-150 hover:border-border-strong"
          >
            <span className="grid size-10 place-items-center rounded-md bg-accent-soft text-accent-strong">
              <Phone className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="text-sm">
              <span dir="ltr" className="block font-bold text-ink">
                ۰۲۱-۹۱۰۰۴۸۲۷
              </span>
              <span className="text-ink-muted">شنبه تا پنجشنبه، ساعت ۹ تا ۱۸</span>
            </span>
          </a>
        </div>

        <div className="faq flex flex-col gap-3 md:col-span-8">
          {FAQ.map((f, i) => (
            <details
              key={f.q}
              className="group rounded-lg border border-border bg-surface open:border-border-strong"
              open={i === 0}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-5 py-4 text-base font-bold text-ink transition-colors duration-150 hover:text-accent-strong">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-surface-muted text-ink transition-transform duration-200 ease-out-soft group-open:rotate-45">
                  <Plus className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm leading-7 text-ink-muted">
                <p className="max-w-prose">{f.a}</p>
                {f.link && (
                  <Link
                    href={f.link.href}
                    className="mt-2 inline-block font-medium text-accent transition-colors duration-150 hover:text-accent-strong"
                  >
                    {f.link.label}
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
