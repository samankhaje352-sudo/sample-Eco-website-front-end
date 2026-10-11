"use client";

import { useEffect, useState } from "react";
import { api, type Category } from "@/lib/api";

let cache: Promise<Category[]> | null = null;

/** Top-level categories from the API, fetched once per page load and shared. */
export function useCategories(): Category[] {
  const [list, setList] = useState<Category[]>([]);
  useEffect(() => {
    let alive = true;
    cache ??= api.catalog.categories().catch(() => {
      cache = null;
      return [] as Category[];
    });
    void cache.then((c) => alive && setList(c));
    return () => {
      alive = false;
    };
  }, []);
  return list;
}
