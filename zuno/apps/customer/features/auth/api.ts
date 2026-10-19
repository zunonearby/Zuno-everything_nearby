import { supabase } from "../../lib/supabase";
import { normalizePhoneE164, rawPhoneSchema } from "@zuno/validation";
import { trackEvent } from "../../lib/analytics";
import { AnalyticsEvent } from "@zuno/analytics";
import { isDevMockAuthEnabled } from "@zuno/config";

/**
 * Requests a phone OTP via Supabase Auth.
 * Accepts a 10-digit Indian phone number or E.164 formatted string.
 */
export async function requestPhoneOtp(
  phoneInput: string
): Promise<{ success: boolean; formattedPhone: string; message?: string }> {
  // Validate raw 10-digit phone
  const cleanPhone = phoneInput.replace(/\D/g, "").slice(-10);
  const parseResult = rawPhoneSchema.safeParse(cleanPhone);
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0]?.message || "Invalid phone number format");
  }

  const e164Phone = normalizePhoneE164(cleanPhone);

  trackEvent(AnalyticsEvent.OTP_REQUESTED);

  // Requirement 2 & 9: Only permit in non-production when explicitly enabled
  if (isDevMockAuthEnabled()) {
    console.info("[AuthAPI] Dev mock auth mode: OTP request simulated for local testing.");
    return {
      success: true,
      formattedPhone: e164Phone,
      message: "Development Mock: OTP sent successfully (No SMS required)",
    };
  }

  const { error } = await supabase.auth.signInWithOtp({ phone: e164Phone });
  if (error) {
    throw new Error(error.message || "Failed to send verification code.");
  }

  return {
    success: true,
    formattedPhone: e164Phone,
    message: "OTP sent successfully to your mobile number",
  };
}

/**
 * Verifies the received OTP against Supabase Auth.
 */
export async function verifyPhoneOtp(
  phoneInput: string,
  otpCode: string
): Promise<{ success: boolean; session: any; user: any }> {
  const cleanPhone = phoneInput.replace(/\D/g, "").slice(-10);
  const e164Phone = normalizePhoneE164(cleanPhone);

  if (!otpCode || otpCode.trim().length !== 6) {
    throw new Error("OTP must be a valid 6-digit code");
  }

  // Requirement 2 & 9: Only permit in non-production when explicitly enabled
  if (isDevMockAuthEnabled()) {
    console.info("[AuthAPI] Dev mock auth mode: OTP verification simulated for local testing.");
    trackEvent(AnalyticsEvent.OTP_VERIFICATION_SUCCEEDED);
    return {
      success: true,
      session: { access_token: "dev-session-token", user: { id: "dev-user-id", phone: e164Phone } },
      user: { id: "dev-user-id", phone: e164Phone },
    };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone: e164Phone,
    token: otpCode.trim(),
    type: "sms",
  });

  if (error || !data.user) {
    throw new Error(error?.message || "Invalid or expired verification code");
  }

  trackEvent(AnalyticsEvent.OTP_VERIFICATION_SUCCEEDED);
  return {
    success: true,
    session: data.session,
    user: data.user,
  };
}

/**
 * Gets the current active session from Supabase Auth.
 */
export async function getCurrentSession() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  } catch {
    return null;
  }
}

/**
 * Gets the current authenticated user.
 */
export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  } catch {
    return null;
  }
}

/**
 * Signs out the current customer and clears the local session storage.
 */
export async function signOutCustomer(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err: any) {
    console.error("[AuthAPI] Error signing out:", err.message);
  }
}

/**
 * Listens for auth state changes (e.g. SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED).
 */
export function subscribeToAuthChanges(callback: (event: string, session: any) => void) {
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return authListener.subscription;
}


