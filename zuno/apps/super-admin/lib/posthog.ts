import { PostHog } from "posthog-node";

/**
 * Server-side PostHog client for querying behavioral analytics
 * (DAU/WAU/MAU, funnels, retention). Never used for transactional data —
 * that always comes from Supabase/PostgreSQL (see features/*/api.ts).
 */
let client: PostHog | null = null;

export function getPostHogClient(): PostHog {
  if (!client) {
    client = new PostHog(process.env.POSTHOG_KEY!, {
      host: process.env.POSTHOG_HOST,
    });
  }
  return client;
}
