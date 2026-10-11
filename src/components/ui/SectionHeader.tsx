import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import Button from "./Button";

export interface SectionHeaderProps {
  title: string;
  /** Shows the «مشاهده همه» link when set. */
  href?: string;
  /** Extra controls next to the link (e.g. rail scroll buttons). */
  actions?: ReactNode;
}

export default function SectionHeader({ title, href, actions }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 md:mb-6">
      <h2 className="text-xl font-bold text-ink md:text-2xl">{title}</h2>
      <div className="flex items-center gap-3">
        {actions}
        {href && (
          <Button
            variant="link"
            size="sm"
            href={href}
            iconEnd={<ChevronLeft className="size-4" strokeWidth={1.75} />}
          >
            مشاهده همه
          </Button>
        )}
      </div>
    </div>
  );
}
