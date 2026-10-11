"use client";

import { useState } from "react";
import { api, ApiError, type Address, type AddressInput } from "@/lib/api";
import { Button, Input, InlineAlert, Textarea, useToast } from "@/components/ui";
import { isValidPhone, normalizePhone, toEnglishDigits } from "@/lib/format";

export interface AddressFormProps {
  /** With an `id` the form updates that address, otherwise it creates one. */
  initial?: Partial<Address>;
  onSaved: (address: Address) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

type Values = AddressInput;
type Errors = Partial<Record<keyof Values, string>>;

const REQUIRED = "این فیلد الزامی است.";
const FIELDS = [
  "title", "receiver_name", "receiver_phone", "province", "city", "postal_code", "address_line",
] as const satisfies readonly (keyof Values)[];

function validate(v: Values): Errors {
  const e: Errors = {};
  for (const k of FIELDS) if (!v[k].trim()) e[k] = REQUIRED;
  if (!e.receiver_phone && !isValidPhone(v.receiver_phone)) e.receiver_phone = "شماره موبایل معتبر نیست.";
  if (!e.postal_code && !/^\d{10}$/.test(toEnglishDigits(v.postal_code).trim())) {
    e.postal_code = "کد پستی باید ۱۰ رقم باشد.";
  }
  return e;
}

/** Create or update an address through the api, with inline validation and server errors. */
export default function AddressForm({ initial, onSaved, onCancel, submitLabel = "ذخیره آدرس" }: AddressFormProps) {
  const toast = useToast();
  const [values, setValues] = useState<Values>({
    title: initial?.title ?? "",
    receiver_name: initial?.receiver_name ?? "",
    receiver_phone: initial?.receiver_phone ?? "",
    province: initial?.province ?? "",
    city: initial?.city ?? "",
    postal_code: initial?.postal_code ?? "",
    address_line: initial?.address_line ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload: AddressInput = {
      title: values.title.trim(),
      receiver_name: values.receiver_name.trim(),
      receiver_phone: normalizePhone(values.receiver_phone),
      province: values.province.trim(),
      city: values.city.trim(),
      postal_code: toEnglishDigits(values.postal_code).trim(),
      address_line: values.address_line.trim(),
    };
    setBusy(true);
    try {
      const saved = initial?.id !== undefined
        ? await api.addresses.update(initial.id, payload)
        : await api.addresses.create(payload);
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError && err.data && typeof err.data === "object") {
        const fieldErrors: Errors = {};
        for (const [k, val] of Object.entries(err.data as Record<string, unknown>)) {
          const text = Array.isArray(val) ? val[0] : val;
          if ((FIELDS as readonly string[]).includes(k) && typeof text === "string") {
            fieldErrors[k as keyof Values] = text;
          }
        }
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          setFormError(err.message);
        }
      } else if (err instanceof ApiError && err.status === 0) {
        toast.error("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
      } else {
        setFormError("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 rounded-lg border border-border bg-surface p-5 md:grid-cols-2">
      <Input label="عنوان آدرس" placeholder="مثلاً خانه یا محل کار" value={values.title}
        onChange={set("title")} error={errors.title} autoComplete="off" />
      <Input label="نام و نام خانوادگی گیرنده" value={values.receiver_name}
        onChange={set("receiver_name")} error={errors.receiver_name} autoComplete="name" />
      <Input label="شماره موبایل گیرنده" dir="ltr" inputMode="numeric" autoComplete="tel"
        placeholder="۰۹۱۲۳۴۵۶۷۸۹" value={values.receiver_phone}
        onChange={set("receiver_phone")} error={errors.receiver_phone} />
      <Input label="کد پستی" dir="ltr" inputMode="numeric" autoComplete="postal-code"
        helper="۱۰ رقم، بدون خط تیره" value={values.postal_code}
        onChange={set("postal_code")} error={errors.postal_code} />
      <Input label="استان" value={values.province} onChange={set("province")}
        error={errors.province} autoComplete="address-level1" />
      <Input label="شهر" value={values.city} onChange={set("city")}
        error={errors.city} autoComplete="address-level2" />
      <Textarea label="نشانی کامل" placeholder="خیابان، کوچه، پلاک، واحد" value={values.address_line}
        onChange={set("address_line")} error={errors.address_line} autoComplete="street-address"
        wrapperClassName="md:col-span-2" />
      {formError && <InlineAlert kind="error" className="md:col-span-2">{formError}</InlineAlert>}
      <div className="flex justify-end gap-3 md:col-span-2">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>انصراف</Button>}
        <Button type="submit" loading={busy}>{busy ? "در حال ذخیره" : submitLabel}</Button>
      </div>
    </form>
  );
}
