import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/** Lets the client read/write tokens without importing any store. */
export interface TokenProvider {
  getAccess(): string | null;
  getRefresh(): string | null;
  setAccess(access: string): void;
  onAuthFailure(): void;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  auth?: boolean; // send the Bearer header (default: true when a token exists)
  /** Next.js fetch caching for server components. */
  revalidate?: number | false;
  noStore?: boolean;
}

const FALLBACK_MESSAGE = "خطایی رخ داد. لطفا دوباره تلاش کنید.";

/** Extract a Persian message from `detail` or the first field error. */
export function extractMessage(data: unknown): string {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.detail === "string") return d.detail;
    for (const value of Object.values(d)) {
      if (Array.isArray(value) && typeof value[0] === "string") return value[0];
      if (typeof value === "string") return value;
    }
  }
  return FALLBACK_MESSAGE;
}

export class ApiClient {
  private tokens: TokenProvider | null = null;
  private refreshing: Promise<boolean> | null = null;

  constructor(readonly baseUrl: string = API_BASE_URL) {}

  setTokenProvider(provider: TokenProvider) {
    this.tokens = provider;
  }

  private buildUrl(path: string, query?: RequestOptions["query"]) {
    const url = new URL(`${this.baseUrl}/${path.replace(/^\/+/, "")}`);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
      }
    }
    return url.toString();
  }

  private async doFetch(path: string, opts: RequestOptions): Promise<Response> {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (opts.body !== undefined) headers["Content-Type"] = "application/json";
    const access = opts.auth === false ? null : this.tokens?.getAccess();
    if (access) headers.Authorization = `Bearer ${access}`;

    const init: RequestInit & { next?: { revalidate: number | false } } = {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    };
    if (opts.noStore) init.cache = "no-store";
    else if (opts.revalidate !== undefined) init.next = { revalidate: opts.revalidate };

    try {
      return await fetch(this.buildUrl(path, opts.query), init);
    } catch {
      throw new ApiError(0, "ارتباط با سرور برقرار نشد.");
    }
  }

  /** Single refresh at a time; resolves true when a new access token is set. */
  private refreshAccess(): Promise<boolean> {
    if (!this.refreshing) {
      this.refreshing = (async () => {
        const refresh = this.tokens?.getRefresh();
        if (!refresh) return false;
        try {
          const res = await this.doFetch("auth/token/refresh/", {
            method: "POST",
            body: { refresh },
            auth: false,
            noStore: true,
          });
          if (!res.ok) return false;
          const data = (await res.json()) as { access: string };
          this.tokens?.setAccess(data.access);
          return true;
        } catch {
          return false;
        }
      })().finally(() => {
        this.refreshing = null;
      });
    }
    return this.refreshing;
  }

  async request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
    let res = await this.doFetch(path, opts);

    if (res.status === 401 && opts.auth !== false && this.tokens?.getRefresh()) {
      if (await this.refreshAccess()) {
        res = await this.doFetch(path, opts); // exactly one retry
      } else {
        this.tokens.onAuthFailure();
      }
    }

    if (res.status === 204) return undefined as T;
    let data: unknown = null;
    try {
      data = await res.json();
    } catch {
      /* non-JSON body */
    }
    if (!res.ok) throw new ApiError(res.status, extractMessage(data), data);
    return data as T;
  }

  get<T>(path: string, query?: RequestOptions["query"], o: RequestOptions = {}) {
    return this.request<T>(path, { ...o, method: "GET", query });
  }
  post<T>(path: string, body?: unknown, o: RequestOptions = {}) {
    return this.request<T>(path, { ...o, method: "POST", body: body ?? {} });
  }
  patch<T>(path: string, body?: unknown, o: RequestOptions = {}) {
    return this.request<T>(path, { ...o, method: "PATCH", body: body ?? {} });
  }
  delete<T>(path: string, o: RequestOptions = {}) {
    return this.request<T>(path, { ...o, method: "DELETE" });
  }
}
