export type ConsentType = "TERMS_AND_CONDITIONS" | "PRIVACY_POLICY";

export interface UserConsent {
  id: string;
  user_id: string;
  consent_type: ConsentType;
  document_version: string;
  accepted: boolean;
  accepted_at: string;
  created_at: string;
}

export interface RecordConsentInput {
  consent_type: ConsentType;
  document_version: string;
}
