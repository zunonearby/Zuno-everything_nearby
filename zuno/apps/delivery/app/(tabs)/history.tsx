import React, { useState, useCallback } from "react";
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
import { useFocusEffect } from "expo-router";
import { History, CheckCircle2, AlertCircle, Store, ChevronRight } from "lucide-react-native";
import { getDeliveryOrdersList, DeliveryOrder } from "@/features/deliveries/api";
import { DeliveryStatus, OrderStatus } from "@zuno/types";

const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#6B7A70";

export default function HistoryScreen() {
  const [historyOrders, setHistoryOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const data = await getDeliveryOrdersList("ALL");
      const filtered = data.filter(
        (o) =>
          o.status === DeliveryStatus.COMPLETED ||
          o.status === DeliveryStatus.FAILED ||
          o.orderStatus === OrderStatus.DELIVERED ||
          o.orderStatus === OrderStatus.CANCELLED
      );
      setHistoryOrders(filtered);
    } catch (err) {
      console.error("[History] Error loading history:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Delivery History</Text>
          <Text style={styles.headerSub}>Past completed & cancelled delivery records</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadHistory();
              }}
              tintColor={GREEN}
            />
          }
        >
          {loading && !refreshing ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={GREEN} />
              <Text style={styles.loadingText}>Fetching delivery history...</Text>
            </View>
          ) : historyOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <History size={36} color={GREEN} />
              </View>
              <Text style={styles.emptyTitle}>No past deliveries</Text>
              <Text style={styles.emptySub}>
                Your completed and historical delivery logs will be preserved here.
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {historyOrders.map((item) => {
                const isCompleted =
                  item.status === DeliveryStatus.COMPLETED ||
                  item.orderStatus === OrderStatus.DELIVERED;

                return (
                  <View key={item.id} style={styles.historyCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.shopBox}>
                        <Store size={16} color={GREEN} />
                        <Text style={styles.shopNameBold}>{item.shopName}</Text>
                      </View>

                      {isCompleted ? (
                        <View style={styles.completedBadge}>
                          <CheckCircle2 size={12} color={GREEN} />
                          <Text style={styles.completedBadgeText}>Delivered</Text>
                        </View>
                      ) : (
                        <View style={styles.failedBadge}>
                          <AlertCircle size={12} color="#EF4444" />
                          <Text style={styles.failedBadgeText}>Cancelled</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.metaRow}>
                      <Text style={styles.orderNo}>{item.orderNumber}</Text>
                      <Text style={styles.dateText}>
                        {new Date(item.createdAt).toLocaleDateString([], {
                          day: "numeric",
                          month: "short",
                        })}
                      </Text>
                    </View>

                    <Text style={styles.addressLineSub} numberOfLines={1}>
                      Dropoff: {item.deliveryAddress}
                    </Text>

                    <View style={styles.cardFooter}>
                      <Text style={styles.itemsCount}>
                        {item.itemsCount} items · Total ₹{item.total}
                      </Text>
                      <Text style={styles.payoutText}>Payout: ₹{item.payout}</Text>
                    </View>
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F1",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: DARK,
  },
  headerSub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EAEFEA",
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shopBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shopNameBold: {
    fontSize: 14,
    fontWeight: "800",
    color: DARK,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  completedBadgeText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "800",
  },
  failedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  failedBadgeText: {
    color: "#EF4444",
    fontSize: 11,
    fontWeight: "800",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNo: {
    fontSize: 12.5,
    fontWeight: "800",
    color: GREEN,
  },
  dateText: {
    fontSize: 11,
    color: MUTED,
  },
  addressLineSub: {
    fontSize: 11.5,
    color: MUTED,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F4F6F4",
  },
  itemsCount: {
    fontSize: 11.5,
    color: MUTED,
  },
  payoutText: {
    fontSize: 13,
    fontWeight: "900",
    color: DARK,
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
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
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
    fontSize: 12,
    color: MUTED,
    textAlign: "center",
  },
});
