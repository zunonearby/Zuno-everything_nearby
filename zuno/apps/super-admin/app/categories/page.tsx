import React from "react";
import { getPlatformCategoriesAction } from "../../features/categories/actions";
import CategoriesClient from "./CategoriesClient";
import { requireAdminPage } from "../../lib/authGuard";

export default async function CategoriesPage() {
  await requireAdminPage();
  const res = await getPlatformCategoriesAction();
  return (
    <CategoriesClient
      initialCategories={res.data || []}
      initialError={res.error}
    />
  );
}
