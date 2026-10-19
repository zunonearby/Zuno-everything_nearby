import React from "react";
import { getShopProductsAction } from "../../features/products/actions";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  const initialData = await getShopProductsAction();
  return <ProductsClient initialData={initialData} />;
}
