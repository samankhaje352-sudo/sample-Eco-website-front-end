"use client";

import { useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api";
import { Button, Input, InlineAlert, useToast } from "@/components/ui";
import { toPersianDigits } from "@/lib/format";
import { useAuthStore } from "@/stores/authStore";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const toast = useToast();
  const [first, setFirst] = useState(user?.first_name ?? "");
  const [last, setLast] = useState(user?.last_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await api.auth.updateMe({
        first_name: first.trim(),
        last_name: last.trim(),
        email: email.trim(),
      });
      useAuthStore.setState({ user: updated });
      toast.success("اطلاعات شما ذخیره شد.");
    } catch (err) {
      if (err instanceof ApiError && err.status !== 0) setError(err.message);
      else toast.error("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-ink md:text-2xl">اطلاعات حساب</h1>
      <form onSubmit={onSubmit} className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="نام" value={first} onChange={(e) => setFirst(e.target.value)} autoComplete="given-name" />
          <Input label="نام خانوادگی" value={last} onChange={(e) => setLast(e.target.value)} autoComplete="family-name" />
          <Input
            label="ایمیل"
            optional
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="شماره موبایل"
            dir="ltr"
            disabled
            value={user ? toPersianDigits(user.phone) : ""}
            readOnly
            helper="شماره موبایل قابل تغییر نیست."
          />
        </div>
        {error ? <InlineAlert kind="error" className="mt-4">{error}</InlineAlert> : null}
        <div className="mt-5 flex justify-end">
          <Button type="submit" loading={saving}>
            {saving ? "در حال ذخیره" : "ذخیره تغییرات"}
          </Button>
        </div>
      </form>
    </div>
  );
}
