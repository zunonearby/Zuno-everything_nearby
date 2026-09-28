# Supabase Edge Functions

Server-side logic that must never trust the client — order total
recalculation, payment webhook handling (Razorpay), delivery assignment,
notification dispatch.

No functions are implemented yet. Suggested first functions:

- `place-order/` — validates cart against `shop_products`, recalculates
  totals server-side, creates the `orders` + `order_items` rows.
- `razorpay-webhook/` — verifies signature, updates `payments`/`orders`.
- `assign-delivery/` — picks an available delivery partner for a ready order.
