"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

/** Client-side guard: redirects to /login?next=... when logged out. Returns true when ready. */
export function useRequireAuth(): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthStore((s) => s.hydrated);
  const authed = useAuthStore((s) => !!s.access);

  useEffect(() => {
    if (hydrated && !authed) {
      const next = pathname + (typeof window !== "undefined" ? window.location.search : "");
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [hydrated, authed, pathname, router]);

  return hydrated && authed;
}
