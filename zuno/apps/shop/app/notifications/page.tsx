import React from "react";
import { getShopNotificationsAction } from "../../features/notifications/actions";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsPage() {
  const initialData = await getShopNotificationsAction();
  return <NotificationsClient initialData={initialData} />;
}
