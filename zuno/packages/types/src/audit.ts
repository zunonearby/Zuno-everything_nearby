export interface ActivityLog {
  id: string;
  actor_id: string | null;
  action: string; // e.g. "shop.approved", "order.status_changed"
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface PlatformSetting {
  key: string;
  value: unknown;
  updated_at: string;
}
