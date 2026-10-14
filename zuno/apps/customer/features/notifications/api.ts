import { supabase } from "../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  body: string;
  read: boolean;
  type: "ORDER_UPDATE" | "PROMO" | "SYSTEM";
  metadata?: {
    order_id?: string;
    status?: string;
    [key: string]: any;
  };
  created_at: string;
}

export const FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    user_id: "demo-user",
    title: "Your order is on the way",
    body: "Your order from Eureka Fresh Mart will arrive in 12 minutes.",
    read: false,
    type: "ORDER_UPDATE",
    metadata: { order_id: "ord-123", status: "OUT_FOR_DELIVERY" },
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    user_id: "demo-user",
    title: "Your order has been prepared",
    body: "Eureka Fresh Mart has prepared your order and it is ready for delivery pickup.",
    read: false,
    type: "ORDER_UPDATE",
    metadata: { order_id: "ord-123", status: "PREPARING" },
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    user_id: "demo-user",
    title: "Shop accepted your order",
    body: "Eureka Fresh Mart has accepted your order #ZUNO-123456.",
    read: true,
    type: "ORDER_UPDATE",
    metadata: { order_id: "ord-123", status: "ACCEPTED" },
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-4",
    user_id: "demo-user",
    title: "Special Offer Just for You!",
    body: "Get 20% off on fresh fruits this weekend in Renukoot.",
    read: true,
    type: "PROMO",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-5",
    user_id: "demo-user",
    title: "Welcome to ZUNO!",
    body: "Start your shopping journey with the freshest local products nearby.",
    read: true,
    type: "SYSTEM",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const READ_NOTIFS_KEY = "zuno_read_notification_ids";

async function getLocalReadIds(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(READ_NOTIFS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {
    // fallback
  }
  return new Set();
}

async function markLocalReadId(id: string) {
  try {
    const set = await getLocalReadIds();
    set.add(id);
    await AsyncStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // fallback
  }
}

async function markAllLocalReadIds(ids: string[]) {
  try {
    const set = await getLocalReadIds();
    ids.forEach((id) => set.add(id));
    await AsyncStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // fallback
  }
}

/**
 * Fetches notifications for the authenticated customer.
 */
export async function getCustomerNotifications(
  filterType: "ALL" | "ORDER_UPDATE" | "PROMO" | "SYSTEM" = "ALL"
): Promise<NotificationItem[]> {
  const localReadIds = await getLocalReadIds();
  let items: NotificationItem[] = [];

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (filterType !== "ALL") {
        query = query.eq("type", filterType);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        items = data as NotificationItem[];
      }
    }
  } catch {
    // fallback
  }

  if (items.length === 0) {
    items =
      filterType === "ALL"
        ? FALLBACK_NOTIFICATIONS
        : FALLBACK_NOTIFICATIONS.filter((n) => n.type === filterType);
  }

  return items.map((item) => ({
    ...item,
    read: item.read || localReadIds.has(item.id),
  }));
}

/**
 * Marks a single notification as read.
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  await markLocalReadId(notificationId);
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .eq("user_id", userData.user.id);
    }
  } catch {
    // ignore
  }
  return true;
}

/**
 * Marks all notifications for the authenticated customer as read.
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  const allIds = FALLBACK_NOTIFICATIONS.map((n) => n.id);
  await markAllLocalReadIds(allIds);

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userData.user.id)
        .eq("read", false);
    }
  } catch {
    // ignore
  }
  return true;
}

/**
 * Retrieves the count of unread notifications for the authenticated customer.
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const list = await getCustomerNotifications("ALL");
  return list.filter((n) => !n.read).length;
}

/**
 * Subscribes to Supabase Realtime notifications for the authenticated user.
 */
export function subscribeToNotificationsRealtime(onNotificationReceived: () => void) {
  const channelName = `notifications-realtime-${Math.random().toString(36).substring(2, 9)}`;
  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
      },
      () => {
        onNotificationReceived();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
