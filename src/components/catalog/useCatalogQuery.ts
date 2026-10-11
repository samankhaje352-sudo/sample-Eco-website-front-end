"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import { hrefWith, parseQuery, type QueryKey } from "./params";

/** Reads the catalog query from the URL and updates it (shareable filters). */
export function useCatalogQuery() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();
  const query = useMemo(() => parseQuery(sp), [sp]);

  const update = useCallback(
    (patch: Partial<Record<QueryKey, string | number | null>>) => {
      startTransition(() => router.push(hrefWith(query, patch), { scroll: false }));
    },
    [router, query],
  );

  return { query, update, pending };
}
