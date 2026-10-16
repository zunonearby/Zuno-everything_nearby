import { APPROVED_SERVICE_AREAS, ServiceAreaConfigRecord } from "@zuno/config";
import { createPublicClient } from "@/lib/supabase";
import { pincodeSchema } from "@zuno/validation";

export type ServiceAreaCheckStatus = "AVAILABLE" | "NOT_AVAILABLE" | "UNKNOWN";

export interface ServiceAreaDetails {
  pincode: string;
  name: string;
  city: string;
  state: string;
  country_code: string;
  hub_address?: string;
  notes?: string;
}

export interface ServiceAreaCheckResult {
  status: ServiceAreaCheckStatus;
  pincode: string;
  details?: ServiceAreaDetails;
  source: "database" | "configuration" | "unconfigured";
}

/**
 * Checks service area availability for a 6-digit Indian PIN code.
 *
 * Checks against:
 * 1. The existing Supabase `service_areas` database records (when connected).
 * 2. The authoritative `@zuno/config` approved launch registry (fallback / offline).
 * 3. Returns UNKNOWN / UNCONFIGURED if the PIN is not mapped in reliable records,
 *    ensuring unknown PINs are never incorrectly classified as unavailable.
 */
export async function checkServiceAreaAvailability(
  rawPincode: string
): Promise<ServiceAreaCheckResult> {
  const trimmed = rawPincode.trim();
  const validation = pincodeSchema.safeParse(trimmed);
  if (!validation.success) {
    throw new Error(validation.error.errors[0]?.message || "Invalid 6-digit PIN code format");
  }

  const pincode = validation.data;

  // 1. Attempt query against existing database table `service_areas`
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("service_areas")
      .select("id, name, pincode, city, state, country_code, is_active")
      .eq("pincode", pincode)
      .maybeSingle();

    if (!error && data) {
      return {
        status: data.is_active ? "AVAILABLE" : "NOT_AVAILABLE",
        pincode: data.pincode,
        details: {
          pincode: data.pincode,
          name: data.name,
          city: data.city || "Renukoot",
          state: data.state || "Uttar Pradesh",
          country_code: data.country_code || "IN",
        },
        source: "database",
      };
    }
  } catch (err) {
    // If Supabase is unreachable or not configured in current environment, fall through to configuration registry
    console.warn("[ServiceArea] Live database check not accessible, querying approved configuration registry:", err);
  }

  // 2. Query configured service-area records
  const configured = APPROVED_SERVICE_AREAS[pincode];
  if (configured) {
    return {
      status: configured.is_active ? "AVAILABLE" : "NOT_AVAILABLE",
      pincode: configured.pincode,
      details: {
        pincode: configured.pincode,
        name: configured.name,
        city: configured.city,
        state: configured.state,
        country_code: configured.country_code,
        hub_address: configured.hub_address,
        notes: configured.notes,
      },
      source: "configuration",
    };
  }

  // 3. Unconfigured / Unknown PIN code
  return {
    status: "UNKNOWN",
    pincode,
    source: "unconfigured",
  };
}
