import React from "react";
import { getShopAnalyticsAction } from "../../features/analytics/actions";
import AnalyticsClient from "./AnalyticsClient";

export default async function AnalyticsPage() {
  const initialData = await getShopAnalyticsAction();
  return <AnalyticsClient initialData={initialData} />;
}
