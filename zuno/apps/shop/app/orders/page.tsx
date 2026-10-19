import React from "react";
import { getShopOrdersAction } from "../../features/orders/actions";
import OrdersClient from "./OrdersClient";

export default async function OrdersPage() {
  const initialData = await getShopOrdersAction();
  return <OrdersClient initialData={initialData} />;
}
