"use client";

import { CircleAlert } from "lucide-react";
import { Button, Container, EmptyState } from "@/components/ui";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-10">
      <EmptyState
        icon={CircleAlert}
        tileClassName="bg-danger-soft text-danger"
        title="مشکلی پیش آمد"
        body="لطفاً دوباره تلاش کنید."
        action={<Button onClick={reset}>تلاش دوباره</Button>}
      />
    </Container>
  );
}
