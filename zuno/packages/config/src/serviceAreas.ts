/**
 * ZUNO Approved Service Area Configuration
 *
 * Authoritative configuration registry for approved service area records.
 * - Initial approved launch PIN: 231217 (Renukoot Central) is live (is_active: true).
 * - Known configured inactive zones (e.g. 231222) are explicit records marked is_active: false.
 * - All other unmapped PINs are treated as unknown/unconfigured.
 */

export interface ServiceAreaConfigRecord {
  pincode: string;
  name: string;
  city: string;
  state: string;
  country_code: string;
  is_active: boolean;
  hub_address?: string;
  notes?: string;
}

export const APPROVED_SERVICE_AREAS: Record<string, ServiceAreaConfigRecord> = {
  // Approved Initial Launch Area (Live & Active)
  "231217": {
    pincode: "231217",
    name: "Renukoot Central",
    city: "Renukoot",
    state: "Uttar Pradesh",
    country_code: "IN",
    is_active: true,
    hub_address: "Main Market & Hindalco Colony Radius, Renukoot",
    notes: "Approved initial launch zone — neighborhood merchant and rider operations active",
  },
  // Evaluated Pilot / Peripheral Area — Explicitly configured as inactive/unavailable
  "231222": {
    pincode: "231222",
    name: "Anpara / Sonbhadra Peripheral",
    city: "Sonbhadra",
    state: "Uttar Pradesh",
    country_code: "IN",
    is_active: false,
    notes: "Evaluated pilot sector — deliveries are not currently supported",
  },
};
