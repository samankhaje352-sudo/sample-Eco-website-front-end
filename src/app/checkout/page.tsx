"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError, type Address, type AddressInput } from "@/lib/api";
import { useRequireAuth } from "@/components/useRequireAuth";
import { useCartStore, useCartView } from "@/stores/cartStore";
import { formatPrice, isValidPhone, normalizePhone } from "@/lib/format";

const EMPTY: AddressInput = {
  title: "", receiver_name: "", receiver_phone: "", province: "",
  city: "", postal_code: "", address_line: "",
};

export default function CheckoutPage() {
  const ready = useRequireAuth();
  const view = useCartView();
  const refreshCart = useCartStore((s) => s.refresh);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [form, setForm] = useState<AddressInput>(EMPTY);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const list = await api.addresses.list();
    setAddresses(list);
    setSelected((cur) => cur ?? list[0]?.id ?? null);
  }, []);

  useEffect(() => {
    if (!ready) return;
    void refreshCart();
    load().catch(() => setError("خطا در دریافت آدرس‌ها"));
  }, [ready, load, refreshCart]);

  async function addAddress(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidPhone(form.receiver_phone)) return setError("شماره موبایل گیرنده معتبر نیست.");
    try {
      const a = await api.addresses.create({ ...form, receiver_phone: normalizePhone(form.receiver_phone) });
      setForm(EMPTY);
      setSelected(a.id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "خطایی رخ داد.");
    }
  }

  async function placeOrder() {
    if (selected === null) return setError("یک آدرس انتخاب کنید.");
    setBusy(true);
    setError("");
    try {
      const { payment_url } = await api.orders.create(selected, note || undefined);
      window.location.assign(payment_url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "خطایی رخ داد.");
      setBusy(false);
    }
  }

  if (!ready) return <p>در حال بارگذاری…</p>;
  if (view.lines.length === 0) return <p>سبد خرید خالی است. <Link href="/products">محصولات</Link></p>;

  const field = (k: keyof AddressInput, label: string) => (
    <input key={k} value={form[k]} placeholder={label} required className="border"
      onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
  );

  return (
    <div className="space-y-4">
      <h1 className="font-bold">تسویه حساب</h1>
      <section>
        <h2 className="font-bold">آدرس</h2>
        {addresses.map((a) => (
          <label key={a.id} className="block">
            <input type="radio" name="address" checked={selected === a.id} onChange={() => setSelected(a.id)} />{" "}
            {a.title}: {a.receiver_name}، {a.province}، {a.city}، {a.address_line}
          </label>
        ))}
        <form onSubmit={addAddress} className="mt-2 flex flex-wrap gap-2">
          {field("title", "عنوان")}{field("receiver_name", "نام گیرنده")}
          {field("receiver_phone", "موبایل گیرنده")}{field("province", "استان")}
          {field("city", "شهر")}{field("postal_code", "کد پستی")}{field("address_line", "نشانی")}
          <button className="border px-2">افزودن آدرس</button>
        </form>
      </section>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="توضیحات (اختیاری)" className="block w-full border" />
      <dl>
        <dt>جمع کالاها</dt><dd>{formatPrice(view.subtotal)}</dd>
        <dt>تخفیف</dt><dd>{formatPrice(view.discount)}</dd>
        <dt>ارسال</dt><dd>{formatPrice(view.shipping_fee)}</dd>
        <dt>قابل پرداخت</dt><dd>{formatPrice(view.total)}</dd>
      </dl>
      {error && <p role="alert">{error}</p>}
      <button type="button" disabled={busy} onClick={placeOrder} className="border px-2">ثبت سفارش و پرداخت</button>
    </div>
  );
}
