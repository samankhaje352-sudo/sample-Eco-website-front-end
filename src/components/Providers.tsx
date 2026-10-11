"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { ToastProvider } from "@/components/ui";

/** Rehydrates persisted stores on the client and keeps cart/wishlist in sync with auth. */
export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let prev: string | null = null;
    const onAccess = (access: string | null, first = false) => {
      const wasLoggedIn = !!prev;
      prev = access;
      if (access && !wasLoggedIn) {
        // logged in (fresh login or page load): merge guest items, then sync
        void useCartStore.getState().mergeGuest();
        void useWishlistStore.getState().refresh();
        if (first) void useAuthStore.getState().loadMe();
      } else if (!access && wasLoggedIn) {
        useCartStore.setState({ cart: null });
        useWishlistStore.getState().clear();
      }
    };

    const unsub = useAuthStore.subscribe((s) => {
      if (s.hydrated && s.access !== prev) onAccess(s.access);
    });
    void Promise.resolve(useAuthStore.persist.rehydrate()).then(() => {
      useAuthStore.setState({ hydrated: true });
      onAccess(useAuthStore.getState().access, true);
    });
    void useCartStore.persist.rehydrate();
    return unsub;
  }, []);

  return <ToastProvider>{children}</ToastProvider>;
}
