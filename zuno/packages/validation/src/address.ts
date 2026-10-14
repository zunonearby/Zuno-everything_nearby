import { z } from "zod";

export const pincodeSchema = z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit Indian PIN code");

export const addressSchema = z.object({
  label: z.string().trim().min(1).max(40).default("Home"),
  recipient_name: z.string().trim().min(2).optional(),
  phone_number: z.string().trim().optional(),
  line1: z.string().trim().min(3, "Address line 1 is required"),
  line2: z.string().trim().optional(),
  locality: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required").default("Renukoot"),
  state: z.string().trim().min(1, "State is required").default("Uttar Pradesh"),
  pincode: pincodeSchema,
  country_code: z.string().trim().default("IN"),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  is_default: z.boolean().default(true),
});
