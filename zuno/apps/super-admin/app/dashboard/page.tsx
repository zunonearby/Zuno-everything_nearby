import React from "react";
import { getSuperAdminDashboardDataAction } from "../../features/dashboard/actions";
import SuperAdminDashboardClient from "./SuperAdminDashboardClient";
import { requireAdminPage } from "../../lib/authGuard";

export default async function SuperAdminDashboardPage() {
  await requireAdminPage();
  const initialData = await getSuperAdminDashboardDataAction();
  return <SuperAdminDashboardClient initialData={initialData} />;
}
