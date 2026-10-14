import { supabase } from "../../lib/supabase";
import type { ConsentType, UserConsent } from "@zuno/types";
import { consentRecordSchema } from "@zuno/validation";

/**
 * Records an explicit legal consent acceptance (TERMS_AND_CONDITIONS / PRIVACY_POLICY).
 * Append-only behavior associated with auth.uid().
 */
export async function recordUserConsent(
  consentType: ConsentType,
  documentVersion = "1.0"
): Promise<UserConsent> {
  const validated = consentRecordSchema.parse({
    consent_type: consentType,
    document_version: documentVersion,
  });

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Authentication required to record consent");
  }

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from("user_consents")
    .insert({
      user_id: userId,
      consent_type: validated.consent_type,
      document_version: validated.document_version,
      accepted: true,
      accepted_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    console.error("[ConsentAPI] Error inserting consent record:", error.message);
    throw new Error(`Failed to record ${consentType} consent`);
  }

  return data as UserConsent;
}

/**
 * Fetches all historical consent records for the authenticated customer.
 */
export async function getUserConsents(): Promise<UserConsent[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return [];
  }

  const { data, error } = await supabase
    .from("user_consents")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[ConsentAPI] Error fetching consents:", error.message);
    throw new Error("Failed to fetch consent records");
  }

  return (data as UserConsent[]) || [];
}
