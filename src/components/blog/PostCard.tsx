import { ArrowLeft, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PostList } from "@/lib/api";
import { cn } from "@/lib/cn";
import PostMeta from "./PostMeta";

export interface PostCardProps {
  post: PostList;
  /** Use for the first row of images above the fold. */
  priority?: boolean;
  /**
   * "grid": cover on top (default). "feature": large, cover beside the text from md up.
   * "row": small thumbnail beside the title, for compact lists.
   * "lead": like grid, with a larger title (first post of a home section).
   */
  variant?: "grid" | "feature" | "row" | "lead";
  /** Heading level for the title (h2 on the blog index, h3 inside a home section). */
  as?: "h2" | "h3";
  className?: string;
}

const COVER_SIZES = {
  grid: "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
  feature: "(min-width:768px) 58vw, 100vw",
  row: "160px",
  lead: "(min-width:1024px) 58vw, 100vw",
} as const;

export default function PostCard({ post, priority, variant = "grid", as: H = "h3", className }: PostCardProps) {
  const href = `/blog/${post.slug}`;
  const feature = variant === "feature";
  const row = variant === "row";
  const stacked = variant === "grid" || variant === "lead";

  return (
    <article
      className={cn(
        "group",
        feature && "grid gap-5 md:grid-cols-12 md:items-center md:gap-8",
        row && "grid grid-cols-[7rem_1fr] items-start gap-4 sm:grid-cols-[9rem_1fr]",
        stacked && "flex flex-col",
        className,
      )}
    >
      <Link
        href={href}
        className={cn(
          "well-edge relative block overflow-hidden rounded-lg bg-surface-muted",
          row ? "aspect-[4/3] rounded-md" : "aspect-[16/9]",
          feature && "md:col-span-7",
        )}
        tabIndex={-1}
        aria-hidden
      >
        {post.cover ? (
          <Image
            src={post.cover}
            alt=""
            fill
            sizes={COVER_SIZES[variant]}
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out-soft motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center">
            <BookOpen className="size-8 text-ink-subtle" strokeWidth={1.75} />
          </span>
        )}
      </Link>

      <div className={cn("flex flex-col", feature && "md:col-span-5", stacked && "mt-4")}>
        <PostMeta
          publishedAt={post.published_at}
          publishedAtJalali={post.published_at_jalali}
          readingTime={post.reading_time}
        />
        <H
          className={cn(
            "mt-2 font-bold text-ink",
            feature && "text-2xl leading-[1.5] md:text-3xl md:leading-[1.5]",
            variant === "lead" && "text-xl leading-[1.6] md:text-2xl md:leading-[1.6]",
            variant === "grid" && "text-base",
            row && "mt-1 line-clamp-2 text-sm sm:text-base",
          )}
        >
          <Link href={href} className="transition-colors duration-150 hover:text-accent-strong">
            {post.title}
          </Link>
        </H>
        {!row && (
          <p className={cn("mt-2 text-ink-muted", variant === "grid" ? "line-clamp-2 text-sm" : "text-base")}>{post.excerpt}</p>
        )}
        {feature && (
          <Link
            href={href}
            className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-strong"
          >
            خواندن مقاله
            <ArrowLeft
              className="size-4 transition-transform duration-200 motion-safe:group-hover:-translate-x-1"
              strokeWidth={1.75}
              aria-hidden
            />
          </Link>
        )}
      </div>
    </article>
  );
}
