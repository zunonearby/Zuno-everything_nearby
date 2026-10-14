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
  Alert,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import {
  User,
  MapPin,
  ShoppingBag,
  Bell,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Edit3,
} from "lucide-react-native";
import { getCustomerProfile } from "@/features/profile/api";
import { getCustomerAddresses } from "@/features/location/api";
import { getCustomerOrders } from "@/features/orders/api";
import { signOutCustomer } from "@/features/auth/api";
import type { Profile } from "@zuno/types";

const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#718078";

export default function ProfileScreen() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [addressCount, setAddressCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [profData, ordersData, addrsData] = await Promise.all([
        getCustomerProfile(),
        getCustomerOrders(),
        getCustomerAddresses(),
      ]);

      setProfile(profData);
      setOrderCount(ordersData.length);
      setAddressCount(addrsData.length);
    } catch (err) {
      console.error("[ProfileScreen] Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out from ZUNO?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOutCustomer();
          router.replace("/(auth)/login" as never);
        },
      },
    ]);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "Z";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <View style={styles.screen}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Pressable
            style={styles.iconBtn}
            onPress={() => router.push("/notifications" as never)}
          >
            <Bell size={20} color={DARK} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Identity Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {getInitials(profile?.full_name)}
                </Text>
              </View>

              <View style={{ flex: 1, marginLeft: 14 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {profile?.full_name || "ZUNO Customer"}
                  </Text>
                  {profile?.profile_completed_at && (
                    <ShieldCheck size={16} color={GREEN} />
                  )}
                </View>
                <Text style={styles.profileSubtext}>
                  {profile?.phone || "+91 98765 43210"}
                </Text>
                {profile?.email && (
                  <Text style={styles.profileSubtext} numberOfLines={1}>
                    {profile.email}
                  </Text>
                )}
              </View>

              <Pressable
                style={styles.editBtn}
                onPress={() => router.push("/profile/edit" as never)}
              >
                <Edit3 size={16} color={GREEN} />
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
            </View>

            {profile?.profile_completed_at && (
              <View style={styles.badgeRow}>
                <View style={styles.verifiedBadge}>
                  <View style={styles.dot} />
                  <Text style={styles.verifiedBadgeText}>Verified Customer Account</Text>
                </View>
              </View>
            )}
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsRow}>
            <Pressable
              style={styles.statCard}
              onPress={() => router.push("/orders" as never)}
            >
              <View style={styles.statIconBox}>
                <ShoppingBag size={20} color={GREEN} />
              </View>
              <Text style={styles.statNumber}>
                {loading ? "..." : orderCount}
              </Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </Pressable>

            <Pressable
              style={styles.statCard}
              onPress={() => router.push("/profile/addresses" as never)}
            >
              <View style={styles.statIconBox}>
                <MapPin size={20} color={GREEN} />
              </View>
              <Text style={styles.statNumber}>
                {loading ? "..." : addressCount}
              </Text>
              <Text style={styles.statLabel}>Saved Addresses</Text>
            </Pressable>
          </View>

          {/* Menu Sections */}
          <View style={styles.menuContainer}>
            <Text style={styles.menuSectionHeader}>Account Settings</Text>

            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/profile/edit" as never)}
            >
              <View style={styles.menuIconBox}>
                <User size={18} color={GREEN} />
              </View>
              <Text style={styles.menuText}>Edit Profile</Text>
              <ChevronRight size={18} color={MUTED} />
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/profile/addresses" as never)}
            >
              <View style={styles.menuIconBox}>
                <MapPin size={18} color={GREEN} />
              </View>
              <Text style={styles.menuText}>Saved Addresses</Text>
              <ChevronRight size={18} color={MUTED} />
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/orders" as never)}
            >
              <View style={styles.menuIconBox}>
                <ShoppingBag size={18} color={GREEN} />
              </View>
              <Text style={styles.menuText}>My Orders</Text>
              <ChevronRight size={18} color={MUTED} />
            </Pressable>

            <Text style={styles.menuSectionHeader}>General & Support</Text>

            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/notifications" as never)}
            >
              <View style={styles.menuIconBox}>
                <Bell size={18} color={GREEN} />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
              <ChevronRight size={18} color={MUTED} />
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() =>
                Alert.alert(
                  "Help & Support",
                  "Need assistance with your order? Reach out to ZUNO Support at support@zuno.com or call +91 98765 43210.",
                  [{ text: "OK" }]
                )
              }
            >
              <View style={styles.menuIconBox}>
                <HelpCircle size={18} color={GREEN} />
              </View>
              <Text style={styles.menuText}>Help & Support</Text>
              <ChevronRight size={18} color={MUTED} />
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() =>
                Alert.alert(
                  "Terms & Privacy",
                  "ZUNO Hyperlocal Commerce v1.0\n\nAll rights reserved. PIN 231217, Renukoot, UP.",
                  [{ text: "Close" }]
                )
              }
            >
              <View style={styles.menuIconBox}>
                <FileText size={18} color={GREEN} />
              </View>
              <Text style={styles.menuText}>Terms & Privacy</Text>
              <ChevronRight size={18} color={MUTED} />
            </Pressable>

            <Pressable style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
              <View style={[styles.menuIconBox, { backgroundColor: "#FEE2E2" }]}>
                <LogOut size={18} color="#EF4444" />
              </View>
              <Text style={[styles.menuText, { color: "#EF4444", fontWeight: "600" }]}>
                Logout
              </Text>
            </Pressable>
          </View>

          <Text style={styles.versionFooter}>ZUNO App Version 1.0.0 (Renukoot)</Text>
        </ScrollView>
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
    fontSize: 20,
    fontWeight: "700",
    color: DARK,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: DARK,
  },
  profileSubtext: {
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: LIGHT_GREEN,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: GREEN,
  },
  badgeRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: GREEN,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: DARK,
  },
  statLabel: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  menuSectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginVertical: 10,
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: DARK,
  },
  logoutItem: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 14,
  },
  versionFooter: {
    textAlign: "center",
    fontSize: 12,
    color: MUTED,
    marginTop: 24,
  },
});
