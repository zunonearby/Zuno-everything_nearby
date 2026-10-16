import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://mwcvagktpvlzorojdsxg.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Y3ZhZ2t0cHZsem9yb2pkc3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2ODk4MDYsImV4cCI6MjEwNjI2NTgwNn0.KmkVlqAY8QmQItwU-JFbWzsFoHGjOtuef4jCVpDiAlY";

// SERVER-ONLY. Super Admin server actions/route handlers run with the
// authenticated SUPER_ADMIN session; RLS still applies (see supabase/migrations).
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Ignore if called from Server Component where cookies cannot be set
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        } catch {
          // Ignore if called from Server Component where cookies cannot be set
        }
      },
    },
  });
}
