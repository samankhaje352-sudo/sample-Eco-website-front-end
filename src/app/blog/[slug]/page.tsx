import type { Metadata } from "next";
import { Ruler, Truck } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { api, ApiError, type PostDetail, type PostList } from "@/lib/api";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import PostBody from "@/components/blog/PostBody";
import PostCard from "@/components/blog/PostCard";
import PostMeta from "@/components/blog/PostMeta";
import ProductGrid from "@/components/ProductGrid";
import { Breadcrumb, Button, Container, SectionHeader } from "@/components/ui";

type Params = { params: Promise<{ slug: string }> };

async function load(slug: string): Promise<PostDetail> {
  try {
    return await api.blog.post(slug);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

/** Other recent posts for «بیشتر بخوانید». Fail-soft: an error just hides the section. */
async function loadMore(slug: string): Promise<PostList[]> {
  try {
    return (await api.blog.posts(1)).results.filter((p) => p.slug !== slug).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await api.blog.post(slug);
    return {
      title: post.meta_title,
      description: post.meta_description,
      alternates: { canonical: `/blog/${post.slug}` },
      openGraph: {
        type: "article",
        url: `/blog/${post.slug}`,
        title: post.meta_title,
        description: post.meta_description,
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        authors: [post.author_name],
        images: post.cover ? [{ url: post.cover, width: 1200, height: 675, alt: post.title }] : undefined,
      },
    };
  } catch {
    return { title: "مقاله" };
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const [post, more] = await Promise.all([load(slug), loadMore(slug)]);

  return (
    <Container className="pb-16 pt-6 md:pt-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              headline: post.title,
              description: post.meta_description,
              image: post.cover ? [post.cover] : undefined,
              datePublished: post.published_at,
              dateModified: post.updated_at,
              author: { "@type": "Organization", name: post.author_name },
              publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
              mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
              inLanguage: "fa-IR",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "خانه", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "وبلاگ", item: `${SITE_URL}/blog` },
                { "@type": "ListItem", position: 3, name: post.title },
              ],
            },
          ],
        }}
      />

      <Breadcrumb
        items={[{ label: "خانه", href: "/" }, { label: "وبلاگ", href: "/blog" }, { label: post.title }]}
      />

      <article className="mt-6 md:mt-8">
        <header className="mx-auto max-w-prose">
          <h1 className="text-3xl font-extrabold leading-[1.45] text-ink md:text-4xl md:leading-[1.45]">
            {post.title}
          </h1>
          <PostMeta
            className="mt-4 text-sm"
            author={post.author_name}
            publishedAt={post.published_at}
            publishedAtJalali={post.published_at_jalali}
            readingTime={post.reading_time}
          />
        </header>

        {post.cover && (
          <div className="well-edge relative mx-auto mt-8 aspect-[16/9] max-w-3xl overflow-hidden rounded-lg bg-surface-muted">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              sizes="(min-width:1024px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="mx-auto mt-8 max-w-prose md:mt-10">
          <p className="border-s-2 border-accent ps-4 text-lg leading-9 text-ink">{post.excerpt}</p>
          <div className="mt-8">
            <PostBody body={post.body} />
          </div>

          <aside className="mt-12 rounded-lg bg-accent-soft p-5 md:p-6" aria-label="شرایط خرید از پود">
            <p className="text-base font-bold text-ink">اگر از پود خرید می‌کنید</p>
            <ul className="mt-4 space-y-3 text-sm text-ink">
              <li className="flex items-start gap-3">
                <Ruler className="mt-0.5 size-5 shrink-0 text-accent-strong" strokeWidth={1.75} aria-hidden />
                سایز اندازه نبود؟ تا ۷ روز پس از تحویل می‌توانید آن را تعویض کنید.
              </li>
              <li className="flex items-start gap-3">
                <Truck className="mt-0.5 size-5 shrink-0 text-accent-strong" strokeWidth={1.75} aria-hidden />
                ارسال برای خریدهای بالای ۱ میلیون تومان رایگان است.
              </li>
            </ul>
          </aside>
        </div>
      </article>

      {post.related_products.length > 0 && (
        <section className="mt-16 border-t border-border pt-10 md:mt-20 md:pt-12">
          <SectionHeader title="محصولات مرتبط با این مقاله" />
          <ProductGrid products={post.related_products.slice(0, 4)} layout="four" />
        </section>
      )}

      {more.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10 md:mt-20 md:pt-12">
          <SectionHeader title="بیشتر بخوانید" href="/blog" />
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p, i) => (
              <PostCard key={p.id} post={p} className={i === 2 ? "sm:hidden lg:flex" : undefined} />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-12 text-center">
          <Button variant="secondary" href="/blog">
            همه‌ی مقاله‌ها
          </Button>
        </div>
      )}
    </Container>
  );
}
