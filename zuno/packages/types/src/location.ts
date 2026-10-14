/**
 * Generic location concepts. The initial launch area (PIN 231217 / Renukoot)
 * is data, not architecture — nothing here should hardcode it.
 */
export interface ServiceArea {
  id: string;
  name: string;
  pincode: string;
  city: string;
  state: string;
  country_code: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceAreaValidationResult {
  is_serviceable: boolean;
  pincode: string;
  city?: string;
  state?: string;
  area_name?: string;
  message?: string;
}

export interface DeliveryZone {
  id: string;
  service_area_id: string;
  name: string;
  polygon: unknown; // GeoJSON polygon
}
