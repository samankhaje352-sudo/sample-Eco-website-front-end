"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { isValidPhone, normalizePhone, toEnglishDigits } from "@/lib/format";
import { useAuthStore } from "@/stores/authStore";

function safeNext(next: string | null) {
  // only same-site relative paths
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/profile";
}

function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const login = useAuthStore((s) => s.login);
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitPhone(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidPhone(phone)) return setError("شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).");
    setBusy(true);
    try {
      await api.auth.requestOtp(normalizePhone(phone));
      setStep("code");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "خطایی رخ داد.");
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(phone, toEnglishDigits(code.trim()));
      router.replace(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "خطایی رخ داد.");
      setBusy(false);
    }
  }

  return step === "phone" ? (
    <form onSubmit={submitPhone} className="space-y-2">
      <h1 className="font-bold">ورود / ثبت‌نام</h1>
      <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric"
        placeholder="شماره موبایل" dir="ltr" className="border" />{" "}
      <button disabled={busy} className="border px-2">دریافت کد</button>
      {error && <p role="alert">{error}</p>}
    </form>
  ) : (
    <form onSubmit={submitCode} className="space-y-2">
      <h1 className="font-bold">کد تایید</h1>
      <p>کد ارسال‌شده به {phone} را وارد کنید.</p>
      <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric"
        placeholder="کد" dir="ltr" className="border" />{" "}
      <button disabled={busy} className="border px-2">ورود</button>{" "}
      <button type="button" onClick={() => { setStep("phone"); setCode(""); setError(""); }}>ویرایش شماره</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><LoginForm /></Suspense>;
}
