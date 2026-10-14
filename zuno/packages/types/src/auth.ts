export type OnboardingState =
  | "UNAUTHENTICATED"
  | "LOCATION_REQUIRED"
  | "PHONE_VERIFICATION_REQUIRED"
  | "PROFILE_COMPLETION_REQUIRED"
  | "TERMS_ACCEPTANCE_REQUIRED"
  | "READY_FOR_HOME";

export interface CompleteProfileInput {
  full_name: string;
  email: string;
  gender: "Male" | "Female" | "Non-binary" | "Prefer not to say";
  address: {
    line1: string;
    line2?: string;
    locality?: string;
    city: string;
    state: string;
    pincode: string;
    label?: string;
    lat?: number;
    lng?: number;
  };
  terms_accepted: boolean;
  privacy_accepted: boolean;
  terms_version?: string;
  privacy_version?: string;
}
