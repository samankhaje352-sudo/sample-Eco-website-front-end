import { toPersianDigits } from "@/lib/format";
import type { Address } from "@/lib/api";

/** Address text plus receiver / phone / postal line, shared by checkout and profile. */
export default function AddressMeta({ address }: { address: Address }) {
  return (
    <>
      <p className="mt-2 text-sm text-ink">
        {address.province}، {address.city}، {address.address_line}
      </p>
      <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-ink-muted">
        <span>گیرنده: {address.receiver_name}</span>
        <span dir="ltr">{toPersianDigits(address.receiver_phone)}</span>
        <span>کد پستی: {toPersianDigits(address.postal_code)}</span>
      </p>
    </>
  );
}
