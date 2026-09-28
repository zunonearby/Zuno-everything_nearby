import { z } from "zod";

export const productSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  unit: z.string().min(1).max(20),
});

export const shopProductSchema = z.object({
  product_id: z.string().uuid(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  available: z.boolean().default(true),
});
