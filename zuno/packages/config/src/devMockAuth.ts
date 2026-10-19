/**
 * Development-Only Mock Authentication Controls.
 *
 * Invariants:
 * 1. MUST strictly evaluate to false if NODE_ENV === 'production'.
 * 2. Defaults to false if ENABLE_DEV_MOCK_AUTH is unset or 'false'.
 * 3. Never permits role escalation (ADMIN / SUPER_ADMIN).
 */
export function isDevMockAuthEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }
  return (
    process.env.ENABLE_DEV_MOCK_AUTH === "true" ||
    process.env.NEXT_PUBLIC_ENABLE_DEV_MOCK_AUTH === "true" ||
    process.env.EXPO_PUBLIC_ENABLE_DEV_MOCK_AUTH === "true"
  );
}

export const DEV_MOCK_AUTH_COOKIE = "zuno_dev_mock_session";
