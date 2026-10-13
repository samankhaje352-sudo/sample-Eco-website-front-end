import { Clock } from "lucide-react";
import { toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/cn";

export interface PostMetaProps {
  publishedAt: string;
  publishedAtJalali: string;
  readingTime: number;
  author?: string;
  className?: string;
}

/** Date, reading time and (optionally) author as spaced spans; no middle-dot chains. */
export default function PostMeta({ publishedAt, publishedAtJalali, readingTime, author, className }: PostMetaProps) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted", className)}>
      {author && <span className="font-medium text-ink">{author}</span>}
      <time dateTime={publishedAt}>{publishedAtJalali}</time>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3.5" strokeWidth={1.75} aria-hidden />
        {toPersianDigits(readingTime)} دقیقه مطالعه
      </span>
    </p>
  );
}
