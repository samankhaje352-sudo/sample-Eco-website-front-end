"use client";

import { Button } from "@/components/ui";
import { CLEAR_FILTERS } from "./params";
import { useCatalogQuery } from "./useCatalogQuery";

/** Empty-state action: clears every filter (keeps search and sort). */
export default function ClearFiltersButton({ label = "حذف فیلترها" }: { label?: string }) {
  const { update, pending } = useCatalogQuery();
  return (
    <Button loading={pending} onClick={() => update(CLEAR_FILTERS)}>
      {label}
    </Button>
  );
}
