# ZUNO

**Everything nearby.**

ZUNO is a modern hyperlocal commerce platform designed to bridge neighborhood families with trusted local shopkeepers. It connects customers directly to nearby verified inventories (grocery, fruits & vegetables, daily essentials), backed by a dedicated local delivery fleet.

---

## 🌟 Product Vision

Everything a neighborhood needs, from nearby shops, delivered fast and fresh. ZUNO preserves community-first economics by empowering local merchants rather than replacing them with impersonal dark stores.

Currently operational in **Renukoot Central (PIN 231217)**, Uttar Pradesh, with an architecture designed to scale seamlessly across categories and geographies.

---

## 📱 Five Application Surfaces

ZUNO is built as a unified monorepo containing **five distinct applications**, each engineered for its specific user role, UX requirements, and security boundaries:

| Application | Role / Audience | Tech Stack | Port / Path | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Public Website (`@zuno/web`)** | Public Visitors & Customers | Next.js 14, Tailwind CSS, Three.js, React Three Fiber | `localhost:3002`<br>`apps/web` | Public brand storefront, 3D interactive hero, 7-category showcase, live PIN 231217 coverage checker, FAQs, and app download guide. |
| **Customer App (`@zuno/customer`)** | End Customers | Expo, React Native, TypeScript, Expo Router, Zustand | Expo Dev Server<br>`apps/customer` | Store discovery, real-time product catalogs, cart, checkout, order tracking, address & profile management. |
| **Delivery App (`@zuno/delivery`)** | Delivery Partners | Expo, React Native, TypeScript, Expo Router, Zustand | Expo Dev Server<br>`apps/delivery` | Partner shift toggling, delivery task queue, step-by-step pickup/delivery flow, and secure OTP dropoff verification. |
| **Shop Dashboard (`@zuno/shop`)** | Neighborhood Merchants | Next.js, TypeScript, Tailwind CSS, TanStack Query | `localhost:3001`<br>`apps/shop` | Storefront controls, product catalog & stock management, order acceptance, packing workflow, and sales metrics. |
| **Super Admin (`@zuno/super-admin`)** | Platform Operations | Next.js, TypeScript, Tailwind CSS, TanStack Query | `localhost:3000`<br>`apps/super-admin` | Platform-wide oversight: shop onboarding, delivery coordination, platform analytics, system logs, and security controls. |

---

## 🛠️ Technology Stack & Architecture

### Monorepo Architecture
- **Package Manager:** `pnpm` workspaces (`pnpm-workspace.yaml`)
- **Language:** TypeScript 5.5+ throughout all mobile apps, web apps, and packages
- **Code Standards:** Shared ESLint, Prettier, and TypeScript configurations

### Shared Packages (`packages/`)
- **`@zuno/config`**: Centralized source of truth for brand tokens (`#0F5D3A`, `#22A06B`, `#A7D56B`), category palettes, and environment contracts.
- **`@zuno/types`**: Canonical TypeScript interfaces for domain entities (`User`, `Shop`, `Product`, `Order`, `Delivery`, `ServiceArea`, `Location`).
- **`@zuno/validation`**: Shared Zod schemas ensuring runtime safety across API boundaries (PIN code, auth credentials, checkout payload).
- **`@zuno/utils`**: Framework-agnostic utility functions (currency formatting, distance calculation, string helpers).
- **`@zuno/ui`**: Shared design primitives and components for web applications.
- **`@zuno/analytics`**: Strongly-typed PostHog analytics wrapper for client and server telemetry.

### Backend & Cloud Services
- **Database & Auth:** Supabase (PostgreSQL 15+, Row-Level Security, Realtime subscriptions, Auth)
- **Security:** Strict PostgreSQL Row Level Security (RLS) policies on all transactional tables. Client apps are never trusted for pricing or order totals.
- **Analytics:** PostHog (privacy-focused behavioral tracking)
- **Payments:** Razorpay integration boundary (COD, UPI, Netbanking)
- **Location:** Google Maps Platform boundary + local postal PIN validation

---

## 📂 Repository Directory Structure

```
zuno/
├── apps/
│   ├── web/              # Public marketing website (Next.js 14)
│   ├── customer/         # Customer mobile application (Expo / React Native)
│   ├── delivery/         # Delivery partner mobile app (Expo / React Native)
│   ├── shop/             # Shopkeeper merchant dashboard (Next.js)
│   └── super-admin/      # Operations control center (Next.js)
├── packages/
│   ├── config/           # Brand tokens, colors, constants
│   ├── types/            # Domain interfaces & TypeScript types
│   ├── validation/       # Zod validation schemas
│   ├── utils/            # Helper functions & formatters
│   ├── ui/               # Shared web UI components
│   └── analytics/        # PostHog telemetry wrapper
├── supabase/
│   ├── migrations/       # Incremental SQL migrations & RLS policies
│   └── seed/             # Development and test seed fixtures
├── assets/brand/         # Official brand logos, vectors & app icons
├── docs/                 # Architecture, security, database & API documentation
├── package.json          # Workspace root scripts
└── pnpm-workspace.yaml   # Monorepo workspace configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>= 18.18.0` (Node 20+ recommended)
- **pnpm**: `>= 8.0.0`
- **Expo Go** or an Android/iOS emulator (for mobile testing)
- **Supabase CLI** (for local migrations and database management)

### 1. Installation
Clone the repository and install all workspace dependencies:
```bash
git clone https://github.com/zunonearby/Zuno-everything_nearby.git
cd zuno
pnpm install
```

### 2. Environment Setup
Copy the sample environment file and configure your credentials:
```bash
cp .env.example .env
```
Key required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous public key

### 3. Running Applications Locally

You can launch apps independently using the workspace scripts:

```bash
# Public Website (localhost:3002)
pnpm dev:web

# Customer Mobile App (Expo Metro bundler)
pnpm dev:customer

# Delivery Partner Mobile App (Expo Metro bundler)
pnpm dev:delivery

# Shopkeeper Dashboard (localhost:3001)
pnpm dev:shop

# Super Admin Control Center (localhost:3000)
pnpm dev:super-admin
```

### 4. Code Quality & Type Checking
Run workspace-wide verification:
```bash
# Typecheck all apps and packages
pnpm typecheck

# Lint all files
pnpm lint

# Production build verification
pnpm build
```

---

## 🎨 Brand Identity

| Token | Value | Visual | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `#0F5D3A` | <div style="width:24px;height:24px;background:#0F5D3A;border-radius:4px;"></div> | Deep forest green — primary brand color, active highlights, key CTAs |
| **Secondary** | `#22A06B` | <div style="width:24px;height:24px;background:#22A06B;border-radius:4px;"></div> | Vibrant supporting green — success states, live indicators |
| **Accent** | `#A7D56B` | <div style="width:24px;height:24px;background:#A7D56B;border-radius:4px;"></div> | Fresh lime accent — contrast badges, highlights |
| **Background** | `#F8FAF6` | <div style="width:24px;height:24px;background:#F8FAF6;border-radius:4px;"></div> | Warm off-white surface |
| **Text** | `#17231D` | <div style="width:24px;height:24px;background:#17231D;border-radius:4px;"></div> | Primary high-contrast charcoal text |

---

## 📖 Key Documentation

Detailed architectural and implementation guides can be found in the [`docs/`](./docs) directory:
- [`docs/architecture.md`](./docs/architecture.md) — System boundaries and platform design
- [`docs/database.md`](./docs/database.md) — PostgreSQL schema, entity relationships, and triggers
- [`docs/security.md`](./docs/security.md) — Authentication models and Row-Level Security (RLS) policies
- [`docs/brand.md`](./docs/brand.md) — Brand guidelines, typography, and color tokens
- [`docs/delivery-architecture.md`](./docs/delivery-architecture.md) — Partner dispatch and delivery lifecycle
- [`docs/development-roadmap.md`](./docs/development-roadmap.md) — Milestones and MVP roadmap

---

## 📄 License

Proprietary — All rights reserved by **ZUNO Hyperlocal Commerce**.
