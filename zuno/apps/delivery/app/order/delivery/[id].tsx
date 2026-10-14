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
  TextInput,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  MapPin,
  Phone,
  CheckCircle2,
  Navigation,
  DollarSign,
  User,
} from "lucide-react-native";
import { getDeliveryDetails, confirmCustomerDelivery, DeliveryOrder } from "@/features/deliveries/api";

const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#6B7A70";

export default function DeliveryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const deliveryId = params.id || "del-101";

  const [delivery, setDelivery] = useState<DeliveryOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [deliveryOtp, setDeliveryOtp] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getDeliveryDetails(deliveryId);
        setDelivery(data);
      } catch (err) {
        console.error("Error loading delivery details:", err);
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
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.deliveryAddress)}`;
    Linking.openURL(url).catch(() => Alert.alert("Navigation Error", "Unable to open maps application."));
  };

  const handleConfirmDelivery = async () => {
    if (!delivery) return;
    setConfirming(true);
    try {
      await confirmCustomerDelivery(delivery.id, delivery.orderId, deliveryOtp);
      
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.alert) {
          window.alert(`Delivery Completed! 🎉\n\nOrder ${delivery.orderNumber} delivered successfully. ₹${delivery.payout} payout added to your earnings!`);
        }
        router.replace("/(tabs)" as never);
      } else {
        Alert.alert(
          "Delivery Completed! 🎉",
          `Order ${delivery.orderNumber} delivered. ₹${delivery.payout} payout added to your earnings!`,
          [
            {
              text: "Back to Home",
              onPress: () => router.replace("/(tabs)" as never),
            },
          ]
        );
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to confirm delivery.");
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
          <Text style={styles.loadingText}>Loading delivery details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!delivery) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Delivery Details Not Found</Text>
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
          <Text style={styles.headerTitle}>Deliver to Customer</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Customer & Address Card */}
          <View style={styles.card}>
            <View style={styles.customerHeaderRow}>
              <View style={styles.customerAvatarCircle}>
                <User size={22} color={GREEN} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.customerName}>{delivery.customerName || "Customer"}</Text>
                <Text style={styles.customerPhoneSub}>{delivery.customerPhone}</Text>
              </View>

              <Pressable
                style={styles.callCircleBtn}
                onPress={() => Linking.openURL(`tel:${delivery.customerPhone}`)}
              >
                <Phone size={18} color={GREEN} />
              </Pressable>
            </View>

            <View style={styles.divider} />

            <View style={styles.addressBox}>
              <View style={styles.addressHeaderRow}>
                <MapPin size={16} color="#EF4444" />
                <Text style={styles.addressLabelBold}>DELIVERY LOCATION</Text>
              </View>

              <Text style={styles.addressText}>{delivery.deliveryAddress}</Text>

              <Pressable style={styles.navFullBtn} onPress={handleOpenNavigation}>
                <Navigation size={16} color="#FFFFFF" />
                <Text style={styles.navFullBtnText}>Start GPS Navigation</Text>
              </Pressable>
            </View>
          </View>

          {/* Delivery Payout & Order Info */}
          <View style={styles.card}>
            <View style={styles.payoutHighlightRow}>
              <View>
                <Text style={styles.payoutLabelSmall}>DELIVERY PAYOUT</Text>
                <Text style={styles.payoutValueBig}>₹{delivery.payout}</Text>
              </View>
              <View style={styles.orderBadgePill}>
                <Text style={styles.orderBadgeText}>{delivery.orderNumber}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Order Items ({delivery.itemsCount})</Text>
              <Text style={styles.metaVal}>Total: ₹{delivery.total}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Payment Mode</Text>
              <Text style={styles.metaVal}>Cash on Delivery</Text>
            </View>
          </View>

          {/* Optional Delivery OTP Confirmation */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Confirm Handover</Text>
            <Text style={styles.cardSectionSub}>
              Ensure order items are handed over to the customer before marking complete.
            </Text>
          </View>
        </ScrollView>

        {/* Sticky Confirm Delivery Footer */}
        <View style={styles.footerBar}>
          <Pressable
            style={[styles.confirmBtn, confirming && { opacity: 0.7 }]}
            onPress={handleConfirmDelivery}
            disabled={confirming}
          >
            {confirming ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <CheckCircle2 size={18} color="#FFFFFF" />
                <Text style={styles.confirmBtnText}>Complete Delivery (₹{delivery.payout})</Text>
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
  customerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  customerAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  customerName: {
    fontSize: 16,
    fontWeight: "900",
    color: DARK,
  },
  customerPhoneSub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 1,
  },
  callCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#F4F6F4",
    marginVertical: 12,
  },
  addressBox: {
    gap: 6,
  },
  addressHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addressLabelBold: {
    fontSize: 11,
    fontWeight: "800",
    color: MUTED,
  },
  addressText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: DARK,
    lineHeight: 18,
  },
  navFullBtn: {
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  navFullBtnText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "800",
  },
  payoutHighlightRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  payoutLabelSmall: {
    fontSize: 10,
    fontWeight: "800",
    color: GREEN,
  },
  payoutValueBig: {
    fontSize: 22,
    fontWeight: "900",
    color: DARK,
    marginTop: 2,
  },
  orderBadgePill: {
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  orderBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: DARK,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  metaLabel: {
    fontSize: 12.5,
    color: MUTED,
  },
  metaVal: {
    fontSize: 12.5,
    fontWeight: "700",
    color: DARK,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: DARK,
    marginBottom: 2,
  },
  cardSectionSub: {
    fontSize: 12,
    color: MUTED,
    lineHeight: 16,
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
