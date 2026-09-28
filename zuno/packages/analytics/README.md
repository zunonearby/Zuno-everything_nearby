# @zuno/analytics

Thin, typed wrapper around PostHog. This is the ONLY place `posthog-js`
should be imported from inside app code — never call PostHog directly from
a screen/page/feature.

PostHog is for **behavioral** analytics only (DAU/WAU/MAU, funnels,
retention, feature usage). It is never the source of truth for orders,
payments, shops, or any transactional record — that's always PostgreSQL.
