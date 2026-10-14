import PostHog from "posthog-react-native";

let projectToken = process.env.POSTHOG_PROJECT_TOKEN || process.env.EXPO_PUBLIC_POSTHOG_KEY;
let host = process.env.POSTHOG_HOST || process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Constants = require("expo-constants")?.default || require("expo-constants");
  const extra = Constants?.expoConfig?.extra;
  if (extra?.posthogProjectToken) {
    projectToken = extra.posthogProjectToken;
  }
  if (extra?.posthogHost) {
    host = extra.posthogHost;
  }
} catch {
  // Fallback to environment variables if expo-constants is unavailable
}

const isValidToken =
  Boolean(projectToken) &&
  typeof projectToken === "string" &&
  projectToken.trim().length > 0 &&
  !projectToken.includes("placeholder") &&
  !projectToken.includes("sb_secret") &&
  projectToken !== "undefined";

export const posthog = isValidToken
  ? new PostHog(projectToken!, {
      host,
      captureAppLifecycleEvents: false,
      logs: {
        serviceName: "zuno-customer",
      },
    })
  : undefined;
