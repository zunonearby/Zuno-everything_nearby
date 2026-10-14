import React from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Home, LayoutGrid, ShoppingCart, Package, User } from "lucide-react-native";
import { useCartStore } from "@/store/cartStore";

const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const INACTIVE = "#718078";

function TabIcon({
  focused,
  Icon,
  label,
  badgeCount,
}: {
  focused: boolean;
  Icon: any;
  label: string;
  badgeCount?: number;
}) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <View style={{ position: "relative" }}>
        <Icon
          size={20}
          color={focused ? GREEN : INACTIVE}
          strokeWidth={focused ? 2.3 : 1.8}
        />
        {badgeCount !== undefined && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badgeCount > 99 ? "99+" : badgeCount}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.labelText, focused && styles.labelTextActive]}>
        {label}
      </Text>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function TabsLayout() {
  const cartCount = useCartStore((state) => state.getCartCount());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={Home} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={LayoutGrid} label="Categories" />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              Icon={ShoppingCart}
              label="Cart"
              badgeCount={cartCount}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={Package} label="Orders" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={User} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 84 : 68,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8EEE8",
    elevation: 16,
    shadowColor: "#0F5D3A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    paddingBottom: Platform.OS === "ios" ? 20 : 6,
    paddingTop: 4,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    width: 64,
  },
  tabItemActive: {
    backgroundColor: LIGHT_GREEN,
  },
  labelText: {
    fontSize: 9.5,
    fontWeight: "600",
    color: INACTIVE,
    marginTop: 2,
  },
  labelTextActive: {
    color: GREEN,
    fontWeight: "800",
  },
  activeDot: {
    position: "absolute",
    top: 2,
    right: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#22A06B",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: "#E53935",
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
});

