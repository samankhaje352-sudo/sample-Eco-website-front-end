import { toEnglishDigits } from "@/lib/format";

/** Page size of GET blog/posts/ (fixed by the API). */
export const BLOG_PAGE_SIZE = 12;

/** Reads `?page=` (Persian, Arabic or Latin digits). Anything that is not an integer >= 1 becomes 1. */
export function parsePage(raw: string | undefined): number {
  const n = Number(toEnglishDigits((raw ?? "").trim()));
  return Number.isInteger(n) && n >= 1 ? n : 1;
}
