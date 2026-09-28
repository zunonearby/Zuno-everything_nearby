import { z } from "zod";

/**
 * Client only submits intent (address + payment method). Price, totals and
 * item validity are always recalculated server-side — never trust the client.
 */
export const placeOrderSchema = z.object({
  shop_id: z.string().uuid(),
  address_id: z.string().uuid(),
  payment_method: z.enum(["COD", "UPI", "ONLINE"]),
});
