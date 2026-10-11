import { ApiClient } from "./client";
import {
  AddressApi, AuthApi, CartApi, CatalogApi, OrderApi, WishlistApi,
} from "./resources";

export * from "./types";
export * from "./client";
export * from "./resources";
export { API_VERSION, API_BASE_URL } from "./config";

export class Api {
  readonly auth: AuthApi;
  readonly catalog: CatalogApi;
  readonly cart: CartApi;
  readonly wishlist: WishlistApi;
  readonly addresses: AddressApi;
  readonly orders: OrderApi;
  constructor(readonly client: ApiClient = new ApiClient()) {
    this.auth = new AuthApi(client);
    this.catalog = new CatalogApi(client);
    this.cart = new CartApi(client);
    this.wishlist = new WishlistApi(client);
    this.addresses = new AddressApi(client);
    this.orders = new OrderApi(client);
  }
}

/** Singleton used throughout the app. */
export const api = new Api();
