import { Stack } from "expo-router";

/**
 * Root layout. Wraps the app with providers (TanStack Query client, etc.)
 * as they're introduced — kept minimal for the scaffold.
 */
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
