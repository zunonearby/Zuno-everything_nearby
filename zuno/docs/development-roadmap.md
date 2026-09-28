# Development Roadmap (suggested)

This scaffold intentionally stops at foundation — folders, types, schema,
and empty screens with TODOs. Suggested build order:

1. **Auth** — phone/OTP login via Supabase Auth across all four apps;
   `profiles` row creation on signup with the correct `role`.
2. **Catalog (read-only)** — categories, products, shop_products list/detail
   in the customer app; shop app product/inventory management.
3. **Cart & checkout** — Zustand cart, `place-order` Edge Function that
   recalculates totals server-side.
4. **Order lifecycle** — status transitions + `order_status_history`,
   surfaced in customer tracking and shop order management.
5. **Delivery MVP** — assignment, pickup/delivery confirmation flow per
   `docs/delivery-architecture.md`.
6. **Super Admin core** — shop approval, customer/shop/order visibility
   backed by PostgreSQL.
7. **Payments** — COD first, then Razorpay UPI/online + webhook handling.
8. **Analytics** — wire `@zuno/analytics` events into customer app,
   surface PostHog-backed views in Super Admin analytics.
9. **RLS hardening** — full policy set per `docs/security.md` before any
   real user data flows through the system.
10. **Maps** — Google Maps for addresses, shop locations, and (later)
    delivery tracking.
