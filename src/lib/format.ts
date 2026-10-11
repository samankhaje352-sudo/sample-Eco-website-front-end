const FA = "۰۱۲۳۴۵۶۷۸۹";
const AR = "٠١٢٣٤٥٦٧٨٩";

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => FA[Number(d)]);
}

/** Persian and Arabic-Indic digits to ASCII. */
export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR.indexOf(d)));
}

/** 1290000 -> "۱٬۲۹۰٬۰۰۰" (Persian digits and separators, no currency word) */
export function formatNumber(n: number): string {
  const grouped = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
  return toPersianDigits(grouped);
}

/** 1290000 -> "۱٬۲۹۰٬۰۰۰ تومان" */
export function formatPrice(n: number): string {
  return `${formatNumber(n)} تومان`;
}

export const PHONE_RE = /^09\d{9}$/;

/** Normalizes digits (Persian/Arabic -> ASCII) and strips spaces. */
export function normalizePhone(input: string): string {
  return toEnglishDigits(input).replace(/[\s\-]/g, "");
}

export function isValidPhone(input: string): boolean {
  return PHONE_RE.test(normalizePhone(input));
}
