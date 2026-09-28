import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// SERVER-ONLY. Super Admin server actions/route handlers run with the
// authenticated SUPER_ADMIN session; RLS still applies (see supabase/migrations).
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
