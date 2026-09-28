# API Conventions

Each feature owns a service boundary: `features/<feature>/api.ts`. Screens
and pages call through this module — never call `supabase-js` (or, for
Super Admin, the PostHog client) directly from a component.

```
features/products/api.ts
features/shops/api.ts
features/orders/api.ts
features/cart/api.ts
features/deliveries/api.ts
```

## State management

- **TanStack Query** for anything that comes from the server: products,
  shops, orders, inventory, deliveries, analytics.
- **Zustand** for small client-only state: cart-in-progress, local UI
  state. Don't put server data into Zustand.

## Validation

Shared Zod schemas live in `@zuno/validation` and are the single
definition used by both the client (form validation) and, eventually,
server-side handlers (Edge Functions) validating the same input shape.

## Trust boundary

The client is never trusted for `price`, `total`, `user_id`, `shop_id`,
`payment_status`, or `order_status`. These are always validated/derived
server-side.
