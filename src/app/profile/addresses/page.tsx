"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError, type Address, type AddressInput } from "@/lib/api";
import { useRequireAuth } from "@/components/useRequireAuth";
import { isValidPhone, normalizePhone } from "@/lib/format";

const EMPTY: AddressInput = {
  title: "", receiver_name: "", receiver_phone: "", province: "",
  city: "", postal_code: "", address_line: "",
};

export default function AddressesPage() {
  const ready = useRequireAuth();
  const [list, setList] = useState<Address[] | null>(null);
  const [form, setForm] = useState<AddressInput>(EMPTY);
  const [error, setError] = useState("");

  const load = useCallback(() => api.addresses.list().then(setList).catch(() => setList([])), []);
  useEffect(() => { if (ready) void load(); }, [ready, load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidPhone(form.receiver_phone)) return setError("شماره موبایل گیرنده معتبر نیست.");
    try {
      await api.addresses.create({ ...form, receiver_phone: normalizePhone(form.receiver_phone) });
      setForm(EMPTY);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "خطایی رخ داد.");
    }
  }

  async function del(id: number) {
    await api.addresses.remove(id).catch(() => {});
    await load();
  }

  if (!ready || !list) return <p>در حال بارگذاری…</p>;
  const labels: [keyof AddressInput, string][] = [
    ["title", "عنوان"], ["receiver_name", "نام گیرنده"], ["receiver_phone", "موبایل گیرنده"],
    ["province", "استان"], ["city", "شهر"], ["postal_code", "کد پستی"], ["address_line", "نشانی"],
  ];
  return (
    <div className="space-y-4">
      <h1 className="font-bold">آدرس‌ها</h1>
      <ul>
        {list.map((a) => (
          <li key={a.id}>
            {a.title}: {a.receiver_name}، {a.province}، {a.city}، {a.address_line}{" "}
            <button type="button" onClick={() => del(a.id)}>حذف</button>
          </li>
        ))}
      </ul>
      <form onSubmit={create} className="flex flex-wrap gap-2">
        {labels.map(([k, l]) => (
          <input key={k} value={form[k]} placeholder={l} required className="border"
            onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        ))}
        <button className="border px-2">افزودن</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
