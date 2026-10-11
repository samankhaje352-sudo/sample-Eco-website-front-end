// Contract types for API v1. v1 may only GAIN fields, so keep these additive.

export interface User {
  id: number;
  phone: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  children: Category[];
}

export interface Color {
  name: string;
  slug: string;
  hex: string;
}

export interface ProductList {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  final_price: number;
  discount_percent: number;
  main_image: string | null;
  category: { name: string; slug: string };
  colors: Color[];
  is_available: boolean;
}

export interface Variant {
  id: number;
  size: string;
  color: Color;
  stock: number;
}

export interface ProductDetail extends ProductList {
  description: string;
  images: { id: number; url: string; alt: string }[];
  variants: Variant[];
  sizes: string[];
  related: ProductList[];
}

export interface CartItem {
  id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  variant: Variant;
  product: { id: number; name: string; slug: string; main_image: string | null };
}

export interface Cart {
  items: CartItem[];
  items_count: number;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  coupon: { code: string; description: string } | null;
}

export interface Address {
  id: number;
  title: string;
  receiver_name: string;
  receiver_phone: string;
  province: string;
  city: string;
  postal_code: string;
  address_line: string;
}
export type AddressInput = Omit<Address, "id">;

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderList {
  number: string;
  status: OrderStatus;
  status_display: string;
  total: number;
  items_count: number;
  created_at: string;
  created_at_jalali: string;
}

export interface OrderItem {
  product_name: string;
  product_slug: string;
  size: string;
  color_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  image: string | null;
}

export interface OrderDetail extends OrderList {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping_fee: number;
  coupon_code: string | null;
  address: Omit<Address, "id"> & Partial<Pick<Address, "id">>;
  note: string;
  paid_at: string | null;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface FilterOptions {
  sizes: string[];
  colors: Color[];
  price_range: { min: number; max: number };
}

export interface HomeData {
  new_arrivals: ProductList[];
  discounted: ProductList[];
  categories: Omit<Category, "children">[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface VerifyResponse extends AuthTokens {
  user: User;
  is_new: boolean;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  min_price?: number | string;
  max_price?: number | string;
  size?: string;
  color?: string;
  in_stock?: string;
  ordering?: "newest" | "price" | "-price" | "discount" | string;
  page?: number | string;
}

export interface CartLineInput {
  variant_id: number;
  quantity: number;
}
