# Security

## Never trust the client for
`price`, `total`, `user_id`, `shop_id`, `payment_status`, `order_status`.
These are always validated or recalculated server-side (Edge Function or
RLS-guarded database function), never taken as-given from a request body.

## Keys
`SUPABASE_SERVICE_ROLE_KEY` must never reach a mobile or web client
bundle. It is used only in trusted server contexts — Supabase Edge
Functions, Next.js server actions/route handlers. See `.env.example` for
the PUBLIC vs SERVER-ONLY split.

## Authorization
All four apps share one Supabase Auth instance; authorization is
role-based (`profiles.role`) and enforced primarily through PostgreSQL
Row Level Security — not by client-side route protection alone. See
`docs/roles-and-permissions.md`.

The foundational migration enables RLS on every table and leaves policies
mostly to be written per-feature; only a baseline "read your own profile"
policy exists so far. **Do not ship a feature whose table has RLS enabled
but no real policy for it** — that either blocks all access or, if RLS is
disabled to "make it work," exposes everything.

## Shop isolation
A shopkeeper should only be able to read/write data for shops they belong
to (`shop_members`). RLS policies for shop-owned tables should join
through `shop_members`, not trust a client-supplied `shop_id`.

## Audit
`activity_logs` exists as the foundation for recording important
administrative actions (shop approval, order status overrides,
configuration changes). Write to it from server-side mutations as those
are implemented.
