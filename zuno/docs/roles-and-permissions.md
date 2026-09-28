# Roles & Permissions

Centralized in `@zuno/types` (`UserRole`) — never scatter role strings
through the codebase.

```
CUSTOMER      -> apps/customer
SHOPKEEPER    -> apps/shop
DELIVERY      -> apps/delivery
ADMIN         -> apps/super-admin (limited)
SUPER_ADMIN   -> apps/super-admin (full)
```

Each app authenticates against the same Supabase Auth instance, but
**authorization is role-dependent and must be enforced server-side**,
primarily via PostgreSQL Row Level Security (RLS) policies, never by
route protection alone on the client.

`shop_members` additionally scopes a shopkeeper user to the specific
shop(s) they manage — RLS policies for shop-owned tables (`shop_products`,
`inventory`, shop-scoped `orders`, etc.) should join through
`shop_members` rather than trusting a client-supplied `shop_id`.
