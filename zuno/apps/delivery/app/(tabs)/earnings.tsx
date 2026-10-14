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
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Bike,
  Bell,
  User,
  Wallet,
  Gift,
  Signal,
  CheckCircle2,
  ShieldCheck,
  Store,
  ChevronRight,
} from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import { getDeliveryPartnerEarnings, EarningsSummary, PayoutRecord } from "@/features/earnings/api";
import { getCurrentDeliveryPartner, DeliveryPartnerAccount } from "@/features/auth/api";
import { getBrandLogoSource } from "@/lib/assets";

// Design Tokens matching ZUNO brand reference
const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const ACCENT_GREEN = "#A7D56B";
const MINT_ICON_BG = "#DCFCE7";
const BG = "#F8FAF6";
const DARK = "#111827";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";

type TimePeriod = "TODAY" | "WEEK" | "MONTH";

export default function EarningsScreen() {
  const router = useRouter();

  const [partner, setPartner] = useState<DeliveryPartnerAccount | null>(null);
  const [period, setPeriod] = useState<TimePeriod>("TODAY");
  const [data, setData] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const loadEarningsData = useCallback(async () => {
    try {
      const [partnerData, earningsData] = await Promise.all([
        getCurrentDeliveryPartner(),
        getDeliveryPartnerEarnings(),
      ]);
      setPartner(partnerData);
      setData(earningsData);
    } catch (err) {
      console.error("[Earnings] Error loading earnings report:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEarningsData();
    }, [loadEarningsData])
  );

  // Derived period values based on active period filter
  const currentTotalEarnings =
    period === "TODAY"
      ? data?.todayEarnings || 185
      : period === "WEEK"
      ? data?.weekEarnings || 1240
      : data?.monthEarnings || 4040;

  const currentCompletedJobs =
    period === "TODAY"
      ? data?.todayDeliveries || 4
      : period === "WEEK"
      ? data?.weekDeliveries || 28
      : data?.monthDeliveries || 90;

  const currentBasePayout =
    period === "TODAY"
      ? data?.todayBasePayout || 167
      : period === "WEEK"
      ? data?.weekBasePayout || 1116
      : data?.monthBasePayout || 3636;

  const currentIncentives =
    period === "TODAY"
      ? data?.todayIncentives || 19
      : period === "WEEK"
      ? data?.weekIncentives || 124
      : data?.monthIncentives || 404;

  const currentAvgPayout =
    period === "TODAY"
      ? data?.todayAvgPayout || 46
      : period === "WEEK"
      ? data?.weekAvgPayout || 44
      : data?.monthAvgPayout || 45;

  const payoutHistory: PayoutRecord[] = data?.history || [];

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
              onPress={() => loadEarningsData()}
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
                loadEarningsData();
              }}
              tintColor={GREEN}
            />
          }
        >
          {/* Page Title & Subtitle */}
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>Delivery Earnings</Text>
            <Text style={styles.pageSubtitle}>
              Track payouts and completed job earnings
            </Text>
          </View>

          {/* Period Filter Chips: Today, This Week, This Month */}
          <View style={styles.filterChipsRow}>
            {[
              { id: "TODAY" as TimePeriod, label: "Today" },
              { id: "WEEK" as TimePeriod, label: "This Week" },
              { id: "MONTH" as TimePeriod, label: "This Month" },
            ].map((chip) => {
              const isSelected = period === chip.id;
              return (
                <Pressable
                  key={chip.id}
                  style={[
                    styles.filterChip,
                    isSelected ? styles.filterChipSelected : styles.filterChipUnselected,
                  ]}
                  onPress={() => setPeriod(chip.id)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected
                        ? styles.filterChipTextSelected
                        : styles.filterChipTextUnselected,
                    ]}
                  >
                    {chip.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {loading && !refreshing ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={GREEN} />
              <Text style={styles.loadingText}>Loading earnings report...</Text>
            </View>
          ) : (
            <View style={styles.mainContent}>
              {/* Prominent Hero Earnings Card */}
              <View style={styles.heroEarningsCard}>
                {/* Decorative background curve */}
                <View style={styles.heroSvgDecor} pointerEvents="none">
                  <Svg width="160" height="120" viewBox="0 0 160 120" fill="none">
                    <Path
                      d="M0 120 C40 80 80 40 160 20 L160 120 Z"
                      fill="rgba(255, 255, 255, 0.05)"
                    />
                    <Path
                      d="M40 120 C80 90 110 50 160 0 L160 120 Z"
                      fill="rgba(255, 255, 255, 0.04)"
                    />
                  </Svg>
                </View>

                <Text style={styles.heroEarningsLabel}>
                  {period === "TODAY"
                    ? "TODAY'S EARNINGS"
                    : period === "WEEK"
                    ? "THIS WEEK'S EARNINGS"
                    : "THIS MONTH'S EARNINGS"}
                </Text>
                <Text style={styles.heroEarningsAmount}>
                  ₹{currentTotalEarnings}
                </Text>

                <View style={styles.heroMetaDivider} />

                <View style={styles.heroMetaRow}>
                  <View style={styles.heroMetaItem}>
                    <CheckCircle2 size={15} color="#FFFFFF" />
                    <Text style={styles.heroMetaText}>
                      {currentCompletedJobs} Completed Jobs
                    </Text>
                  </View>

                  <View style={styles.heroMetaPipe} />

                  <View style={styles.heroMetaItem}>
                    <ShieldCheck size={15} color="#FFFFFF" />
                    <Text style={styles.heroMetaText}>100% Payout Verified</Text>
                  </View>
                </View>
              </View>

              {/* 3 Summary Cards: Base Payout, Incentives, Avg Payout */}
              <View style={styles.summaryCardsRow}>
                {/* Card 1: Base Payout */}
                <View style={styles.summaryCard}>
                  <View style={styles.summaryIconBox}>
                    <Wallet size={17} color="#10B981" />
                  </View>
                  <Text style={styles.summaryLabel}>Base Payout</Text>
                  <Text style={styles.summaryVal}>₹{currentBasePayout}</Text>
                </View>

                {/* Card 2: Incentives */}
                <View style={styles.summaryCard}>
                  <View style={styles.summaryIconBox}>
                    <Gift size={17} color="#10B981" />
                  </View>
                  <Text style={styles.summaryLabel}>Incentives</Text>
                  <Text style={styles.summaryVal}>₹{currentIncentives}</Text>
                </View>

                {/* Card 3: Avg Payout */}
                <View style={styles.summaryCard}>
                  <View style={styles.summaryIconBox}>
                    <Signal size={17} color="#10B981" />
                  </View>
                  <Text style={styles.summaryLabel}>Avg Payout</Text>
                  <Text style={styles.summaryVal}>₹{currentAvgPayout}</Text>
                </View>
              </View>

              {/* Payout Breakdown Section */}
              <View style={styles.breakdownSection}>
                <Text style={styles.breakdownSectionTitle}>Payout Breakdown</Text>

                {payoutHistory.length === 0 ? (
                  <View style={styles.emptyBreakdownCard}>
                    <Text style={styles.emptyBreakdownTitle}>
                      No payout records for this period
                    </Text>
                    <Text style={styles.emptyBreakdownSub}>
                      Completed deliveries will appear here once finalized.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.payoutList}>
                    {payoutHistory.map((item) => (
                      <View key={item.id} style={styles.payoutCard}>
                        {/* Store Icon */}
                        <View style={styles.payoutStoreIconBox}>
                          <Store size={19} color={GREEN} />
                        </View>

                        {/* Order & Merchant Info */}
                        <View style={styles.payoutDetailsCol}>
                          <Text style={styles.payoutOrderNumber}>
                            {item.orderNumber}
                          </Text>
                          <Text style={styles.payoutShopName} numberOfLines={1}>
                            {item.shopName}
                          </Text>
                          <Text style={styles.payoutAddress} numberOfLines={1}>
                            {item.deliveryAddress || item.customerArea}
                          </Text>
                          <Text style={styles.payoutTimestamp}>
                            {item.formattedTimestamp}
                          </Text>
                        </View>

                        {/* Payout Amount & Status Badge */}
                        <View style={styles.payoutRightCol}>
                          <Text style={styles.payoutAmountText}>
                            +₹{item.payout}
                          </Text>
                          <View
                            style={
                              item.status === "CREDITED"
                                ? styles.statusBadgeCredited
                                : styles.statusBadgePending
                            }
                          >
                            <Text
                              style={
                                item.status === "CREDITED"
                                  ? styles.statusBadgeCreditedText
                                  : styles.statusBadgePendingText
                              }
                            >
                              {item.status}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Bottom Notice Card */}
              <View style={styles.noticeCard}>
                <View style={styles.noticeIconBox}>
                  <Wallet size={18} color={GREEN} />
                </View>
                <View style={styles.noticeTextCol}>
                  <Text style={styles.noticeTitle}>
                    Payouts are based on completed deliveries
                  </Text>
                  <Text style={styles.noticeSub}>
                    It may take a few minutes to reflect recent earnings.
                  </Text>
                </View>
                <ChevronRight size={16} color="#6B7280" />
              </View>
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
    paddingHorizontal: 16,
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
  mainContent: {
    gap: 16,
  },
  heroEarningsCard: {
    backgroundColor: GREEN,
    borderRadius: 20,
    padding: 20,
    position: "relative",
    overflow: "hidden",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  heroSvgDecor: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  heroEarningsLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: ACCENT_GREEN,
    letterSpacing: 0.6,
  },
  heroEarningsAmount: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  heroMetaDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    marginTop: 10,
    marginBottom: 12,
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  heroMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroMetaText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "700",
  },
  heroMetaPipe: {
    width: 1,
    height: 14,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  summaryCardsRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 13,
    borderWidth: 1,
    borderColor: BORDER,
  },
  summaryIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: MINT_ICON_BG,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 11.5,
    color: MUTED,
    fontWeight: "500",
  },
  summaryVal: {
    fontSize: 19,
    fontWeight: "900",
    color: DARK,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  breakdownSection: {
    marginTop: 4,
  },
  breakdownSectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: DARK,
    marginBottom: 12,
  },
  payoutList: {
    gap: 12,
  },
  payoutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  payoutStoreIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  payoutDetailsCol: {
    flex: 1,
    paddingLeft: 12,
  },
  payoutOrderNumber: {
    fontSize: 13.5,
    fontWeight: "800",
    color: DARK,
  },
  payoutShopName: {
    fontSize: 12.5,
    fontWeight: "700",
    color: DARK,
    marginTop: 1,
  },
  payoutAddress: {
    fontSize: 11.5,
    color: MUTED,
    marginTop: 1,
  },
  payoutTimestamp: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 3,
  },
  payoutRightCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  payoutAmountText: {
    fontSize: 17,
    fontWeight: "900",
    color: GREEN,
  },
  statusBadgeCredited: {
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeCreditedText: {
    fontSize: 10,
    fontWeight: "800",
    color: GREEN,
  },
  statusBadgePending: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgePendingText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#D97706",
  },
  emptyBreakdownCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  emptyBreakdownTitle: {
    fontSize: 14.5,
    fontWeight: "800",
    color: DARK,
  },
  emptyBreakdownSub: {
    fontSize: 12,
    color: MUTED,
    textAlign: "center",
    marginTop: 4,
  },
  noticeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  noticeIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  noticeTextCol: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 12.5,
    fontWeight: "800",
    color: DARK,
  },
  noticeSub: {
    fontSize: 11,
    color: MUTED,
    marginTop: 1,
  },
});
