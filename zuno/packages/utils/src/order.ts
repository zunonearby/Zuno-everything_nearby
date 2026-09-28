import type { OrderItem } from "@zuno/types";

/**
 * Reference implementation for recomputing an order total from snapshots.
 * The server is the only place this should be trusted; never take a total
 * submitted by a client.
 */
export function calculateOrderSubtotal(items: Pick<OrderItem, "unit_price_snapshot" | "quantity">[]): number {
  return items.reduce((sum, item) => sum + item.unit_price_snapshot * item.quantity, 0);
}
