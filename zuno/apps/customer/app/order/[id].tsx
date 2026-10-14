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
  Modal,
  Image,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Store,
  RotateCcw,
  Bike,
  Phone,
  MessageSquare,
  ChevronRight,
  Star,
  ShoppingBag,
  X,
  Check,
  FileText,
  Download,
  Headphones,
  CheckCircle,
} from "lucide-react-native";
import { posthog } from "@/lib/posthog";
import {
  getCustomerOrderDetails,
  subscribeToOrderRealtime,
  subscribeToDeliveryLocationRealtime,
  getAuthorizedDeliveryLocation,
  OrderDetailData,
  DeliveryLocation,
} from "@/features/orders/api";
import { OrderStatus } from "@zuno/types";
import { getProductImageSource } from "@/assets/productImages";
import { useCartStore } from "@/store/cartStore";

const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#718078";

type ViewTab = "tracking" | "details" | "timeline";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const orderId = params.id || "ord-123";

  const addToCart = useCartStore((state) => state.addToCart);

  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ViewTab>("tracking");
  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation | null>(null);
  const [showAllItems, setShowAllItems] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    posthog?.capture("order_tracking_viewed", { order_id: orderId });

    async function loadOrder() {
      setLoading(true);
      try {
        const data = await getCustomerOrderDetails(orderId);
        setOrder(data);

        // Default to 'details' tab if order is completed/delivered, or 'tracking' if active
        if (data?.status === OrderStatus.DELIVERED) {
          setActiveTab("details");
        } else {
          setActiveTab("tracking");
        }

        const loc = await getAuthorizedDeliveryLocation(orderId);
        setDeliveryLocation(loc);
      } catch (err) {
        console.error("Error loading order details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();

    const unsubscribeStatus = subscribeToOrderRealtime(orderId, (newStatus) => {
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    });

    const unsubscribeLocation = subscribeToDeliveryLocationRealtime(orderId, (newLoc) => {
      setDeliveryLocation(newLoc);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeLocation();
    };
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={GREEN} />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Order Not Found</Text>
          <Pressable style={styles.backBtn} onPress={() => router.push("/(tabs)/orders" as never)}>
            <Text style={styles.backBtnText}>Return to Orders</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isDelivered = order.status === OrderStatus.DELIVERED;

  const handleReorder = () => {
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

  const getStatusPillLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return "Delivered";
      case OrderStatus.CANCELLED:
        return "Cancelled";
      case OrderStatus.REJECTED:
        return "Rejected";
      case OrderStatus.OUT_FOR_DELIVERY:
        return "On the way";
      case OrderStatus.READY_FOR_PICKUP:
        return "Ready for Pickup";
      case OrderStatus.PREPARING:
        return "Preparing";
      case OrderStatus.ACCEPTED:
        return "Accepted";
      default:
        return "Order Placed";
    }
  };

  const renderHeader = (title: string) => (
    <View style={styles.header}>
      <Pressable style={styles.iconBtn} onPress={() => router.back()}>
        <ArrowLeft size={20} color={DARK} />
      </Pressable>

      <Text style={styles.headerTitle}>{title}</Text>

      <Pressable style={styles.iconBtn} onPress={() => setShowHelpModal(true)}>
        <Headphones size={20} color={DARK} />
      </Pressable>
    </View>
  );

  const renderProductThumbnails = (items: OrderDetailData["items"]) => {
    const maxVisible = 4;
    const visibleItems = items.slice(0, maxVisible);
    const extraCount = items.length - maxVisible;

    return (
      <View style={styles.thumbnailRow}>
        {visibleItems.map((item, idx) => {
          const imgSrc = getProductImageSource({
            id: item.id,
            name: item.name,
            image_url: item.image_url,
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

  // SCREEN 2 — ORDER TRACKING
  const renderTrackingScreen = () => (
    <View style={styles.viewContainer}>
      {/* Upper Map Section */}
      <View style={styles.mapContainer}>
        {/* Floating Callout Bubble */}
        <View style={styles.etaCalloutBubble}>
          <Text style={styles.etaCalloutTitle}>Arriving in</Text>
          <Text style={styles.etaCalloutTime}>12 minutes</Text>
        </View>

        {/* User Destination Pin */}
        <View style={styles.userPinBox}>
          <View style={styles.userPinCircle}>
            <MapPin size={16} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        </View>

        {/* Dynamic Route Line Visual */}
        <View style={styles.routeLineGraphic} />

        {/* Delivery Scooter Marker */}
        <View style={styles.scooterMarkerBox}>
          <View style={styles.scooterMarkerCircle}>
            <Bike size={18} color="#FFFFFF" />
          </View>
        </View>

        {/* Shop Origin Pin */}
        <View style={styles.shopPinBox}>
          <Store size={14} color={GREEN} />
        </View>
      </View>

      {/* Floating Live Status Card */}
      <View style={styles.liveStatusCard}>
        <View style={styles.liveStatusHeader}>
          <View style={styles.liveStatusIconCircle}>
            <Bike size={24} color={GREEN} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.liveStatusTitle}>Your order is on the way</Text>
            <Text style={styles.liveStatusSub}>
              Your order from {order.shopName} will arrive in 12 minutes.
            </Text>
          </View>
        </View>

        {/* Horizontal Progress Timeline */}
        <View style={styles.horizontalTimelineRow}>
          {[
            { label: "Placed", time: "10:42 AM", completed: true, active: false },
            { label: "Accepted", time: "10:45 AM", completed: true, active: false },
            { label: "Preparing", time: "11:05 AM", completed: true, active: false },
            { label: "On the way", time: "11:20 AM", completed: true, active: true },
          ].map((step, idx) => (
            <View key={idx} style={styles.timelineStepColumn}>
              <View
                style={[
                  styles.timelineStepDot,
                  step.completed && styles.timelineStepDotCompleted,
                  step.active && styles.timelineStepDotActive,
                ]}
              >
                {step.active ? (
                  <Bike size={11} color="#FFFFFF" />
                ) : step.completed ? (
                  <Check size={11} color="#FFFFFF" />
                ) : (
                  <View style={styles.timelineStepDotInner} />
                )}
              </View>
              <Text style={[styles.timelineStepLabel, step.active && styles.timelineStepLabelActive]}>
                {step.label}
              </Text>
              <Text style={styles.timelineStepTime}>{step.time}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Delivery Partner Card */}
      <View style={styles.deliveryPartnerCard}>
        <View style={styles.partnerAvatarCircle}>
          <Text style={{ fontSize: 22 }}>👨‍🦱</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.partnerRoleLabel}>Delivery Partner</Text>
          <Text style={styles.partnerName}>{order.deliveryPartnerName || "Rohit Kumar"}</Text>
          <View style={styles.ratingRow}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>4.8 (1.2k deliveries)</Text>
          </View>
        </View>

        <View style={styles.partnerActionButtons}>
          <Pressable
            style={styles.partnerActionBtn}
            onPress={() => Alert.alert("Calling Delivery Partner", `Connecting call to ${order.deliveryPartnerPhone || "+91 98765 12345"}...`)}
          >
            <Phone size={16} color={GREEN} />
          </Pressable>
          <Pressable
            style={styles.partnerActionBtn}
            onPress={() => Alert.alert("Support Chat", "Opening live chat with delivery partner...")}
          >
            <MessageSquare size={16} color={GREEN} />
          </Pressable>
        </View>
      </View>

      {/* Shop & Order Summary Card (at bottom) */}
      <View style={styles.orderSummaryCard}>
        <View style={styles.shopRow}>
          <View style={styles.shopImgBox}>
            <Store size={20} color={GREEN} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.shopName}>{order.shopName}</Text>
            <Text style={styles.shopCategory}>Fruits & Vegetables</Text>
          </View>
          <ChevronRight size={18} color={MUTED} />
        </View>

        <View style={styles.orderSummaryMetaRow}>
          <View>
            <Text style={styles.orderNumberBold}>{order.orderNumber}</Text>
            <Text style={styles.orderSummaryText}>
              {order.items.length} items • ₹{order.total}
            </Text>
          </View>

          <Text style={styles.orderTimestampText}>Today, 10:42 AM</Text>
        </View>

        <Pressable
          style={styles.viewOrderDetailsBtn}
          onPress={() => setActiveTab("details")}
        >
          <FileText size={16} color={GREEN} />
          <Text style={styles.viewOrderDetailsBtnText}>View Order Details</Text>
        </Pressable>
      </View>
    </View>
  );

  // SCREEN 3 & SCREEN 4 — ORDER DETAILS & COMPLETED ORDER STATE
  const renderDetailsScreen = () => {
    const displayedItems = showAllItems ? order.items : order.items.slice(0, 4);
    const hasMoreItems = order.items.length > 4;

    return (
      <View style={styles.viewContainer}>
        {/* Shop Summary Card */}
        <View style={styles.card}>
          <View style={styles.shopHeaderRow}>
            <View style={styles.shopImgBoxLarge}>
              <Store size={24} color={GREEN} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.shopNameLarge}>{order.shopName}</Text>
              <Text style={styles.shopCategoryText}>
                {order.shopName.toLowerCase().includes("fresh")
                  ? "Fruits & Vegetables"
                  : "Grocery & Household"}
              </Text>
              <View style={styles.ratingBadgeRow}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingBadgeText}>4.5 (320+)</Text>
              </View>
            </View>

            <View style={styles.deliveredPill}>
              <Text style={styles.deliveredPillText}>
                {getStatusPillLabel(order.status)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.orderMetaInfoRow}>
            <Text style={styles.orderMetaNumber}>{order.orderNumber}</Text>
            <Text style={styles.orderMetaDate}>
              {isDelivered ? "Delivered on " : "Placed on "}
              {new Date(order.createdAt).toLocaleDateString([], {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              , {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        </View>

        {/* SCREEN 4 SPECIAL: Delivery Success Banner (Only for DELIVERED orders) */}
        {isDelivered && (
          <View style={styles.deliverySuccessBanner}>
            <View style={styles.successCheckCircle}>
              <CheckCircle size={24} color={GREEN} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.successBannerTitle}>Order Delivered</Text>
              <Text style={styles.successBannerSub}>
                Your order has been successfully delivered. Thank you for shopping with ZUNO!
              </Text>
            </View>
          </View>
        )}

        {/* SCREEN 4 SPECIAL: Ordered Items Thumbnails Grid / Row + Reorder Buttons */}
        {isDelivered ? (
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Items ({order.items.length})</Text>

            <View style={{ marginVertical: 12 }}>
              {renderProductThumbnails(order.items)}
            </View>

            {/* Side by side action buttons */}
            <View style={styles.completedActionsRow}>
              <Pressable style={styles.reorderPrimaryBtn} onPress={handleReorder}>
                <RotateCcw size={16} color={GREEN} />
                <Text style={styles.reorderPrimaryBtnText}>Reorder</Text>
              </Pressable>

              <Pressable
                style={styles.viewInvoiceSecondaryBtn}
                onPress={() => setShowInvoiceModal(true)}
              >
                <FileText size={16} color={DARK} />
                <Text style={styles.viewInvoiceSecondaryBtnText}>View Invoice</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          /* Detailed Items List (Screen 3) */
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Items ({order.items.length})</Text>

            <View style={{ marginTop: 10 }}>
              {displayedItems.map((it, idx) => {
                const imgSrc = getProductImageSource({
                  id: it.id,
                  name: it.name,
                  image_url: it.image_url,
                });

                return (
                  <View key={it.id || idx} style={styles.itemDetailRow}>
                    <View style={styles.itemDetailImgBox}>
                      {imgSrc ? (
                        <Image source={imgSrc} style={styles.itemDetailImg} resizeMode="cover" />
                      ) : (
                        <ShoppingBag size={16} color={GREEN} />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemDetailName}>{it.name}</Text>
                      <Text style={styles.itemDetailSub}>{it.unit || "1 pack"}</Text>
                    </View>

                    <Text style={styles.itemDetailQty}>x {it.quantity}</Text>
                    <Text style={styles.itemDetailPrice}>₹{it.subtotal}</Text>
                  </View>
                );
              })}
            </View>

            {hasMoreItems && (
              <Pressable
                style={styles.viewAllItemsBtn}
                onPress={() => setShowAllItems(!showAllItems)}
              >
                <Text style={styles.viewAllItemsText}>
                  {showAllItems ? "Show Less" : `View All Items (${order.items.length})`}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Bill Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Bill Details</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billVal}>₹{order.subtotal}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billVal}>₹{order.deliveryFee}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Discount</Text>
            <Text style={styles.billDiscountVal}>-₹20</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.billTotalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalVal}>₹{order.total}</Text>
          </View>
        </View>

        {/* Payment Method Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Payment Method</Text>

          <View style={styles.paymentMethodRow}>
            <View style={styles.paymentIconBox}>
              <Text style={{ fontSize: 16 }}>💵</Text>
            </View>
            <Text style={styles.paymentMethodName}>{order.paymentMethod}</Text>

            <View style={styles.paidBadgePill}>
              <Text style={styles.paidBadgeText}>
                {order.paymentStatus === "PAID" || isDelivered ? "PAID" : "PENDING"}
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Address Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Delivery Address</Text>

          <View style={styles.addressRowBox}>
            <View style={styles.addressIconCircle}>
              <MapPin size={18} color={GREEN} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabelBold}>{order.addressLabel || "Home"}</Text>
              <Text style={styles.addressLineSub}>{order.addressLine}</Text>
            </View>
          </View>
        </View>

        {/* Additional Options List (Screen 4) */}
        <View style={styles.card}>
          <Pressable
            style={styles.optionListRow}
            onPress={() => setActiveTab("timeline")}
          >
            <Clock size={18} color={DARK} />
            <Text style={styles.optionListTitle}>Order Timeline</Text>
            <ChevronRight size={18} color={MUTED} />
          </Pressable>

          <View style={styles.dividerLight} />

          <Pressable
            style={styles.optionListRow}
            onPress={() => setShowHelpModal(true)}
          >
            <Headphones size={18} color={DARK} />
            <Text style={styles.optionListTitle}>Need Help?</Text>
            <ChevronRight size={18} color={MUTED} />
          </Pressable>

          <View style={styles.dividerLight} />

          <Pressable
            style={styles.optionListRow}
            onPress={() => setShowInvoiceModal(true)}
          >
            <Download size={18} color={DARK} />
            <Text style={styles.optionListTitle}>Download Invoice</Text>
            <ChevronRight size={18} color={MUTED} />
          </Pressable>
        </View>
      </View>
    );
  };

  // TIMELINE VIEW
  const renderTimelineView = () => (
    <View style={styles.viewContainer}>
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>Order Status Journey</Text>

        <View style={{ marginTop: 14 }}>
          {order.timeline.map((step, i) => (
            <View key={i} style={styles.timelineJourneyRow}>
              <View
                style={[
                  styles.journeyCircle,
                  step.completed && styles.journeyCircleActive,
                ]}
              >
                <Check size={14} color={step.completed ? "#FFFFFF" : MUTED} />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.journeyTitle,
                    step.completed && styles.journeyTitleActive,
                  ]}
                >
                  {step.title}
                </Text>
                <Text style={styles.journeyDesc}>{step.description}</Text>
              </View>

              {step.timestamp && (
                <Text style={styles.journeyTime}>{step.timestamp}</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.screen}>
        {renderHeader(
          activeTab === "tracking"
            ? "Track Order"
            : isDelivered
            ? "Order Details"
            : "Order Details"
        )}

        {/* Segmented View Switcher */}
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tabPill, activeTab === "tracking" && styles.tabPillActive]}
            onPress={() => setActiveTab("tracking")}
          >
            <Text style={[styles.tabPillText, activeTab === "tracking" && styles.tabPillTextActive]}>
              Live Tracking
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabPill, activeTab === "details" && styles.tabPillActive]}
            onPress={() => setActiveTab("details")}
          >
            <Text style={[styles.tabPillText, activeTab === "details" && styles.tabPillTextActive]}>
              Order Details
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabPill, activeTab === "timeline" && styles.tabPillActive]}
            onPress={() => setActiveTab("timeline")}
          >
            <Text style={[styles.tabPillText, activeTab === "timeline" && styles.tabPillTextActive]}>
              Timeline
            </Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === "tracking" && renderTrackingScreen()}
          {activeTab === "details" && renderDetailsScreen()}
          {activeTab === "timeline" && renderTimelineView()}
        </ScrollView>
      </View>

      {/* Invoice Modal */}
      <Modal visible={showInvoiceModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tax Invoice</Text>
              <Pressable onPress={() => setShowInvoiceModal(false)}>
                <X size={20} color={DARK} />
              </Pressable>
            </View>

            <View style={styles.invoiceMetaBox}>
              <Text style={styles.invoiceOrderNo}>{order.orderNumber}</Text>
              <Text style={styles.invoiceShopName}>{order.shopName}</Text>
              <Text style={styles.invoiceDate}>
                Issued on {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.divider} />

            {order.items.map((item, idx) => (
              <View key={idx} style={styles.invoiceRow}>
                <Text style={styles.invoiceItemName} numberOfLines={1}>
                  {item.name} x {item.quantity}
                </Text>
                <Text style={styles.invoiceItemPrice}>₹{item.subtotal}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.invoiceRowTotal}>
              <Text style={styles.invoiceTotalLabel}>Grand Total</Text>
              <Text style={styles.invoiceTotalVal}>₹{order.total}</Text>
            </View>

            <Pressable
              style={styles.modalPrimaryBtn}
              onPress={() => {
                setShowInvoiceModal(false);
                Alert.alert("Invoice Downloaded", `Tax Invoice for ${order.orderNumber} saved to downloads.`);
              }}
            >
              <Download size={16} color="#FFFFFF" />
              <Text style={styles.modalPrimaryBtnText}>Download Tax Invoice (PDF)</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Support Help Modal */}
      <Modal visible={showHelpModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Need Help with this Order?</Text>
              <Pressable onPress={() => setShowHelpModal(false)}>
                <X size={20} color={DARK} />
              </Pressable>
            </View>

            <Text style={styles.helpSub}>
              We are here to assist you with order #{order.orderNumber}. Select an option below:
            </Text>

            <Pressable
              style={styles.helpOptionCard}
              onPress={() => {
                setShowHelpModal(false);
                Alert.alert("Connecting Chat", "ZUNO Customer Care representative is joining...");
              }}
            >
              <MessageSquare size={20} color={GREEN} />
              <View style={{ flex: 1 }}>
                <Text style={styles.helpOptionTitle}>Chat with Customer Support</Text>
                <Text style={styles.helpOptionSub}>Instant 24x7 resolution</Text>
              </View>
              <ChevronRight size={18} color={MUTED} />
            </Pressable>

            <Pressable
              style={styles.helpOptionCard}
              onPress={() => {
                setShowHelpModal(false);
                Alert.alert("Calling Support", "Calling +91 1800 123 4567...");
              }}
            >
              <Phone size={20} color={GREEN} />
              <View style={{ flex: 1 }}>
                <Text style={styles.helpOptionTitle}>Call Toll Free Support</Text>
                <Text style={styles.helpOptionSub}>+91 1800 123 4567</Text>
              </View>
              <ChevronRight size={18} color={MUTED} />
            </Pressable>
          </View>
        </View>
      </Modal>
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
    marginTop: 12,
    fontSize: 13,
    color: MUTED,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: DARK,
  },
  backBtn: {
    marginTop: 14,
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
    backgroundColor: "#F4F6F4",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F1",
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#EFF2EE",
  },
  tabPillActive: {
    backgroundColor: GREEN,
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: DARK,
  },
  tabPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 60,
  },
  viewContainer: {
    gap: 14,
  },
  mapContainer: {
    height: 180,
    backgroundColor: "#E2EFE5",
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D3E4D7",
  },
  etaCalloutBubble: {
    position: "absolute",
    top: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  etaCalloutTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
  },
  etaCalloutTime: {
    fontSize: 13,
    fontWeight: "900",
    color: DARK,
  },
  userPinBox: {
    position: "absolute",
    top: 30,
    right: 35,
  },
  userPinCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  scooterMarkerBox: {
    position: "absolute",
    bottom: 50,
    left: 70,
  },
  scooterMarkerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  shopPinBox: {
    position: "absolute",
    bottom: 30,
    left: 25,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: GREEN,
  },
  routeLineGraphic: {
    width: 140,
    height: 2,
    backgroundColor: GREEN,
    transform: [{ rotate: "-25deg" }],
  },
  liveStatusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EAEFEA",
  },
  liveStatusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  liveStatusIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  liveStatusTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: DARK,
  },
  liveStatusSub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
    lineHeight: 16,
  },
  horizontalTimelineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F4F6F4",
  },
  timelineStepColumn: {
    alignItems: "center",
    flex: 1,
  },
  timelineStepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E2E8E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  timelineStepDotCompleted: {
    backgroundColor: GREEN,
  },
  timelineStepDotActive: {
    backgroundColor: GREEN,
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  timelineStepDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: MUTED,
  },
  timelineStepLabel: {
    fontSize: 10.5,
    color: MUTED,
    fontWeight: "600",
    textAlign: "center",
  },
  timelineStepLabelActive: {
    color: DARK,
    fontWeight: "800",
  },
  timelineStepTime: {
    fontSize: 9.5,
    color: MUTED,
    marginTop: 1,
  },
  deliveryPartnerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#EAEFEA",
  },
  partnerAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  partnerRoleLabel: {
    fontSize: 11,
    color: MUTED,
    fontWeight: "600",
  },
  partnerName: {
    fontSize: 14.5,
    fontWeight: "800",
    color: DARK,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: DARK,
  },
  partnerActionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  partnerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  orderSummaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EAEFEA",
    gap: 12,
  },
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  shopImgBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  shopName: {
    fontSize: 14,
    fontWeight: "800",
    color: DARK,
  },
  shopCategory: {
    fontSize: 11,
    color: MUTED,
  },
  orderSummaryMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F4F6F4",
  },
  orderNumberBold: {
    fontSize: 13,
    fontWeight: "800",
    color: DARK,
  },
  orderSummaryText: {
    fontSize: 12,
    color: MUTED,
    marginTop: 1,
  },
  orderTimestampText: {
    fontSize: 11.5,
    color: MUTED,
  },
  viewOrderDetailsBtn: {
    backgroundColor: LIGHT_GREEN,
    borderWidth: 1,
    borderColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  viewOrderDetailsBtnText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EAEFEA",
  },
  shopHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shopImgBoxLarge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  shopNameLarge: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },
  shopCategoryText: {
    fontSize: 11.5,
    color: MUTED,
    marginTop: 1,
  },
  ratingBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  ratingBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: DARK,
  },
  deliveredPill: {
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveredPillText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: "#F4F6F4",
    marginVertical: 12,
  },
  dividerLight: {
    height: 1,
    backgroundColor: "#F4F6F4",
  },
  orderMetaInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderMetaNumber: {
    fontSize: 13,
    fontWeight: "800",
    color: DARK,
  },
  orderMetaDate: {
    fontSize: 11,
    color: MUTED,
  },
  deliverySuccessBanner: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  successCheckCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  successBannerTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: DARK,
  },
  successBannerSub: {
    fontSize: 11.5,
    color: MUTED,
    marginTop: 2,
    lineHeight: 16,
  },
  cardSectionTitle: {
    fontSize: 14.5,
    fontWeight: "800",
    color: DARK,
    marginBottom: 4,
  },
  thumbnailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  thumbnailContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F1F5F1",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  moreThumbnailText: {
    fontSize: 12,
    fontWeight: "800",
    color: DARK,
  },
  moreThumbnailSub: {
    fontSize: 9,
    color: MUTED,
    marginTop: -2,
  },
  completedActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  reorderPrimaryBtn: {
    flex: 1,
    backgroundColor: LIGHT_GREEN,
    borderWidth: 1,
    borderColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  reorderPrimaryBtnText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "800",
  },
  viewInvoiceSecondaryBtn: {
    flex: 1,
    backgroundColor: "#F4F6F4",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  viewInvoiceSecondaryBtnText: {
    color: DARK,
    fontSize: 13,
    fontWeight: "700",
  },
  itemDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  itemDetailImgBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F4F6F4",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  itemDetailImg: {
    width: "100%",
    height: "100%",
  },
  itemDetailName: {
    fontSize: 13,
    fontWeight: "700",
    color: DARK,
  },
  itemDetailSub: {
    fontSize: 11,
    color: MUTED,
    marginTop: 1,
  },
  itemDetailQty: {
    fontSize: 12.5,
    color: MUTED,
    fontWeight: "600",
    marginRight: 10,
  },
  itemDetailPrice: {
    fontSize: 13.5,
    fontWeight: "800",
    color: DARK,
  },
  viewAllItemsBtn: {
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 6,
  },
  viewAllItemsText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: GREEN,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  billLabel: {
    fontSize: 13,
    color: MUTED,
  },
  billVal: {
    fontSize: 13,
    fontWeight: "700",
    color: DARK,
  },
  billDiscountVal: {
    fontSize: 13,
    fontWeight: "700",
    color: GREEN,
  },
  billTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "900",
    color: DARK,
  },
  totalVal: {
    fontSize: 17,
    fontWeight: "900",
    color: DARK,
  },
  paymentMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  paymentIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F4F6F4",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentMethodName: {
    fontSize: 13.5,
    fontWeight: "700",
    color: DARK,
    flex: 1,
  },
  paidBadgePill: {
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  paidBadgeText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "800",
  },
  addressRowBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 8,
  },
  addressIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  addressLabelBold: {
    fontSize: 14,
    fontWeight: "800",
    color: DARK,
  },
  addressLineSub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
    lineHeight: 16,
  },
  optionListRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  optionListTitle: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: "700",
    color: DARK,
  },
  timelineJourneyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  journeyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E2E8E2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  journeyCircleActive: {
    backgroundColor: GREEN,
  },
  journeyTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: MUTED,
  },
  journeyTitleActive: {
    color: DARK,
    fontWeight: "800",
  },
  journeyDesc: {
    fontSize: 11,
    color: MUTED,
    marginTop: 1,
  },
  journeyTime: {
    fontSize: 11,
    color: GREEN,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: DARK,
  },
  invoiceMetaBox: {
    gap: 2,
  },
  invoiceOrderNo: {
    fontSize: 14,
    fontWeight: "800",
    color: DARK,
  },
  invoiceShopName: {
    fontSize: 12.5,
    color: MUTED,
  },
  invoiceDate: {
    fontSize: 11,
    color: MUTED,
  },
  invoiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  invoiceItemName: {
    fontSize: 13,
    color: DARK,
    flex: 1,
  },
  invoiceItemPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: DARK,
  },
  invoiceRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  invoiceTotalLabel: {
    fontSize: 15,
    fontWeight: "900",
    color: DARK,
  },
  invoiceTotalVal: {
    fontSize: 17,
    fontWeight: "900",
    color: DARK,
  },
  modalPrimaryBtn: {
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  modalPrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  helpSub: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 18,
  },
  helpOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#EAEFEA",
  },
  helpOptionTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: DARK,
  },
  helpOptionSub: {
    fontSize: 11.5,
    color: MUTED,
    marginTop: 1,
  },
});
