# Architecture

## One platform, four application surfaces

ZUNO is not one app with multiple screens — it's four separate,
purpose-built applications sharing one backend:

| App          | Users              | Stack                          | Path                 |
|--------------|--------------------|---------------------------------|-----------------------|
| Customer     | Customers          | Expo / React Native             | `apps/customer`       |
| Shop         | Shopkeepers        | Next.js                         | `apps/shop`           |
| Delivery     | Delivery partners  | Expo / React Native             | `apps/delivery`       |
| Super Admin  | Platform owner/ops | Next.js                         | `apps/super-admin`    |

Each has its own users, permissions, UX, navigation and security boundary.
None of them import from another app — anything shared lives in `packages/`.

## One backend

All four apps talk to a single Supabase project (Auth, PostgreSQL,
Storage, Realtime). There is no per-app backend and no microservices —
this is a modular monolith, intentionally, to stay manageable for a small
bootstrapped team.

```
CUSTOMER   SHOP   DELIVERY
    \       |       /
      SUPABASE BACKEND
     (Auth · Storage · Realtime)
            |
       POSTGRESQL
            |
      SUPER ADMIN
       /        \
PostgreSQL     PostHog
(operational)  (behavioral)
```

## Shared packages

| Package               | Purpose                                             |
|------------------------|------------------------------------------------------|
| `@zuno/types`          | Canonical domain types (Order, Shop, Product, ...)  |
| `@zuno/validation`     | Zod schemas for inputs shared across apps           |
| `@zuno/config`         | Brand tokens, category colors, env contract         |
| `@zuno/utils`          | Small framework-agnostic helpers                    |
| `@zuno/ui`             | Shared UI primitives for the two Next.js apps       |
| `@zuno/analytics`      | Typed PostHog wrapper (event names + tracking)      |

## What this scaffold deliberately does NOT include

Microservices, Kafka, Kubernetes, unnecessary Docker infrastructure, event
buses, CQRS, or a Redis architecture. Add these only when a real,
measured need appears — not preemptively.
