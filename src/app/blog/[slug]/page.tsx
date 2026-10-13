import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { api, ApiError, type PostDetail } from "@/lib/api";
import { toPersianDigits } from "@/lib/format";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import PostBody from "@/components/blog/PostBody";
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
  const post = await load(slug);

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

      <article className="mx-auto mt-6 max-w-prose">
        <header>
          <h1 className="text-3xl font-extrabold leading-[1.4] text-ink md:text-4xl md:leading-[1.4]">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            {post.author_name} · <time dateTime={post.published_at}>{post.published_at_jalali}</time> · {toPersianDigits(post.reading_time)} دقیقه مطالعه
          </p>
        </header>

        {post.cover && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg bg-surface-muted">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              sizes="(min-width:768px) 640px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <p className="mt-6 text-lg leading-9 text-ink-muted">{post.excerpt}</p>
        <div className="mt-6">
          <PostBody body={post.body} />
        </div>
      </article>

      {post.related_products.length > 0 && (
        <section className="mt-12 md:mt-16">
          <SectionHeader title="محصولات مرتبط با این مقاله" />
          <ProductGrid products={post.related_products.slice(0, 4)} layout="four" />
        </section>
      )}

      <div className="mt-12 text-center">
        <Button variant="secondary" href="/blog">
          همه‌ی مقاله‌ها
        </Button>
      </div>
    </Container>
  );
}
