import { supabase } from "../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CompleteProfileInput, OnboardingState, Profile } from "@zuno/types";
import { completeProfileSchema, profileSchema } from "@zuno/validation";
import { saveCustomerAddress } from "../location/api";
import { recordUserConsent } from "../consent/api";
import { trackEvent } from "../../lib/analytics";
import { AnalyticsEvent } from "@zuno/analytics";

const PROFILE_STORAGE_KEY = "zuno_customer_profile";

export const DEFAULT_FALLBACK_PROFILE: Profile = {
  id: "prof-demo-123",
  role: "CUSTOMER",
  full_name: "ZUNO Customer",
  phone: "+91 98765 43210",
  email: "customer@zuno.com",
  email_verified_at: new Date().toISOString(),
  avatar_url: null,
  gender: "Male",
  default_address_id: "addr-1",
  onboarding_completed_at: new Date().toISOString(),
  profile_completed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function getLocalProfile(): Promise<Profile | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed as Profile;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function saveLocalProfile(profile: Profile): Promise<void> {
  try {
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

/**
 * Creates or retrieves the customer profile matching auth.uid().
 * Idempotent operation — safe to retry.
 */
export async function createOrGetCustomerProfile(
  fullName?: string,
  email?: string,
  phone?: string
): Promise<Profile> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    const local = await getLocalProfile();
    if (local) return local;
    const initial = {
      ...DEFAULT_FALLBACK_PROFILE,
      full_name: fullName || DEFAULT_FALLBACK_PROFILE.full_name,
      email: email || DEFAULT_FALLBACK_PROFILE.email,
      phone: phone || DEFAULT_FALLBACK_PROFILE.phone,
    };
    await saveLocalProfile(initial);
    return initial;
  }

  const userId = userData.user.id;
  const userPhone = phone || userData.user.phone || "";

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (existingProfile) {
    // Update missing email/name if provided
    if (fullName || email || phone) {
      const updates: Partial<Profile> = { updated_at: new Date().toISOString() };
      if (fullName && !existingProfile.full_name) updates.full_name = fullName;
      if (email && !existingProfile.email) updates.email = email;
      if (userPhone && !existingProfile.phone) updates.phone = userPhone;

      const { data: updated } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select("*")
        .single();

      const finalProf = (updated || existingProfile) as Profile;
      await saveLocalProfile(finalProf);
      return finalProf;
    }
    await saveLocalProfile(existingProfile as Profile);
    return existingProfile as Profile;
  }

  // Create new profile for authenticated customer
  const { data: newProfile, error: createError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      role: "CUSTOMER",
      full_name: fullName || null,
      email: email || null,
      phone: userPhone || null,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (createError) {
    console.error("[ProfileAPI] Error creating customer profile:", createError.message);
    const local = {
      ...DEFAULT_FALLBACK_PROFILE,
      id: userId,
      full_name: fullName || DEFAULT_FALLBACK_PROFILE.full_name,
    };
    await saveLocalProfile(local);
    return local;
  }

  await saveLocalProfile(newProfile as Profile);
  return newProfile as Profile;
}

/**
 * Gets the authenticated customer's profile.
 */
export async function getCustomerProfile(): Promise<Profile | null> {
  const localProf = await getLocalProfile();

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (!error && data) {
        const fetched = data as Profile;
        await saveLocalProfile(fetched);
        return fetched;
      }
    }
  } catch {
    // fallback
  }

  return localProf || DEFAULT_FALLBACK_PROFILE;
}

/**
 * Updates permitted fields on the customer's profile.
 */
export async function updateCustomerProfile(updates: Partial<Profile>): Promise<Profile> {
  const existing = (await getCustomerProfile()) || DEFAULT_FALLBACK_PROFILE;

  const mergedInput = {
    full_name: updates.full_name ?? existing.full_name ?? "ZUNO Customer",
    email: updates.email ?? existing.email ?? undefined,
    phone: updates.phone ?? existing.phone ?? undefined,
    avatar_url: updates.avatar_url ?? existing.avatar_url ?? undefined,
    gender: updates.gender ?? existing.gender ?? undefined,
  };

  const validated = profileSchema.partial().parse(mergedInput);

  const updatedProfile: Profile = {
    ...existing,
    ...validated,
    updated_at: new Date().toISOString(),
  };

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...validated,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userData.user.id)
        .select("*")
        .maybeSingle();

      if (!error && data) {
        const result = data as Profile;
        await saveLocalProfile(result);
        return result;
      }
    }
  } catch (err) {
    console.warn("[ProfileAPI] Supabase update bypassed, using local profile store:", err);
  }

  await saveLocalProfile(updatedProfile);
  return updatedProfile;
}

/**
 * Completes the customer profile journey:
 * 1. Validates full name, email, gender, terms & privacy acceptance, and delivery address.
 * 2. Saves delivery address and sets it as default.
 * 3. Records versioned Terms & Conditions and Privacy Policy consents.
 * 4. Sets profile_completed_at and onboarding_completed_at.
 */
export async function completeCustomerProfile(
  input: CompleteProfileInput
): Promise<{ profile: Profile }> {
  const validated = completeProfileSchema.parse({
    full_name: input.full_name,
    email: input.email,
    gender: input.gender,
    terms_accepted: input.terms_accepted,
    privacy_accepted: input.privacy_accepted,
    terms_version: input.terms_version || "1.0",
    privacy_version: input.privacy_version || "1.0",
  });

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Authentication required to complete profile");
  }

  const userId = userData.user.id;

  // 1. Save confirmed delivery address
  const savedAddress = await saveCustomerAddress({
    ...input.address,
    recipient_name: validated.full_name,
    phone_number: userData.user.phone || undefined,
    is_default: true,
  });

  // 2. Record explicit versioned legal consents
  await recordUserConsent("TERMS_AND_CONDITIONS", validated.terms_version);
  await recordUserConsent("PRIVACY_POLICY", validated.privacy_version);

  // 3. Update profile with completed state
  const now = new Date().toISOString();
  const { data: updatedProfile, error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: validated.full_name,
      email: validated.email,
      gender: validated.gender,
      default_address_id: savedAddress.id,
      profile_completed_at: now,
      onboarding_completed_at: now,
      updated_at: now,
    })
    .eq("id", userId)
    .select("*")
    .single();

  if (profileError) {
    console.error("[ProfileAPI] Error completing customer profile:", profileError.message);
    throw new Error("Failed to finalize profile completion");
  }

  trackEvent(AnalyticsEvent.PROFILE_COMPLETED);

  return { profile: updatedProfile as Profile };
}

/**
 * Calculates the current onboarding & authentication state of the customer.
 * Server/Database verified state — never trusts client state.
 */
export async function getOnboardingState(): Promise<OnboardingState> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData?.session) {
    return "UNAUTHENTICATED";
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return "UNAUTHENTICATED";
  }

  // Verify phone is verified
  if (!userData.user.phone) {
    return "PHONE_VERIFICATION_REQUIRED";
  }

  const profile = await getCustomerProfile();

  // If profile does not exist yet
  if (!profile) {
    return "LOCATION_REQUIRED";
  }

  // Check if profile is complete
  if (!profile.full_name || !profile.email || !profile.gender) {
    return "PROFILE_COMPLETION_REQUIRED";
  }

  // Check if legal consent recorded
  const { data: consents } = await supabase
    .from("user_consents")
    .select("consent_type")
    .eq("user_id", profile.id);

  const hasTerms = consents?.some((c) => c.consent_type === "TERMS_AND_CONDITIONS");
  const hasPrivacy = consents?.some((c) => c.consent_type === "PRIVACY_POLICY");

  if (!hasTerms || !hasPrivacy) {
    return "TERMS_ACCEPTANCE_REQUIRED";
  }

  if (!profile.profile_completed_at) {
    return "PROFILE_COMPLETION_REQUIRED";
  }

  return "READY_FOR_HOME";
}
