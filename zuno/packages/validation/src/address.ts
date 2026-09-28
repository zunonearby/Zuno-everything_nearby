import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(1).max(40),
  line1: z.string().min(3),
  line2: z.string().optional(),
  pincode: z.string().length(6),
  lat: z.number(),
  lng: z.number(),
});
