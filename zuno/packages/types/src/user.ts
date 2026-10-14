import type { UserRole } from "./roles";

export type Gender = "Male" | "Female" | "Non-binary" | "Prefer not to say";

export interface Profile {
  id: string; // matches supabase auth.users.id
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  email_verified_at: string | null;
  avatar_url: string | null;
  gender: Gender | null;
  default_address_id: string | null;
  onboarding_completed_at: string | null;
  profile_completed_at: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface Address {
  id: string;
  user_id: string;
  label: string; // "Home", "Work", "Other"
  recipient_name?: string | null;
  phone_number?: string | null;
  line1: string;
  line2: string | null;
  locality?: string | null;
  city: string;
  state: string;
  pincode: string;
  country_code: string;
  lat: number | null;
  lng: number | null;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}
