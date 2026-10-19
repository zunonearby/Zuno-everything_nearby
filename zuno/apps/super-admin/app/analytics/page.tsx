import React from "react";
import { getPlatformAnalyticsAction } from "../../features/analytics/actions";
import AnalyticsClient from "./AnalyticsClient";
import { requireAdminPage } from "../../lib/authGuard";

export default async function AnalyticsPage() {
  await requireAdminPage();
  const res = await getPlatformAnalyticsAction();
  return <AnalyticsClient initialData={res.data} initialError={res.error} />;
}
