import { SearchX } from "lucide-react";
import { Button, Container, EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-10">
      <EmptyState
        icon={SearchX}
        title="صفحه‌ای که دنبالش بودید پیدا نشد"
        body="نشانی را بررسی کنید یا به صفحه اصلی بروید."
        action={<Button href="/">بازگشت به صفحه اصلی</Button>}
      />
    </Container>
  );
}
