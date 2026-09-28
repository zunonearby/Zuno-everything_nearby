# Analytics

## The rule

```
PostgreSQL  -> what actually happened   (source of truth)
PostHog     -> how users behaved        (behavioral analytics)
```

Never use PostHog as a substitute for transactional records.

### PostgreSQL owns
`orders`, `payments`, `shops`, `customers` (profiles), `products`,
`inventory`, `deliveries`, revenue, commissions. Any Super Admin question
like "how many orders?" or "today's GMV?" is answered from PostgreSQL.

### PostHog owns
DAU/WAU/MAU, retention, funnels, conversion, feature usage, session
analysis, experiments/feature flags. Tracked via `@zuno/analytics`
(`packages/analytics`) — the only place `posthog-js`/`posthog-node`
should be imported from.

### Baseline events (see `packages/analytics/src/events.ts`)
```
app_opened, search_performed, shop_viewed, product_viewed,
product_added_to_cart, cart_viewed, checkout_started,
order_created, order_completed, order_cancelled
```

Add new events to that one file first — don't inline raw event-name
strings in screens/pages.
