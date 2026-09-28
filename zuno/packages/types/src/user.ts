import type { UserRole } from "./roles";

export interface Profile {
  id: string; // matches supabase auth.users.id
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string; // "Home", "Work", etc.
  line1: string;
  line2: string | null;
  pincode: string;
  lat: number;
  lng: number;
  is_default: boolean;
}
