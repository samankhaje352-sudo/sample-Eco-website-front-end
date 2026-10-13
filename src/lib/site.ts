/** Public site constants used for SEO (canonical URLs, Open Graph, JSON-LD). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
export const SITE_NAME = "پود";
export const SITE_TAGLINE = "لباس روزمره، دوخت درست.";
export const SITE_DESCRIPTION =
  "فروشگاه اینترنتی پوشاک پود؛ لباس مردانه، زنانه و بچگانه با قیمت منصفانه، ارسال رایگان برای خریدهای بالای یک میلیون تومان و تعویض سایز تا ۷ روز.";
export const THEME_STORAGE_KEY = "pood-theme";
