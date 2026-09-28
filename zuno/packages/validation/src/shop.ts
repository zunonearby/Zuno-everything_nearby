import { z } from "zod";

export const shopSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  lat: z.number(),
  lng: z.number(),
});
