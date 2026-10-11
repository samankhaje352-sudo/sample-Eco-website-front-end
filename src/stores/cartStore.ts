import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { api, ApiError, type Cart, type CartLineInput } from "@/lib/api";
import { useAuthStore } from "./authStore";

export const COUPON_LOGIN_MESSAGE = "برای استفاده از کد تخفیف وارد شوید";

/** Guest line: ids plus a display snapshot so it renders without the API. */
export interface GuestLine {
  variant_id: number;
  quantity: number;
  stock: number;
  product_name: string;
  product_slug: string;
  image: string | null;
  size: string;
  color_name: string;
  unit_price: number;
}

interface CartState {
  guestItems: GuestLine[];
  cart: Cart | null; // server cart (logged in)
  loading: boolean;
  error: string | null;
  add: (line: GuestLine) => Promise<boolean>;
  /** variantId identifies the line in both guest and server mode. */
  update: (variantId: number, quantity: number) => Promise<boolean>;
  remove: (variantId: number) => Promise<boolean>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => Promise<boolean>;
  refresh: () => Promise<void>;
  /** Merge guest items into the server cart, then clear them. */
  mergeGuest: () => Promise<void>;
  clearLocal: () => void;
  itemsCount: () => number;
}

const loggedIn = () => !!useAuthStore.getState().access;
const msg = (e: unknown) => (e instanceof ApiError ? e.message : "خطایی رخ داد.");

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      /** Run a server cart mutation, store the resulting cart or the error. */
      const run = async (fn: () => Promise<Cart>) => {
        set({ loading: true, error: null });
        try {
          set({ cart: await fn(), loading: false });
          return true;
        } catch (e) {
          set({ loading: false, error: msg(e) });
          return false;
        }
      };
      const findItemId = (variantId: number) =>
        get().cart?.items.find((i) => i.variant.id === variantId)?.id;

      return {
        guestItems: [],
        cart: null,
        loading: false,
        error: null,

        async add(line) {
          if (loggedIn()) {
            return run(() => api.cart.addItem({ variant_id: line.variant_id, quantity: line.quantity }));
          }
          const items = [...get().guestItems];
          const existing = items.find((i) => i.variant_id === line.variant_id);
          const wanted = (existing?.quantity ?? 0) + line.quantity;
          if (wanted > line.stock) {
            set({ error: "موجودی کافی نیست." });
            return false;
          }
          if (existing) existing.quantity = wanted;
          else items.push({ ...line });
          set({ guestItems: items, error: null });
          return true;
        },

        async update(variantId, quantity) {
          if (loggedIn()) {
            const id = findItemId(variantId);
            return id === undefined ? false : run(() => api.cart.updateItem(id, quantity));
          }
          if (quantity <= 0) return get().remove(variantId);
          const line = get().guestItems.find((i) => i.variant_id === variantId);
          if (!line) return false;
          if (quantity > line.stock) {
            set({ error: "موجودی کافی نیست." });
            return false;
          }
          set({
            guestItems: get().guestItems.map((i) =>
              i.variant_id === variantId ? { ...i, quantity } : i),
            error: null,
          });
          return true;
        },

        async remove(variantId) {
          if (loggedIn()) {
            const id = findItemId(variantId);
            return id === undefined ? false : run(() => api.cart.removeItem(id));
          }
          set({ guestItems: get().guestItems.filter((i) => i.variant_id !== variantId) });
          return true;
        },

        async applyCoupon(code) {
          if (!loggedIn()) {
            set({ error: COUPON_LOGIN_MESSAGE });
            return false;
          }
          return run(() => api.cart.applyCoupon(code));
        },
        async removeCoupon() {
          if (!loggedIn()) return false;
          return run(() => api.cart.removeCoupon());
        },

        async refresh() {
          if (!loggedIn()) return;
          await run(() => api.cart.get());
        },

        async mergeGuest() {
          const guest = get().guestItems;
          if (guest.length === 0) return get().refresh();
          const items: CartLineInput[] = guest.map((g) => ({
            variant_id: g.variant_id,
            quantity: g.quantity,
          }));
          const ok = await run(() => api.cart.merge(items));
          if (ok) set({ guestItems: [] });
        },

        clearLocal() {
          set({ cart: null, guestItems: [], error: null });
        },

        itemsCount() {
          const { cart, guestItems } = get();
          return loggedIn()
            ? (cart?.items_count ?? 0)
            : guestItems.reduce((n, i) => n + i.quantity, 0);
        },
      };
    },
    {
      name: "guest-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ guestItems: s.guestItems }),
      skipHydration: true,
    },
  ),
);

export interface CartLineView {
  variant_id: number;
  product_name: string;
  product_slug: string;
  image: string | null;
  size: string;
  color_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  stock: number;
}

export interface CartView {
  lines: CartLineView[];
  items_count: number;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  coupon: Cart["coupon"];
  isGuest: boolean;
}

/** Unified view: server cart when logged in, locally computed for guests. */
export function useCartView(): CartView {
  const authed = useAuthStore((s) => !!s.access);
  const cart = useCartStore((s) => s.cart);
  const guest = useCartStore((s) => s.guestItems);
  if (authed && cart) {
    return {
      lines: cart.items.map((i) => ({
        variant_id: i.variant.id,
        product_name: i.product.name,
        product_slug: i.product.slug,
        image: i.product.main_image,
        size: i.variant.size,
        color_name: i.variant.color.name,
        unit_price: i.unit_price,
        quantity: i.quantity,
        line_total: i.line_total,
        stock: i.variant.stock,
      })),
      items_count: cart.items_count,
      subtotal: cart.subtotal,
      discount: cart.discount,
      shipping_fee: cart.shipping_fee,
      total: cart.total,
      coupon: cart.coupon,
      isGuest: false,
    };
  }
  const lines = guest.map((g) => ({
    variant_id: g.variant_id,
    product_name: g.product_name,
    product_slug: g.product_slug,
    image: g.image,
    size: g.size,
    color_name: g.color_name,
    unit_price: g.unit_price,
    quantity: g.quantity,
    line_total: g.unit_price * g.quantity,
    stock: g.stock,
  }));
  const subtotal = lines.reduce((n, l) => n + l.line_total, 0);
  return {
    lines,
    items_count: lines.reduce((n, l) => n + l.quantity, 0),
    subtotal,
    discount: 0,
    shipping_fee: 0, // shipping is computed by the server at checkout
    total: subtotal,
    coupon: null,
    isGuest: !authed,
  };
}
