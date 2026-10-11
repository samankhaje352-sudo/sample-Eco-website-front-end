import { create } from "zustand";
import { api } from "@/lib/api";
import { useAuthStore } from "./authStore";

interface WishlistState {
  ids: number[]; // product ids
  loaded: boolean;
  has: (productId: number) => boolean;
  refresh: () => Promise<void>;
  /** Returns false when the user is not logged in. */
  toggle: (productId: number) => Promise<boolean>;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  ids: [],
  loaded: false,
  has: (id) => get().ids.includes(id),
  async refresh() {
    if (!useAuthStore.getState().access) return;
    try {
      const list = await api.wishlist.list();
      set({ ids: list.map((p) => p.id), loaded: true });
    } catch {
      /* ignore */
    }
  },
  async toggle(productId) {
    if (!useAuthStore.getState().access) return false;
    const had = get().has(productId);
    set({ ids: had ? get().ids.filter((i) => i !== productId) : [...get().ids, productId] });
    try {
      if (had) await api.wishlist.remove(productId);
      else await api.wishlist.add(productId);
    } catch {
      await get().refresh();
    }
    return true;
  },
  clear: () => set({ ids: [], loaded: false }),
}));
