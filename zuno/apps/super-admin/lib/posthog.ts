import { PostHog } from "posthog-node";

/**
 * Server-side PostHog client for querying behavioral analytics
 * (DAU/WAU/MAU, funnels, retention). Never used for transactional data -
 * that always comes from Supabase/PostgreSQL.
 */
let client: PostHog | null = null;

export function getPostHogClient(): PostHog {
  if (!client) {
    client = new PostHog(process.env.POSTHOG_KEY || "dummy", {
      host: process.env.POSTHOG_HOST || "https://app.posthog.com",
    });
  }
  return client;
}
