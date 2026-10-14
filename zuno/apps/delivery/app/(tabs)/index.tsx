import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  Switch,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Bike,
  Bell,
  User,
  Wallet,
  Package,
  Star,
  MapPin,
  Store,
  Check,
  Clock,
  ArrowRight,
  ArrowUp,
  ChevronRight,
  Navigation,
  Signal,
  Crosshair,
  Phone,
  X,
} from "lucide-react-native";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
import { getCurrentDeliveryPartner, DeliveryPartnerAccount } from "@/features/auth/api";
import {
  getDeliveryOrdersList,
  togglePartnerAvailability,
  acceptDeliveryRequest,
  subscribeToDeliveriesRealtime,
  DeliveryOrder,
} from "@/features/deliveries/api";
import { getDeliveryPartnerEarnings } from "@/features/earnings/api";
import { getBrandLogoSource, getShopStorefrontSource } from "@/lib/assets";
import { DeliveryStatus, OrderStatus } from "@zuno/types";

// Design Tokens matching ZUNO brand reference
const GREEN = "#0F5D3A";
const ACCENT_GREEN = "#10B981";
const LIGHT_GREEN = "#EAF4E5";
const MINT_BG = "#F0FDF4";
const BLUE_BG = "#F0F9FF";
const WARN_BG = "#FFFDF7";
const BG = "#F8FAF6";
const DARK = "#111827";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";

// Rider Illustration for the Promotional Banner
function RiderScooterIllustration() {
  return (
    <View style={styles.riderIllustrationWrapper}>
      <Svg width="72" height="52" viewBox="0 0 72 52" fill="none">
        {/* Ground shadow */}
        <Circle cx="36" cy="48" r="16" fill="#D1FAE5" opacity="0.6" />
        
        {/* Wheels */}
        <Circle cx="16" cy="42" r="7" fill="#374151" />
        <Circle cx="16" cy="42" r="3.5" fill="#E5E7EB" />
        <Circle cx="56" cy="42" r="7" fill="#374151" />
        <Circle cx="56" cy="42" r="3.5" fill="#E5E7EB" />

        {/* Scooter Body */}
        <Path
          d="M16 42 L26 42 L34 34 L48 34 L56 42"
          stroke="#0F5D3A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M32 34 L26 22 L22 22"
          stroke="#0F5D3A"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Rect x="44" y="24" width="10" height="10" rx="2" fill="#22A06B" />

        {/* Rider Body & Arms */}
        <Path
          d="M36 28 L32 20 L26 23"
          stroke="#10B981"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="32" cy="13" r="5.5" fill="#0F5D3A" />
        {/* Helmet visor */}
        <Path
          d="M34 11 C36 12 37 14 36 16"
          stroke="#A7D56B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Delivery bag */}
        <Rect x="38" y="16" width="9" height="12" rx="2" fill="#047857" />
      </Svg>
    </View>
  );
}

export default function DeliveryHomeScreen() {
  const router = useRouter();

  const [partner, setPartner] = useState<DeliveryPartnerAccount | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [togglingOnline, setTogglingOnline] = useState(false);
  const [activeDelivery, setActiveDelivery] = useState<DeliveryOrder | null>(null);
  const [unassignedRequest, setUnassignedRequest] = useState<DeliveryOrder | null>(null);
  const [todayStats, setTodayStats] = useState({ earnings: 350, deliveries: 5 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const p = await getCurrentDeliveryPartner();
      setPartner(p);
      if (p) setIsOnline(p.isAvailable);

      const activeList = await getDeliveryOrdersList("ACTIVE");
      if (activeList.length > 0) {
        setActiveDelivery(activeList[0]);
      } else {
        setActiveDelivery(null);
      }

      const allList = await getDeliveryOrdersList("ALL");
      const unassigned = allList.find((d) => d.status === DeliveryStatus.UNASSIGNED);
      if (unassigned && !activeDelivery) {
        setUnassignedRequest(unassigned);
      } else {
        setUnassignedRequest(null);
      }

      const earningsData = await getDeliveryPartnerEarnings();
      setTodayStats({
        earnings: earningsData.todayEarnings || 350,
        deliveries: earningsData.todayDeliveries || 5,
      });
    } catch (err) {
      console.error("[DeliveryHome] Error loading backend data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeDelivery]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    const unsubscribe = subscribeToDeliveriesRealtime(() => {
      loadData();
    });
    return () => {
      unsubscribe();
    };
  }, [loadData]);

  const handleToggleOnline = async (val: boolean) => {
    setTogglingOnline(true);
    setIsOnline(val); // optimistic immediate update
    try {
      const updatedVal = await togglePartnerAvailability(val);
      setIsOnline(updatedVal);
    } catch (err: any) {
      setIsOnline(!val); // revert on failure
      Alert.alert("Status Update Error", err?.message || "Failed to change online status.");
    } finally {
      setTogglingOnline(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!unassignedRequest || accepting) return;
    setAccepting(true);
    try {
      const res = await acceptDeliveryRequest(unassignedRequest.id);
      if (res.success) {
        setShowRequestModal(false);
        loadData();
        router.push(`/order/pickup/${unassignedRequest.id}` as never);
      } else {
        Alert.alert("Assignment Notice", res.message);
      }
    } catch (err: any) {
      Alert.alert("Acceptance Failed", err.message || "Unable to claim delivery request.");
    } finally {
      setAccepting(false);
    }
  };

  // Helper for delivery progress stage calculations
  const isBeforePickup =
    !activeDelivery ||
    activeDelivery.status === DeliveryStatus.ASSIGNED ||
    activeDelivery.orderStatus === OrderStatus.READY_FOR_PICKUP ||
    activeDelivery.orderStatus === OrderStatus.PREPARING ||
    activeDelivery.orderStatus === OrderStatus.ACCEPTED;

  const isDelivered =
    activeDelivery?.status === DeliveryStatus.COMPLETED ||
    activeDelivery?.orderStatus === OrderStatus.DELIVERED;

  const etaMinutes = activeDelivery
    ? Math.max(5, Math.round(activeDelivery.distanceKm * 3.5 + 1))
    : 9;

  // Format timestamp helper
  const formatTime = (isoString?: string | null, fallback: string = "--:--") => {
    if (!isoString) return fallback;
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return fallback;
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    } catch {
      return fallback;
    }
  };

  const handleCallShop = () => {
    if (activeDelivery?.shopPhone) {
      Linking.openURL(`tel:${activeDelivery.shopPhone}`);
    } else {
      Alert.alert("Contact Info", "Shop contact number is not available.");
    }
  };

  const handleCallCustomer = () => {
    if (activeDelivery?.customerPhone) {
      Linking.openURL(`tel:${activeDelivery.customerPhone}`);
    } else {
      Alert.alert("Contact Info", "Customer contact number is not available.");
    }
  };

  const handlePrimaryNavigationPress = () => {
    if (!activeDelivery) return;
    if (isBeforePickup) {
      router.push(`/order/pickup/${activeDelivery.id}` as never);
    } else {
      router.push(`/order/delivery/${activeDelivery.id}` as never);
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
              onPress={() => router.push("/(tabs)/orders" as never)}
            >
              <Bell size={18} color={DARK} />
              <View style={styles.unreadDot} />
            </Pressable>

            <Pressable
              style={styles.avatarCircle}
              onPress={() => router.push("/(tabs)/profile" as never)}
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
                loadData();
              }}
              tintColor={GREEN}
            />
          }
        >
          {/* Greeting Section */}
          <View style={styles.greetingSection}>
            <Text style={styles.greetingTitle}>
              Hello, {partner?.fullName || "Rohit Patel"} 👋
            </Text>
            <View style={styles.locationRow}>
              <MapPin size={13} color={GREEN} />
              <Text style={styles.locationText}>PIN 231217, Renukoot Region</Text>
            </View>
          </View>

          {/* Online / Offline Availability Card */}
          <View
            style={[
              styles.availabilityCard,
              isOnline ? styles.availabilityCardOnline : styles.availabilityCardOffline,
            ]}
          >
            <Pressable
              style={styles.availabilityTopRow}
              onPress={() => !togglingOnline && handleToggleOnline(!isOnline)}
              accessibilityRole="switch"
              accessibilityLabel={isOnline ? "Switch to offline" : "Switch to online"}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.availabilityStatusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isOnline ? ACCENT_GREEN : "#94A3B8" },
                    ]}
                  />
                  <Text style={styles.availabilityTitle}>
                    {isOnline ? "You are Online" : "You are Offline"}
                  </Text>
                </View>
                <Text style={styles.availabilitySub}>
                  {isOnline
                    ? "Available for nearby orders"
                    : "You won't receive new orders"}
                </Text>
              </View>

              {togglingOnline ? (
                <ActivityIndicator color={GREEN} size="small" />
              ) : (
                <Switch
                  value={isOnline}
                  onValueChange={handleToggleOnline}
                  trackColor={{ false: "#CBD5E1", true: ACCENT_GREEN }}
                  thumbColor="#FFFFFF"
                />
              )}
            </Pressable>

            {/* Bottom Row Inside Availability Card */}
            <View style={styles.availabilityBottomRow}>
              <View style={styles.metaBadge}>
                <Signal size={13} color={isOnline ? "#059669" : "#94A3B8"} />
                <Text
                  style={[
                    styles.metaBadgeText,
                    { color: isOnline ? "#047857" : "#64748B" },
                  ]}
                >
                  {isOnline ? "You're visible to shops nearby" : "Hidden from shops nearby"}
                </Text>
              </View>

              <View style={styles.metaBadge}>
                <Crosshair size={13} color={isOnline ? "#059669" : "#94A3B8"} />
                <Text
                  style={[
                    styles.metaBadgeText,
                    { color: isOnline ? "#047857" : "#64748B" },
                  ]}
                >
                  Within 5 km
                </Text>
              </View>
            </View>
          </View>

          {/* Today's Performance Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Today's Performance</Text>
            <Pressable
              style={styles.viewDetailsBtn}
              onPress={() => router.push("/(tabs)/earnings" as never)}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
              <ArrowRight size={13} color={GREEN} />
            </Pressable>
          </View>

          <View style={styles.performanceGrid}>
            {/* Card 1: Today's Earnings */}
            <View style={[styles.perfCard, styles.perfCardMint]}>
              <View style={styles.perfIconBoxMint}>
                <Wallet size={18} color={ACCENT_GREEN} />
              </View>
              <Text style={styles.perfValue}>
                {loading ? "..." : `₹${todayStats.earnings}`}
              </Text>
              <Text style={styles.perfLabel}>Today's Earnings</Text>
              <View style={styles.trendRow}>
                <ArrowUp size={11} color="#16A34A" />
                <Text style={styles.trendText}>+12% vs. yesterday</Text>
              </View>
            </View>

            {/* Card 2: Completed Orders */}
            <View style={[styles.perfCard, styles.perfCardBlue]}>
              <View style={styles.perfIconBoxBlue}>
                <Package size={18} color="#0284C7" />
              </View>
              <Text style={styles.perfValue}>
                {loading ? "..." : todayStats.deliveries}
              </Text>
              <Text style={styles.perfLabel}>Completed</Text>
              <View style={styles.trendRow}>
                <ArrowUp size={11} color="#16A34A" />
                <Text style={styles.trendText}>+2 vs. yesterday</Text>
              </View>
            </View>

            {/* Card 3: Rating */}
            <View style={[styles.perfCard, styles.perfCardWarm]}>
              <View style={styles.perfIconBoxWarm}>
                <Star size={18} color="#F59E0B" />
              </View>
              <Text style={styles.perfValue}>
                {partner?.rating ? partner.rating.toFixed(1) : "4.8"}
              </Text>
              <Text style={styles.perfLabel}>Rating</Text>
              <View style={styles.ratingStarsRow}>
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <Star
                    key={starIdx}
                    size={10}
                    color="#FBBF24"
                    fill={starIdx <= 4 ? "#FBBF24" : "transparent"}
                  />
                ))}
              </View>
              <Text style={styles.reviewCountText}>
                From {partner?.completedDeliveries ? Math.min(partner.completedDeliveries, 28) : 28} reviews
              </Text>
            </View>
          </View>

          {/* Active Delivery Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Active Delivery</Text>
            {activeDelivery && (
              <Pressable
                style={styles.inProgressPill}
                onPress={() => {
                  if (isBeforePickup) {
                    router.push(`/order/pickup/${activeDelivery.id}` as never);
                  } else {
                    router.push(`/order/delivery/${activeDelivery.id}` as never);
                  }
                }}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="View in progress delivery details"
              >
                <Text style={styles.inProgressPillText}>IN PROGRESS</Text>
                <ChevronRight size={12} color="#EA580C" />
              </Pressable>
            )}
          </View>

          {activeDelivery ? (
            <View style={styles.activeCard}>
              {/* Active Delivery Card Header */}
              <View style={styles.activeCardTopRow}>
                <Image
                  source={getShopStorefrontSource()}
                  style={styles.shopThumbnail}
                  resizeMode="cover"
                />
                <View style={styles.shopDetailsCol}>
                  <Text style={styles.shopNameText} numberOfLines={1}>
                    {activeDelivery.shopName}
                  </Text>
                  <Text style={styles.orderNumberText}>
                    Order {activeDelivery.orderNumber}
                  </Text>
                  <Text style={styles.orderMetaText}>
                    {activeDelivery.itemsCount} items • ₹{activeDelivery.total} order value
                  </Text>
                </View>
                <View style={styles.payoutPill}>
                  <Text style={styles.payoutPillText}>
                    Payout: ₹{activeDelivery.payout}
                  </Text>
                </View>
              </View>

              {/* 4-Step Progress Tracker Box */}
              <View style={styles.progressTrackerCard}>
                <View style={styles.timelineRow}>
                  {/* Step 1: Assigned */}
                  <View style={styles.stepNodeCol}>
                    <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
                      <Check size={11} color="#FFFFFF" strokeWidth={3} />
                    </View>
                    <Text style={styles.stepNodeLabel}>Assigned</Text>
                    <Text style={styles.stepNodeSub}>
                      {formatTime(activeDelivery.createdAt, "09:12 AM")}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.stepConnectorLine,
                      !isBeforePickup ? styles.connectorCompleted : styles.connectorPending,
                    ]}
                  />

                  {/* Step 2: Picked Up */}
                  <View style={styles.stepNodeCol}>
                    <View
                      style={[
                        styles.stepCircle,
                        !isBeforePickup ? styles.stepCircleCompleted : styles.stepCircleCurrent,
                      ]}
                    >
                      {!isBeforePickup ? (
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      ) : (
                        <Text style={styles.stepCircleNum}>2</Text>
                      )}
                    </View>
                    <Text style={styles.stepNodeLabel}>Picked Up</Text>
                    <Text style={styles.stepNodeSub}>
                      {!isBeforePickup
                        ? formatTime(activeDelivery.pickedUpAt, "09:28 AM")
                        : "Pending"}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.stepConnectorLine,
                      isDelivered ? styles.connectorCompleted : styles.connectorPending,
                    ]}
                  />

                  {/* Step 3: On the Way */}
                  <View style={styles.stepNodeCol}>
                    <View
                      style={[
                        styles.stepCircle,
                        !isBeforePickup && !isDelivered
                          ? styles.stepCircleCompleted
                          : isDelivered
                          ? styles.stepCircleCompleted
                          : styles.stepCirclePending,
                      ]}
                    >
                      {isDelivered ? (
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      ) : (
                        <Text style={styles.stepCircleNum}>3</Text>
                      )}
                    </View>
                    <Text style={styles.stepNodeLabel}>On the Way</Text>
                    <Text style={styles.stepNodeSub}>
                      {!isBeforePickup ? `ETA ${etaMinutes} min` : "Pending"}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.stepConnectorLine,
                      isDelivered ? styles.connectorCompleted : styles.connectorPending,
                    ]}
                  />

                  {/* Step 4: Delivered */}
                  <View style={styles.stepNodeCol}>
                    <View
                      style={[
                        styles.stepCircle,
                        isDelivered ? styles.stepCircleCompleted : styles.stepCirclePending,
                      ]}
                    >
                      {isDelivered ? (
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      ) : (
                        <Text style={styles.stepCircleNumPending}>4</Text>
                      )}
                    </View>
                    <Text style={styles.stepNodeLabel}>Delivered</Text>
                    <Text style={styles.stepNodeSub}>
                      {isDelivered
                        ? formatTime(activeDelivery.deliveredAt, "Completed")
                        : "--"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Pickup & Dropoff Address Section */}
              <View style={styles.addressContainer}>
                {/* Pickup Row */}
                <View style={styles.addressRow}>
                  <View style={styles.storeIconBox}>
                    <Store size={16} color={GREEN} />
                  </View>
                  <View style={styles.addressInfoCol}>
                    <Text style={styles.addressTypeLabel}>Pickup from</Text>
                    <Text style={styles.addressTitleText} numberOfLines={1}>
                      {activeDelivery.shopName}
                    </Text>
                    <Text style={styles.addressDetailText} numberOfLines={2}>
                      {activeDelivery.pickupAddress}
                    </Text>
                  </View>
                  <Pressable style={styles.callPillBtn} onPress={handleCallShop}>
                    <Phone size={12} color={GREEN} />
                    <Text style={styles.callPillText}>Call Shop</Text>
                  </Pressable>
                </View>

                {/* Vertical Dotted Connector */}
                <View style={styles.verticalDottedConnector}>
                  <View style={styles.dottedDot} />
                  <View style={styles.dottedDot} />
                  <View style={styles.dottedDot} />
                </View>

                {/* Dropoff Row */}
                <View style={styles.addressRow}>
                  <View style={styles.customerPinBox}>
                    <MapPin size={16} color="#EF4444" />
                  </View>
                  <View style={styles.addressInfoCol}>
                    <Text style={styles.addressTypeLabel}>Deliver to</Text>
                    <Text style={styles.addressTitleText} numberOfLines={1}>
                      {activeDelivery.deliveryAddress.split(",")[0] || activeDelivery.deliveryAddress}
                    </Text>
                    <Text style={styles.addressDetailText} numberOfLines={2}>
                      {activeDelivery.deliveryAddress.split(",").slice(1).join(",").trim() ||
                        activeDelivery.deliveryArea}
                    </Text>
                  </View>
                  <Pressable style={styles.callPillBtn} onPress={handleCallCustomer}>
                    <Phone size={12} color={GREEN} />
                    <Text style={styles.callPillText}>Call Customer</Text>
                  </Pressable>
                </View>
              </View>

              {/* Primary Navigation CTA Button */}
              <Pressable
                style={styles.primaryNavigateCta}
                onPress={handlePrimaryNavigationPress}
              >
                <View style={styles.ctaLeftRow}>
                  <Navigation size={17} color="#FFFFFF" />
                  <Text style={styles.ctaTitleText}>
                    {isBeforePickup ? "Navigate to Shop" : "Navigate to Customer"}
                  </Text>
                </View>
                <View style={styles.ctaRightRow}>
                  <Text style={styles.ctaMetaText}>
                    {etaMinutes} min • {activeDelivery.distanceKm} km
                  </Text>
                  <ChevronRight size={15} color="#FFFFFF" />
                </View>
              </Pressable>
            </View>
          ) : unassignedRequest && isOnline ? (
            /* Incoming Offer Card Banner */
            <View style={styles.offerBannerCard}>
              <View style={styles.offerHeaderRow}>
                <View style={styles.offerBadge}>
                  <Clock size={12} color="#D97706" />
                  <Text style={styles.offerBadgeText}>NEW DELIVERY OFFER</Text>
                </View>
                <Text style={styles.offerPayoutText}>
                  Earn ₹{unassignedRequest.payout}
                </Text>
              </View>

              <Text style={styles.offerShopTitle}>{unassignedRequest.shopName}</Text>
              <Text style={styles.offerAddressSub}>
                Pickup: {unassignedRequest.pickupAddress}
              </Text>
              <Text style={styles.offerAddressSub}>
                Deliver to: {unassignedRequest.deliveryArea} ({unassignedRequest.itemsCount} items)
              </Text>

              <Pressable
                style={styles.viewOfferCta}
                onPress={() => setShowRequestModal(true)}
              >
                <Text style={styles.viewOfferCtaText}>View Delivery Request</Text>
                <ArrowRight size={15} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : (
            /* Empty State */
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyIconCircle}>
                <Bike size={30} color={GREEN} />
              </View>
              <Text style={styles.emptyTitle}>
                {isOnline ? "No active delivery" : "You are currently offline"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {isOnline
                  ? "Stay online to receive nearby grocery & essential orders"
                  : "Turn online using the switch above to start receiving delivery jobs."}
              </Text>
            </View>
          )}

          {/* Motivational / Stay Online Banner matching Reference */}
          <View style={styles.motivationalCard}>
            <RiderScooterIllustration />
            <View style={styles.motivationalTextCol}>
              <Text style={styles.motivationalTitle}>
                Stay online to get more orders
              </Text>
              <Text style={styles.motivationalSub}>
                Peak hours: 11 AM – 2 PM, 6 PM – 9 PM
              </Text>
            </View>
            <ChevronRight size={18} color="#4B5563" />
          </View>
        </ScrollView>
      </View>

      {/* Incoming Delivery Request Modal Sheet */}
      <Modal visible={showRequestModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delivery Offer</Text>
              <Pressable onPress={() => setShowRequestModal(false)} hitSlop={10}>
                <X size={20} color={DARK} />
              </Pressable>
            </View>

            {unassignedRequest && (
              <View style={styles.offerCardBody}>
                <View style={styles.offerPayoutRow}>
                  <View>
                    <Text style={styles.offerPayoutLabel}>ESTIMATED PAYOUT</Text>
                    <Text style={styles.offerPayoutAmount}>₹{unassignedRequest.payout}</Text>
                  </View>
                  <View style={styles.distanceBadge}>
                    <Text style={styles.distanceBadgeText}>Renukoot Region</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.offerDetailRow}>
                  <Store size={18} color={GREEN} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.offerShopLabel}>PICKUP SHOP</Text>
                    <Text style={styles.offerShopName}>{unassignedRequest.shopName}</Text>
                    <Text style={styles.offerAddressSub}>{unassignedRequest.pickupAddress}</Text>
                  </View>
                </View>

                <View style={styles.offerDetailRow}>
                  <MapPin size={18} color="#EF4444" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.offerShopLabel}>DELIVERY AREA</Text>
                    <Text style={styles.offerShopName}>{unassignedRequest.deliveryArea}</Text>
                    <Text style={styles.offerAddressSub}>
                      {unassignedRequest.itemsCount} items in order
                    </Text>
                  </View>
                </View>

                <View style={styles.modalActionButtons}>
                  <Pressable
                    style={styles.rejectBtn}
                    onPress={() => setShowRequestModal(false)}
                  >
                    <Text style={styles.rejectBtnText}>Decline</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.acceptBtn, accepting && { opacity: 0.7 }]}
                    onPress={handleAcceptRequest}
                    disabled={accepting}
                  >
                    {accepting ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.acceptBtnText}>Accept Delivery</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            )}
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
  greetingSection: {
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: DARK,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12.5,
    color: "#4B5563",
    fontWeight: "500",
  },
  availabilityCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  availabilityCardOnline: {
    backgroundColor: MINT_BG,
    borderColor: "#DCFCE7",
  },
  availabilityCardOffline: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
  availabilityTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  availabilityStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  availabilityTitle: {
    fontSize: 16.5,
    fontWeight: "800",
    color: DARK,
  },
  availabilitySub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 1,
  },
  availabilityBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(16, 185, 129, 0.12)",
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: DARK,
  },
  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  viewDetailsText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: GREEN,
  },
  performanceGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },
  perfCard: {
    flex: 1,
    borderRadius: 18,
    padding: 13,
    borderWidth: 1,
  },
  perfCardMint: {
    backgroundColor: MINT_BG,
    borderColor: "#DCFCE7",
  },
  perfCardBlue: {
    backgroundColor: BLUE_BG,
    borderColor: "#E0F2FE",
  },
  perfCardWarm: {
    backgroundColor: WARN_BG,
    borderColor: "#FEF3C7",
  },
  perfIconBoxMint: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  perfIconBoxBlue: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  perfIconBoxWarm: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  perfValue: {
    fontSize: 19,
    fontWeight: "900",
    color: DARK,
    letterSpacing: -0.2,
  },
  perfLabel: {
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
    fontWeight: "500",
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 6,
  },
  trendText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16A34A",
  },
  ratingStarsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 6,
  },
  reviewCountText: {
    fontSize: 9.5,
    color: "#9CA3AF",
    marginTop: 3,
  },
  inProgressPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    ...(Platform.OS === "web" ? { cursor: "pointer" as any } : {}),
  },
  inProgressPillText: {
    color: "#EA580C",
    fontSize: 10,
    fontWeight: "800",
  },
  activeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 18,
  },
  activeCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shopThumbnail: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  shopDetailsCol: {
    flex: 1,
  },
  shopNameText: {
    fontSize: 15,
    fontWeight: "800",
    color: DARK,
  },
  orderNumberText: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 1,
    fontWeight: "500",
  },
  orderMetaText: {
    fontSize: 11.5,
    color: MUTED,
    marginTop: 2,
  },
  payoutPill: {
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },
  payoutPillText: {
    color: GREEN,
    fontSize: 11.5,
    fontWeight: "800",
  },
  progressTrackerCard: {
    backgroundColor: "#F8FAF8",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepNodeCol: {
    alignItems: "center",
    minWidth: 54,
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepCircleCompleted: {
    backgroundColor: GREEN,
  },
  stepCircleCurrent: {
    backgroundColor: GREEN,
  },
  stepCirclePending: {
    backgroundColor: "#E2E8F0",
  },
  stepCircleNum: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  stepCircleNumPending: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "800",
  },
  stepNodeLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    color: DARK,
  },
  stepNodeSub: {
    fontSize: 9.5,
    color: MUTED,
    marginTop: 1,
  },
  stepConnectorLine: {
    flex: 1,
    height: 2,
    marginHorizontal: -2,
    marginBottom: 18,
  },
  connectorCompleted: {
    backgroundColor: GREEN,
  },
  connectorPending: {
    backgroundColor: "#E2E8F0",
  },
  addressContainer: {
    backgroundColor: BG,
    borderRadius: 14,
    padding: 12,
    position: "relative",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  storeIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  customerPinBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  addressInfoCol: {
    flex: 1,
  },
  addressTypeLabel: {
    fontSize: 10,
    color: MUTED,
    fontWeight: "600",
  },
  addressTitleText: {
    fontSize: 13,
    fontWeight: "800",
    color: DARK,
    marginTop: 1,
  },
  addressDetailText: {
    fontSize: 11,
    color: "#4B5563",
    marginTop: 1,
  },
  callPillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },
  callPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: DARK,
  },
  verticalDottedConnector: {
    paddingLeft: 16,
    marginVertical: 4,
    gap: 3,
  },
  dottedDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: GREEN,
  },
  primaryNavigateCta: {
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  ctaLeftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ctaTitleText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "800",
  },
  ctaRightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ctaMetaText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.95,
  },
  motivationalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EDF7ED",
    borderRadius: 16,
    padding: 12,
    marginTop: 6,
  },
  riderIllustrationWrapper: {
    width: 64,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  motivationalTextCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  motivationalTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: DARK,
  },
  motivationalSub: {
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
  },
  offerBannerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: GREEN,
    gap: 8,
    marginBottom: 18,
  },
  offerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  offerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  offerBadgeText: {
    color: "#D97706",
    fontSize: 10,
    fontWeight: "900",
  },
  offerPayoutText: {
    fontSize: 15,
    fontWeight: "900",
    color: GREEN,
  },
  offerShopTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: DARK,
  },
  offerAddressSub: {
    fontSize: 12,
    color: MUTED,
  },
  viewOfferCta: {
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 6,
  },
  viewOfferCtaText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "800",
  },
  emptyStateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 18,
  },
  emptyIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: DARK,
    marginBottom: 4,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 12,
    color: MUTED,
    textAlign: "center",
    lineHeight: 17,
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
  offerCardBody: {
    gap: 14,
  },
  offerPayoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 14,
    padding: 14,
  },
  offerPayoutLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: GREEN,
  },
  offerPayoutAmount: {
    fontSize: 22,
    fontWeight: "900",
    color: DARK,
    marginTop: 2,
  },
  distanceBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  distanceBadgeText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: GREEN,
  },
  divider: {
    height: 1,
    backgroundColor: "#F4F6F4",
  },
  offerDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  offerShopLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: MUTED,
  },
  offerShopName: {
    fontSize: 14,
    fontWeight: "800",
    color: DARK,
    marginTop: 1,
  },
  modalActionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: "#F4F6F4",
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  rejectBtnText: {
    color: DARK,
    fontSize: 13,
    fontWeight: "700",
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: GREEN,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  acceptBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
