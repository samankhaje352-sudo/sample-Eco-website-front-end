import type { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Upper bound on pages read from each paginated endpoint. */
const MAX_PAGES = 50;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
  ];

  // Each API section has its own try/catch: a failing endpoint only drops its own URLs.
  try {
    const categories = await api.catalog.categories();
    for (const c of categories) {
      entries.push({
        url: `${SITE_URL}/products?category=${encodeURIComponent(c.slug)}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // Categories are skipped; the other sections still render.
  }

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await api.catalog.products({ page });
      for (const p of res.results) {
        entries.push({
          url: `${SITE_URL}/products/${encodeURIComponent(p.slug)}`,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
      if (!res.next) break;
    }
  } catch {
    // Keep the products collected so far.
  }

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await api.blog.posts(page);
      for (const p of res.results) {
        const published = new Date(p.published_at);
        entries.push({
          url: `${SITE_URL}/blog/${encodeURIComponent(p.slug)}`,
          // An unparseable date would make Next fail while serialising the whole sitemap.
          lastModified: Number.isNaN(published.getTime()) ? undefined : published,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
      if (!res.next) break;
    }
  } catch {
    // Keep the posts collected so far.
  }

  return entries;
}
