import React from "react";
import { getShopProfileAction } from "../../features/shop/actions";
import ShopProfileClient from "./ShopProfileClient";

export default async function ShopProfilePage() {
  const initialData = await getShopProfileAction();
  return <ShopProfileClient initialData={initialData} />;
}
