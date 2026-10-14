import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Store,
  MapPin,
  ArrowRight,
  Package,
  Check,
  Bike,
  Bell,
  User,
  IndianRupee,
} from "lucide-react-native";
import {
  getDeliveryOrdersList,
  subscribeToDeliveriesRealtime,
  DeliveryOrder,
} from "@/features/deliveries/api";
import { getCurrentDeliveryPartner, DeliveryPartnerAccount } from "@/features/auth/api";
import { getBrandLogoSource } from "@/lib/assets";
import { DeliveryStatus, OrderStatus } from "@zuno/types";

// Design Tokens matching ZUNO brand reference
const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#111827";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";

type FilterTab = "ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export default function DeliveryOrdersScreen() {
  const router = useRouter();

  const [partner, setPartner] = useState<DeliveryPartnerAccount | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [allOrders, setAllOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Status helper functions
  const isOrderActive = (d: DeliveryOrder) =>
    d.status === DeliveryStatus.ASSIGNED ||
    d.status === DeliveryStatus.PICKED_UP ||
    d.status === DeliveryStatus.OUT_FOR_DELIVERY ||
    d.orderStatus === OrderStatus.OUT_FOR_DELIVERY ||
    d.orderStatus === OrderStatus.PREPARING ||
    d.orderStatus === OrderStatus.READY_FOR_PICKUP ||
    d.orderStatus === OrderStatus.ACCEPTED;

  const isOrderCompleted = (d: DeliveryOrder) =>
    d.status === DeliveryStatus.COMPLETED || d.orderStatus === OrderStatus.DELIVERED;

  const isOrderCancelled = (d: DeliveryOrder) =>
    d.status === DeliveryStatus.FAILED ||
    d.orderStatus === OrderStatus.CANCELLED ||
    d.orderStatus === OrderStatus.REJECTED;

  const isBeforePickup = (d: DeliveryOrder) =>
    d.status === DeliveryStatus.ASSIGNED ||
    d.orderStatus === OrderStatus.READY_FOR_PICKUP ||
    d.orderStatus === OrderStatus.PREPARING ||
    d.orderStatus === OrderStatus.ACCEPTED;

  const loadOrders = useCallback(async () => {
    try {
      const [partnerData, list] = await Promise.all([
        getCurrentDeliveryPartner(),
        getDeliveryOrdersList("ALL"),
      ]);
      setPartner(partnerData);
      setAllOrders(list || []);
    } catch (err) {
      console.error("[DeliveryOrders] Error loading orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  useEffect(() => {
    const unsubscribe = subscribeToDeliveriesRealtime(() => {
      loadOrders();
    });
    return () => {
      unsubscribe();
    };
  }, [loadOrders]);

  // Derived counts for filter chips
  const activeCount = allOrders.filter(isOrderActive).length;
  const completedCount = allOrders.filter(isOrderCompleted).length;
  const cancelledCount = allOrders.filter(isOrderCancelled).length;
  const allCount = allOrders.length;

  // Filtered orders to display
  const displayedOrders = allOrders.filter((item) => {
    if (activeTab === "ACTIVE") return isOrderActive(item);
    if (activeTab === "COMPLETED") return isOrderCompleted(item);
    if (activeTab === "CANCELLED") return isOrderCancelled(item);
    return true; // ALL
  });

  const handleOrderPress = (item: DeliveryOrder) => {
    if (isOrderActive(item)) {
      if (isBeforePickup(item)) {
        router.push(`/order/pickup/${item.id}` as never);
      } else {
        router.push(`/order/delivery/${item.id}` as never);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.screen}>
        {/* Header matching Reference */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image
              source={getBrandLogoSource()}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <View style={styles.partnerTag}>
              <Bike size={13} color={GREEN} />
              <Text style={styles.partnerTagText}>Delivery Partner</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <Pressable
              style={styles.iconCircle}
              onPress={() => loadOrders()}
              accessibilityLabel="Notifications"
            >
              <Bell size={18} color={DARK} />
              <View style={styles.unreadDot} />
            </Pressable>

            <Pressable
              style={styles.avatarCircle}
              onPress={() => router.push("/(tabs)/profile" as never)}
              accessibilityLabel="Profile"
            >
              {!avatarError ? (
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
                  }}
                  style={styles.avatarImg}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <User size={18} color={GREEN} />
              )}
            </Pressable>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadOrders();
              }}
              tintColor={GREEN}
            />
          }
        >
          {/* Page Title & Subtitle */}
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>Delivery Orders</Text>
            <Text style={styles.pageSubtitle}>
              Manage assigned and active deliveries
            </Text>
          </View>

          {/* Filter Chips matching Reference */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsRow}
          >
            {[
              { id: "ALL" as FilterTab, label: `All (${allCount})` },
              { id: "ACTIVE" as FilterTab, label: `Active (${activeCount})` },
              { id: "COMPLETED" as FilterTab, label: `Completed (${completedCount})` },
              { id: "CANCELLED" as FilterTab, label: `Cancelled (${cancelledCount})` },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  style={[
                    styles.filterChip,
                    isSelected ? styles.filterChipSelected : styles.filterChipUnselected,
                  ]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected
                        ? styles.filterChipTextSelected
                        : styles.filterChipTextUnselected,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Orders List Content */}
          {loading && !refreshing ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={GREEN} />
              <Text style={styles.loadingText}>Fetching delivery orders...</Text>
            </View>
          ) : displayedOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Package size={34} color={GREEN} />
              </View>
              <Text style={styles.emptyTitle}>No deliveries found</Text>
              <Text style={styles.emptySub}>
                {activeTab === "ACTIVE"
                  ? "You have no active orders in progress right now."
                  : activeTab === "COMPLETED"
                  ? "Completed deliveries will show here."
                  : activeTab === "CANCELLED"
                  ? "No cancelled orders recorded."
                  : "Assigned orders will appear here once dispatched."}
              </Text>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {displayedOrders.map((item) => {
                const active = isOrderActive(item);
                const completed = isOrderCompleted(item);
                const cancelled = isOrderCancelled(item);

                return (
                  <View key={item.id} style={styles.orderCard}>
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.shopLeftBox}>
                        <View style={styles.shopIconCircle}>
                          <Store size={18} color={GREEN} />
                        </View>
                        <Text style={styles.shopNameText} numberOfLines={1}>
                          {item.shopName}
                        </Text>
                      </View>

                      <View style={styles.orderStatusCol}>
                        <Text style={styles.orderNumberText}>
                          {item.orderNumber}
                        </Text>

                        {/* Status Badge Pill */}
                        {active ? (
                          <View style={styles.activeStatusPill}>
                            <View style={styles.activeStatusDot} />
                            <Text style={styles.activeStatusText}>Active</Text>
                          </View>
                        ) : completed ? (
                          <View style={styles.completedStatusPill}>
                            <Check size={11} color={GREEN} strokeWidth={3} />
                            <Text style={styles.completedStatusText}>Delivered</Text>
                          </View>
                        ) : cancelled ? (
                          <View style={styles.cancelledStatusPill}>
                            <Text style={styles.cancelledStatusText}>Cancelled</Text>
                          </View>
                        ) : (
                          <View style={styles.activeStatusPill}>
                            <Text style={styles.activeStatusText}>{item.status}</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Address Route Container */}
                    <View style={styles.addressRouteCard}>
                      {/* Pickup Row */}
                      <View style={styles.addressNodeRow}>
                        <View style={styles.pickupDot} />
                        <View style={styles.addressNodeCol}>
                          <Text style={styles.addressNodeLabel}>Pickup from</Text>
                          <Text style={styles.addressNodeText} numberOfLines={1}>
                            {item.pickupAddress}
                          </Text>
                        </View>
                      </View>

                      {/* Dotted Connecting Line */}
                      <View style={styles.dottedConnectorLine}>
                        <View style={styles.smallDot} />
                        <View style={styles.smallDot} />
                        <View style={styles.smallDot} />
                      </View>

                      {/* Drop-off Row */}
                      <View style={styles.addressNodeRow}>
                        <MapPin size={13} color="#EF4444" style={styles.dropoffPinIcon} />
                        <View style={styles.addressNodeCol}>
                          <Text style={styles.addressNodeLabel}>Deliver to</Text>
                          <Text style={styles.addressNodeText} numberOfLines={2}>
                            {item.deliveryAddress}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Meta Info & Payout Row */}
                    <View style={styles.metaRow}>
                      <View style={styles.metaLeftGroup}>
                        <View style={styles.itemsBadge}>
                          <Package size={15} color="#4B5563" />
                          <Text style={styles.itemsText}>
                            {item.itemsCount} item{item.itemsCount > 1 ? "s" : ""}
                          </Text>
                        </View>

                        <View style={styles.metaDivider} />

                        <View style={styles.orderValueCol}>
                          <View style={styles.orderValuePriceRow}>
                            <IndianRupee size={12} color={DARK} />
                            <Text style={styles.orderValueNum}>
                              {item.total}
                            </Text>
                          </View>
                          <Text style={styles.orderValueLabel}>Order value</Text>
                        </View>
                      </View>

                      {/* Partner Payout Box */}
                      <View style={styles.payoutBadgeBox}>
                        <Text style={styles.payoutLabel}>Partner payout</Text>
                        <Text style={styles.payoutValue}>₹{item.payout}</Text>
                      </View>
                    </View>

                    {/* Prominent Action Button (Only for Eligible Active Orders) */}
                    {active && (
                      <Pressable
                        style={styles.viewDeliveryBtn}
                        onPress={() => handleOrderPress(item)}
                        accessibilityRole="button"
                        accessibilityLabel="View Delivery"
                      >
                        <Text style={styles.viewDeliveryBtnText}>
                          View Delivery
                        </Text>
                        <ArrowRight size={16} color="#FFFFFF" />
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F1",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandLogo: {
    width: 105,
    height: 28,
  },
  partnerTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  partnerTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: GREEN,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#EF4444",
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: LIGHT_GREEN,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 88,
  },
  titleSection: {
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: DARK,
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
  },
  filterChipsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipSelected: {
    backgroundColor: GREEN,
  },
  filterChipUnselected: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
  },
  filterChipText: {
    fontSize: 12.5,
  },
  filterChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  filterChipTextUnselected: {
    color: DARK,
    fontWeight: "600",
  },
  centerContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: MUTED,
  },
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12.5,
    color: MUTED,
    textAlign: "center",
    lineHeight: 18,
  },
  ordersList: {
    gap: 14,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  shopLeftBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  shopIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  shopNameText: {
    fontSize: 15,
    fontWeight: "800",
    color: DARK,
    flex: 1,
  },
  orderStatusCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  orderNumberText: {
    fontSize: 13,
    fontWeight: "800",
    color: DARK,
  },
  activeStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  activeStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EA580C",
  },
  activeStatusText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#EA580C",
  },
  completedStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EAF4E5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  completedStatusText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: GREEN,
  },
  cancelledStatusPill: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  cancelledStatusText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#EF4444",
  },
  addressRouteCard: {
    backgroundColor: BG,
    borderRadius: 14,
    padding: 12,
  },
  addressNodeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  pickupDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#10B981",
    marginTop: 4,
    marginLeft: 3,
  },
  dropoffPinIcon: {
    marginTop: 2,
  },
  addressNodeCol: {
    flex: 1,
  },
  addressNodeLabel: {
    fontSize: 10.5,
    color: MUTED,
    fontWeight: "500",
  },
  addressNodeText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: DARK,
    marginTop: 1,
  },
  dottedConnectorLine: {
    paddingLeft: 5,
    marginVertical: 3,
    gap: 2.5,
  },
  smallDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#10B981",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 2,
  },
  metaLeftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  itemsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  metaDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#E2E8F0",
  },
  orderValueCol: {
    alignItems: "flex-start",
  },
  orderValuePriceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderValueNum: {
    fontSize: 13,
    fontWeight: "800",
    color: DARK,
  },
  orderValueLabel: {
    fontSize: 10,
    color: MUTED,
  },
  payoutBadgeBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignItems: "flex-end",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  payoutLabel: {
    fontSize: 9.5,
    color: "#4B5563",
    fontWeight: "500",
  },
  payoutValue: {
    fontSize: 16,
    fontWeight: "900",
    color: GREEN,
  },
  viewDeliveryBtn: {
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 2,
    ...(Platform.OS === "web" ? { cursor: "pointer" as any } : {}),
  },
  viewDeliveryBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "800",
  },
});
