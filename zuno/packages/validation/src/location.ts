import { z } from "zod";
import { pincodeSchema } from "./address";

export const serviceAreaValidationSchema = z.object({
  pincode: pincodeSchema,
  locality: z.string().trim().optional(),
});
