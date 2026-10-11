"use client";

import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Button, InlineAlert, Input, useToast } from "@/components/ui";
import Logo from "@/components/Logo";
import { isValidPhone, normalizePhone, toEnglishDigits, toPersianDigits } from "@/lib/format";
import { useAuthStore } from "@/stores/authStore";

const RESEND_SECONDS = 60;
const NETWORK = "ارتباط با سرور برقرار نشد. دوباره تلاش کنید.";
const THROTTLED = "تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.";

/** Same-site relative paths only. */
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function clock(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return toPersianDigits(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
}

export default function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  const next = safeNext(useSearchParams().get("next"));
  const login = useAuthStore((s) => s.login);
  const hydrated = useAuthStore((s) => s.hydrated);
  const authed = useAuthStore((s) => !!s.access);

  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [left, setLeft] = useState(0);
  const verifying = useRef(false);

  // Already signed in: nothing to do here.
  useEffect(() => {
    if (hydrated && authed) router.replace(next);
  }, [hydrated, authed, next, router]);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const describe = (err: unknown, fallback: string) => {
    if (!(err instanceof ApiError)) return fallback;
    if (err.status === 429) return THROTTLED;
    if (err.status === 0) return NETWORK;
    return fallback;
  };

  async function sendCode(isResend = false) {
    setError("");
    if (!isValidPhone(phone)) {
      setError("شماره موبایل معتبر نیست.");
      return;
    }
    setBusy(true);
    try {
      await api.auth.requestOtp(normalizePhone(phone));
      setCode("");
      setStep("code");
      setLeft(RESEND_SECONDS);
      if (isResend) toast.success("کد جدید ارسال شد.");
    } catch (err) {
      setError(describe(err, err instanceof ApiError ? err.message : "خطایی رخ داد. لطفاً دوباره تلاش کنید."));
    } finally {
      setBusy(false);
    }
  }

  const verify = useCallback(async (digits: string) => {
    if (verifying.current) return;
    verifying.current = true;
    setError("");
    setBusy(true);
    try {
      // Providers merges the guest cart as soon as the access token appears.
      await login(phone, digits);
      toast.success("ورود با موفقیت انجام شد.");
      router.replace(next);
    } catch (err) {
      const server = err instanceof ApiError ? err.message : "";
      setError(
        server.includes("منقضی")
          ? "کد منقضی شده است. کد جدید دریافت کنید."
          : describe(err, "کد وارد شده اشتباه است."),
      );
      setBusy(false);
      verifying.current = false;
    }
  }, [login, phone, next, router, toast]);

  function onCode(value: string) {
    const digits = toEnglishDigits(value).replace(/\D/g, "").slice(0, 5);
    setCode(digits);
    setError("");
    if (digits.length === 5) void verify(digits);
  }

  const panel = "rounded-lg border border-border bg-surface p-6 md:p-8";

  return (
    <div className="mx-auto w-full max-w-sm px-4 pt-10 pb-16 md:pt-20">
      <div className={panel}>
        <div className="mb-6 flex justify-center"><Logo /></div>

        {step === "phone" ? (
          <form
            noValidate
            onSubmit={(e) => { e.preventDefault(); void sendCode(); }}
          >
            <h1 className="text-xl font-bold text-ink">ورود یا ثبت‌نام</h1>
            <p className="mt-2 text-sm text-ink-muted">شماره موبایل خود را وارد کنید.</p>
            <Input
              wrapperClassName="mt-6" label="شماره موبایل" dir="ltr" inputMode="numeric" autoComplete="tel"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹" autoFocus value={phone} error={error || undefined}
              onChange={(e) => { setPhone(e.target.value); setError(""); }}
            />
            <Button type="submit" size="lg" fullWidth className="mt-6" loading={busy}>
              {busy ? "در حال ارسال" : "دریافت کد"}
            </Button>
            <p className="mt-4 text-xs text-ink-muted">ورود شما به معنای پذیرش قوانین فروشگاه پود است.</p>
          </form>
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (code.length === 5) void verify(code);
              else setError("کد وارد شده اشتباه است.");
            }}
          >
            <div className="mb-4">
              <Button
                type="button" variant="link" size="sm" iconStart={<ArrowRight />}
                onClick={() => { setStep("phone"); setCode(""); setError(""); setLeft(0); }}
              >
                ویرایش شماره
              </Button>
            </div>
            <h1 className="text-xl font-bold text-ink">کد تأیید را وارد کنید</h1>
            <p className="mt-2 text-sm text-ink-muted">
              کد ۵ رقمی به شماره <span dir="ltr">{toPersianDigits(normalizePhone(phone))}</span> ارسال شد.
            </p>
            <Input
              wrapperClassName="mt-6" label="کد تأیید" h={14} dir="ltr" inputMode="numeric"
              autoComplete="one-time-code" maxLength={5} autoFocus
              className="text-center text-2xl font-bold tracking-[0.5em] tabular-nums"
              value={toPersianDigits(code)} error={error || undefined}
              onChange={(e) => onCode(e.target.value)}
            />
            <InlineAlert kind="info" className="mt-3">کد آزمایشی: ۱۲۳۴۵</InlineAlert>
            <Button type="submit" size="lg" fullWidth className="mt-6" loading={busy}>
              {busy ? "در حال بررسی" : "ورود"}
            </Button>
            <div className="mt-4 text-center text-sm">
              {left > 0 ? (
                <p className="text-ink-muted">
                  ارسال مجدد کد تا <span dir="ltr" className="tabular-nums">{clock(left)}</span>
                </p>
              ) : (
                <Button type="button" variant="link" size="sm" disabled={busy} onClick={() => void sendCode(true)}>
                  ارسال مجدد کد
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
