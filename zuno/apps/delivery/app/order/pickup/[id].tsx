import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  CheckCircle2,
  Navigation,
  ShoppingBag,
  Check,
} from "lucide-react-native";
import { getDeliveryDetails, confirmShopPickup, DeliveryOrder } from "@/features/deliveries/api";

const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#6B7A70";

export default function PickupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const deliveryId = params.id || "del-101";

  const [delivery, setDelivery] = useState<DeliveryOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getDeliveryDetails(deliveryId);
        setDelivery(data);
      } catch (err) {
        console.error("Error loading pickup details:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [deliveryId]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)" as never);
    }
  };

  const handleOpenNavigation = () => {
    if (!delivery) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.pickupAddress)}`;
    Linking.openURL(url).catch(() => Alert.alert("Navigation Error", "Unable to open maps application."));
  };

  const handleConfirmPickup = async () => {
    if (!delivery) return;
    setConfirming(true);
    try {
      await confirmShopPickup(delivery.id, delivery.orderId);
      
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.alert) {
          window.alert("Pickup Confirmed! 📦\n\nOrder marked as picked up. Proceeding to customer delivery.");
        }
        router.replace(`/order/delivery/${delivery.id}` as never);
      } else {
        Alert.alert("Pickup Confirmed", "Order has been marked as picked up from shop!", [
          {
            text: "Proceed to Delivery",
            onPress: () => router.replace(`/order/delivery/${delivery.id}` as never),
          },
        ]);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to confirm pickup.");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={GREEN} />
          <Text style={styles.loadingText}>Loading pickup details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!delivery) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Pickup Details Not Found</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.iconBtn} onPress={handleBack}>
            <ArrowLeft size={20} color={DARK} />
          </Pressable>
          <Text style={styles.headerTitle}>Pickup from Shop</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Shop Header Card */}
          <View style={styles.card}>
            <View style={styles.shopRow}>
              <View style={styles.shopImgBox}>
                <Store size={24} color={GREEN} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.shopName}>{delivery.shopName}</Text>
                <Text style={styles.shopCategory}>{delivery.shopCategory}</Text>
                <Text style={styles.shopAddress}>{delivery.pickupAddress}</Text>
              </View>
            </View>

            <View style={styles.actionButtonsRow}>
              <Pressable style={styles.navBtn} onPress={handleOpenNavigation}>
                <Navigation size={16} color="#FFFFFF" />
                <Text style={styles.navBtnText}>Navigate to Shop</Text>
              </Pressable>

              <Pressable
                style={styles.callBtn}
                onPress={() => Linking.openURL(`tel:${delivery.shopPhone}`)}
              >
                <Phone size={16} color={GREEN} />
              </Pressable>
            </View>
          </View>

          {/* Order Details & Checklist */}
          <View style={styles.card}>
            <View style={styles.orderMetaHeader}>
              <Text style={styles.orderNumber}>{delivery.orderNumber}</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>READY FOR PICKUP</Text>
              </View>
            </View>

            <Text style={styles.cardSectionTitle}>Items to Pick Up ({delivery.itemsCount})</Text>

            <View style={{ marginTop: 8 }}>
              {delivery.items.map((it, idx) => (
                <View key={it.id || idx} style={styles.itemCheckRow}>
                  <View style={styles.checkCircleActive}>
                    <Check size={12} color="#FFFFFF" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{it.name}</Text>
                    <Text style={styles.itemUnit}>{it.unit || "1 pack"}</Text>
                  </View>

                  <Text style={styles.itemQty}>x {it.quantity}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Sticky Confirm Pickup Footer */}
        <View style={styles.footerBar}>
          <Pressable
            style={[styles.confirmBtn, confirming && { opacity: 0.7 }]}
            onPress={handleConfirmPickup}
            disabled={confirming}
          >
            {confirming ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <CheckCircle2 size={18} color="#FFFFFF" />
                <Text style={styles.confirmBtnText}>Confirm Pickup & Start Delivery</Text>
              </>
            )}
          </Pressable>
        </View>
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
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: MUTED,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },
  backBtn: {
    marginTop: 12,
    backgroundColor: GREEN,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
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
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EAEFEA",
  },
  shopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  shopImgBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  shopName: {
    fontSize: 16,
    fontWeight: "900",
    color: DARK,
  },
  shopCategory: {
    fontSize: 11.5,
    color: MUTED,
    marginTop: 1,
  },
  shopAddress: {
    fontSize: 12,
    color: DARK,
    marginTop: 4,
    fontWeight: "600",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F4F6F4",
  },
  navBtn: {
    flex: 1,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  navBtnText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "800",
  },
  callBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  orderMetaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "900",
    color: DARK,
  },
  statusPill: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPillText: {
    color: "#D97706",
    fontSize: 10,
    fontWeight: "900",
  },
  cardSectionTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: DARK,
    marginBottom: 4,
  },
  itemCheckRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  checkCircleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  itemName: {
    fontSize: 13,
    fontWeight: "700",
    color: DARK,
  },
  itemUnit: {
    fontSize: 11,
    color: MUTED,
  },
  itemQty: {
    fontSize: 13,
    fontWeight: "800",
    color: DARK,
  },
  footerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EAEFEA",
  },
  confirmBtn: {
    backgroundColor: GREEN,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
