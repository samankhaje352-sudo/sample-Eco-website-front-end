"use client";

import { MapPin, Pencil, Plus, RotateCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api, type Address } from "@/lib/api";
import { Button, EmptyState, InlineAlert, Skeleton, useToast } from "@/components/ui";
import AddressForm from "@/components/checkout/AddressForm";
import AddressMeta from "@/components/checkout/AddressMeta";
import { useRequireAuth } from "@/components/useRequireAuth";

export default function AddressesPage() {
  const ready = useRequireAuth();
  const toast = useToast();
  const [list, setList] = useState<Address[] | null>(null);
  const [failed, setFailed] = useState(false);
  /** "new", an address id being edited, or null. */
  const [editing, setEditing] = useState<"new" | number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      setList(await api.addresses.list());
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  async function del(id: number) {
    setDeleting(true);
    try {
      await api.addresses.remove(id);
      setList((l) => (l ?? []).filter((a) => a.id !== id));
      setConfirmId(null);
      toast.success("آدرس حذف شد.");
    } catch {
      toast.error("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setDeleting(false);
    }
  }

  function saved(a: Address) {
    setList((l) => {
      const cur = l ?? [];
      return cur.some((x) => x.id === a.id) ? cur.map((x) => (x.id === a.id ? a : x)) : [...cur, a];
    });
    setEditing(null);
    toast.success("آدرس ذخیره شد.");
  }

  const empty = list !== null && list.length === 0 && editing !== "new";
  const addButton = (
    <Button variant="secondary" iconStart={<Plus />} onClick={() => { setEditing("new"); setConfirmId(null); }}>
      افزودن آدرس جدید
    </Button>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-ink md:text-2xl">آدرس‌ها</h1>
        {list && !empty && editing !== "new" && addButton}
      </div>

      {failed ? (
        <InlineAlert
          kind="error"
          action={
            <Button variant="secondary" size="sm" iconStart={<RotateCw />} onClick={() => void load()}>
              تلاش دوباره
            </Button>
          }
        >
          بارگذاری اطلاعات با خطا مواجه شد.
        </InlineAlert>
      ) : !ready || list === null ? (
        <div role="status" aria-label="در حال بارگذاری" className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      ) : empty ? (
        <EmptyState
          icon={MapPin}
          title="هنوز آدرسی ثبت نکرده‌اید"
          body="برای سریع‌تر شدن خرید، آدرس خود را اضافه کنید."
          action={
            <Button iconStart={<Plus />} onClick={() => setEditing("new")}>
              افزودن آدرس جدید
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {editing === "new" && (
            <div className="md:col-span-2">
              <AddressForm onSaved={saved} onCancel={() => setEditing(null)} />
            </div>
          )}
          {list.map((a) =>
            editing === a.id ? (
              <div key={a.id} className="md:col-span-2">
                <AddressForm initial={a} onSaved={saved} onCancel={() => setEditing(null)} />
              </div>
            ) : (
              <article key={a.id} className="rounded-lg border border-border bg-surface p-5">
                <h2 className="text-sm font-bold text-ink">{a.title}</h2>
                <AddressMeta address={a} />
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                  {confirmId === a.id ? (
                    <>
                      <span className="me-auto text-sm text-ink">این آدرس حذف شود؟</span>
                      <Button variant="danger-ghost" size="sm" loading={deleting} onClick={() => void del(a.id)}>
                        بله، حذف شود
                      </Button>
                      <Button variant="ghost" size="sm" disabled={deleting} onClick={() => setConfirmId(null)}>
                        انصراف
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" iconStart={<Pencil />}
                        onClick={() => { setEditing(a.id); setConfirmId(null); }}>
                        ویرایش
                      </Button>
                      <Button variant="danger-ghost" size="sm" iconStart={<Trash2 />} onClick={() => setConfirmId(a.id)}>
                        حذف
                      </Button>
                    </>
                  )}
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </div>
  );
}
