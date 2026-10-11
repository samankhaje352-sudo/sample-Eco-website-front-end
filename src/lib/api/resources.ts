import { ApiClient, type RequestOptions } from "./client";
import type {
  Address, AddressInput, Cart, CartLineInput, Category, FilterOptions, HomeData,
  OrderDetail, OrderList, Paginated, ProductDetail, ProductList, ProductQuery,
  User, VerifyResponse,
} from "./types";

class Resource {
  constructor(protected client: ApiClient) {}
}

export class AuthApi extends Resource {
  requestOtp(phone: string) {
    return this.client.post<{ detail: string; expires_in: number }>(
      "auth/otp/request/", { phone }, { auth: false });
  }
  verifyOtp(phone: string, code: string) {
    return this.client.post<VerifyResponse>("auth/otp/verify/", { phone, code }, { auth: false });
  }
  refresh(refresh: string) {
    return this.client.post<{ access: string }>("auth/token/refresh/", { refresh }, { auth: false });
  }
  me() {
    return this.client.get<User>("auth/me/");
  }
  updateMe(data: Partial<Pick<User, "first_name" | "last_name" | "email">>) {
    return this.client.patch<User>("auth/me/", data);
  }
}

/** Public endpoints; safe in server components (default revalidate 60s). */
export class CatalogApi extends Resource {
  private opts(o?: RequestOptions): RequestOptions {
    return { auth: false, revalidate: 60, ...o };
  }
  categories(o?: RequestOptions) {
    return this.client.get<Category[]>("categories/", undefined, this.opts(o));
  }
  products(query: ProductQuery = {}, o?: RequestOptions) {
    return this.client.get<Paginated<ProductList>>(
      "products/", query as Record<string, string | number>, this.opts(o));
  }
  product(slug: string, o?: RequestOptions) {
    return this.client.get<ProductDetail>(
      `products/${encodeURIComponent(slug)}/`, undefined, this.opts(o));
  }
  filters(o?: RequestOptions) {
    return this.client.get<FilterOptions>("filters/", undefined, this.opts(o));
  }
  home(o?: RequestOptions) {
    return this.client.get<HomeData>("home/", undefined, this.opts(o));
  }
}

export class CartApi extends Resource {
  get() {
    return this.client.get<Cart>("cart/");
  }
  addItem(line: CartLineInput) {
    return this.client.post<Cart>("cart/items/", line);
  }
  updateItem(itemId: number, quantity: number) {
    return this.client.patch<Cart>(`cart/items/${itemId}/`, { quantity });
  }
  removeItem(itemId: number) {
    return this.client.delete<Cart>(`cart/items/${itemId}/`);
  }
  merge(items: CartLineInput[]) {
    return this.client.post<Cart>("cart/merge/", { items });
  }
  applyCoupon(code: string) {
    return this.client.post<Cart>("cart/coupon/", { code });
  }
  removeCoupon() {
    return this.client.delete<Cart>("cart/coupon/");
  }
}

export class WishlistApi extends Resource {
  list() {
    return this.client.get<ProductList[]>("wishlist/");
  }
  add(productId: number) {
    return this.client.post<{ detail: string }>("wishlist/", { product_id: productId });
  }
  remove(productId: number) {
    return this.client.delete<void>(`wishlist/${productId}/`);
  }
}

export class AddressApi extends Resource {
  list() {
    return this.client.get<Address[] | Paginated<Address>>("addresses/").then(
      (r) => (Array.isArray(r) ? r : r.results));
  }
  get(id: number) {
    return this.client.get<Address>(`addresses/${id}/`);
  }
  create(data: AddressInput) {
    return this.client.post<Address>("addresses/", data);
  }
  update(id: number, data: Partial<AddressInput>) {
    return this.client.patch<Address>(`addresses/${id}/`, data);
  }
  remove(id: number) {
    return this.client.delete<void>(`addresses/${id}/`);
  }
}

export class OrderApi extends Resource {
  create(address_id: number, note?: string) {
    return this.client.post<{ order: OrderDetail; payment_url: string }>(
      "orders/", { address_id, note });
  }
  list(page?: number) {
    return this.client.get<Paginated<OrderList>>("orders/", { page });
  }
  get(number: string) {
    return this.client.get<OrderDetail>(`orders/${encodeURIComponent(number)}/`);
  }
  pay(number: string) {
    return this.client.post<{ payment_url: string }>(`orders/${encodeURIComponent(number)}/pay/`);
  }
}
