import React from "react";
import { getShopDashboardDataAction } from "../../features/dashboard/actions";
import ShopDashboardClient from "./ShopDashboardClient";

export default async function ShopDashboardPage() {
  const initialData = await getShopDashboardDataAction();
  return <ShopDashboardClient initialData={initialData} />;
}
