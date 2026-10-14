import { z } from "zod";

export const genderSchema = z.enum(["Male", "Female", "Non-binary", "Prefer not to say"], {
  errorMap: () => ({ message: "Select a valid gender option" }),
});

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email address").optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url("Enter a valid URL").optional().nullable(),
  gender: genderSchema.optional().nullable(),
});

export const completeProfileSchema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(80),
  email: z.string().trim().email("Valid email address is required"),
  gender: genderSchema,
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms & Conditions" }),
  }),
  privacy_accepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Privacy Policy" }),
  }),
  terms_version: z.string().default("1.0"),
  privacy_version: z.string().default("1.0"),
});
