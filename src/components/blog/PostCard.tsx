import Image from "next/image";
import Link from "next/link";
import type { PostList } from "@/lib/api";
import { toPersianDigits } from "@/lib/format";

export interface PostCardProps {
  post: PostList;
  /** Use for the first row of images above the fold. */
  priority?: boolean;
}

export default function PostCard({ post, priority }: PostCardProps) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="group flex flex-col">
      <Link
        href={href}
        className="relative block aspect-[16/9] overflow-hidden rounded-lg bg-surface-muted"
        tabIndex={-1}
        aria-hidden
      >
        {post.cover && (
          <Image
            src={post.cover}
            alt=""
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out-soft motion-safe:group-hover:scale-[1.03]"
          />
        )}
      </Link>
      <p className="mt-3 text-xs text-ink-muted">
        <time dateTime={post.published_at}>{post.published_at_jalali}</time> · {toPersianDigits(post.reading_time)} دقیقه مطالعه
      </p>
      <h3 className="mt-1 text-base font-bold text-ink">
        <Link href={href} className="hover:text-accent-strong">
          {post.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{post.excerpt}</p>
    </article>
  );
}
