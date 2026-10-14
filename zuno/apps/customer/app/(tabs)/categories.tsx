import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Search, ShoppingCart, ArrowRight } from "lucide-react-native";
import { fetchCategories, CategoryItem } from "@/features/categories/api";
import { useCartStore } from "@/store/cartStore";

const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#718078";

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState("");

  const cartCount = useCartStore((state) => state.getCartCount());

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Categories</Text>
            <Text style={styles.headerSubtitle}>Explore everything nearby</Text>
          </View>
          <Pressable
            style={styles.cartButton}
            onPress={() => router.push("/cart" as never)}
          >
            <ShoppingCart size={20} color={GREEN} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Search size={18} color={MUTED} style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search all categories..."
            placeholderTextColor="#89948D"
            style={[styles.searchInput, { outlineStyle: "none" } as any]}
          />
        </View>

        {/* Category Grid */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
        >
          {filteredCategories.map((cat) => (
            <Pressable
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/category/${cat.slug}` as never)}
            >
              <View style={styles.imageContainer}>
                {cat.image ? (
                  <Image
                    source={cat.image}
                    style={styles.categoryImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={{ fontSize: 36 }}>🛍️</Text>
                )}
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryDesc} numberOfLines={2}>
                  {cat.description || "Fresh products from nearby shops"}
                </Text>
                <View style={styles.exploreRow}>
                  <Text style={styles.exploreText}>Explore items</Text>
                  <ArrowRight size={13} color={GREEN} />
                </View>
              </View>
            </Pressable>
          ))}
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
    backgroundColor: BG,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: DARK,
  },
  headerSubtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  cartButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8EEE8",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#E53935",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  searchBox: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8E2",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: DARK,
    fontSize: 14,
    fontWeight: "500",
  },
  gridContent: {
    paddingBottom: 90,
    gap: 14,
  },
  categoryCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EAEFEA",
    alignItems: "center",
    gap: 14,
  },
  imageContainer: {
    width: 76,
    height: 76,
    borderRadius: 16,
    backgroundColor: LIGHT_GREEN,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  cardInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },
  categoryDesc: {
    fontSize: 11.5,
    color: MUTED,
    marginTop: 3,
  },
  exploreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  exploreText: {
    fontSize: 12,
    fontWeight: "700",
    color: GREEN,
  },
});
