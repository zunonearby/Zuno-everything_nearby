"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { verifyAdminAuthorization } from "../../lib/authGuard";

export interface ActivityLogRecord {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: any;
  createdAt: string;
}

export interface ActivityActionResponse {
  success: boolean;
  data?: ActivityLogRecord[];
  error?: string;
}

/**
 * Server Action: Fetches real audit logs from public.activity_logs.
 */
export async function getPlatformActivityLogsAction(): Promise<ActivityActionResponse> {
  const auth = await verifyAdminAuthorization();
  if (!auth.authorized || !auth.user) {
    return {
      success: false,
      error: auth.error || "Unauthorized: Administrator privileges required.",
      data: [],
    };
  }

  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select(`
        id,
        actor_id,
        action,
        entity_type,
        entity_id,
        metadata,
        created_at,
        profiles:actor_id (
          full_name,
          role
        )
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return {
        success: false,
        error: `Database query failed: ${error.message}`,
        data: [],
      };
    }

    const logs: ActivityLogRecord[] = (data || []).map((l: any) => ({
      id: l.id,
      actorName: l.profiles?.full_name || "Platform Administrator",
      actorRole: l.profiles?.role || "ADMIN",
      action: l.action,
      entityType: l.entity_type,
      entityId: String(l.entity_id),
      metadata: l.metadata || {},
      createdAt: l.created_at,
    }));

    return {
      success: true,
      data: logs,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to fetch activity logs.",
      data: [],
    };
  }
}
