"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { verifyAdminAuthorization } from "../../lib/authGuard";
import { APPROVED_SERVICE_AREAS, ServiceAreaConfigRecord } from "@zuno/config";

export interface PlatformConfigSummary {
  serviceArea: ServiceAreaConfigRecord;
  dbSettings: Array<{ key: string; value: any; updatedAt: string }>;
}

export interface SettingsActionResponse {
  success: boolean;
  data?: PlatformConfigSummary;
  error?: string;
}

/**
 * Server Action: Fetches real service area and platform configuration.
 */
export async function getPlatformSettingsAction(): Promise<SettingsActionResponse> {
  const auth = await verifyAdminAuthorization();
  if (!auth.authorized || !auth.user) {
    return {
      success: false,
      error: auth.error || "Unauthorized: Administrator privileges required.",
    };
  }

  const supabase = createServerSupabaseClient();

  try {
    const { data: dbRows } = await supabase
      .from("platform_settings")
      .select("key, value, updated_at");

    return {
      success: true,
      data: {
        serviceArea: APPROVED_SERVICE_AREAS["231217"],
        dbSettings: (dbRows || []).map((r: any) => ({
          key: r.key,
          value: r.value,
          updatedAt: r.updated_at,
        })),
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to fetch platform settings.",
    };
  }
}
