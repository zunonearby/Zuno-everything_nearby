import React from "react";
import { getShopInventoryAction } from "../../features/inventory/actions";
import InventoryClient from "./InventoryClient";

export default async function InventoryPage() {
  const initialData = await getShopInventoryAction();
  return <InventoryClient initialData={initialData} />;
}
