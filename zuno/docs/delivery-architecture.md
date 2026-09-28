# Delivery Architecture

The delivery app (`apps/delivery`) is separate from the customer and shop
apps by design — different users, different workflow, different
permissions.

## Initial workflow

```
LOGIN
  -> DELIVERY DASHBOARD
  -> ASSIGNED ORDERS
  -> ORDER DETAILS
  -> PICKUP FROM SHOP
  -> PICKUP CONFIRMATION
  -> OUT FOR DELIVERY
  -> CUSTOMER DELIVERY
  -> DELIVERY CONFIRMATION
  -> COMPLETED
```

This maps to `delivery_status`:
`UNASSIGNED -> ASSIGNED -> PICKED_UP -> OUT_FOR_DELIVERY -> COMPLETED`
(or `FAILED`).

## Explicitly deferred (architecture allows, not implemented yet)

- Live GPS tracking
- Route optimization
- Delivery heatmaps
- Automatic dispatch algorithms
- Earnings calculation details

`deliveries` already has `pickup_lat/lng` and `dropoff_lat/lng` columns
so these can be layered on without a schema rewrite.
