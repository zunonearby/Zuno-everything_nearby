# Order Lifecycle

```
PLACED
  -> ACCEPTED
  -> PREPARING
  -> READY_FOR_PICKUP
  -> OUT_FOR_DELIVERY
  -> DELIVERED

PLACED     -> CANCELLED
PLACED     -> REJECTED
ACCEPTED   -> CANCELLED
```

Every transition should write a row to `order_status_history`
(`order_id`, `status`, `changed_by`, `note`, `created_at`). This backs
customer-facing tracking, shopkeeper order management, delivery status
updates, and admin visibility from one source of truth.

`order_items` snapshot the product name and unit price at the time of
purchase — historical orders must never change if a product's price or
name changes later.

The **server** (Edge Function or RLS-guarded mutation) is the only place
that recalculates `subtotal`/`total` — never trust a client-submitted
total.
