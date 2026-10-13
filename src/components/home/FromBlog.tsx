import type { PostList } from "@/lib/api";
import PostCard from "@/components/blog/PostCard";
import { SectionHeader } from "@/components/ui";

/** Home «از وبلاگ پود»: newest post large, the next three as compact rows beside it. */
export default function FromBlog({ posts }: { posts: PostList[] }) {
  const [lead, ...rest] = posts.slice(0, 4);
  if (!lead) return null;

  return (
    <section className="py-10 md:py-16">
      <SectionHeader title="از وبلاگ پود" href="/blog" />
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <PostCard post={lead} variant="lead" className="lg:col-span-7" />
        {rest.length > 0 && (
          <div className="flex flex-col divide-y divide-border border-t border-border lg:col-span-5 lg:border-t-0">
            {rest.map((p) => (
              <PostCard key={p.id} post={p} variant="row" className="py-5 first:pt-5 lg:first:pt-0" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
