import { z } from "zod";

export const cartItemSchema = z.object({
  shop_product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
});
