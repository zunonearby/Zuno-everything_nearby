import posthog from "posthog-js";

let initialized = false;

export function initAnalytics(apiKey: string, host: string) {
  if (initialized || !apiKey) return;
  posthog.init(apiKey, { api_host: host });
  initialized = true;
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!initialized) return;
  posthog.identify(userId, traits);
}
