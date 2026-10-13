import type { Metadata } from "next";
import { BookOpen, RotateCw } from "lucide-react";
import { api, ApiError, type Paginated, type PostList } from "@/lib/api";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/blog/PostCard";
import { BLOG_PAGE_SIZE, parsePage } from "@/components/blog/params";
import { Breadcrumb, Button, Container, EmptyState, InlineAlert, Pagination } from "@/components/ui";

export const dynamic = "force-dynamic"; // do not require the API at build time

type Props = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parsePage((await searchParams).page);
  return {
    title: "وبلاگ",
    description: "راهنمای خرید، نگهداری و ست کردن لباس از تحریریه پود.",
    alternates: { canonical: page > 1 ? `/blog?page=${page}` : "/blog" },
  };
}

/** Returns null when the request failed. A page past the last one is a 404 from the API: show it as empty. */
async function loadPosts(page: number): Promise<Paginated<PostList> | null> {
  try {
    return await api.blog.posts(page);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404 && page > 1) {
      return { count: 0, next: null, previous: null, results: [] };
    }
    return null;
  }
}

export default async function BlogPage({ searchParams }: Props) {
  const page = parsePage((await searchParams).page);
  const data = await loadPosts(page);

  if (!data) {
    return (
      <Container className="py-10">
        <InlineAlert
          kind="error"
          action={
            <Button variant="secondary" size="sm" href="/blog" iconStart={<RotateCw />}>
              تلاش دوباره
            </Button>
          }
        >
          بارگذاری اطلاعات با خطا مواجه شد.
        </InlineAlert>
      </Container>
    );
  }

  const pageCount = Math.ceil(data.count / BLOG_PAGE_SIZE);
  // Page 1 leads with the newest post as a wide feature; the rest go in the grid.
  const featured = page === 1 ? data.results[0] : undefined;
  const rest = featured ? data.results.slice(1) : data.results;

  return (
    <Container className="pb-16 pt-6 md:pt-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "وبلاگ پود",
          url: `${SITE_URL}/blog`,
          inLanguage: "fa-IR",
          blogPost: data.results.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${SITE_URL}/blog/${p.slug}`,
            datePublished: p.published_at,
          })),
        }}
      />
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "وبلاگ" }]} />
      <header className="mt-4 border-b border-border pb-6 md:pb-8">
        <h1 className="text-3xl font-extrabold text-ink md:text-4xl">وبلاگ پود</h1>
        <p className="mt-3 max-w-prose text-base text-ink-muted md:text-lg">
          راهنمای خرید، نگهداری و ست کردن لباس؛ کوتاه و کاربردی.
        </p>
      </header>

      {data.results.length === 0 ? (
        <EmptyState icon={BookOpen} title="هنوز مقاله‌ای منتشر نشده است." />
      ) : (
        <>
          {featured && (
            <PostCard post={featured} variant="feature" as="h2" priority className="mt-8 md:mt-10" />
          )}
          {rest.length > 0 && (
            <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <PostCard key={post.id} post={post} as="h2" priority={!featured && i < 3} />
              ))}
            </div>
          )}
          <Pagination
            page={page}
            pageCount={pageCount}
            hrefFor={(p) => (p > 1 ? `/blog?page=${p}` : "/blog")}
          />
        </>
      )}
    </Container>
  );
}
