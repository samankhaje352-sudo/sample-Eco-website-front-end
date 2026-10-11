"use client";

import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button, Container, InlineAlert } from "@/components/ui";

export default function ProductsError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <Container className="pb-16 pt-6 md:pt-10">
      <InlineAlert
        kind="error"
        action={
          <Button
            variant="secondary"
            size="sm"
            iconStart={<RotateCw />}
            onClick={() =>
              startTransition(() => {
                router.refresh();
                reset();
              })
            }
          >
            تلاش دوباره
          </Button>
        }
      >
        بارگذاری اطلاعات با خطا مواجه شد.
      </InlineAlert>
    </Container>
  );
}
