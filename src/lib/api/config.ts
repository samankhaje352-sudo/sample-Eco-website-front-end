/** The ONE place the API version lives. Moving to v2 = change this line. */
export const API_VERSION = "v1";

/** Full base URL (env var wins when set). */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? `http://localhost:8000/api/${API_VERSION}`
).replace(/\/+$/, "");
