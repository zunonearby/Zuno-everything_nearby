import React, { useState } from "react";
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";

import { useLocationStore } from "../../store/locationStore";
import { useUserRegistrationStore } from "../../store/registrationStore";
import { requestPhoneOtp } from "../../features/auth/api";

// Brand Color Palette
const GREEN = "#0F5D3A";
const SECONDARY_GREEN = "#22A06B";
const LIGHT_GREEN = "#EAF4EC";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#6B756E";
const BORDER = "#E1E6E2";
const DISABLED_GREEN = "#A3B9AC";
const ERROR_RED = "#DC2626";

export default function RegistrationDetailsScreen() {
  const router = useRouter();
  const { selectedLocation } = useLocationStore();
  const { fullName: savedName, email: savedEmail, phone: savedPhone, setRegistrationDetails } =
    useUserRegistrationStore();

  const [fullName, setFullName] = useState(savedName);
  const [email, setEmail] = useState(savedEmail);
  const [phone, setPhone] = useState(savedPhone);

  const [focusedField, setFocusedField] = useState<"name" | "email" | "phone" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field validation rules
  const isNameValid = fullName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPhoneValid = /^\d{10}$/.test(phone.trim().replace(/\D/g, ""));
  const hasValidLocation = Boolean(selectedLocation && selectedLocation.is_serviceable);

  const isFormValid = isNameValid && isEmailValid && isPhoneValid && hasValidLocation;

  const handleNameChange = (text: string) => {
    setFullName(text);
    setRegistrationDetails({ fullName: text });
    setErrorMessage(null);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setRegistrationDetails({ email: text });
    setErrorMessage(null);
  };

  const handlePhoneChange = (text: string) => {
    const clean = text.replace(/\D/g, "").slice(0, 10);
    setPhone(clean);
    setRegistrationDetails({ phone: clean });
    setErrorMessage(null);
  };

  const handleBack = () => {
    // Save state and return to location selection page
    setRegistrationDetails({ fullName, email, phone });
    router.replace("/(auth)/location" as never);
  };

  const handleContinue = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const cleanPhone = phone.trim().replace(/\D/g, "");

    try {
      // Save details to store
      setRegistrationDetails({ fullName: fullName.trim(), email: email.trim(), phone: cleanPhone });

      // Request OTP via Supabase Auth service
      const res = await requestPhoneOtp(cleanPhone);

      if (res.success) {
        // Navigate to OTP verification screen passing details
        router.push({
          pathname: "/(auth)/verify" as never,
          params: {
            phone: cleanPhone,
            formattedPhone: res.formattedPhone,
            email: email.trim(),
            fullName: fullName.trim(),
          },
        } as never);
      }
    } catch (err: any) {
      console.error("[RegistrationDetails] OTP Request error:", err.message);
      setErrorMessage(err.message || "Failed to send OTP. Please check your phone number.");
      Alert.alert("Authentication Error", err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Header: Back Button & ZUNO Logo */}
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
              hitSlop={12}
              accessibilityLabel="Back to location selection"
            >
              <Ionicons name="arrow-back" size={20} color={DARK} />
            </Pressable>

            <View style={styles.brandContainer}>
              <Image
                source={require("../../assets/brandlogo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.tagline}>Everything nearby.</Text>
            </View>

            <View style={{ width: 42 }} />
          </View>

          {/* Three-step Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.dotCompleted]} />
            <View style={styles.progressLineActive} />
            <View style={[styles.progressDot, styles.dotActive]} />
            <View style={styles.progressLineInactive} />
            <View style={[styles.progressDot, styles.dotInactive]} />
          </View>

          {/* Main Heading & Subtitle */}
          <View style={styles.titleSection}>
            <Text style={styles.mainHeading}>Tell us about{"\n"}yourself</Text>
            <Text style={styles.subTitle}>
              We’ll use this information to create your ZUNO account.
            </Text>
          </View>

          {/* Error Message Toast if any */}
          {errorMessage && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Form Input Fields Group */}
          <View style={styles.formGroup}>
            {/* 1. Full Name Input */}
            <View
              style={[
                styles.inputCard,
                focusedField === "name" && styles.inputCardFocused,
              ]}
            >
              <View style={styles.inputIconCol}>
                <Ionicons name="person-outline" size={20} color={DARK} />
              </View>

              <View style={styles.inputTextCol}>
                <Text style={styles.inputLabel}>Full name</Text>
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={handleNameChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9AA29D"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              {fullName.length > 0 && focusedField === "name" && (
                <Pressable
                  onPress={() => handleNameChange("")}
                  style={styles.clearBtn}
                  hitSlop={8}
                  accessibilityLabel="Clear name"
                >
                  <Ionicons name="close" size={14} color="#5E6C63" />
                </Pressable>
              )}
            </View>

            {/* 2. Email Address Input */}
            <View
              style={[
                styles.inputCard,
                focusedField === "email" && styles.inputCardFocused,
              ]}
            >
              <View style={styles.inputIconCol}>
                <Ionicons name="mail-outline" size={20} color={DARK} />
              </View>

              <View style={styles.inputTextCol}>
                <Text style={styles.inputLabel}>Email address</Text>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={handleEmailChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email address"
                  placeholderTextColor="#9AA29D"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {email.length > 0 && focusedField === "email" && (
                <Pressable
                  onPress={() => handleEmailChange("")}
                  style={styles.clearBtn}
                  hitSlop={8}
                  accessibilityLabel="Clear email"
                >
                  <Ionicons name="close" size={14} color="#5E6C63" />
                </Pressable>
              )}
            </View>

            {/* 3. Phone Number Input */}
            <View
              style={[
                styles.inputCard,
                focusedField === "phone" && styles.inputCardFocused,
              ]}
            >
              <View style={styles.inputIconCol}>
                <Ionicons name="call-outline" size={20} color={DARK} />
              </View>

              <View style={styles.inputTextCol}>
                <Text style={styles.inputLabel}>Phone number</Text>
                
                <View style={styles.phoneInputRow}>
                  {/* Indian Country Selector Badge */}
                  <View style={styles.countryBadge}>
                    <Text style={styles.flagEmoji}>🇮🇳</Text>
                    <Text style={styles.countryCodeText}>+91</Text>
                    <Ionicons name="chevron-down" size={14} color={MUTED} style={{ marginLeft: 2 }} />
                  </View>

                  <TextInput
                    style={[styles.textInput, { flex: 1, marginLeft: 8 }]}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter 10-digit number"
                    placeholderTextColor="#9AA29D"
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                </View>
              </View>

              {phone.length > 0 && focusedField === "phone" && (
                <Pressable
                  onPress={() => handlePhoneChange("")}
                  style={styles.clearBtn}
                  hitSlop={8}
                  accessibilityLabel="Clear phone number"
                >
                  <Ionicons name="close" size={14} color="#5E6C63" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Selected Location Summary Card */}
          <View style={styles.locationCard}>
            <View style={styles.locationIconCircle}>
              <Ionicons name="location" size={20} color="#FFFFFF" />
            </View>

            <View style={styles.locationTextCol}>
              <Text style={styles.locationDeliveringLabel}>Delivering to</Text>
              <Text style={styles.locationTitleText}>
                {selectedLocation
                  ? `${selectedLocation.city}, ${selectedLocation.state}`
                  : "Renukoot, Uttar Pradesh"}
              </Text>
              <Text style={styles.locationPinText}>
                PIN {selectedLocation?.pincode || "231217"}
              </Text>
            </View>

            <Pressable onPress={handleBack} hitSlop={10} style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Change</Text>
            </Pressable>
          </View>

          {/* Bottom Continue CTA Button */}
          <View style={styles.ctaFooter}>
            <Pressable
              style={[
                styles.primaryContinueBtn,
                !isFormValid && styles.disabledContinueBtn,
              ]}
              onPress={handleContinue}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.continueBtnRow}>
                  <Text style={styles.continueBtnText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </View>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F2",
  },
  brandContainer: {
    alignItems: "center",
  },
  logoImage: {
    width: 135,
    height: 38,
  },
  tagline: {
    fontSize: 12,
    fontWeight: "700",
    color: GREEN,
    marginTop: -2,
    letterSpacing: -0.2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 14,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotCompleted: {
    backgroundColor: GREEN,
  },
  dotActive: {
    backgroundColor: GREEN,
  },
  dotInactive: {
    backgroundColor: "#D1D5DB",
  },
  progressLineActive: {
    width: 32,
    height: 2,
    backgroundColor: GREEN,
    marginHorizontal: 4,
  },
  progressLineInactive: {
    width: 32,
    height: 2,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 20,
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
  errorBox: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    width: "100%",
  },
  errorText: {
    color: ERROR_RED,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  formGroup: {
    width: "100%",
    gap: 14,
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 74,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputCardFocused: {
    borderColor: GREEN,
    backgroundColor: "#FFFFFF",
  },
  inputIconCol: {
    marginRight: 14,
    justifyContent: "center",
  },
  inputTextCol: {
    flex: 1,
    justifyContent: "center",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: MUTED,
    marginBottom: 2,
  },
  textInput: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
    padding: 0,
    height: 24,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
  },
  countryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: "800",
    color: DARK,
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D2E8D7",
  },
  locationIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationTextCol: {
    flex: 1,
  },
  locationDeliveringLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: MUTED,
  },
  locationTitleText: {
    fontSize: 15,
    fontWeight: "800",
    color: DARK,
    marginTop: 1,
  },
  locationPinText: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "600",
    marginTop: 1,
  },
  changeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  changeBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: GREEN,
  },
  ctaFooter: {
    width: "100%",
    marginTop: 14,
  },
  primaryContinueBtn: {
    width: "100%",
    height: 56,
    backgroundColor: GREEN,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  disabledContinueBtn: {
    backgroundColor: DISABLED_GREEN,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
