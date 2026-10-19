import React from "react";
import { getShopEarningsAction } from "../../features/earnings/actions";
import EarningsClient from "./EarningsClient";

export default async function EarningsPage() {
  const initialData = await getShopEarningsAction();
  return <EarningsClient initialData={initialData} />;
}
