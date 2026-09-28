import { z } from "zod";

export const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number");

export const otpVerifySchema = z.object({
  phone: phoneSchema,
  otp: z.string().length(6),
});

export const loginSchema = z.object({
  phone: phoneSchema,
});
