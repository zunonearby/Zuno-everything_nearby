import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCheck,
  ShoppingBag,
  Bike,
  PackageCheck,
  Sparkles,
  Megaphone,
  Bell,
  ChevronRight,
  CheckCircle2,
} from "lucide-react-native";
import {
  getCustomerNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  subscribeToNotificationsRealtime,
  NotificationItem,
} from "@/features/notifications/api";
import { posthog } from "@/lib/posthog";

const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#718078";
const ORANGE_BG = "#FEF3C7";
const ORANGE_TEXT = "#D97706";
const BLUE_BG = "#EFF6FF";
const BLUE_TEXT = "#2563EB";

type FilterTab = "ALL" | "ORDER_UPDATE" | "PROMO" | "SYSTEM";

export default function NotificationsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async (filter = activeTab) => {
    try {
      const data = await getCustomerNotifications(filter);
      setNotifications(data || []);
    } catch (err) {
      console.error("[NotificationsScreen] Error loading notifications:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    try {
      posthog?.capture("notifications_viewed");
    } catch {
      // ignore posthog error
    }

    loadNotifications(activeTab);

    const unsubscribe = subscribeToNotificationsRealtime(() => {
      loadNotifications(activeTab);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [activeTab]);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setLoading(true);
    loadNotifications(tab);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationPress = async (item: NotificationItem) => {
    try {
      if (!item.read) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
        );
        markNotificationAsRead(item.id).catch(() => {});
      }
    } catch {
      // Ignore background read status sync errors
    }

    try {
      if (item.type === "PROMO") {
        router.push("/category/fruits" as never);
      } else if (item.type === "SYSTEM") {
        router.push("/" as never);
      } else if (item.metadata?.order_id) {
        router.push(`/order/${item.metadata.order_id}` as never);
      } else {
        router.push("/" as never);
      }
    } catch {
      // Fallback navigation
    }
  };

  const getRelativeTime = (isoString?: string) => {
    if (!isoString) return "Recently";
    try {
      const timeMs = new Date(isoString).getTime();
      if (isNaN(timeMs)) return "Recently";
      const nowMs = Date.now();
      const diffSec = Math.floor((nowMs - timeMs) / 1000);

      if (diffSec < 60) return "Just now";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
      return `${Math.floor(diffSec / 86400)} day ago`;
    } catch {
      return "Recently";
    }
  };

  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  const renderNotificationIcon = (item: NotificationItem) => {
    if (item?.type === "PROMO") {
      return (
        <View style={[styles.iconBox, { backgroundColor: ORANGE_BG }]}>
          <Sparkles size={20} color={ORANGE_TEXT} />
        </View>
      );
    }
    if (item?.type === "SYSTEM") {
      return (
        <View style={[styles.iconBox, { backgroundColor: BLUE_BG }]}>
          <Megaphone size={20} color={BLUE_TEXT} />
        </View>
      );
    }
    // ORDER_UPDATE icons based on title/status
    const titleLower = (item?.title || "").toLowerCase();
    if (titleLower.includes("on the way") || titleLower.includes("out for delivery")) {
      return (
        <View style={[styles.iconBox, { backgroundColor: LIGHT_GREEN }]}>
          <Bike size={20} color={GREEN} />
        </View>
      );
    }
    if (titleLower.includes("prepared") || titleLower.includes("ready")) {
      return (
        <View style={[styles.iconBox, { backgroundColor: LIGHT_GREEN }]}>
          <PackageCheck size={20} color={GREEN} />
        </View>
      );
    }
    return (
      <View style={[styles.iconBox, { backgroundColor: LIGHT_GREEN }]}>
        <ShoppingBag size={20} color={GREEN} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push("/" as never);
              }
            }}
          >
            <ArrowLeft size={20} color={DARK} />
          </Pressable>

          <Text style={styles.headerTitle}>Notifications</Text>

          {unreadCount > 0 ? (
            <Pressable style={styles.markReadBtn} onPress={handleMarkAllRead}>
              <CheckCheck size={14} color={GREEN} style={{ marginRight: 3 }} />
              <Text style={styles.markReadText}>Mark all as read</Text>
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Horizontal Filter Chips */}
        <View style={styles.filterRow}>
          {[
            { id: "ALL", label: "All" },
            { id: "ORDER_UPDATE", label: "Orders" },
            { id: "PROMO", label: "Offers" },
            { id: "SYSTEM", label: "System" },
          ].map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => handleTabChange(tab.id as FilterTab)}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Content List */}
        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={GREEN} />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Bell size={36} color={GREEN} />
            </View>
            <Text style={styles.emptyTitle}>You're all caught up!</Text>
            <Text style={styles.emptySub}>
              We'll notify you here when your order status changes or special offers launch.
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadNotifications(activeTab);
                }}
                tintColor={GREEN}
              />
            }
          >
            {notifications.map((item) => (
              <Pressable
                key={item.id}
                style={[styles.notifCard, !item.read && styles.unreadCard]}
                onPress={() => handleNotificationPress(item)}
              >
                {renderNotificationIcon(item)}

                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notifTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {!item.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifBody}>{item.body}</Text>
                  <Text style={styles.timeText}>{getRelativeTime(item.created_at)}</Text>
                </View>

                <ChevronRight size={16} color={MUTED} style={{ marginLeft: 6 }} />
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  screen: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
    color: MUTED,
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: DARK,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
  },
  markReadBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  markReadText: {
    fontSize: 13,
    fontWeight: "600",
    color: GREEN,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipSelected: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: DARK,
  },
  chipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: DARK,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: MUTED,
    textAlign: "center",
    lineHeight: 18,
  },
  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  unreadCard: {
    borderColor: GREEN,
    backgroundColor: "#F4FAF0",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN,
    marginLeft: 6,
  },
  notifBody: {
    fontSize: 13,
    color: DARK,
    lineHeight: 18,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 11,
    color: MUTED,
  },
});
