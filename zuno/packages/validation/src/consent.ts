import { z } from "zod";

export const consentRecordSchema = z.object({
  consent_type: z.enum(["TERMS_AND_CONDITIONS", "PRIVACY_POLICY"]),
  document_version: z.string().trim().min(1, "Document version is required"),
});
