import React, { useState, useCallback, useEffect } from "react";
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
  Image,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  ShoppingBag,
  Store,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  PackageCheck,
  Bike,
  Bell,
  User,
} from "lucide-react-native";
import {
  getCustomerOrdersList,
  subscribeToAllCustomerOrdersRealtime,
  CustomerOrderListItem,
} from "@/features/orders/api";
import { OrderStatus } from "@zuno/types";
import { useCartStore } from "@/store/cartStore";
import { posthog } from "@/lib/posthog";
import { getProductImageSource } from "@/assets/productImages";

const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#718078";
const RED_BG = "#FEE2E2";
const RED_TEXT = "#DC2626";

type FilterTab = "ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export default function OrdersScreen() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [orders, setOrders] = useState<CustomerOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async (filter = activeTab) => {
    try {
      const data = await getCustomerOrdersList(filter);
      setOrders(data || []);
    } catch (err) {
      console.error("[OrdersScreen] Error loading customer orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      loadOrders(activeTab);
    }, [activeTab, loadOrders])
  );

  useEffect(() => {
    try {
      posthog?.capture("orders_screen_viewed");
    } catch {
      // ignore
    }

    const unsubscribe = subscribeToAllCustomerOrdersRealtime(() => {
      loadOrders(activeTab);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [activeTab, loadOrders]);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setLoading(true);
    loadOrders(tab);
  };

  const handleReorder = (order: CustomerOrderListItem) => {
    try {
      order.items.forEach((item) => {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          unit: item.unit || "1 pack",
          shopId: order.shopId,
          shopName: order.shopName,
        });
      });
      router.push("/cart" as never);
    } catch {
      router.push("/cart" as never);
    }
  };

  const activeOrders = orders.filter(
    (o) =>
      o.status !== OrderStatus.DELIVERED &&
      o.status !== OrderStatus.CANCELLED &&
      o.status !== OrderStatus.REJECTED
  );

  const pastOrders = orders.filter(
    (o) =>
      o.status === OrderStatus.DELIVERED ||
      o.status === OrderStatus.CANCELLED ||
      o.status === OrderStatus.REJECTED
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return (
          <View style={[styles.badgeBox, { backgroundColor: "#E6F4EA" }]}>
            <Text style={[styles.badgeText, { color: GREEN }]}>Delivered</Text>
            <ChevronRight size={13} color={GREEN} />
          </View>
        );
      case OrderStatus.CANCELLED:
      case OrderStatus.REJECTED:
        return (
          <View style={[styles.badgeBox, { backgroundColor: RED_BG }]}>
            <Text style={[styles.badgeText, { color: RED_TEXT }]}>
              {status === OrderStatus.CANCELLED ? "Cancelled" : "Rejected"}
            </Text>
            <ChevronRight size={13} color={RED_TEXT} />
          </View>
        );
      case OrderStatus.OUT_FOR_DELIVERY:
        return (
          <View style={[styles.badgeBox, { backgroundColor: "#E6F4EA" }]}>
            <Text style={[styles.badgeText, { color: GREEN }]}>On the way</Text>
            <ChevronRight size={13} color={GREEN} />
          </View>
        );
      case OrderStatus.READY_FOR_PICKUP:
        return (
          <View style={[styles.badgeBox, { backgroundColor: "#E6F4EA" }]}>
            <Text style={[styles.badgeText, { color: GREEN }]}>Ready for Pickup</Text>
            <ChevronRight size={13} color={GREEN} />
          </View>
        );
      case OrderStatus.PREPARING:
        return (
          <View style={[styles.badgeBox, { backgroundColor: "#FEF3C7" }]}>
            <Text style={[styles.badgeText, { color: "#D97706" }]}>Preparing</Text>
            <ChevronRight size={13} color="#D97706" />
          </View>
        );
      case OrderStatus.ACCEPTED:
        return (
          <View style={[styles.badgeBox, { backgroundColor: "#FEF3C7" }]}>
            <Text style={[styles.badgeText, { color: "#D97706" }]}>Accepted</Text>
            <ChevronRight size={13} color="#D97706" />
          </View>
        );
      default:
        return (
          <View style={[styles.badgeBox, { backgroundColor: "#E6F4EA" }]}>
            <Text style={[styles.badgeText, { color: GREEN }]}>Order Placed</Text>
            <ChevronRight size={13} color={GREEN} />
          </View>
        );
    }
  };

  const getRelativeDate = (isoString: string) => {
    if (!isoString) return "Recently";
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "Recently";

      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      }

      return `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } catch {
      return "Recently";
    }
  };

  const renderProductThumbnails = (items: CustomerOrderListItem["items"]) => {
    const maxVisible = 4;
    const visibleItems = items.slice(0, maxVisible);
    const extraCount = items.length - maxVisible;

    return (
      <View style={styles.thumbnailRow}>
        {visibleItems.map((item, idx) => {
          const imgSrc = getProductImageSource({
            id: item.id,
            name: item.name,
            image_url: (item as any).image_url,
          });

          return (
            <View key={item.id || idx} style={styles.thumbnailContainer}>
              {imgSrc ? (
                <Image source={imgSrc} style={styles.thumbnailImage} resizeMode="cover" />
              ) : (
                <View style={styles.thumbnailFallback}>
                  <ShoppingBag size={14} color={GREEN} />
                </View>
              )}
            </View>
          );
        })}

        {extraCount > 0 && (
          <View style={styles.moreThumbnailCard}>
            <Text style={styles.moreThumbnailText}>+{extraCount}</Text>
            <Text style={styles.moreThumbnailSub}>more</Text>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => {
    let icon = <ShoppingBag size={42} color={GREEN} />;
    let title = "No orders placed yet";
    let sub = "Explore fresh groceries, fruits, vegetables & daily essentials near you.";
    let btnLabel = "Start Shopping";

    if (activeTab === "ACTIVE") {
      icon = <PackageCheck size={42} color={GREEN} />;
      title = "No active orders";
      sub = "You don't have any in-progress orders right now.";
      btnLabel = "Explore Shops";
    } else if (activeTab === "COMPLETED") {
      icon = <CheckCircle2 size={42} color={GREEN} />;
      title = "No completed orders";
      sub = "Your past delivered orders will appear here.";
      btnLabel = "Browse Products";
    } else if (activeTab === "CANCELLED") {
      icon = <AlertCircle size={42} color={MUTED} />;
      title = "No cancelled orders";
      sub = "None of your orders have been cancelled.";
      btnLabel = "Shop Now";
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>{icon}</View>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySub}>{sub}</Text>

        <Pressable
          style={styles.browseBtn}
          onPress={() => router.push("/categories" as never)}
        >
          <Text style={styles.browseBtnText}>{btnLabel}</Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    );
  };

  const renderOrderCard = (item: CustomerOrderListItem, isPastCard = false) => {
    const isActive =
      item.status !== OrderStatus.DELIVERED &&
      item.status !== OrderStatus.CANCELLED &&
      item.status !== OrderStatus.REJECTED;

    return (
      <Pressable
        key={item.id}
        style={styles.orderCard}
        onPress={() => router.push(`/order/${item.id}` as never)}
      >
        {/* Shop Info & Status Row */}
        <View style={styles.cardHeader}>
          <View style={styles.shopBox}>
            <View style={styles.shopIconCircle}>
              <Store size={18} color={GREEN} />
            </View>
            <View>
              <Text style={styles.shopName}>{item.shopName}</Text>
              <Text style={styles.shopCategory}>
                {item.shopName.toLowerCase().includes("fresh")
                  ? "Fruits & Vegetables"
                  : "Grocery & Household"}
              </Text>
            </View>
          </View>

          {getStatusBadge(item.status)}
        </View>

        {/* Order Meta Row */}
        <View style={styles.orderMetaRow}>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderSummaryMeta}>
            {item.itemsCount} item{item.itemsCount > 1 ? "s" : ""} • ₹{item.total}
          </Text>
        </View>

        <Text style={styles.orderDate}>{getRelativeDate(item.createdAt)}</Text>

        {/* Product Preview Thumbnails Row + Primary Action */}
        <View style={styles.cardBottomRow}>
          <View style={{ flex: 1 }}>
            {renderProductThumbnails(item.items)}
          </View>

          {/* Action Button */}
          {isActive ? (
            <Pressable
              style={styles.trackBtn}
              onPress={() => router.push(`/order/${item.id}` as never)}
            >
              <Text style={styles.trackBtnText}>Track Order</Text>
            </Pressable>
          ) : item.status === OrderStatus.DELIVERED ? (
            <Pressable
              style={styles.reorderPillBtn}
              onPress={(e) => {
                e.stopPropagation();
                handleReorder(item);
              }}
            >
              <RotateCcw size={13} color={GREEN} />
              <Text style={styles.reorderPillText}>Reorder</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.detailsPillBtn}
              onPress={() => router.push(`/order/${item.id}` as never)}
            >
              <Text style={styles.detailsPillText}>View Details</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.screen}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image
              source={require("../../assets/brandlogo.png")}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerRightControls}>
            <Pressable
              style={styles.iconCircle}
              onPress={() => router.push("/notifications" as never)}
            >
              <Bell size={20} color={DARK} />
              <View style={styles.unreadNotificationDot} />
            </Pressable>

            <Pressable
              style={styles.avatarCircle}
              onPress={() => router.push("/(tabs)/profile" as never)}
            >
              <User size={18} color={GREEN} />
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
                loadOrders(activeTab);
              }}
              tintColor={GREEN}
            />
          }
        >
          {/* Screen Title */}
          <View style={styles.titleSection}>
            <Text style={styles.screenTitle}>My Orders</Text>
            <Text style={styles.screenSubtitle}>Track and manage your orders</Text>
          </View>

          {/* Segmented Filter Bar */}
          <View style={styles.filterBar}>
            {[
              { id: "ALL", label: "All" },
              { id: "ACTIVE", label: "Active" },
              { id: "COMPLETED", label: "Completed" },
              { id: "CANCELLED", label: "Cancelled" },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                  onPress={() => handleTabChange(tab.id as FilterTab)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextSelected,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Main Content */}
          {loading && !refreshing ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={GREEN} />
              <Text style={styles.loadingText}>Fetching your orders...</Text>
            </View>
          ) : orders.length === 0 ? (
            renderEmptyState()
          ) : (
            <View style={styles.ordersListContainer}>
              {/* Active Orders Section */}
              {(activeTab === "ALL" || activeTab === "ACTIVE") && activeOrders.length > 0 && (
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Active Orders</Text>
                    <View style={styles.countBadge}>
                      <Text style={styles.countBadgeText}>{activeOrders.length}</Text>
                    </View>
                  </View>

                  {activeOrders.map((ord) => renderOrderCard(ord))}
                </View>
              )}

              {/* Past Orders Section */}
              {(activeTab === "ALL" || activeTab === "COMPLETED" || activeTab === "CANCELLED") &&
                pastOrders.length > 0 && (
                  <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Text style={styles.sectionTitle}>Past Orders</Text>
                        <View style={styles.pastCountBadge}>
                          <Text style={styles.pastCountBadgeText}>{pastOrders.length}</Text>
                        </View>
                      </View>

                      {activeTab === "ALL" && (
                        <Pressable onPress={() => handleTabChange("COMPLETED")}>
                          <Text style={styles.seeAllText}>See All</Text>
                        </Pressable>
                      )}
                    </View>

                    {pastOrders.map((ord) => renderOrderCard(ord, true))}
                  </View>
                )}
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
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F1",
  },
  brandContainer: {
    justifyContent: "center",
  },
  brandLogo: {
    width: 105,
    height: 28,
  },
  headerRightControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F4F6F4",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  unreadNotificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: LIGHT_GREEN,
    borderWidth: 1.5,
    borderColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 14,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: DARK,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
  },
  filterBar: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EFF2EE",
  },
  filterChipSelected: {
    backgroundColor: GREEN,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: DARK,
  },
  filterChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  ordersListContainer: {
    gap: 20,
  },
  sectionContainer: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: DARK,
  },
  countBadge: {
    backgroundColor: GREEN,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  pastCountBadge: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pastCountBadgeText: {
    color: DARK,
    fontSize: 12,
    fontWeight: "700",
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: GREEN,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EAEFEA",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  shopBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  shopIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  shopName: {
    fontSize: 14.5,
    fontWeight: "800",
    color: DARK,
  },
  shopCategory: {
    fontSize: 11,
    color: MUTED,
    marginTop: 1,
  },
  badgeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: "800",
  },
  orderMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: "800",
    color: DARK,
  },
  orderSummaryMeta: {
    fontSize: 12.5,
    fontWeight: "700",
    color: DARK,
  },
  orderDate: {
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
    marginBottom: 12,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F4F6F4",
  },
  thumbnailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  thumbnailContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F4F6F4",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EAEFEA",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  thumbnailFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LIGHT_GREEN,
  },
  moreThumbnailCard: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F1F5F1",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  moreThumbnailText: {
    fontSize: 11,
    fontWeight: "800",
    color: DARK,
  },
  moreThumbnailSub: {
    fontSize: 8.5,
    color: MUTED,
    marginTop: -2,
  },
  trackBtn: {
    backgroundColor: GREEN,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  trackBtnText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "800",
  },
  reorderPillBtn: {
    backgroundColor: "#E6F4EA",
    borderWidth: 1,
    borderColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  reorderPillText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "800",
  },
  detailsPillBtn: {
    backgroundColor: "#F4F6F4",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  detailsPillText: {
    color: DARK,
    fontSize: 12,
    fontWeight: "700",
  },
  centerContainer: {
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 13,
    color: MUTED,
    marginTop: 10,
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: DARK,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12.5,
    color: MUTED,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  browseBtn: {
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "800",
  },
});

