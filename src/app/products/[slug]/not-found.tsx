import { PackageX } from "lucide-react";
import { Button, Container, EmptyState } from "@/components/ui";

export default function ProductNotFound() {
  return (
    <Container className="pb-16 pt-6 md:pt-10">
      <EmptyState
        icon={PackageX}
        title="این محصول پیدا نشد"
        body="ممکن است حذف شده باشد یا نشانی را اشتباه وارد کرده باشید."
        action={<Button href="/products">مشاهده محصولات</Button>}
      />
    </Container>
  );
}
