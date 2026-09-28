import posthog from "posthog-js";
import type { AnalyticsEvent } from "./events";

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  posthog.capture(event, properties);
}
