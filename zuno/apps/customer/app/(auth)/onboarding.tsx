import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// Target Service Area Configuration
export const TARGET_PIN = "231217";
export const TARGET_CITY = "Renukoot";

// ZUNO Brand Theme Tokens
const GREEN = "#0F5D3A";
const SECONDARY_GREEN = "#22A06B";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#5E6C63";

const SLIDES = [
  {
    id: 0,
    headingDark: "Local shops",
    headingGreen: "now at your doorstep.",
    description: "Groceries, fruits, vegetables and more from stores near you.",
    image: require("../../assets/onboarding1.png"),
    resizeMode: "cover" as const,
    showBadge: true,
  },
  {
    id: 1,
    headingDark: "Your daily needs,",
    headingGreen: "made simple.",
    description: "Browse. Choose. Add to cart.",
    image: require("../../assets/onboarding2.png"),
    resizeMode: "contain" as const,
    showBadge: false,
  },
  {
    id: 2,
    headingDark: "From your shop",
    headingGreen: "to your home.",
    description: "Fresh groceries, delivered with care.",
    image: require("../../assets/onboarding3.png"),
    resizeMode: "cover" as const,
    showBadge: false,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeDot, setActiveDot] = useState(0);

  const currentSlide = SLIDES[activeDot];

  const handleNext = () => {
    if (activeDot < SLIDES.length - 1) {
      setActiveDot((prev) => prev + 1);
    } else {
      router.replace("/location" as never);
    }
  };

  const handleContinue = () => {
    router.replace("/location" as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Background Soft Pale Green Organic Leaf Shapes */}
      <View style={styles.bgBlobTopRight} />
      <View style={styles.bgBlobBottomLeft} />

      {/* Main No-Scroll Fixed Flex Layout Container */}
      <View style={styles.mainContainer}>
        {/* Header: Official ZUNO Logo & Tagline */}
        <View style={styles.brandContainer}>
          <Image
            source={require("../../assets/brandlogo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Everything nearby.</Text>
        </View>

        {/* Enhanced High-Resolution Hero Visual Container */}
        <View
          style={[
            styles.heroContainer,
            currentSlide.id === 1 && styles.transparentHeroContainer,
          ]}
        >
          <Image
            source={currentSlide.image}
            style={styles.heroImage}
            resizeMode={currentSlide.resizeMode}
          />

          {/* Location Badge Overlay */}
          {currentSlide.showBadge && (
            <View style={styles.locationBadge}>
              <Ionicons name="location" size={14} color={GREEN} />
              <Text style={styles.locationBadgeText}>231217, Renukoot</Text>
            </View>
          )}
        </View>

        {/* Dynamic Heading & Description */}
        <View style={styles.contentContainer}>
          <Text style={styles.heading}>
            {currentSlide.headingDark}
            {currentSlide.headingGreen ? "\n" : ""}
            <Text style={styles.headingHighlight}>{currentSlide.headingGreen}</Text>
          </Text>

          <Text style={styles.description}>{currentSlide.description}</Text>
        </View>

        {/* Bottom Footer Controls */}
        <View style={styles.footerContainer}>
          {activeDot < SLIDES.length - 1 ? (
            <View style={styles.manualControlsRow}>
              {/* Skip Button */}
              <Pressable
                onPress={() => router.replace("/location" as never)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.skipButton}
              >
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>

              {/* 3 Pagination Dots */}
              <View style={styles.paginationRow}>
                {SLIDES.map((_, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setActiveDot(index)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <View
                      style={[
                        styles.dot,
                        activeDot === index ? styles.dotActive : styles.dotInactive,
                      ]}
                    />
                  </Pressable>
                ))}
              </View>

              {/* Compact Next Button */}
              <Pressable style={styles.compactNextButton} onPress={handleNext}>
                <Text style={styles.compactNextText}>Next  →</Text>
              </Pressable>
            </View>
          ) : (
            /* Page 3: Full-Width Primary Green CTA Button */
            <Pressable style={styles.fullContinueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue  →</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  bgBlobTopRight: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: LIGHT_GREEN,
    opacity: 0.45,
  },
  bgBlobBottomLeft: {
    position: "absolute",
    bottom: 80,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: LIGHT_GREEN,
    opacity: 0.35,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  brandContainer: {
    alignItems: "center",
    marginTop: 2,
  },
  logoImage: {
    width: 150,
    height: 44,
  },
  tagline: {
    fontSize: 13,
    fontWeight: "700",
    color: GREEN,
    marginTop: 1,
    letterSpacing: -0.2,
  },
  heroContainer: {
    width: "100%",
    height: Math.min(height * 0.52, 420),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  transparentHeroContainer: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
    borderRadius: 0,
    overflow: "visible",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  locationBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  locationBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: DARK,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  heading: {
    fontSize: 25,
    fontWeight: "900",
    color: DARK,
    textAlign: "center",
    lineHeight: 31,
    letterSpacing: -0.5,
  },
  headingHighlight: {
    color: SECONDARY_GREEN,
  },
  description: {
    fontSize: 14,
    color: MUTED,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
    fontWeight: "500",
  },
  footerContainer: {
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  manualControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "700",
    color: GREEN,
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: GREEN,
  },
  dotInactive: {
    width: 8,
    backgroundColor: "#D1D5DB",
  },
  compactNextButton: {
    backgroundColor: GREEN,
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  compactNextText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  fullContinueButton: {
    width: "100%",
    height: 52,
    backgroundColor: GREEN,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
});

