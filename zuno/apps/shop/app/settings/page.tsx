import React from "react";
import { getShopSettingsAction } from "../../features/settings/actions";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const initialData = await getShopSettingsAction();
  return <SettingsClient initialData={initialData} />;
}
