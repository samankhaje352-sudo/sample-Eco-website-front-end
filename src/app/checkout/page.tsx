"use client";

import { LockKeyhole, Plus, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError, type Address } from "@/lib/api";
import {
  Button, Container, InlineAlert, RadioCard, Skeleton, Textarea, useToast,
} from "@/components/ui";
import AddressForm from "@/components/checkout/AddressForm";
import AddressMeta from "@/components/checkout/AddressMeta";
import LineThumb from "@/components/checkout/LineThumb";
import MobileBar from "@/components/checkout/MobileBar";
import OrderTotals from "@/components/checkout/OrderTotals";
import { useRequireAuth } from "@/components/useRequireAuth";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { useCartStore, useCartView } from "@/stores/cartStore";

export default function CheckoutPage() {
  const ready = useRequireAuth();
  const router = useRouter();
  const toast = useToast();
  const view = useCartView();
  const serverCart = useCartStore((s) => s.cart);
  const refreshCart = useCartStore((s) => s.refresh);

  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [note, setNote] = useState("");
  const [addressError, setAddressError] = useState("");
  const [payError, setPayError] = useState("");
  const [busy, setBusy] = useState(false);
  const addressSection = useRef<HTMLElement>(null);

  const load = useCallback(async () => {
    setLoadFailed(false);
    try {
      const list = await api.addresses.list();
      setAddresses(list);
      setSelected((cur) => cur ?? list[0]?.id ?? null);
    } catch {
      setLoadFailed(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    void refreshCart();
    void load();
  }, [ready, load, refreshCart]);

  const cartLoaded = ready && !!serverCart;
  const cartEmpty = cartLoaded && view.lines.length === 0;
  useEffect(() => {
    if (cartEmpty && !busy) router.replace("/cart");
  }, [cartEmpty, busy, router]);

  async function pay() {
    setPayError("");
    if (selected === null) {
      setAddressError("لطفاً یک آدرس انتخاب کنید.");
      addressSection.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setBusy(true);
    try {
      const { payment_url } = await api.orders.create(selected, note.trim() || undefined);
      window.location.href = payment_url;
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) toast.error("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
      else setPayError(err instanceof ApiError ? err.message : "خطایی رخ داد. لطفاً دوباره تلاش کنید.");
      setBusy(false);
    }
  }

  if (!ready || !cartLoaded || cartEmpty) {
    return (
      <Container className="pt-6 pb-16 md:pt-10">
        <div role="status" aria-label="در حال بارگذاری" className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
          </div>
          <Skeleton className="h-72 rounded-lg lg:col-span-4" />
        </div>
      </Container>
    );
  }

  const noAddresses = addresses !== null && addresses.length === 0;
  const showForm = formOpen || noAddresses;

  return (
    <Container className="pt-6 pb-24 md:pt-10 lg:pb-16">
      <h1 className="text-2xl font-bold text-ink md:text-3xl">تکمیل خرید</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <section ref={addressSection} aria-labelledby="addr-title">
            <h2 id="addr-title" className="mb-4 text-lg font-bold text-ink">آدرس تحویل</h2>

            {loadFailed ? (
              <InlineAlert
                kind="error"
                action={
                  <Button variant="secondary" size="sm" iconStart={<RotateCw />} onClick={() => void load()}>
                    تلاش دوباره
                  </Button>
                }
              >
                بارگذاری اطلاعات با خطا مواجه شد.
              </InlineAlert>
            ) : addresses === null ? (
              <div role="status" aria-label="در حال بارگذاری" className="grid gap-3 md:grid-cols-2">
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
              </div>
            ) : (
              <>
                {addresses.length > 0 && (
                  <div role="radiogroup" aria-label="آدرس تحویل" className="grid gap-3 md:grid-cols-2">
                    {addresses.map((a) => (
                      <RadioCard
                        key={a.id} name="address" value={a.id} checked={selected === a.id}
                        onChange={() => { setSelected(a.id); setAddressError(""); }}
                      >
                        <p className="pe-8 text-sm font-bold text-ink">{a.title}</p>
                        <AddressMeta address={a} />
                      </RadioCard>
                    ))}
                  </div>
                )}
                {addressError && (
                  <InlineAlert kind="error" className="mt-3">{addressError}</InlineAlert>
                )}
                {!showForm && (
                  <Button variant="secondary" iconStart={<Plus />} className="mt-4" onClick={() => setFormOpen(true)}>
                    افزودن آدرس جدید
                  </Button>
                )}
                {showForm && (
                  <div className={addresses.length > 0 ? "mt-4" : undefined}>
                    <AddressForm
                      onSaved={(a) => {
                        setAddresses((list) => [...(list ?? []), a]);
                        setSelected(a.id);
                        setAddressError("");
                        setFormOpen(false);
                      }}
                      onCancel={noAddresses ? undefined : () => setFormOpen(false)}
                    />
                  </div>
                )}
              </>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ink">توضیحات سفارش</h2>
            <Textarea
              label="توضیحات" optional value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="اگر نکته‌ای برای ارسال دارید، اینجا بنویسید."
            />
          </section>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="text-base font-bold text-ink">خلاصه سفارش</h2>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto">
              {view.lines.map((l) => (
                <li key={l.variant_id} className="flex gap-3">
                  <LineThumb src={l.image} alt="" sizes="56px" className="w-14" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm text-ink">{l.product_name}</p>
                    <p className="text-xs text-ink-muted">
                      {toPersianDigits(l.quantity)} عدد، سایز {/^\d+$/.test(l.size) ? toPersianDigits(l.size) : l.size}
                    </p>
                  </div>
                  <span className="text-sm font-medium tabular-nums">{formatPrice(l.line_total)}</span>
                </li>
              ))}
            </ul>
            <div className="my-5 border-t border-border" />
            <OrderTotals view={view} />
            {payError && <InlineAlert kind="error" className="mt-4">{payError}</InlineAlert>}
            <Button
              size="lg" fullWidth className="mt-5 hidden lg:flex" iconStart={<LockKeyhole />}
              loading={busy} onClick={() => void pay()}
            >
              {busy ? "در حال انتقال به درگاه" : "پرداخت"}
            </Button>
            <p className="mt-3 text-center text-xs text-ink-muted">
              پس از کلیک، به درگاه پرداخت بانکی منتقل می‌شوید.
            </p>
          </div>
        </aside>
      </div>

      <MobileBar total={view.total}>
        <Button iconStart={<LockKeyhole />} loading={busy} onClick={() => void pay()}>
          {busy ? "در حال انتقال" : "پرداخت"}
        </Button>
      </MobileBar>
    </Container>
  );
}
