"use client";

import { Select } from "@/components/ui";
import { SORT_OPTIONS } from "./params";

export default function SortSelect({
  value,
  onChange,
  compact,
}: {
  value: string;
  onChange: (v: string) => void;
  compact?: boolean;
}) {
  return (
    <Select
      aria-label="مرتب‌سازی"
      h={compact ? 9 : 10}
      value={SORT_OPTIONS.some((o) => o.value === value) ? value : "newest"}
      onChange={(e) => onChange(e.target.value)}
      wrapperClassName="w-40 lg:w-44"
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Select>
  );
}
