import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { api, type User } from "@/lib/api";
import { normalizePhone } from "@/lib/format";

interface AuthState {
  access: string | null;
  refresh: string | null;
  user: User | null;
  hydrated: boolean; // true after localStorage was read (client only)
  isAuthenticated: () => boolean;
  login: (phone: string, code: string) => Promise<{ user: User; is_new: boolean }>;
  logout: () => void;
  loadMe: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      access: null,
      refresh: null,
      user: null,
      hydrated: false,
      isAuthenticated: () => !!get().access,
      async login(phone, code) {
        const res = await api.auth.verifyOtp(normalizePhone(phone), code);
        set({ access: res.access, refresh: res.refresh, user: res.user });
        return { user: res.user, is_new: res.is_new };
      },
      logout() {
        set({ access: null, refresh: null, user: null });
      },
      async loadMe() {
        if (!get().access) return null;
        try {
          const user = await api.auth.me();
          set({ user });
          return user;
        } catch {
          return null;
        }
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ access: s.access, refresh: s.refresh, user: s.user }),
      skipHydration: true, // rehydrated in <Providers/> to avoid SSR mismatch
      onRehydrateStorage: () => () => useAuthStore.setState({ hydrated: true }),
    },
  ),
);

// Wire the API client to this store (client-side only matters; harmless on server).
api.client.setTokenProvider({
  getAccess: () => useAuthStore.getState().access,
  getRefresh: () => useAuthStore.getState().refresh,
  setAccess: (access) => useAuthStore.setState({ access }),
  onAuthFailure: () => useAuthStore.getState().logout(),
});
