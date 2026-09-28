# ZUNO

**Everything nearby.**

ZUNO is a hyperlocal commerce platform. It launches with grocery and
fruits/vegetables in a tightly controlled local area, but the
architecture is built to expand into a much broader set of local
verticals (fast food, restaurants, bakery, dairy, pharmacy, household,
personal care, local services) and locations without structural rewrites.

## Product vision

Everything a neighborhood needs, from nearby shops, delivered — starting
narrow and deep in one launch area, expanding by category and geography
once the core loop (shop -> customer -> delivery) works.

## Four application surfaces

This is one platform, but **four separate applications**, each with its
own users, permissions, UX, and security boundary — not four screens of
one app.

| App          | Users              | Stack                | Path                |
|--------------|--------------------|------------------------|-----------------------|
| **Customer** | Customers          | Expo / React Native   | `apps/customer`      |
| **Shop**     | Shopkeepers        | Next.js               | `apps/shop`          |
| **Delivery** | Delivery partners  | Expo / React Native   | `apps/delivery`      |
| **Super Admin** | Platform owner/ops | Next.js            | `apps/super-admin`   |

See `docs/architecture.md` for the full picture.

## Technology stack

- **Monorepo**: pnpm workspaces
- **Mobile** (customer, delivery): Expo, React Native, TypeScript, Expo Router, Zustand, TanStack Query, Zod
- **Web** (shop, super-admin): Next.js, TypeScript, Tailwind CSS, TanStack Query, Zod
- **Backend**: Supabase (Auth, PostgreSQL, Storage, Realtime)
- **Analytics**: PostHog (behavioral only — see `docs/analytics.md`)
- **Payments**: Razorpay (COD / UPI / Online), boundary prepared, not yet integrated
- **Maps**: Google Maps Platform, boundary prepared, not yet integrated

## Repository structure

```
zuno/
├── apps/
│   ├── customer/       Customer mobile app (Expo)
│   ├── shop/            Shopkeeper dashboard (Next.js)
│   ├── delivery/        Delivery partner app (Expo)
│   └── super-admin/     Platform control center (Next.js)
├── packages/
│   ├── ui/               Shared UI primitives (web apps)
│   ├── types/            Canonical domain types
│   ├── validation/       Shared Zod schemas
│   ├── config/           Brand tokens, category colors, env contract
│   ├── utils/            Small framework-agnostic helpers
│   └── analytics/        Typed PostHog wrapper
├── supabase/
│   ├── migrations/       SQL schema migrations
│   ├── functions/        Edge Functions (server-only logic)
│   ├── seed/              Development-only seed data
│   └── tests/             Database tests
├── assets/brand/          Logo + brand asset source of truth
├── docs/                  Architecture, database, security, roadmap, ...
└── scripts/               Repo-level scripts
```

## Customer app

Discover nearby shops, browse categories/products, cart, checkout, track
orders, manage profile/addresses. See `apps/customer`.

## Shopkeeper dashboard

Manage shop, products, pricing, inventory; accept/manage orders; basic
sales analytics. See `apps/shop`.

## Delivery app

Login, availability, assigned deliveries, pickup/delivery confirmation
flow. GPS tracking, route optimization, and automatic dispatch are
explicitly deferred — see `docs/delivery-architecture.md`.

## Super Admin

Platform-wide visibility and control over customers, shops, products,
orders, deliveries, payments, and analytics, plus an administrative
activity log. See `docs/roles-and-permissions.md` and `docs/analytics.md`.

## Supabase / PostgreSQL

Single backend shared by all four apps. PostgreSQL is the operational
source of truth for everything transactional. See `docs/database.md`.

## Authentication & security

One Supabase Auth instance, role-based authorization enforced primarily
via PostgreSQL RLS. The client is never trusted for price, totals, or
status fields. See `docs/security.md`.

## Local development

```bash
pnpm install

# run one app at a time
pnpm dev:customer
pnpm dev:shop
pnpm dev:delivery
pnpm dev:super-admin
```

## Environment variables

Copy `.env.example` to `.env` and fill in Supabase / Razorpay / Google
Maps / PostHog credentials. Never commit real credentials. See the
PUBLIC vs SERVER-ONLY notes inside the file.

## Database setup

```bash
# once a Supabase project exists and the CLI is linked
supabase db push        # applies supabase/migrations/
```

See `docs/database.md` for schema details.

## Roadmap

See `docs/development-roadmap.md` for the suggested build order from this
foundation to a working MVP.

## Future expansion

The architecture is deliberately category-neutral and location-neutral:
new verticals are new `categories` rows, not new tables; new launch areas
are new `service_areas`, not new code paths. See `docs/architecture.md`
and `docs/database.md`.
