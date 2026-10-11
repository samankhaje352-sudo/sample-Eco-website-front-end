# DESIGN.md: پود (Pood) storefront

Implementation spec for Next.js 15 + Tailwind v4. Engineers: do not make design decisions. If something is not covered, use the closest existing recipe in this file and leave a `// DESIGN-GAP:` comment.

---

## 1. Design Read, dials, brand

**Design Read:** Reading this as: mobile-first fashion storefront for urban Iranian shoppers 18-40, with a clean, confident, monochrome-plus-one-accent language, leaning toward Tailwind v4 utilities + Vazirmatn + quiet CSS-only motion, where commerce clarity (price, stock, size, cart) always wins over expression.

| Dial | Value | Why |
|---|---|---|
| `DESIGN_VARIANCE` | **4** | Asymmetry only on the home hero and category bento. Catalog, PDP, cart, checkout are strict grids: shoppers scan, they do not explore. |
| `MOTION_INTENSITY` | **3** | Hover/active feedback, drawer/sheet slide, toast enter, image zoom on hover. No scroll reveals, no loops (except skeleton pulse and button spinner). |
| `VISUAL_DENSITY` | **5** | Daily-app spacing. Product grids are 2-up on phones with tight gutters; sections use `py-10 md:py-16`. |

**Brand**
- Name: **پود** (Latin: **Pood**). "Pood" is the weft thread in weaving; short, easy to say, owns the "fabric" idea without cliché.
- Tone: direct, warm, plain Persian. No marketing filler (no «بی‌نظیر»، «فوق‌العاده»، «انقلابی»). Short sentences. Address the user as «شما».
- Tagline: **«لباس روزمره، دوخت درست.»**
- Logo: a 28px square (`size-7 rounded-md bg-primary`) containing the letter «پ» (`text-base font-black text-primary-contrast`, centered), followed by the wordmark «پود» (`text-xl font-black text-ink`). Gap `gap-2`. No SVG, no gradient. Whole lockup is a `<Link href="/" aria-label="پود، صفحه اصلی">`.
- Palette in one line: cool off-white + off-black ink, one deep turquoise accent (`#0B6B66`, nod to Persian firoozeh), brick red reserved strictly for sale prices.

---

## 2. Tokens

### 2.1 Paste into `src/app/globals.css` (replace current content)

```css
@import "tailwindcss";

/* Runtime tokens. Light is default; dark is a token swap only. */
:root {
  color-scheme: light;
  --bg: #F4F5F5;              /* page background */
  --surface: #FCFCFC;         /* cards, inputs, header, sheets */
  --surface-muted: #E9ECEC;   /* image wells, skeletons, footer, chips */
  --ink: #15191A;             /* primary text */
  --ink-muted: #545C5F;       /* secondary text, meta */
  --ink-subtle: #656D70;      /* placeholders, struck prices; only on bg/surface */
  --border: #DCE0E1;          /* dividers, card outlines (decorative) */
  --border-strong: #858E91;   /* input/select/control borders (3:1 non-text) */
  --primary: #15191A;         /* main CTA fill (ink black) */
  --primary-hover: #2A3032;
  --primary-contrast: #FCFCFC;
  --accent: #0B6B66;          /* links, selected state, focus ring, info */
  --accent-strong: #08524E;   /* accent text on accent-soft, accent hover */
  --accent-soft: #DDEEEC;
  --accent-contrast: #FCFCFC;
  --sale: #C0352B;            /* discounted price + percent badge ONLY */
  --sale-soft: #FBE7E4;
  --sale-contrast: #FCFCFC;
  --success: #1E7346;
  --success-soft: #E2F2E8;
  --warning: #8F5300;
  --warning-soft: #FBEED9;
  --danger: #B42318;
  --danger-soft: #FCE8E6;
  --overlay: rgb(21 25 26 / 0.45);
  --shadow-color: 192 10% 10%;
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --bg: #0F1213;
    --surface: #171B1C;
    --surface-muted: #22282A;
    --ink: #ECEFEF;
    --ink-muted: #A4ADAF;
    --ink-subtle: #869093;
    --border: #2D3436;
    --border-strong: #5E686B;
    --primary: #ECEFEF;
    --primary-hover: #D9DEDF;
    --primary-contrast: #15191A;
    --accent: #4DB6AD;
    --accent-strong: #7FD3CB;
    --accent-soft: #16302E;
    --accent-contrast: #0F1213;
    --sale: #FF7B6E;
    --sale-soft: #3A1D1A;
    --sale-contrast: #15191A;
    --success: #5CC98C;
    --success-soft: #16301F;
    --warning: #F2B45A;
    --warning-soft: #35270F;
    --danger: #FF8A80;
    --danger-soft: #3A1A18;
    --overlay: rgb(0 0 0 / 0.6);
    --shadow-color: 200 20% 2%;
  }
}

@theme inline {
  --font-sans: var(--font-vazirmatn), ui-sans-serif, system-ui, sans-serif;

  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-ink-subtle: var(--ink-subtle);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-contrast: var(--primary-contrast);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
  --color-accent-soft: var(--accent-soft);
  --color-accent-contrast: var(--accent-contrast);
  --color-sale: var(--sale);
  --color-sale-soft: var(--sale-soft);
  --color-sale-contrast: var(--sale-contrast);
  --color-success: var(--success);
  --color-success-soft: var(--success-soft);
  --color-warning: var(--warning);
  --color-warning-soft: var(--warning-soft);
  --color-danger: var(--danger);
  --color-danger-soft: var(--danger-soft);
  --color-overlay: var(--overlay);

  --shadow-card: 0 1px 2px hsl(var(--shadow-color) / 0.06), 0 2px 8px -2px hsl(var(--shadow-color) / 0.08);
  --shadow-pop: 0 4px 12px -2px hsl(var(--shadow-color) / 0.12), 0 16px 40px -8px hsl(var(--shadow-color) / 0.18);
}

@theme {
  /* Type scale tuned for Vazirmatn (tall Persian ascenders/descenders need loose leading). */
  --text-xs: 0.75rem;   --text-xs--line-height: 1.25rem;   /* 12/20 meta, badges */
  --text-sm: 0.875rem;  --text-sm--line-height: 1.5rem;    /* 14/24 card names, labels, buttons */
  --text-base: 1rem;    --text-base--line-height: 1.75rem; /* 16/28 body, inputs */
  --text-lg: 1.125rem;  --text-lg--line-height: 1.875rem;  /* 18/30 prices on PDP, sub-heads */
  --text-xl: 1.25rem;   --text-xl--line-height: 2rem;      /* 20/32 section titles mobile */
  --text-2xl: 1.5rem;   --text-2xl--line-height: 2.25rem;  /* 24/36 section titles, PDP name mobile */
  --text-3xl: 1.875rem; --text-3xl--line-height: 2.625rem; /* 30/42 page H1 desktop, hero mobile */
  --text-4xl: 2.25rem;  --text-4xl--line-height: 3.125rem; /* 36/50 hero tablet */
  --text-5xl: 3rem;     --text-5xl--line-height: 4rem;     /* 48/64 hero desktop (max) */

  --radius-sm: 6px;    /* badges, swatch-check, small chips */
  --radius-md: 10px;   /* buttons, inputs, selects, size chips, thumbnails */
  --radius-lg: 16px;   /* cards, product images, panels, sheets, tiles */

  --container-page: 80rem;  /* max-w-page = 1280px */
  --container-prose: 40rem; /* max-w-prose = ~65ch body copy */

  --ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1);
}

html { background: var(--bg); }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-vazirmatn), ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
::selection { background: var(--accent-soft); color: var(--ink); }

/* Global focus style for anything focusable that has no custom recipe. */
:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Hide scrollbar on horizontal rails only (class: rail). */
.rail { scrollbar-width: none; }
.rail::-webkit-scrollbar { display: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 2.2 Semantic usage table

| Token (utility) | Use for | Never use for |
|---|---|---|
| `bg-bg` | `<body>`, page background | cards |
| `bg-surface` | header, cards that need edges, inputs, sheets, toasts, dropdowns | page background |
| `bg-surface-muted` | product image wells, skeletons, footer, tag chips, qty stepper bg | text containers holding `text-ink-subtle` |
| `text-ink` | headings, body, prices | |
| `text-ink-muted` | meta (category name, size/color line, helper text, counts) | prices, primary content |
| `text-ink-subtle` | placeholders, struck-through original price, disabled-ish meta | anything on `bg-surface-muted` |
| `border-border` | dividers, card outlines | input borders |
| `border-border-strong` | inputs, selects, secondary buttons, unselected size chips, checkboxes | |
| `bg-primary` / `text-primary-contrast` | the ONE main CTA per view (add to cart, checkout, pay, login), active pagination, selected size | |
| `accent*` | text links, selected swatch ring, selected address card, focus ring, info hint, "new" state | CTAs fills, sale prices |
| `sale*` | discounted final price, percent badge | errors, hearts, anything else |
| `success/warning/danger` + `-soft` | status badges, inline form errors (danger), stock warning (warning), discount line in totals (success) | decoration |

### 2.3 Contrast (WCAG 2.x, computed)

Light mode:
| Pair | Ratio | Result |
|---|---|---|
| ink on bg / surface / surface-muted | 16.2 / 17.3 / 14.9 | AAA |
| ink-muted on bg / surface / surface-muted | 6.3 / 6.7 / 5.8 | AA |
| ink-subtle on bg / surface | 4.8 / 5.1 | AA (do not use on surface-muted: 4.45) |
| primary-contrast on primary | 17.3 | AAA |
| accent on bg / surface | 5.8 / 6.2 | AA |
| accent-contrast on accent | 6.2 | AA |
| accent-strong on accent-soft | 7.5 | AAA |
| sale on bg / surface | 5.1 / 5.4 | AA |
| sale-contrast on sale (badge) | 5.4 | AA |
| sale on sale-soft | 4.7 | AA |
| success / warning / danger on their -soft | 5.0 / 5.4 / 5.6 | AA |
| danger on surface (error text) | 6.4 | AA |
| border-strong vs surface / bg (control edge) | 3.3 / 3.1 | AA non-text (3:1) |

Dark mode: ink on bg 16.3, ink-muted on surface 7.6, ink-subtle on surface 5.3, accent on surface 7.1, sale on surface 6.9, sale-contrast on sale 6.9, accent-strong on accent-soft 8.1, success/warning/danger on -soft 6.9/7.9/6.9, border-strong vs surface 3.0. All pass AA.

### 2.4 Spacing rhythm, containers, breakpoints, z-index

- Base unit 4px (Tailwind default). Allowed steps: `1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20`. Do not use odd arbitrary values.
- Page container (every route): `mx-auto w-full max-w-page px-4 md:px-6 lg:px-8`.
- Vertical section rhythm: home sections `py-10 md:py-16`; section title to content `mb-5 md:mb-6`; inner stacks `space-y-4`; form fields `gap-4` (grid), field internals `gap-1.5`.
- Breakpoints (Tailwind defaults): base = phone (design target 375px), `md` 768 = tablet (3-col grids), `lg` 1024 = desktop (desktop header nav, filter sidebar, 2-column PDP/cart/checkout), `xl` 1280 = 4-col product grids on home.
- Viewport: never `h-screen`/`min-h-screen`; use `min-h-dvh` (fix `layout.tsx` body).
- z-index scale (only these): header `z-30`, mobile search row `z-30`, overlay/backdrop `z-40`, drawer/sheet `z-50`, toast `z-[60]`.
- `layout.tsx`: change `<main>` to `className="flex-1"` (remove `max-w-5xl p-4`); each page renders its own container. Body: `min-h-dvh flex flex-col bg-bg text-ink antialiased`.

---

## 3. Global rules

### 3.1 RTL
- `<html lang="fa" dir="rtl">` (already set). Use only logical utilities: `ps-/pe-/ms-/me-/start-/end-/text-start/text-end/border-s/border-e/rounded-s/rounded-e`. Never `pl-/pr-/ml-/mr-/left-/right-/text-left/text-right` except inside `dir="ltr"` islands.
- "Start" is the right edge. Reading flow, logos and primary content begin on the right.
- Directional icons (do NOT CSS-flip lucide icons; pick the right glyph):
  - Forward / next / "see all" / breadcrumb separator / row affordance: `ChevronLeft` or `ArrowLeft`.
  - Back / previous: `ChevronRight` or `ArrowRight`.
  - Non-directional, never flipped: `Search, Heart, ShoppingBag, UserRound, Plus, Minus, X, Check, Trash2, Truck, Info`.
  - `SlidersHorizontal`, `Menu` are symmetric; use as is.
- Drawers: main menu drawer slides in from the start (right) edge; filter sheet comes from the bottom.
- LTR islands: phone numbers, OTP, postal code, order numbers with Latin letters, `mm:ss` timers. Wrap in `<span dir="ltr">` / `<input dir="ltr">`. Inputs with `dir="ltr"` keep `text-left` (natural start), and `placeholder` still Persian digits.

### 3.2 Numbers and prices
- Persian digits everywhere visible: always pass through `toPersianDigits()`; prices through `formatPrice()` (gives «۱٬۲۹۰٬۰۰۰ تومان», thousands separator U+066C). Counts: `toPersianDigits(n)`; percent: `${toPersianDigits(p)}٪` (U+066A).
- Inputs accept Persian, Arabic or Latin digits; normalize with `toEnglishDigits()` before validation/submit. Display typed value as is.
- Price layout: in summaries and line items, label at start and value at end (`flex items-baseline justify-between`), value `tabular-nums font-medium`. Final total `text-lg font-bold`.
- Price stacking order in a block: final price first (bold), original struck price next to/under it (muted, `line-through`), percent badge at the end. Currency word «تومان» stays in the same text run, same color, `font-normal` (wrap the word in `<span class="text-xs font-normal">` only on ProductCard and PDP; keep as plain text elsewhere). Implement via a `<Price>` component (4.10) so it is never hand-rolled.
- Never letter-space Persian text (`tracking-*` is forbidden on Persian; allowed only on digit-only OTP input). Never `uppercase`. Keep ZWNJ (U+200C) in copy exactly as written in this spec (e.g. «می‌شوید»، «علاقه‌مندی‌ها»).

### 3.3 Focus, motion, images
- Focus ring: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent` (also set globally in CSS). Inputs use border+ring recipe (4.3). Never `outline-none` without replacement.
- Transitions:
  - Color/background/border: `transition-colors duration-150 ease-out`.
  - Transform (press, image zoom, toast, sheet): `transition-transform duration-200 ease-out-soft`; image zoom `duration-500`; drawer/sheet `duration-300`.
  - Press feedback on every button: `active:scale-[0.98]`.
  - Loops allowed: `motion-safe:animate-pulse` (skeleton), `motion-safe:animate-spin` (button loader). Nothing else loops.
  - The global reduced-motion block in 2.1 disables everything else; also prefix zoom with `motion-safe:`.
- Images: product images are 4:5 (800x1000). Every product image wrapper: `relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted`; image `next/image` with `fill`, `className="object-cover"`, explicit `sizes` (given per component). `alt` = product name (or API `alt`). If `main_image` is null: render the wrapper with a centered `Shirt` icon `size-10 text-ink-subtle`. Hero/first-row images: `priority`.
- Only imagery on the site: product images and (if non-null) category images from the API. No stock, picsum, illustrations, hand-drawn SVG, emoji.

### 3.4 Forbidden (AI tells relevant here)
- Em-dash `—` and en-dash `–` anywhere visible (also remove the `" — "` in current `ProductList.tsx`). Use comma, period, colon, parentheses, or layout.
- Middle-dot chains (`·`) as separators. Separate metadata with `gap-3` spans or line breaks.
- Eyebrow labels above section titles (and Persian cannot be uppercase-tracked anyway). Zero eyebrows on the site.
- Purple/neon gradients, glows, glassmorphism, gradient text, mesh blobs, pure `#000`/`#fff`.
- Three equal feature cards. Section numbering («۰۱»), step labels («مرحله ۱»), scroll cues, decorative status dots, version strings, fake counters («فقط ۳ نفر در حال مشاهده»), fake reviews/ratings (API has none: do not show stars).
- Labels/pills overlaid on product images (the discount badge lives in the price block, not on the image). The only thing on an image is the wishlist button.
- Filler copy («تجربه‌ای بی‌نظیر»، «ارتقا دهید»). Duplicate CTA intent on one page (one label per intent, listed in 5).
- Placeholder-as-label. Generic spinners for content loading (use skeletons). `window` scroll listeners.
- Icons from anything other than `lucide-react`; always `strokeWidth={1.75}`; sizes: 16 (`size-4`) inline, 20 (`size-5`) buttons/header, 24 (`size-6`) empty-state tiles only inside circles of `size-16` with icon `size-7`.

---

## 4. Components

Install first: `npm install lucide-react`. Put shared UI in `src/components/ui/`. Use a tiny `cn()` helper (`src/lib/cn.ts`: join truthy class strings; no extra dependency).

### 4.1 Button (`ui/Button.tsx`)
Props: `variant: "primary" | "secondary" | "ghost" | "danger-ghost" | "link"`, `size: "sm" | "md" | "lg"`, `loading?`, `fullWidth?`, `iconStart?`, `iconEnd?`, plus native props. Renders `<button>`; `asChild`-like `href` prop renders `next/link` with identical classes.

Base: `inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100`

Sizes:
| size | classes | icon |
|---|---|---|
| sm | `h-9 px-3 text-sm rounded-md` | `size-4` |
| md (default) | `h-11 px-5 text-sm rounded-md` | `size-5` |
| lg | `h-12 px-6 text-base rounded-md` | `size-5` |
| icon-only (any variant) | `size-11 p-0 rounded-full` (sm: `size-9`) + required `aria-label` | `size-5` |

Variants:
| variant | default | hover | notes |
|---|---|---|---|
| primary | `bg-primary text-primary-contrast` | `hover:bg-primary-hover` | one per view |
| secondary | `bg-surface text-ink border border-border-strong` | `hover:bg-surface-muted` | |
| ghost | `bg-transparent text-ink` | `hover:bg-surface-muted` | icon buttons in header |
| danger-ghost | `bg-transparent text-danger` | `hover:bg-danger-soft` | remove, delete, logout |
| link | `h-auto px-0 text-accent underline-offset-4` | `hover:underline hover:text-accent-strong` | no scale on active |

Loading: `aria-busy="true"`, `disabled`, replace `iconStart` with `<Loader2 className="size-4 motion-safe:animate-spin" />`, keep label text (labels given per use, e.g. «در حال افزودن»). Width must not jump: keep `fullWidth` or `min-w` same.
`fullWidth`: `w-full`. Labels never wrap (`whitespace-nowrap`); primary labels max 3 words.

### 4.2 Icon button with count badge (header cart/wishlist)
Wrapper `relative`; button = ghost icon-only. Badge: `absolute -top-0.5 -end-0.5 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-contrast text-[11px] leading-5 font-bold text-center tabular-nums ring-2 ring-surface`. Show only when count > 0; `99+` shown as `۹۹+`. `aria-label` on the link: `سبد خرید، ${toPersianDigits(n)} کالا`.

### 4.3 Input, Textarea, Select, Field
Field wrapper: `flex flex-col gap-1.5`.
- Label: `text-sm font-medium text-ink`; optional marker: `<span class="text-ink-muted font-normal"> (اختیاری)</span>`. Required fields carry no asterisk; optional ones are marked.
- Input: `h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-base text-ink placeholder:text-ink-subtle transition-colors duration-150 hover:border-ink-muted focus-visible:outline-none focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/20 disabled:bg-surface-muted disabled:text-ink-muted disabled:cursor-not-allowed`. (`text-base` = 16px prevents iOS zoom.)
- Error: add `border-danger focus-visible:border-danger focus-visible:ring-danger/20`, `aria-invalid="true"`, `aria-describedby` to the message. Message: `flex items-center gap-1.5 text-sm text-danger` with `CircleAlert size-4 shrink-0`.
- Helper: `text-xs text-ink-muted` (always below input, above error if both).
- Textarea: Input classes but `h-auto min-h-28 py-2.5 leading-7 resize-y`.
- Select: native `<select>` with Input classes + `appearance-none pe-10`; wrapper `relative`; icon `ChevronDown size-4 text-ink-muted absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none`.
- Input with trailing action (coupon, price range unit): wrapper `flex gap-2`; input `flex-1`.
- Numeric/LTR inputs (phone, postal code): `dir="ltr" inputMode="numeric" autoComplete="tel"` (postal: `autoComplete="postal-code"`).

### 4.4 Checkbox, Switch, Radio card
- Checkbox: native `<input type="checkbox">` `size-5 rounded-sm border-border-strong accent-[var(--accent)]` + label `text-sm text-ink`; row `flex items-center gap-2.5 min-h-10 cursor-pointer`.
- Switch («فقط کالاهای موجود»): `<button role="switch" aria-checked>`; track `relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-150`, off `bg-border-strong`, on `bg-accent`; thumb `absolute top-0.5 start-0.5 size-5 rounded-full bg-surface shadow-card transition-transform duration-200 ease-out-soft`, on `-translate-x-5` (RTL: moves toward the left/end). Label to its start, row `flex items-center justify-between gap-3`.
- Radio card (address picker, shipping-like choices): `<label>` wrapping visually hidden `<input type="radio" class="sr-only peer">`; card `block rounded-lg border border-border bg-surface p-4 cursor-pointer transition-colors duration-150 hover:border-border-strong peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent`; checked (`has-[:checked]:` on the label): `has-[:checked]:border-accent has-[:checked]:bg-accent-soft/50`; selected indicator at end top: `CircleCheck size-5 text-accent` visible only when checked, else `Circle size-5 text-border-strong`.

### 4.5 Badge
Base `inline-flex items-center gap-1 rounded-sm px-2 h-6 text-xs font-medium whitespace-nowrap`.
| kind | classes |
|---|---|
| neutral | `bg-surface-muted text-ink` |
| accent | `bg-accent-soft text-accent-strong` |
| sale (percent) | `bg-sale text-sale-contrast font-bold tabular-nums h-5 px-1.5` |
| success | `bg-success-soft text-success` |
| warning | `bg-warning-soft text-warning` |
| danger | `bg-danger-soft text-danger` |

### 4.6 OrderStatusBadge
Badge + leading icon `size-3.5`. Text = API `status_display`; fallback map below.
| status | kind | icon | fallback text |
|---|---|---|---|
| pending | warning | `Clock` | در انتظار پرداخت |
| paid | accent | `CreditCard` | پرداخت شده |
| processing | neutral | `PackageOpen` | در حال آماده‌سازی |
| shipped | accent | `Truck` | ارسال شده |
| delivered | success | `PackageCheck` | تحویل شده |
| cancelled | danger | `CircleX` | لغو شده |

### 4.7 Toast and inline alerts
- Toast container: `fixed z-[60] inset-x-4 bottom-4 md:inset-x-auto md:end-6 md:bottom-6 md:w-96 flex flex-col gap-2 pb-[env(safe-area-inset-bottom)]`.
- Toast: `flex items-start gap-3 rounded-lg bg-surface text-ink border border-border shadow-pop p-4 text-sm`; enter from `translate-y-2 opacity-0` to `translate-y-0 opacity-100` (`transition duration-200 ease-out-soft`). Icon: success `CircleCheck text-success`, error `CircleAlert text-danger`, info `Info text-accent` (`size-5 shrink-0`). Optional action link (Button `link` size sm) at end. Close `X` ghost icon-only sm, `aria-label="بستن"`. Auto-dismiss 4000ms (errors 6000ms). `role="status" aria-live="polite"` (errors `role="alert"`).
- Use toast only for transient results (added to cart, removed, saved, network error on an action). Form/validation errors are inline.
- Inline alert (page/section-level error, coupon result, OTP hint): `flex items-start gap-2 rounded-md px-3 py-2.5 text-sm` + kind: info `bg-accent-soft text-accent-strong` (`Info`), error `bg-danger-soft text-danger` (`CircleAlert`), success `bg-success-soft text-success` (`CircleCheck`), warning `bg-warning-soft text-warning` (`TriangleAlert`).

### 4.8 EmptyState
Centered column: `flex flex-col items-center text-center gap-3 py-16 px-4 max-w-sm mx-auto`. Icon tile `grid place-items-center size-16 rounded-full bg-surface-muted text-ink-muted` with icon `size-7`. Title `text-lg font-bold text-ink`. Body `text-sm text-ink-muted`. Action: Button primary md, `mt-2`. Copy per page in section 5.

### 4.9 Skeletons
Block: `rounded-md bg-surface-muted motion-safe:animate-pulse`. Never spinners for content.
- ProductCardSkeleton: image `aspect-[4/5] rounded-lg`, then `mt-3 h-3 w-1/3`, `mt-2 h-4 w-4/5`, `mt-2 h-4 w-1/2`.
- Grid skeleton: render 8 (home) / 12 (catalog) card skeletons in the same grid classes.
- PDP skeleton: gallery `aspect-[4/5] rounded-lg` + info lines (h-8 w-3/4, h-6 w-1/3, 5 size chips `h-10 w-12`, h-12 w-full button).
- Cart line skeleton: `w-24 aspect-[4/5] rounded-md` + 3 lines. Order row skeleton: `h-24 rounded-lg`.
- `loading.tsx` per route uses these.

### 4.10 Price (`ui/Price.tsx`)
Props: `price`, `finalPrice`, `discountPercent`, `size: "card" | "pdp" | "line"`, `available`.
- Wrapper `flex flex-wrap items-baseline gap-x-2 gap-y-0.5`.
- Discounted (`discountPercent > 0`):
  - final: card `text-sm font-bold text-sale`, pdp `text-2xl font-bold text-sale`, line `text-sm font-bold text-ink`.
  - original: `<s class="text-xs text-ink-subtle tabular-nums">` (pdp `text-sm`), with `aria-label="قیمت قبل: ..."`.
  - percent: sale Badge `${fa(p)}٪`. Card order: [final][percent] on line 1, [original] on line 2 (`basis-full`). PDP order: [final][original][percent] one line.
- Not discounted: final in `text-ink font-bold` (card `text-sm`, pdp `text-2xl`). On card, reserve the second line: `min-h-[2.75rem]` on the price block so cards align.
- «تومان»: in card/pdp, render the number and then `<span class="text-xs font-normal text-ink-muted ms-1">تومان</span>` (split the `formatPrice` output or add a `formatNumber` helper). Original struck price keeps «تومان» out (number only).
- Unavailable (`available === false`): replace the whole block with `<span class="text-sm font-medium text-ink-muted">ناموجود</span>`.

### 4.11 ColorDots / ColorSwatch / SizeChip / QtyStepper
- ColorDots (card, read-only): `flex items-center gap-1.5`; dot `size-3 rounded-full ring-1 ring-inset ring-ink/15` with `style={{backgroundColor: hex}}`; max 4, then `text-xs text-ink-muted` `+${fa(rest)}`. `aria-label` on wrapper: «رنگ‌ها: مشکی، سرمه‌ای، ...». Hide if 0 or 1 color.
- ColorSwatch (PDP and filters, selectable): `<button aria-pressed aria-label={color.name} title={color.name}>` `relative size-9 rounded-full ring-1 ring-inset ring-ink/15 transition-shadow duration-150` + bg hex; selected: wrapper ring `outline-2 outline-offset-2 outline-accent` (use `aria-pressed:outline-2 aria-pressed:outline-offset-2 aria-pressed:outline-accent`). Unavailable color (all variants out of stock): `opacity-40` + diagonal line via `after:absolute after:inset-x-1 after:top-1/2 after:h-px after:-rotate-45 after:bg-ink` and still clickable (so user can see sizes). Filter version `size-8`, row `flex flex-wrap gap-3`.
- SizeChip: `<button aria-pressed>` `inline-flex h-10 min-w-12 items-center justify-center rounded-md border px-3 text-sm font-medium tabular-nums transition-colors duration-150`; default `border-border-strong bg-surface text-ink hover:border-ink`; selected `border-primary bg-primary text-primary-contrast`; sold out `border-border bg-surface-muted text-ink-subtle line-through cursor-not-allowed` + `aria-disabled="true"` + `aria-label="سایز L، ناموجود"` (do not use `disabled` so it stays focusable and announced). Row `flex flex-wrap gap-2`. Size labels shown as API gives (e.g. "S", "M", "XL", "۳۸"); numeric sizes through `toPersianDigits`.
- QtyStepper: `inline-flex h-10 items-center rounded-md border border-border-strong bg-surface`; buttons `size-10 grid place-items-center text-ink hover:bg-surface-muted disabled:text-ink-subtle disabled:hover:bg-transparent` with `Plus` (start side, increments) and `Minus` (end side) `size-4`, `aria-label` «افزایش تعداد» / «کاهش تعداد»; value `w-10 text-center text-sm font-bold tabular-nums` in Persian digits, `aria-live="polite"`. Min 1 (at 1 the minus is disabled in PDP; in cart, at 1 the minus becomes `Trash2` with `aria-label="حذف از سبد"`). Max = variant stock (plus disabled at max). Updating state in cart: stepper `opacity-60 pointer-events-none` while request pending.

### 4.12 ProductCard (`components/ProductCard.tsx`)
Structure (`<article class="group relative flex flex-col">`):
1. Image link: `<Link href="/products/{slug}" class="block relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted">` → `<Image fill sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw" class="object-cover transition-transform duration-500 ease-out-soft motion-safe:group-hover:scale-[1.03]">`. Sold out: image gets `opacity-60 grayscale-[30%]`.
2. Wishlist button (absolute over image): `absolute top-2 end-2 z-10 grid place-items-center size-9 rounded-full bg-surface/90 text-ink shadow-card transition-colors duration-150 hover:bg-surface active:scale-95`. Icon `Heart size-[18px]`; active state `fill-current` (ink fill, not red). `aria-pressed`, `aria-label` = «افزودن به علاقه‌مندی‌ها» / «حذف از علاقه‌مندی‌ها». Guest click → existing auth flow (redirect to `/login`). Optimistic toggle; on failure revert + error toast.
3. Body `mt-3 flex flex-col gap-1`:
   - Row: category name `text-xs text-ink-muted` at start, ColorDots at end (`flex items-center justify-between gap-2`).
   - Name: `<h3>` → `<Link class="text-sm font-medium text-ink line-clamp-2 min-h-12 hover:text-accent-strong transition-colors">` (full card is NOT one big link; image and name are links, so the heart stays a separate button).
   - Price block: `<Price size="card">` (handles discount, percent badge, sold-out text).
- No border, no shadow, no card background: the image well and spacing group the card.
- Grid (`ProductGrid`): `grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4 xl:gap-x-6` (catalog with sidebar uses `lg:grid-cols-3` and never 4). Render as `<ul>`/`<li>`.
- Rail variant (home discounted section): same card at fixed width `w-[44vw] max-w-56 md:w-60 shrink-0 snap-start`.

### 4.13 Header (`components/Header.tsx`)
- Announcement strip (above header, not sticky): `bg-primary text-primary-contrast text-xs` container `h-9 flex items-center justify-center gap-2`; `Truck size-4`; copy: «ارسال رایگان برای خریدهای بالای ۱ میلیون تومان».
- Header: `sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-b border-border` (blur is functional; if `@supports not (backdrop-filter)`, it is still opaque enough). Inner container `h-14 lg:h-16 flex items-center gap-3 lg:gap-6`.
- Desktop (lg+), in DOM/visual order from start: Logo; nav `<ul class="flex items-center gap-1">` with links «مردانه»، «زنانه»، «بچگانه» (from API top-level categories, `/products?category={slug}`) and «تخفیف‌ها» (`/products?ordering=discount`, `text-sale`); each link `h-10 px-3 inline-flex items-center rounded-md text-sm font-medium text-ink hover:bg-surface-muted`; active (current category) `text-accent-strong bg-accent-soft`. Then search form `ms-auto w-full max-w-sm`: Input `h-10 ps-10 bg-surface-muted border-transparent hover:border-border-strong` with `Search size-4 text-ink-muted absolute start-3`; placeholder «جستجو در محصولات»; submit on Enter → `/products?search=`. `aria-label="جستجو"`. Then actions `flex items-center gap-1`: wishlist (`Heart`, `aria-label="علاقه‌مندی‌ها"`, → `/profile/wishlist`), account (`UserRound`, label «حساب کاربری», → `/profile` or `/login`; when logged out on lg show text button secondary sm «ورود | ثبت‌نام» instead of icon), cart (`ShoppingBag` + count badge 4.2, → `/cart`).
- Mobile (<lg): start: menu button ghost icon-only `Menu` (`aria-label="منو"`, `aria-expanded`), Logo; end (`ms-auto`): search toggle (`Search`, `aria-label="جستجو"`), cart with badge. Search toggle opens a row below the header: `border-b border-border bg-surface px-4 py-2` with the search input (autofocus, `h-11`, `enterKeyHint="search"`) and a ghost `X` button «بستن جستجو».
- Mobile menu drawer: backdrop `fixed inset-0 z-40 bg-overlay` (fade `transition-opacity duration-300`); panel `fixed inset-y-0 start-0 z-50 w-[82vw] max-w-80 bg-surface shadow-pop flex flex-col` sliding from `translate-x-full` (RTL: off-screen to the right) to `translate-x-0`, `transition-transform duration-300 ease-out-soft`. Top: logo + close `X`. Body: category links as large rows `h-12 px-4 flex items-center justify-between text-base font-medium` with `ChevronLeft size-4 text-ink-muted`, children (if any) as an indented list `ps-8 text-sm text-ink-muted`; then divider `border-t border-border my-2`; rows «علاقه‌مندی‌ها» (`Heart`), «سفارش‌های من» (`Package`), «حساب کاربری» or «ورود | ثبت‌نام» (`UserRound`). Focus trap, `Escape` closes, body scroll lock, focus returns to the menu button.

### 4.14 Footer
`mt-16 bg-surface-muted border-t border-border`. Container `py-10 grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]`.
- Col 1: Logo, tagline `mt-3 text-sm text-ink-muted max-w-xs` «لباس روزمره، دوخت درست.», support line `mt-4 text-sm` «پشتیبانی: » + `<a dir="ltr" href="tel:02191004827">۰۲۱-۹۱۰۰۴۸۲۷</a>` and «شنبه تا پنجشنبه، ساعت ۹ تا ۱۸».
- Col 2 title «دسته‌بندی‌ها» (`text-sm font-bold mb-3`): links مردانه، زنانه، بچگانه، تخفیف‌ها (`text-sm text-ink-muted hover:text-ink`, list `space-y-2`).
- Col 3 title «خدمات مشتریان»: پیگیری سفارش (`/profile/orders`)، سبد خرید، حساب کاربری، آدرس‌ها.
- Mobile: col 2 and 3 side by side (`grid-cols-2` wrapper inside), col 1 above.
- Bottom bar: `border-t border-border py-4 text-xs text-ink-muted text-center` «© ۱۴۰۵ پود. همه حقوق محفوظ است.»

### 4.15 Section header (home and PDP related)
`flex items-end justify-between gap-4 mb-5 md:mb-6`: `<h2 class="text-xl md:text-2xl font-bold text-ink">` + Button `link` sm «مشاهده همه» with `iconEnd={<ChevronLeft className="size-4"/>}`. No subtitle, no eyebrow.

### 4.16 Pagination
`<nav aria-label="صفحه‌بندی" class="mt-12 flex items-center justify-center gap-1.5">`.
- Prev (start side): secondary sm with `ChevronRight` + «قبلی»; next (end side): «بعدی» + `ChevronLeft`. Hidden (not disabled) on first/last page; keep layout with `invisible`.
- Pages (md+): `size-10 rounded-md text-sm font-medium tabular-nums`: default `text-ink hover:bg-surface-muted`, current `bg-primary text-primary-contrast` + `aria-current="page"`. Show 1, current-1, current, current+1, last, with `…` (`text-ink-muted px-1`) for gaps.
- Mobile (<md): only prev, `text-sm text-ink-muted` «صفحه ۲ از ۸», next.
- Changing page scrolls to the top of the results (`scrollIntoView` on the results heading, smooth only if motion-safe).

### 4.17 Filter panel
Shared content component `FilterControls` used in both shells. Groups separated by `border-t border-border pt-5 mt-5` (first group no border). Group title `text-sm font-bold text-ink mb-3`.
1. «دسته‌بندی» tree: `<ul class="space-y-1">`, item link `flex h-9 items-center rounded-md px-2 text-sm text-ink-muted hover:bg-surface-muted hover:text-ink`; active `bg-accent-soft text-accent-strong font-medium`; children `ps-4`; first item «همه» clears category.
2. «محدوده قیمت (تومان)»: `grid grid-cols-2 gap-2` two inputs labeled «از» and «تا» (labels `text-xs text-ink-muted`), `inputMode="numeric"`, placeholders from API range in Persian digits with separators. Apply on blur and Enter. Helper below: `text-xs text-ink-muted` «از ۴۰۰٬۰۰۰ تا ۴٬۰۰۰٬۰۰۰ تومان» (from `price_range`). Error if min > max: «حداقل قیمت نباید از حداکثر بیشتر باشد.»
3. «سایز»: SizeChips (multi or single per API; `aria-pressed`), `flex flex-wrap gap-2`, chips `h-9 min-w-11`.
4. «رنگ»: ColorSwatch filter version with name tooltip via `title`; selected uses accent outline.
5. Switch «فقط کالاهای موجود».
- Desktop shell (lg+): `<aside class="hidden lg:block w-64 shrink-0">` inner `sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pe-2`. Title row: «فیلترها» `text-base font-bold` + (when any active) Button link sm «حذف همه».
- Mobile shell: trigger in the toolbar (5.2). Sheet: backdrop as drawer; panel `fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] rounded-t-lg bg-surface shadow-pop flex flex-col`, enter `translate-y-full` → `translate-y-0` `duration-300 ease-out-soft`. Grab handle `mx-auto mt-2 h-1 w-10 rounded-full bg-border-strong`. Header `flex items-center justify-between px-4 h-14 border-b border-border`: «فیلترها» `text-base font-bold` + `X` ghost icon «بستن». Body `flex-1 overflow-y-auto px-4 py-4`. Footer `border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] grid grid-cols-[1fr_2fr] gap-3`: secondary «حذف همه» + primary «نمایش نتایج» (closes the sheet; filters apply live as on desktop). Focus trap, Escape closes, `role="dialog" aria-modal="true" aria-labelledby`.
- Active filter chips (above grid, all sizes, only when any active): `flex flex-wrap gap-2 mb-5`; chip `inline-flex items-center gap-1 h-8 rounded-full bg-surface-muted ps-3 pe-1.5 text-xs text-ink` + remove button `size-6 rounded-full grid place-items-center hover:bg-border` with `X size-3.5` `aria-label="حذف فیلتر {label}"`. Chip labels: category name, «سایز M», color name, «۵۰۰٬۰۰۰ تا ۱٬۲۰۰٬۰۰۰ تومان», «فقط موجود». (Pill radius is the documented exception for removable chips and count badges only.)

### 4.18 Breadcrumb
`<nav aria-label="مسیر"><ol class="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">`; links `hover:text-ink`; separator `ChevronLeft size-3.5 text-ink-subtle` (`aria-hidden`); last item `text-ink` with `aria-current="page"`, `line-clamp-1`.

### 4.19 Dialog (confirm)
Only for destructive confirms if inline is impossible. Prefer inline confirm (5.10). If used: backdrop as drawer; panel `fixed z-50 inset-x-4 bottom-4 md:inset-auto md:start-1/2 md:top-1/2 md:translate-x-1/2 md:-translate-y-1/2 md:w-[26rem] rounded-lg bg-surface p-5 shadow-pop`.

---

## 5. Page layouts and copy

Shared page H1: `text-2xl md:text-3xl font-bold text-ink`. Page top spacing: `pt-6 md:pt-10`, bottom `pb-16`.
Shared error state (any failed fetch for a whole page/section): inline alert error with text «بارگذاری اطلاعات با خطا مواجه شد.» and Button secondary sm «تلاش دوباره» (`RotateCw`). Network action errors (toast): «ارتباط با سرور برقرار نشد. دوباره تلاش کنید.»
Document titles: `«{page} | پود»`; root `metadata.title` «پود | فروشگاه پوشاک».

### 5.1 Home `/`
Section order:
1. **Hero** (container, `pt-6 md:pt-12 pb-10 md:pb-16`), asymmetric split, NOT centered.
   - Desktop (`md:grid md:grid-cols-12 md:items-center md:gap-8`): text column `md:col-span-6 lg:col-span-5` at start (right); visual `md:col-span-6 lg:col-span-7` at end.
   - Text stack (max 3 elements + CTAs, no eyebrow):
     - H1 `text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink`: «لباسی برای هر روزِ شما»
     - Sub `mt-4 text-base md:text-lg text-ink-muted max-w-md`: «مردانه، زنانه و بچگانه با قیمت منصفانه. ارسال رایگان برای خریدهای بالای یک میلیون تومان.» (15 words)
     - CTAs `mt-7 flex flex-wrap gap-3`: primary lg «خرید محصولات جدید» → `/products?ordering=newest`; secondary lg «مشاهده تخفیف‌ها» → `/products?ordering=discount`.
   - Visual (real product images, no photos needed): a composition of the first 3 `new_arrivals` images on a turquoise-tinted block. Container `relative mt-8 md:mt-0 aspect-[5/4] md:aspect-[6/5]`. Background shape: `absolute inset-y-[8%] inset-x-0 rounded-lg bg-accent-soft`. Images (each a link to its product, rounded-lg, `shadow-card`, 4:5 wells `bg-surface-muted`, `object-cover`, `priority` on the first):
     - A (large): `absolute end-[6%] top-0 w-[46%]` (end = left side).
     - B: `absolute start-[8%] top-[10%] w-[32%]`.
     - C: `absolute start-[30%] bottom-0 w-[28%]`, `z-10`.
     - `sizes`: A `(min-width:768px) 28vw, 46vw`, B/C `(min-width:768px) 18vw, 30vw`. If fewer than 3 images exist, render only A centered on the block.
     - Hover on each: `motion-safe:hover:-translate-y-1 transition-transform duration-200`. No captions, no labels on images.
   - Mobile: text first, visual below at `aspect-[5/4]`, whole hero must show H1 + sub + CTAs within the first viewport (375x667) with the visual peeking below.
2. **Category bento** `py-10 md:py-16`, H2 «خرید بر اساس دسته‌بندی» (section header without «مشاهده همه»). Exactly 3 cells (top-level categories in API order).
   - Grid: `grid grid-cols-2 gap-3 md:grid-cols-3 md:grid-rows-2 md:gap-5 md:h-[28rem]`. Cell 1: `col-span-2 md:col-span-2 md:row-span-2 min-h-56`. Cells 2-3: `col-span-1 min-h-40 md:col-span-1 md:row-span-1`.
   - Tile: `<Link class="group relative flex flex-col justify-between overflow-hidden rounded-lg p-5 md:p-7 transition-colors">`. Backgrounds (diversity): tile 1 `bg-primary text-primary-contrast`, tile 2 `bg-accent-soft text-ink`, tile 3 `bg-surface-muted text-ink`.
   - Content: name `text-2xl md:text-3xl font-extrabold` (tile 1 `md:text-4xl`); bottom row `inline-flex items-center gap-1.5 text-sm font-medium` «مشاهده محصولات» + `ArrowLeft size-4 transition-transform duration-200 motion-safe:group-hover:-translate-x-1`.
   - If `category.image` is non-null: render it `absolute bottom-0 end-0 h-[85%] aspect-[4/5] object-contain` (`next/image`, `sizes="30vw"`) behind the text (`z-0`, text `relative z-10`); if null, nothing extra.
3. **New arrivals** `py-10 md:py-16`: section header «تازه‌ترین‌ها» + «مشاهده همه» → `/products?ordering=newest`. ProductGrid (2 / 3 / 4 cols) with 8 items. To avoid a ragged last row at md (3 cols), hide items 7-8 between md and xl: on those `li` add `md:hidden xl:block`. Mobile shows all 8 (4 rows).
4. **Service strip** (one line, not cards), `border-y border-border bg-surface`, container `py-6 grid grid-cols-1 gap-4 sm:grid-cols-3`. Each item `flex items-center gap-3`: icon `size-6 text-accent` + `<p class="text-sm"><b class="font-bold">title</b><br><span class="text-ink-muted">sub</span></p>`.
   - `Truck`: «ارسال رایگان» / «برای خریدهای بالای ۱ میلیون تومان»
   - `RefreshCcw`: «تعویض سایز» / «تا ۷ روز پس از تحویل»
   - `ShieldCheck`: «پرداخت امن» / «از طریق درگاه بانکی»
5. **Discounted rail** `py-10 md:py-16`: section header «تخفیف‌دارها» + «مشاهده همه» → `/products?ordering=discount`. Horizontal scroll-snap rail (different layout family from #3): `rail -mx-4 px-4 md:mx-0 md:px-0 flex gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2` with ProductCard rail variant. Desktop (md+) adds two buttons in the section header next to «مشاهده همه»: secondary icon-only sm `ChevronRight` («قبلی») and `ChevronLeft` («بعدی») that `scrollBy` ±80% of rail width (smooth only if motion-safe).
- Empty arrays: hide that section entirely. Loading: hero visual block skeleton + grid skeletons.

### 5.2 Catalog `/products`
- Container. Breadcrumb («خانه» › «محصولات» › category). H1: category name, or «نتایج جستجو برای «{q}»», or «همه محصولات». Count under H1 `mt-1 text-sm text-ink-muted`: «{n} محصول».
- Layout lg+: `mt-6 flex gap-8` = aside filters (4.17) at start + results `flex-1 min-w-0`.
- Toolbar (above grid), `flex items-center justify-between gap-3 mb-5`:
  - Mobile: sticky under header `sticky top-14 z-20 -mx-4 px-4 py-2 bg-bg/95 backdrop-blur-sm` with secondary sm «فیلترها» (`SlidersHorizontal`) + active count Badge accent (`۳`) and the sort Select (sm, `h-9`).
  - Desktop: only sort, at end: label `text-sm text-ink-muted` «مرتب‌سازی:» + Select `w-44 h-10`.
  - Sort options: «جدیدترین» (newest), «ارزان‌ترین» (price), «گران‌ترین» (-price), «بیشترین تخفیف» (discount).
- Active filter chips (4.17), then ProductGrid `grid-cols-2 md:grid-cols-3` (lg with sidebar stays 3), then Pagination.
- Search inside page: none (header search is the one search). The header input is prefilled with the current `search` value.
- Empty: icon `SearchX`, title «محصولی با این مشخصات پیدا نشد», body «فیلترها را تغییر دهید یا عبارت دیگری را جستجو کنید.», action primary «حذف فیلترها» (if no filters active: «مشاهده همه محصولات» → `/products`).
- Loading: toolbar stays, grid skeleton 12 cards.

### 5.3 Product `/products/[slug]`
- Breadcrumb: خانه › {category} › {name}.
- Layout: mobile single column; lg `grid grid-cols-12 gap-10 mt-6`: gallery `lg:col-span-7`, info `lg:col-span-5 lg:sticky lg:top-24 lg:self-start`.
- Gallery: main image well (4:5, `rounded-lg`, `priority`, `sizes="(min-width:1024px) 55vw, 100vw"`); on mobile full-bleed `-mx-4 rounded-none md:mx-0 md:rounded-lg`. If 2-3 images: thumbnails row `mt-3 flex gap-2` of buttons `w-16 md:w-20 aspect-[4/5] rounded-md overflow-hidden ring-1 ring-border`, selected `ring-2 ring-accent`, `aria-label="تصویر {i} از {n}"` (Persian digits), `aria-pressed`. Mobile also supports swipe: main image area is a `rail flex snap-x snap-mandatory overflow-x-auto` of full-width slides; thumbnails sync to the visible slide (IntersectionObserver). Single image: no thumbnails.
- Info column, `mt-6 lg:mt-0 flex flex-col`:
  1. Category link `text-sm text-accent hover:underline`.
  2. H1 `mt-1 text-2xl md:text-3xl font-bold`.
  3. Price `mt-4` `<Price size="pdp">`.
  4. Divider `my-6 border-t border-border`.
  5. Color: label row `text-sm` «رنگ: » + `<span class="font-bold">{selected name}</span>`, swatches `mt-3 flex flex-wrap gap-3`. Preselect the first color with stock.
  6. Size `mt-6`: label row `flex justify-between`: «سایز» `text-sm font-medium` (no size guide link; nothing to link to). Chips `mt-3`. Sold-out per selected color → sold-out chip style. Below chips: if selected variant stock ≤ 3: `mt-2 text-sm text-warning flex items-center gap-1.5` (`TriangleAlert size-4`) «فقط {n} عدد باقی مانده». Error if add clicked without size: `mt-2` danger message «لطفاً سایز را انتخاب کنید.» and focus moves to first size chip.
  7. Quantity `mt-6`: label «تعداد» + QtyStepper.
  8. Actions `mt-6 flex gap-3`: primary lg `flex-1` «افزودن به سبد خرید» (`ShoppingBag`); loading «در حال افزودن»; all variants out of stock → disabled «ناموجود». Wishlist secondary icon-only lg square `size-12 rounded-md` (`Heart`, filled when active, same aria-labels as card).
  9. Success: toast success «به سبد خرید اضافه شد.» with action link «مشاهده سبد» → `/cart`. Failure (stock): toast error «موجودی این کالا کافی نیست.»
  10. Service lines `mt-6 space-y-2 text-sm text-ink-muted`: `Truck` «ارسال رایگان برای خریدهای بالای ۱ میلیون تومان»، `RefreshCcw` «تعویض سایز تا ۷ روز پس از تحویل».
- Description section (below grid, full width) `mt-12 md:mt-16 max-w-prose`: H2 `text-xl font-bold` «توضیحات محصول», body `mt-3 text-base leading-8 text-ink whitespace-pre-line`.
- Related `mt-12 md:mt-16`: section header «محصولات مشابه» (no «مشاهده همه»), ProductGrid 2 / 4 cols (`md:grid-cols-4`), 4 items. Hide if empty.
- Not found: EmptyState `PackageX`, «این محصول پیدا نشد», «ممکن است حذف شده باشد یا نشانی را اشتباه وارد کرده باشید.», action «مشاهده محصولات» → `/products`.

### 5.4 Cart `/cart`
- H1 «سبد خرید» + `text-ink-muted text-base font-normal ms-2` «({n} کالا)».
- Layout: mobile stacked (lines, then summary); lg `grid grid-cols-12 gap-8 mt-6`: lines `lg:col-span-8`, summary `lg:col-span-4 lg:sticky lg:top-24 lg:self-start`.
- Free-shipping note above lines (when subtotal < 1,000,000): inline alert info `Truck` «{remaining} تا ارسال رایگان باقی مانده است.»; when reached: inline alert success «ارسال این سفارش رایگان است.» (text only, no progress bar).
- Lines: `<ul class="divide-y divide-border rounded-lg bg-surface border border-border">`, each `li` `flex gap-4 p-4`:
  - Image link `w-20 md:w-24 shrink-0` 4:5 `rounded-md`, `sizes="96px"`.
  - Middle `flex-1 min-w-0 flex flex-col gap-1`: name link `text-sm font-medium line-clamp-2 hover:text-accent-strong`; meta `flex flex-wrap gap-x-3 text-xs text-ink-muted`: «رنگ: {name}» (with a `size-3` dot before) and «سایز: {size}»; unit price `text-xs text-ink-muted` «قیمت واحد: ...»; bottom row `mt-auto flex items-center justify-between gap-3 pt-2`: QtyStepper (4.11 cart behavior) and line total `text-sm font-bold tabular-nums`.
  - Remove: danger-ghost icon-only sm `Trash2` at the top end of the li (`self-start`), `aria-label="حذف {name} از سبد"`. After remove: toast «از سبد خرید حذف شد.»
- Summary card `rounded-lg bg-surface border border-border p-5`:
  - Coupon: label «کد تخفیف»; Input + secondary md «اعمال» (loading «در حال بررسی»). Invalid: inline error «کد تخفیف معتبر نیست.» Applied: inline alert success `TicketPercent` «کد {code} اعمال شد. {description}» + Button link sm danger text «حذف کد».
  - Divider `my-5 border-t border-border`. Rows `space-y-3 text-sm`: «جمع کالاها» subtotal; «تخفیف» value `text-success` (only if > 0); «هزینه ارسال» value or `text-success` «رایگان»; divider; «مبلغ قابل پرداخت» `text-base font-bold` / value `text-lg font-bold`.
  - CTA primary lg fullWidth `mt-5` «ادامه فرایند خرید» → `/checkout` (guest → login then back). Under it, guest only: `mt-3 text-xs text-ink-muted text-center` «برای ثبت سفارش، وارد حساب کاربری خود شوید.»
  - Mobile: additionally a sticky bottom bar `fixed inset-x-0 bottom-0 z-30 lg:hidden border-t border-border bg-surface px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-4`: total block («مبلغ قابل پرداخت» `text-xs text-ink-muted` / amount `text-base font-bold`) + the same CTA (primary md). Hide the in-card CTA on mobile (`hidden lg:flex`) so there is one CTA. Add `pb-24 lg:pb-16` to the page.
- Empty: `ShoppingBag`, «سبد خرید شما خالی است», «محصولات دلخواهتان را پیدا کنید و به سبد اضافه کنید.», action «مشاهده محصولات» → `/products`.

### 5.5 Checkout `/checkout`
- H1 «تکمیل خرید». Layout like cart: lg `grid-cols-12 gap-8`: main `lg:col-span-8 space-y-8`, summary `lg:col-span-4 sticky`.
- Section «آدرس تحویل» (H2 `text-lg font-bold mb-4`): radio cards in `grid gap-3 md:grid-cols-2`. Card content: title `text-sm font-bold` + (end) `CircleCheck`; `mt-2 text-sm text-ink` address «{province}، {city}، {address_line}»; `mt-1 text-xs text-ink-muted flex flex-wrap gap-x-3`: «گیرنده: {receiver_name}», `<span dir="ltr">{phone}</span>`, «کد پستی: {postal}». Preselect the first address.
- Below cards: Button secondary md «افزودن آدرس جدید» (`Plus`). Opens inline AddressForm (no modal) in a `rounded-lg border border-border bg-surface p-5`:
  - `grid gap-4 md:grid-cols-2`: «عنوان آدرس» (placeholder «مثلاً خانه یا محل کار»)، «نام و نام خانوادگی گیرنده»، «شماره موبایل گیرنده» (ltr, placeholder «۰۹۱۲۳۴۵۶۷۸۹»)، «کد پستی» (ltr, helper «۱۰ رقم، بدون خط تیره»)، «استان»، «شهر»، «نشانی کامل» (textarea, `md:col-span-2`, placeholder «خیابان، کوچه، پلاک، واحد»).
  - Actions `flex gap-3 justify-end md:col-span-2`: ghost «انصراف», primary md «ذخیره آدرس» (loading «در حال ذخیره»). New address becomes selected.
  - Errors: «این فیلد الزامی است.»، «شماره موبایل معتبر نیست.»، «کد پستی باید ۱۰ رقم باشد.»
  - No addresses at all: the form is open by default, without «انصراف».
- Section «توضیحات سفارش»: Textarea, label «توضیحات» + optional marker «(اختیاری)», placeholder «اگر نکته‌ای برای ارسال دارید، اینجا بنویسید.»
- Summary card: H2 «خلاصه سفارش» `text-base font-bold`; items list `mt-4 space-y-3 max-h-72 overflow-y-auto`: each `flex gap-3`: thumb `w-14` 4:5 `rounded-md` + name `text-sm line-clamp-1` + meta `text-xs text-ink-muted` «{qty} عدد، سایز {size}» + line total at end `text-sm font-medium`. Then totals rows as cart. CTA primary lg fullWidth «پرداخت» (`LockKeyhole`), loading «در حال انتقال به درگاه». Microcopy below `mt-3 text-xs text-ink-muted text-center`: «پس از کلیک، به درگاه پرداخت بانکی منتقل می‌شوید.»
- No address selected on pay: inline error under the address section «لطفاً یک آدرس انتخاب کنید.» and scroll to it. Empty cart → redirect to `/cart`.
- Mobile: same sticky bottom bar pattern as cart, CTA «پرداخت».

### 5.6 Payment result `/checkout/result`
Centered card (centering justified: single message): container `max-w-md mx-auto pt-12 md:pt-20`, card `rounded-lg bg-surface border border-border p-6 md:p-8 text-center flex flex-col items-center gap-3`.
- Success: icon tile `size-16 rounded-full bg-success-soft text-success` `CircleCheck size-8`; H1 `text-xl md:text-2xl font-bold` «پرداخت با موفقیت انجام شد»; text `text-sm text-ink-muted` «سفارش شما ثبت شد و به‌زودی آماده‌سازی می‌شود.»; order number box `mt-2 w-full rounded-md bg-surface-muted px-4 py-3 flex justify-between text-sm`: «شماره سفارش» / `<span dir="ltr" class="font-bold">` number (digits Persian); actions `mt-4 w-full grid gap-3`: primary «مشاهده سفارش» → `/profile/orders/{number}`, ghost «بازگشت به فروشگاه» → `/`.
- Failed: tile `bg-danger-soft text-danger` `CircleX`; H1 «پرداخت ناموفق بود»; text «اگر مبلغی از حساب شما کسر شده باشد، حداکثر تا ۷۲ ساعت آینده بازگردانده می‌شود.»; order number box (if present); actions: primary «تلاش دوباره» (existing retry action, else → `/checkout`), ghost «بازگشت به سبد خرید» → `/cart`.
- Loading/verify: same card with skeleton icon circle and two lines; text «در حال بررسی وضعیت پرداخت».

### 5.7 Login `/login`
Container `max-w-sm mx-auto pt-10 md:pt-20`; panel `rounded-lg bg-surface border border-border p-6 md:p-8`. Logo centered on top `mb-6 flex justify-center`.
- Step 1: H1 `text-xl font-bold` «ورود یا ثبت‌نام»; `mt-2 text-sm text-ink-muted` «شماره موبایل خود را وارد کنید.»; Field `mt-6` label «شماره موبایل», input ltr `inputMode="numeric" autoComplete="tel"` placeholder «۰۹۱۲۳۴۵۶۷۸۹», autofocus; primary lg fullWidth `mt-6` «دریافت کد» (loading «در حال ارسال»). Error «شماره موبایل معتبر نیست.» Footnote `mt-4 text-xs text-ink-muted` «ورود شما به معنای پذیرش قوانین فروشگاه پود است.»
- Step 2: back row `mb-4`: Button link sm «ویرایش شماره» with `iconStart={<ArrowRight/>}` (returns to step 1, keeps value). H1 «کد تأیید را وارد کنید»; text «کد ۵ رقمی به شماره <span dir="ltr">۰۹۱۲۱۲۳۴۵۶۷</span> ارسال شد.»; OTP input: single input `dir="ltr" inputMode="numeric" autoComplete="one-time-code" maxLength={5}` with Input classes + `h-14 text-center text-2xl font-bold tracking-[0.5em] tabular-nums` (letter-spacing allowed: digits only), label «کد تأیید» (visible, not `sr-only`). Auto-submit when 5 digits entered. Hint (always visible, mock env): inline alert info `mt-3` «کد آزمایشی: ۱۲۳۴۵». Primary lg fullWidth «ورود» (loading «در حال بررسی»). Error «کد وارد شده اشتباه است.» (expired: «کد منقضی شده است. کد جدید دریافت کنید.»).
- Resend `mt-4 text-center text-sm`: during countdown `text-ink-muted` «ارسال مجدد کد تا <span dir="ltr" class="tabular-nums">۰۰:۴۵</span>»; after: Button link sm «ارسال مجدد کد» (restarts 60s; toast «کد جدید ارسال شد.»).
- After success: redirect to `next` param or `/profile`, toast success «ورود با موفقیت انجام شد.»

### 5.8 Profile shell `/profile/*`
- Layout: lg `grid grid-cols-12 gap-8 pt-10`: nav `lg:col-span-3`, content `lg:col-span-9`. Mobile: nav becomes a horizontal tab rail `rail -mx-4 px-4 flex gap-2 overflow-x-auto border-b border-border pb-3 mb-6`.
- Nav (desktop): card `rounded-lg bg-surface border border-border p-2`; header inside `px-3 py-3 border-b border-border mb-2`: name `text-sm font-bold` (or «کاربر پود» if empty) + phone `text-xs text-ink-muted` ltr. Items `flex h-11 items-center gap-3 rounded-md px-3 text-sm text-ink hover:bg-surface-muted`; active `bg-accent-soft text-accent-strong font-medium` + `aria-current="page"`:
  - `UserRound` «اطلاعات حساب» → `/profile`
  - `Package` «سفارش‌های من» → `/profile/orders`
  - `Heart` «علاقه‌مندی‌ها» → `/profile/wishlist`
  - `MapPin` «آدرس‌ها» → `/profile/addresses`
  - divider, `LogOut` «خروج» `text-danger hover:bg-danger-soft` (logs out → `/`).
- Mobile tabs: same items as chips `h-9 px-4 rounded-full text-sm whitespace-nowrap border border-border bg-surface`, active `bg-primary text-primary-contrast border-primary`. «خروج» at the end as danger text chip.
- Content H1 per page `text-xl md:text-2xl font-bold mb-6`.

### 5.9 `/profile` (account)
H1 «اطلاعات حساب». Card `rounded-lg bg-surface border border-border p-5 md:p-6`: form `grid gap-4 md:grid-cols-2`: «نام»، «نام خانوادگی»، «ایمیل» (optional marker, ltr), «شماره موبایل» (disabled, ltr, helper «شماره موبایل قابل تغییر نیست.»). Primary md «ذخیره تغییرات» at end (loading «در حال ذخیره»); toast «اطلاعات شما ذخیره شد.» If the page currently has no edit wiring, render the same fields read-only as a `dl` grid (label `text-xs text-ink-muted`, value `text-sm font-medium`) and omit the button.

### 5.10 `/profile/orders` and `/profile/orders/[number]`
- List H1 «سفارش‌های من». `ul space-y-3`; each order is one `<Link>` row `flex items-center gap-4 rounded-lg bg-surface border border-border p-4 hover:border-border-strong transition-colors`:
  - main `flex-1 min-w-0 grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center`: «سفارش <span dir="ltr">{number}</span>» `text-sm font-bold`; date `text-sm text-ink-muted` (`created_at_jalali`, Persian digits); «{items_count} کالا، {total}» `text-sm`; StatusBadge.
  - `ChevronLeft size-5 text-ink-subtle`.
- Empty: `Package`, «هنوز سفارشی ثبت نکرده‌اید», «پس از اولین خرید، سفارش‌هایتان اینجا نمایش داده می‌شود.», action «مشاهده محصولات».
- Detail: back Button link sm «بازگشت به سفارش‌ها» (`ArrowRight` iconStart). Header `flex flex-wrap items-center justify-between gap-3`: H1 «سفارش <span dir="ltr">{number}</span>» + StatusBadge; `text-sm text-ink-muted` «ثبت شده در {date}» (+ «، پرداخت در {paid_at}» if paid).
  - Layout lg `grid grid-cols-12 gap-6 mt-6`: items `lg:col-span-8` (list like cart lines but read-only: thumb `w-16`, name link, meta «رنگ: {color_name}» and «سایز: {size}» as separate spans with `gap-x-3`, then «{qty} عدد، قیمت واحد {unit}», line total at end); side `lg:col-span-4 space-y-4`: card «آدرس تحویل» (receiver, phone ltr, address, postal), card «مبلغ سفارش» (rows: جمع کالاها، تخفیف (+ code `text-xs` «کد: {code}»)، هزینه ارسال، مبلغ پرداختی), card «توضیحات» (only if note).
  - Pending status: inline alert warning above layout «این سفارش هنوز پرداخت نشده است.»

### 5.11 `/profile/wishlist`
H1 «علاقه‌مندی‌ها». ProductGrid `grid-cols-2 md:grid-cols-3` (inside the 9-col content). Removing via heart: card fades out (`transition-opacity duration-200`) then leaves; toast «از علاقه‌مندی‌ها حذف شد.»
Empty: `Heart`, «فهرست علاقه‌مندی‌های شما خالی است», «با زدن روی آیکون قلب، محصولات دلخواهتان را اینجا نگه دارید.», action «مشاهده محصولات».

### 5.12 `/profile/addresses`
H1 row `flex items-center justify-between mb-6`: H1 «آدرس‌ها» + secondary md «افزودن آدرس جدید» (`Plus`). Grid `grid gap-3 md:grid-cols-2` of cards `rounded-lg bg-surface border border-border p-5`: title `text-sm font-bold`, address text, meta row (receiver, phone ltr, postal) as in checkout; footer `mt-4 flex gap-2 border-t border-border pt-3`: ghost sm «ویرایش» (`Pencil`), danger-ghost sm «حذف» (`Trash2`).
- Delete confirm inline (replaces footer): `text-sm` «این آدرس حذف شود؟» + danger-ghost sm «بله، حذف شود» + ghost sm «انصراف». Toast «آدرس حذف شد.»
- Add/edit: the same AddressForm (5.5) rendered inline at the top of the grid (`md:col-span-2`), edit replaces the card in place. Save toast «آدرس ذخیره شد.»
- Empty: `MapPin`, «هنوز آدرسی ثبت نکرده‌اید», «برای سریع‌تر شدن خرید، آدرس خود را اضافه کنید.», action primary «افزودن آدرس جدید» (the header button is hidden in the empty state to avoid duplicate intent).

### 5.13 Not found / global error
`not-found.tsx`: EmptyState `SearchX`, «صفحه‌ای که دنبالش بودید پیدا نشد», «نشانی را بررسی کنید یا به صفحه اصلی بروید.», action «بازگشت به صفحه اصلی». `error.tsx`: `CircleAlert` in `bg-danger-soft text-danger` tile, «مشکلی پیش آمد», «لطفاً دوباره تلاش کنید.», action «تلاش دوباره» (calls `reset`).

### 5.14 CTA intent registry (one label per intent, everywhere)
| Intent | Label |
|---|---|
| browse all products | «مشاهده محصولات» (empty states), «مشاهده همه» (section headers) |
| add to cart | «افزودن به سبد خرید» |
| go to checkout | «ادامه فرایند خرید» |
| pay | «پرداخت» |
| login | «ورود \| ثبت‌نام» (header), «ورود» (OTP submit) |
| add address | «افزودن آدرس جدید» |
| retry | «تلاش دوباره» |
| clear filters | «حذف فیلترها» (empty state), «حذف همه» (filter panel) |

---

## 6. Implementation order and checklists

### 6.1 Order
1. `npm install lucide-react`. Replace `globals.css` with 2.1. Fix `layout.tsx` (body `min-h-dvh flex flex-col`, `<main className="flex-1">`, metadata title).
2. `src/lib/cn.ts`, add `formatNumber()` (digits + separator, no currency) next to `formatPrice`.
3. UI primitives in `src/components/ui/`: Button, Field/Input/Textarea/Select, Checkbox/Switch/RadioCard, Badge, OrderStatusBadge, Price, ColorDots/ColorSwatch/SizeChip/QtyStepper, Toast (+ provider in `Providers.tsx`), InlineAlert, EmptyState, Skeleton, Pagination, Breadcrumb, SectionHeader, Drawer/Sheet shell (shared focus-trap + scroll-lock + Escape).
4. Header (desktop, mobile, search row, drawer) and Footer.
5. ProductCard + ProductGrid + skeletons; replace `ProductList.tsx` usages.
6. Home, then Catalog (+ FilterControls, desktop aside, mobile sheet, chips).
7. Product detail (gallery, pickers, add to cart states).
8. Cart, Checkout (+ AddressForm), Result.
9. Login (2 steps + countdown).
10. Profile shell, account, orders list/detail, wishlist, addresses.
11. `loading.tsx`, `not-found.tsx`, `error.tsx`. Pass 6.2 and 6.3.

### 6.2 Engineer checklist
- [ ] Only token utilities for color (`bg-surface`, `text-ink-muted`, ...). No raw hex, no `gray-*`/`zinc-*`, no `dark:` utilities (dark is token swap).
- [ ] Only logical spacing/position utilities; directional icons chosen per 3.1.
- [ ] Every visible number in Persian digits; prices via `formatPrice`/`Price`.
- [ ] Every image wrapper `aspect-[4/5] bg-surface-muted`, `object-cover`, `sizes` set, null-image fallback.
- [ ] Every icon from `lucide-react`, `strokeWidth={1.75}`, icon-only buttons have Persian `aria-label`.
- [ ] Every interactive element: hover, `focus-visible` outline, `active:scale-[0.98]`, disabled styles, ≥ 40px tap target (44px for primary actions).
- [ ] Every data view has loading skeleton, empty state, and error state with the copy from section 5.
- [ ] Drawers/sheets: focus trap, Escape, scroll lock, focus return, `role="dialog"`.
- [ ] Copy pasted exactly from this spec, ZWNJ preserved.
- [ ] Tested at 360px, 768px, 1024px, 1440px and in dark mode (OS setting).

### 6.3 Pre-flight (adapted from the skill)
- [ ] Design Read and dials respected (variance 4: asymmetry only in hero and category bento; motion 3: hover/press/sheet/toast only).
- [ ] ZERO `—` or `–` in any visible string, alt text, aria-label or title (grep the repo for both characters).
- [ ] Theme lock: no section inverts (the dark category tile and announcement strip are components, not sections).
- [ ] Color lock: turquoise accent is the only accent; sale red appears only on discounted prices and percent badges.
- [ ] Shape lock: radii only `rounded-sm` (badges), `rounded-md` (controls, thumbs), `rounded-lg` (cards, images, tiles, sheets), `rounded-full` (icon buttons, swatches, count badges, removable chips, profile tab chips).
- [ ] Button contrast AA (table 2.3); no transparent button without border over images (wishlist button has `bg-surface/90`).
- [ ] No CTA label wraps on desktop; primary labels ≤ 3 words; no duplicate CTA intent per page (5.14).
- [ ] Forms: label above input, no placeholder-as-label, helper and error below, error text `text-danger` AA.
- [ ] Hero: H1 ≤ 2 lines at desktop, sub ≤ 20 words, CTAs visible without scrolling on 375x667 and 1440x900, top padding ≤ `pt-12`.
- [ ] Zero eyebrows, zero section numbers, zero step labels, zero scroll cues, zero decorative dots (color dots are real data), zero middle-dot chains.
- [ ] No labels overlaid on product images; only the wishlist button.
- [ ] Home uses distinct layout families: split hero, bento, grid, icon strip, horizontal rail.
- [ ] No fake data: no star ratings, no "viewers now" counters, no invented review quotes.
- [ ] `prefers-reduced-motion`: zoom, slide, pulse, spin all neutralized (global block + `motion-safe:`).
- [ ] `min-h-dvh` only, never `h-screen`/`min-h-screen`.
- [ ] CLS: all images have reserved aspect boxes; first hero image and PDP main image use `priority`.
- [ ] Dark mode checked: every page readable, hierarchy the same, primary CTA still the strongest element.
