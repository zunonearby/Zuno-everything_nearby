/**
 * Generic location concepts. The initial launch area (PIN 231217 / Renukoot)
 * is data, not architecture — nothing here should hardcode it.
 */
export interface ServiceArea {
  id: string;
  name: string;
  pincode: string;
  is_active: boolean;
}

export interface DeliveryZone {
  id: string;
  service_area_id: string;
  name: string;
  polygon: unknown; // GeoJSON polygon, refined when maps integration lands
}
