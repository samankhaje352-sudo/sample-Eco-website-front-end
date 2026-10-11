# فروشگاه لباس — فرانت‌اند / Clothing Store Frontend

## فارسی

پایه‌ی فرانت‌اند (RTL) با Next.js 15 (App Router)، TypeScript، Tailwind CSS v4 و Zustand. ظاهر نهایی بعداً بر اساس `DESIGN.md` اعمال می‌شود؛ فعلاً فقط زیرساخت و صفحات ساده وجود دارد.

### راه‌اندازی
1. بک‌اند را اجرا کنید (مخزن `sample-Eco-website`):
   ```
   pg_ctlcluster 16 main start
   cd ../sample-Eco-website && .venv/bin/python manage.py runserver 8000
   ```
2. `cp .env.example .env.local`
3. `npm install && npm run dev` ← http://localhost:3000

کد تأیید آزمایشی (OTP) همیشه `12345` است. درگاه پرداخت آزمایشی پس از پرداخت به `/checkout/result` برمی‌گردد (`FRONTEND_URL` در بک‌اند باید `http://localhost:3000` باشد).

### متغیرهای محیطی
- `NEXT_PUBLIC_API_URL` — آدرس API به‌همراه نسخه (پیش‌فرض `http://localhost:8000/api/v1`).

نسخه‌ی API فقط در `src/lib/api/config.ts` (`API_VERSION`) تعریف شده است.

### ساختار
- `src/lib/api/` — `ApiClient`، `ApiError`، کلاس‌های `AuthApi`، `CatalogApi`، `CartApi`، `WishlistApi`، `AddressApi`، `OrderApi` و singleton `api`
- `src/lib/format.ts` — ارقام فارسی، قیمت، اعتبارسنجی موبایل
- `src/stores/` — `authStore`، `cartStore`، `wishlistStore`
- `src/app/` — مسیرها

اسکریپت‌ها: `npm run dev | build | start | lint`

## English

RTL frontend foundation: Next.js 15 (App Router), TypeScript, Tailwind v4, Zustand, Vazirmatn font. Visual design is intentionally absent; it will be applied from `DESIGN.md` later.

### Setup
1. Start the Django backend (`sample-Eco-website`): `pg_ctlcluster 16 main start` then `.venv/bin/python manage.py runserver 8000`.
2. `cp .env.example .env.local`
3. `npm install && npm run dev` (http://localhost:3000)

The mock OTP is always `12345`. The mock payment gateway redirects back to `/checkout/result?order=..&status=..` (backend `FRONTEND_URL` must be `http://localhost:3000`).

### Env vars
- `NEXT_PUBLIC_API_URL` — API base incl. version (default `http://localhost:8000/api/v1`).

The API version is a single constant: `API_VERSION` in `src/lib/api/config.ts`. Images are allowed from `localhost:8000` in `next.config.ts`; add hosts there for production.

Scripts: `npm run dev | build | start | lint`.
