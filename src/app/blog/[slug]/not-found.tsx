import { FileX } from "lucide-react";
import { Button, Container, EmptyState } from "@/components/ui";

export default function BlogPostNotFound() {
  return (
    <Container className="pb-16 pt-6 md:pt-10">
      <EmptyState
        icon={FileX}
        title="مقاله پیدا نشد"
        body="ممکن است حذف شده باشد یا نشانی را اشتباه وارد کرده باشید."
        action={<Button href="/blog">بازگشت به وبلاگ</Button>}
      />
    </Container>
  );
}
