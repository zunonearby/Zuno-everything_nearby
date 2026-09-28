# Database

Backend: **Supabase** (PostgreSQL, Auth, Storage, Realtime).
Migrations live in `supabase/migrations/`, starting with
`00000000000001_foundation_schema.sql`.

## Core tables

```
profiles, addresses
service_areas, delivery_zones
shops, shop_members
categories, products, shop_products, inventory
carts, cart_items
orders, order_items, order_status_history
payments
delivery_partners, deliveries
notifications, activity_logs, platform_settings
```

## Key design decisions

- **Product vs ShopProduct** — `products` is the generic catalog entry
  (e.g. "Tomato"). `shop_products` is the shop-specific relationship
  holding `price`, `stock`, `available`. The same tomato can be ₹30 at one
  shop and ₹35 at another; price never lives on `products`.
- **Order item snapshots** — `order_items` stores
  `product_name_snapshot` and `unit_price_snapshot` so a historical order
  never changes retroactively when a product's name or price changes.
- **Order status history** — every important status transition should
  write a row to `order_status_history` for tracking, audit, and
  visibility across customer/shop/delivery/admin.
- **Categories are data, not schema** — there is no `GroceryProduct` or
  `RestaurantProduct` table. New verticals (fast food, pharmacy, ...) are
  added as rows in `categories`, not new tables or types.

## Extending the schema

Add new, additive migrations as features are built. Don't keep editing
the foundational migration once other work depends on it.
