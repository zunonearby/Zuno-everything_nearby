import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { validateServiceArea } from "../../features/location/api";
import { useLocationStore, SelectedLocationData } from "../../store/locationStore";

const { width } = Dimensions.get("window");

// Brand Design Tokens
const GREEN = "#0F5D3A";
const SECONDARY_GREEN = "#22A06B";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#6B756E";
const ERROR_RED = "#DC2626";

export default function LocationSelectionScreen() {
  const router = useRouter();
  const { selectedLocation, setSelectedLocation } = useLocationStore();

  const [pinCode, setPinCode] = useState(selectedLocation?.pincode || "231217");
  const [houseNo, setHouseNo] = useState(selectedLocation?.line1 || "");
  const [locality, setLocality] = useState(selectedLocation?.locality || "");

  const [isValidating, setIsValidating] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  const [serviceResult, setServiceResult] = useState<{
    is_serviceable: boolean;
    city?: string;
    state?: string;
    area_name?: string;
    message?: string;
  } | null>({
    is_serviceable: true,
    city: "Renukoot",
    state: "Uttar Pradesh",
    area_name: "Renukoot",
    message: "Service available in Renukoot, Uttar Pradesh",
  });

  const [confirmedView, setConfirmedView] = useState(false);

  // Auto-validate initial PIN code on mount if 6 digits
  useEffect(() => {
    if (pinCode.length === 6) {
      handleValidatePin(pinCode);
    }
  }, []);

  const handleValidatePin = async (code: string) => {
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setServiceResult(null);
      return;
    }
    setIsValidating(true);
    try {
      const res = await validateServiceArea(code);
      setServiceResult(res);

      if (res.is_serviceable) {
        const locData: SelectedLocationData = {
          pincode: code,
          city: res.city || "Renukoot",
          state: res.state || "Uttar Pradesh",
          area_name: res.area_name || "Renukoot",
          locality: locality || res.area_name || "Renukoot",
          line1: houseNo,
          source: "MANUAL",
          is_serviceable: true,
        };
        setSelectedLocation(locData);
      } else {
        setSelectedLocation(null);
      }
    } catch (err: any) {
      setServiceResult({
        is_serviceable: false,
        message: err.message || "Failed to validate PIN code",
      });
      setSelectedLocation(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handlePinChange = (text: string) => {
    const clean = text.replace(/\D/g, "").slice(0, 6);
    setPinCode(clean);
    if (clean.length === 6) {
      handleValidatePin(clean);
    } else {
      setServiceResult(null);
      setSelectedLocation(null);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsGpsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "ZUNO needs your location to check delivery serviceability. Please allow location access or enter your PIN manually.",
          [{ text: "OK" }]
        );
        setIsGpsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocode
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const detectedPin = address?.postalCode || "231217";
      const detectedCity = address?.city || address?.subregion || "Renukoot";
      const detectedState = address?.region || "Uttar Pradesh";
      const detectedLocality = address?.street || address?.district || address?.name || "Renukoot";

      setPinCode(detectedPin);
      setLocality(detectedLocality);

      // Validate detected PIN
      const res = await validateServiceArea(detectedPin);
      setServiceResult(res);

      const locData: SelectedLocationData = {
        pincode: detectedPin,
        city: res.city || detectedCity,
        state: res.state || detectedState,
        locality: detectedLocality,
        area_name: res.area_name || detectedCity,
        lat: latitude,
        lng: longitude,
        source: "CURRENT_LOCATION",
        is_serviceable: res.is_serviceable,
      };

      setSelectedLocation(locData);
      setConfirmedView(true);
    } catch (error: any) {
      Alert.alert(
        "Location Detection Failed",
        "Could not auto-detect your location. Please enter your 6-digit PIN code manually.",
        [{ text: "OK" }]
      );
    } finally {
      setIsGpsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedLocation || !selectedLocation.is_serviceable) {
      return;
    }
    // Update store with final user entered address details if any
    setSelectedLocation({
      ...selectedLocation,
      line1: houseNo || selectedLocation.line1,
      locality: locality || selectedLocation.locality,
    });

    // Navigate to customer registration / auth flow
    router.push("/(auth)/login" as never);
  };

  const isContinueEnabled = Boolean(
    serviceResult?.is_serviceable && pinCode.length === 6 && !isValidating
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Decorative Pale Green Organic Leaf Shapes */}
      <View style={styles.bgBlobTopRight} />
      <View style={styles.bgBlobBottomLeft} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Header Row with Back Button & Official ZUNO Logo */}
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace("/(auth)/onboarding" as never)}
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={24} color={DARK} />
          </Pressable>

          <View style={styles.brandContainer}>
            <Image
              source={require("../../assets/brandlogo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Everything nearby.</Text>
          </View>

          <View style={{ width: 32 }} />
        </View>

        {/* Dynamic View: Confirmation State vs Main Selection State */}
        {confirmedView && serviceResult?.is_serviceable ? (
          /* Confirmation State View */
          <View style={styles.confirmSection}>
            <Text style={styles.mainHeading}>Confirm your location</Text>
            <Text style={styles.subTitle}>
              We found this location. Please confirm to see nearby shops and products.
            </Text>

            {/* Map Pin Preview Box */}
            <View style={styles.mapPreviewCard}>
              <View style={styles.mapCircleIcon}>
                <Ionicons name="location" size={32} color={GREEN} />
              </View>
              <View style={styles.mapCardInfo}>
                <View style={styles.serviceableRow}>
                  <Text style={styles.mapCardTitle}>
                    {serviceResult.city || "Renukoot"}, {serviceResult.state || "Uttar Pradesh"}
                  </Text>
                  <View style={styles.badgeSuccess}>
                    <Text style={styles.badgeSuccessText}>Serviceable</Text>
                  </View>
                </View>
                <Text style={styles.mapCardSub}>PIN {pinCode}</Text>
                <Text style={styles.mapCardDetail}>
                  {locality || serviceResult.area_name || "Renukoot"}, Sonebhadra, Uttar Pradesh
                </Text>
              </View>
            </View>

            <View style={styles.deliveryNoticeCard}>
              <Ionicons name="checkmark-circle" size={20} color={GREEN} />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.deliveryNoticeTitle}>Delivering to this area</Text>
                <Text style={styles.deliveryNoticeSub}>
                  You can change or add a more specific address later.
                </Text>
              </View>
            </View>

            <Pressable
              style={styles.primaryContinueBtn}
              onPress={handleContinue}
            >
              <Text style={styles.continueBtnText}>Confirm Location  →</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryTryBtn}
              onPress={() => setConfirmedView(false)}
            >
              <Text style={styles.tryBtnText}>Try a different location</Text>
            </Pressable>
          </View>
        ) : (
          /* Main Location Selection State */
          <View style={styles.mainSection}>
            {/* Main Heading & Subtitle */}
            <View style={styles.titleContainer}>
              <Text style={styles.mainHeading}>Where should{"\n"}we deliver?</Text>
              <Text style={styles.subTitle}>
                Enter your location to see nearby shops and fresh products.
              </Text>
            </View>

            {/* Hero Isolated Map Illustration */}
            <View style={styles.illustrationContainer}>
              <Image
                source={require("../../assets/location_hero_map.png")}
                style={styles.heroMapImage}
                resizeMode="contain"
              />
            </View>

            {/* Use Current Location Button */}
            <Pressable
              style={({ pressed }) => [
                styles.gpsButton,
                pressed && styles.gpsButtonPressed,
              ]}
              onPress={handleUseCurrentLocation}
              disabled={isGpsLoading}
            >
              {isGpsLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <View style={styles.gpsBtnLeft}>
                    <Ionicons name="navigate-circle-outline" size={22} color="#FFFFFF" />
                    <Text style={styles.gpsBtnText}>Use Current Location</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </>
              )}
            </Pressable>

            {/* OR Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Manual PIN Code Entry Section */}
            <View style={styles.manualSection}>
              <Text style={styles.inputLabel}>Enter PIN code</Text>
              
              <View style={styles.pinInputContainer}>
                <Ionicons name="location-outline" size={20} color={MUTED} style={styles.pinInputIcon} />
                <TextInput
                  style={styles.pinTextInput}
                  value={pinCode}
                  onChangeText={handlePinChange}
                  placeholder="Enter 6-digit PIN code"
                  placeholderTextColor="#A0ABBA"
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {pinCode.length > 0 && (
                  <Pressable onPress={() => handlePinChange("")} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color="#A0ABBA" />
                  </Pressable>
                )}
              </View>

              {/* Validation Feedback Row */}
              {isValidating ? (
                <View style={styles.validatingRow}>
                  <ActivityIndicator size="small" color={GREEN} />
                  <Text style={styles.validatingText}>Checking serviceability...</Text>
                </View>
              ) : serviceResult ? (
                serviceResult.is_serviceable ? (
                  <View style={styles.serviceSuccessBox}>
                    <Ionicons name="checkmark-circle" size={22} color={GREEN} />
                    <View style={styles.serviceTextCol}>
                      <Text style={styles.serviceSuccessTitle}>
                        {serviceResult.city || "Renukoot"}, {serviceResult.state || "Uttar Pradesh"}
                      </Text>
                      <Text style={styles.serviceSuccessSub}>
                        {serviceResult.message || "Service available in your area"}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.serviceErrorBox}>
                    <Ionicons name="close-circle" size={22} color={ERROR_RED} />
                    <View style={styles.serviceTextCol}>
                      <Text style={styles.serviceErrorTitle}>Currently not available</Text>
                      <Text style={styles.serviceErrorSub}>
                        {serviceResult.message || "ZUNO is not available in this area yet. We will notify you when we start delivering here."}
                      </Text>
                    </View>
                  </View>
                )
              ) : null}

              {/* Optional Locality & House Address Fields when PIN is serviceable */}
              {serviceResult?.is_serviceable && (
                <View style={styles.addressFieldsGroup}>
                  <Text style={styles.optionalLabel}>Locality / Area (Optional)</Text>
                  <TextInput
                    style={styles.addressInput}
                    value={locality}
                    onChangeText={setLocality}
                    placeholder="e.g. Colony, Market area, Sector"
                    placeholderTextColor="#A0ABBA"
                  />

                  <Text style={styles.optionalLabel}>House No. / Building (Optional)</Text>
                  <TextInput
                    style={styles.addressInput}
                    value={houseNo}
                    onChangeText={setHouseNo}
                    placeholder="e.g. House no. 12, Flat 3B"
                    placeholderTextColor="#A0ABBA"
                  />
                </View>
              )}
            </View>

            {/* Bottom Continue CTA Button */}
            <View style={styles.ctaFooter}>
              <Pressable
                style={[
                  styles.primaryContinueBtn,
                  !isContinueEnabled && styles.disabledContinueBtn,
                ]}
                onPress={handleContinue}
                disabled={!isContinueEnabled}
              >
                <Text style={styles.continueBtnText}>Continue  →</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  bgBlobTopRight: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: LIGHT_GREEN,
    opacity: 0.45,
  },
  bgBlobBottomLeft: {
    position: "absolute",
    bottom: 40,
    left: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: LIGHT_GREEN,
    opacity: 0.35,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  brandContainer: {
    alignItems: "center",
  },
  logoImage: {
    width: 140,
    height: 40,
  },
  tagline: {
    fontSize: 12,
    fontWeight: "700",
    color: GREEN,
    marginTop: -2,
    letterSpacing: -0.2,
  },
  mainSection: {
    width: "100%",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 4,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: "900",
    color: DARK,
    textAlign: "center",
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 14,
    color: MUTED,
    textAlign: "center",
    maxWidth: 310,
    lineHeight: 20,
    marginTop: 6,
    fontWeight: "500",
  },
  illustrationContainer: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  heroMapImage: {
    width: "92%",
    height: "100%",
  },
  gpsButton: {
    width: "100%",
    height: 52,
    backgroundColor: GREEN,
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 6,
  },
  gpsButtonPressed: {
    opacity: 0.9,
  },
  gpsBtnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  gpsBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
  },
  manualSection: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: DARK,
    marginBottom: 6,
  },
  pinInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  pinInputIcon: {
    marginRight: 10,
  },
  pinTextInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: DARK,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  validatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  validatingText: {
    fontSize: 13,
    color: MUTED,
    fontWeight: "500",
  },
  serviceSuccessBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_GREEN,
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
    gap: 10,
  },
  serviceErrorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
    gap: 10,
  },
  serviceTextCol: {
    flex: 1,
  },
  serviceSuccessTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: GREEN,
  },
  serviceSuccessSub: {
    fontSize: 12,
    color: SECONDARY_GREEN,
    fontWeight: "600",
    marginTop: 1,
  },
  serviceErrorTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: ERROR_RED,
  },
  serviceErrorSub: {
    fontSize: 12,
    color: "#991B1B",
    fontWeight: "500",
    marginTop: 1,
  },
  addressFieldsGroup: {
    marginTop: 10,
  },
  optionalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: MUTED,
    marginTop: 8,
    marginBottom: 4,
  },
  addressInput: {
    backgroundColor: "#FFFFFF",
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontSize: 14,
    color: DARK,
  },
  ctaFooter: {
    width: "100%",
    marginTop: 16,
  },
  primaryContinueBtn: {
    width: "100%",
    height: 54,
    backgroundColor: GREEN,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  disabledContinueBtn: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  confirmSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  mapPreviewCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mapCircleIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  mapCardInfo: {
    flex: 1,
  },
  serviceableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mapCardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
    flex: 1,
  },
  badgeSuccess: {
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeSuccessText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "700",
  },
  mapCardSub: {
    fontSize: 13,
    fontWeight: "700",
    color: GREEN,
    marginTop: 2,
  },
  mapCardDetail: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  deliveryNoticeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_GREEN,
    padding: 14,
    borderRadius: 16,
    width: "100%",
    marginBottom: 20,
  },
  deliveryNoticeTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: GREEN,
  },
  deliveryNoticeSub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 1,
  },
  secondaryTryBtn: {
    paddingVertical: 12,
    marginTop: 8,
  },
  tryBtnText: {
    color: GREEN,
    fontSize: 15,
    fontWeight: "700",
  },
});
