/**
 * Shared shape for the environment variables every app expects.
 * Each app reads process.env / Expo Constants itself — this is just the
 * documented contract, not a loader (mobile and web load env differently).
 */
export interface ZunoPublicEnv {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  GOOGLE_MAPS_API_KEY?: string;
  POSTHOG_KEY?: string;
  POSTHOG_HOST?: string;
}
