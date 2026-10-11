type ClassValue = string | false | null | undefined | 0;

/** Joins truthy class strings. */
export function cn(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(" ");
}
