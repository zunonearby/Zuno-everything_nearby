import React from "react";
import { getPlatformSettingsAction } from "../../features/settings/actions";
import SettingsClient from "./SettingsClient";
import { requireAdminPage } from "../../lib/authGuard";

export default async function SettingsPage() {
  await requireAdminPage();
  const res = await getPlatformSettingsAction();
  return <SettingsClient initialConfig={res.data} initialError={res.error} />;
}
