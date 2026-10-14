import { z } from "zod";

// Validates 10-digit Indian phone number (starts with 6,7,8,9)
export const rawPhoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number");

// Normalizes 10-digit phone to E.164 (+91XXXXXXXXXX) format
export function normalizePhoneE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  return phone.startsWith("+") ? phone : `+${phone}`;
}

export const otpRequestSchema = z.object({
  phone: rawPhoneSchema,
});

export const otpVerifySchema = z.object({
  phone: rawPhoneSchema,
  otp: z.string().trim().length(6, "OTP must be exactly 6 digits"),
});

export const registrationInputSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: rawPhoneSchema,
});
