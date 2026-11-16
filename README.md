# Middle Men

WhatsApp-first soccer kit supplier shop built with **Next.js**, **Supabase**, and **Framer Motion**.

Customers browse weekly kits, customise printing/badges with live ZAR estimates, then enquire on WhatsApp (`083 691 1431` → `wa.me/27836911431`). There is no customer cart or Stripe checkout in the primary flow.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The catalogue uses local demo products until Supabase is connected.

## Setup

1. Copy env template:

```bash
cp .env.example .env.local
```

2. Create a [Supabase](https://supabase.com) project. In the SQL editor, run in order:
   - [`supabase/schema.sql`](supabase/schema.sql)
   - [`supabase/migration-whatsapp-shop.sql`](supabase/migration-whatsapp-shop.sql) (if upgrading an older schema)
   - [`supabase/migration-product-images.sql`](supabase/migration-product-images.sql) (multi-image products)
   - [`supabase/migration-kit-type-enum.sql`](supabase/migration-kit-type-enum.sql) (adds goalkeeper/retro/special)
   - [`supabase/seed.sql`](supabase/seed.sql)

3. Fill `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_WHATSAPP_NUMBER=27836911431
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/middlemenkits
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Promote an admin (after signing up once):

```sql
update public.profiles
set role = 'admin'
where id = '<your-auth-user-uuid>';
```

5. Restart:

```bash
npm run dev
```

## Pricing

| Item | Amount |
|------|--------|
| Kit base | Admin-set (ZAR) |
| Name/number printing | R200 |
| Badge | R100 each |

Estimated totals exclude delivery. Enquiries do not reserve stock.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Brand hero + weekly kits + how it works |
| `/shop` | Weekly-first catalogue + filters |
| `/shop/[slug]` | Customise + WhatsApp enquiry |
| `/request` | Custom kit sourcing form |
| `/admin` | Weekly collection dashboard |
| `/admin/products` | Product CRUD (weekly, badges, availability) |
| `/admin/orders` | Legacy Stripe orders (dormant) |

Cart and checkout URLs redirect to `/shop`.

## Notes

- Instagram uses a placeholder URL until a real profile is set in env.
- CSV bulk import is out of scope for v1 — manage weekly kits in admin.
- Stripe env vars are optional and unused by the storefront enquiry flow.
