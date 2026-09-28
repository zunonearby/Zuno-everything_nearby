import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2).max(80),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional(),
});
