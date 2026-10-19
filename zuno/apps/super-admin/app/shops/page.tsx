import React from "react";
import { getShopApplicationsAction } from "../../features/shops/actions";
import ShopsClient from "./ShopsClient";
import { requireAdminPage } from "../../lib/authGuard";

export default async function ShopsPage() {
  await requireAdminPage();
  const res = await getShopApplicationsAction("ALL");
  return (
    <ShopsClient
      initialApplications={res.data || []}
      initialError={res.error}
    />
  );
}
