import {
  getShopApplicationsAction,
  updateShopApprovalAction,
  ShopApplicationRecord,
} from "./actions";

export type ShopkeeperApplication = ShopApplicationRecord;

export async function getPendingShopkeeperApplications(
  filter: "ALL" | "PENDING" | "APPROVED" | "REJECTED" = "ALL"
): Promise<{ applications: ShopkeeperApplication[]; error?: string }> {
  const res = await getShopApplicationsAction(filter);
  return {
    applications: res.data || [],
    error: res.error,
  };
}

export async function updateShopApprovalStatus(
  shopId: string,
  status: "APPROVED" | "REJECTED" | "SUSPENDED"
): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await updateShopApprovalAction(shopId, status);
  return {
    success: res.success,
    message: res.message,
    error: res.error,
  };
}
