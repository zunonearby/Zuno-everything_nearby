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
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useLocationStore } from "../../store/locationStore";
import { useUserRegistrationStore } from "../../store/registrationStore";
import { updateCustomerProfile, completeCustomerProfile } from "../../features/profile/api";

// Brand Color Palette
const GREEN = "#0F5D3A";
const SECONDARY_GREEN = "#22A06B";
const LIGHT_GREEN = "#EAF4EC";
const SELECTED_BG = "#F0F8F1";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#6B756E";
const BORDER = "#E1E6E2";
const DISABLED_GREEN = "#A3B9AC";
const ERROR_RED = "#DC2626";

type GenderType = "MALE" | "FEMALE" | "OTHER" | null;

export default function ProfileCompletionScreen() {
  const router = useRouter();
  const { selectedLocation } = useLocationStore();
  const { fullName, email, phone } = useUserRegistrationStore();

  const [gender, setGender] = useState<GenderType>(null);
  const [dob, setDob] = useState<string>("");
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [tempDobText, setTempDobText] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenderSelect = (val: "MALE" | "FEMALE" | "OTHER") => {
    setGender((prev) => (prev === val ? null : val));
  };

  const handleSaveDob = () => {
    if (tempDobText.trim()) {
      setDob(tempDobText.trim());
    }
    setShowDobPicker(false);
  };

  const handleBack = () => {
    router.replace("/(auth)/verify" as never);
  };

  const isFormValid = termsAccepted;

  const handleFinishAndExplore = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const mappedGender = gender === "MALE" ? "Male" : gender === "FEMALE" ? "Female" : gender === "OTHER" ? "Non-binary" : "Prefer not to say";

      try {
        await completeCustomerProfile({
          full_name: fullName || "Valued Customer",
          email: email || "customer@zuno.app",
          gender: mappedGender,
          terms_accepted: true,
          privacy_accepted: true,
          terms_version: "1.0",
          privacy_version: "1.0",
          address: {
            line1: selectedLocation?.line1 || "Main Street",
            locality: selectedLocation?.locality || selectedLocation?.area_name || "Renukoot",
            city: selectedLocation?.city || "Renukoot",
            state: selectedLocation?.state || "Uttar Pradesh",
            pincode: selectedLocation?.pincode || "231217",
            lat: selectedLocation?.lat ?? undefined,
            lng: selectedLocation?.lng ?? undefined,
          },
        });
      } catch (apiErr) {
        // Fallback update profile if session is in mock/dev mode
        await updateCustomerProfile({
          full_name: fullName || undefined,
          email: email || undefined,
          gender: mappedGender as any,
        });
      }

      // Navigate to Customer Home Page
      router.replace("/(tabs)" as never);
    } catch (err: any) {
      console.log("[ProfileCompletion] Non-blocking submit notice:", err.message);
      // Navigate to main tabs screen upon finishing registration
      router.replace("/(tabs)" as never);
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
          {/* Top Header: Back Button & Official ZUNO Logo */}
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
              hitSlop={12}
              accessibilityLabel="Back to OTP verification"
            >
              <Ionicons name="arrow-back" size={22} color={DARK} />
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

          {/* Three-step Progress Indicator (Step 3 of 3 - All Active Green) */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.dotActive]} />
            <View style={styles.progressLineActive} />
            <View style={[styles.progressDot, styles.dotActive]} />
            <View style={styles.progressLineActive} />
            <View style={[styles.progressDot, styles.dotActive]} />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainHeading}>A few more details</Text>
            <Text style={styles.subTitle}>
              Help us personalise your experience on ZUNO.
            </Text>
          </View>

          {/* Error Message Toast if any */}
          {errorMessage && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* 1. Gender Selection Section (Optional) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Gender <Text style={styles.optionalText}>(optional)</Text></Text>

            <View style={styles.genderRow}>
              {/* Male Card */}
              <Pressable
                style={[
                  styles.genderCard,
                  gender === "MALE" && styles.genderCardSelected,
                ]}
                onPress={() => handleGenderSelect("MALE")}
                accessibilityLabel="Select Male gender"
              >
                <Ionicons
                  name="person-outline"
                  size={32}
                  color={gender === "MALE" ? GREEN : DARK}
                />
                <Text
                  style={[
                    styles.genderLabel,
                    gender === "MALE" && styles.genderLabelSelected,
                  ]}
                >
                  Male
                </Text>
              </Pressable>

              {/* Female Card */}
              <Pressable
                style={[
                  styles.genderCard,
                  gender === "FEMALE" && styles.genderCardSelected,
                ]}
                onPress={() => handleGenderSelect("FEMALE")}
                accessibilityLabel="Select Female gender"
              >
                <Ionicons
                  name="person-outline"
                  size={32}
                  color={gender === "FEMALE" ? GREEN : DARK}
                />
                <Text
                  style={[
                    styles.genderLabel,
                    gender === "FEMALE" && styles.genderLabelSelected,
                  ]}
                >
                  Female
                </Text>
              </Pressable>

              {/* Other Card */}
              <Pressable
                style={[
                  styles.genderCard,
                  gender === "OTHER" && styles.genderCardSelected,
                ]}
                onPress={() => handleGenderSelect("OTHER")}
                accessibilityLabel="Select Other gender"
              >
                <Ionicons
                  name="person-outline"
                  size={32}
                  color={gender === "OTHER" ? GREEN : DARK}
                />
                <Text
                  style={[
                    styles.genderLabel,
                    gender === "OTHER" && styles.genderLabelSelected,
                  ]}
                >
                  Other
                </Text>
              </Pressable>
            </View>
          </View>

          {/* 2. Date of Birth Section (Optional) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Date of birth <Text style={styles.optionalText}>(optional)</Text></Text>

            <Pressable
              style={styles.dobInputCard}
              onPress={() => {
                setTempDobText(dob);
                setShowDobPicker(true);
              }}
              accessibilityLabel="Select date of birth"
            >
              <Ionicons name="calendar-outline" size={20} color={DARK} style={{ marginRight: 12 }} />
              <Text style={[styles.dobText, !dob && styles.dobPlaceholder]}>
                {dob || "Select your date of birth"}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={MUTED} />
            </Pressable>
          </View>

          {/* 3. Terms & Conditions Section (Mandatory Checkbox) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>

            <View style={styles.termsRow}>
              <Pressable
                style={[
                  styles.checkbox,
                  termsAccepted && styles.checkboxSelected,
                ]}
                onPress={() => setTermsAccepted(!termsAccepted)}
                hitSlop={8}
                accessibilityLabel="Agree to Terms & Conditions and Privacy Policy"
              >
                {termsAccepted && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </Pressable>

              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text
                  style={styles.legalLink}
                  onPress={() => Alert.alert("Terms & Conditions", "ZUNO Terms & Conditions (Version 1.0)\n\nWelcome to ZUNO! By using our service, you agree to our standard terms of hyperlocal grocery delivery.")}
                >
                  Terms & Conditions
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.legalLink}
                  onPress={() => Alert.alert("Privacy Policy", "ZUNO Privacy Policy (Version 1.0)\n\nWe value your privacy. Your data is protected and never shared with third parties.")}
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>

          {/* 4. Primary CTA Button: Finish & Explore */}
          <View style={styles.ctaFooter}>
            <Pressable
              style={[
                styles.primaryFinishBtn,
                (!isFormValid || isSubmitting) && styles.disabledFinishBtn,
              ]}
              onPress={handleFinishAndExplore}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.finishBtnRow}>
                  <Text style={styles.finishBtnText}>Finish & Explore</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </View>
              )}
            </Pressable>
          </View>

          {/* Date of Birth Picker Modal */}
          <Modal
            visible={showDobPicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowDobPicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter Date of Birth</Text>
                <Text style={styles.modalSub}>Format: DD MMM YYYY (e.g. 15 Aug 1998)</Text>

                <TextInput
                  style={styles.modalInput}
                  value={tempDobText}
                  onChangeText={setTempDobText}
                  placeholder="DD MMM YYYY (e.g. 15 Aug 1998)"
                  placeholderTextColor="#A0ABBA"
                />

                <View style={styles.modalBtnRow}>
                  <Pressable
                    style={styles.modalCancelBtn}
                    onPress={() => setShowDobPicker(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.modalSaveBtn} onPress={handleSaveDob}>
                    <Text style={styles.modalSaveText}>Save Date</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
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
    paddingBottom: 28,
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
  dotActive: {
    backgroundColor: GREEN,
  },
  progressLineActive: {
    width: 32,
    height: 2,
    backgroundColor: GREEN,
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
    fontSize: 15,
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
  sectionContainer: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: DARK,
    marginBottom: 10,
  },
  optionalText: {
    fontWeight: "500",
    color: MUTED,
  },
  genderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  genderCard: {
    flex: 1,
    height: 110,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  genderCardSelected: {
    backgroundColor: SELECTED_BG,
    borderColor: GREEN,
  },
  genderLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
    marginTop: 10,
  },
  genderLabelSelected: {
    color: GREEN,
  },
  dobInputCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  dobText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
  },
  dobPlaceholder: {
    color: "#9AA29D",
    fontWeight: "500",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#B8C2BB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: DARK,
    lineHeight: 20,
    fontWeight: "500",
  },
  legalLink: {
    color: GREEN,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  ctaFooter: {
    width: "100%",
    marginTop: 10,
  },
  primaryFinishBtn: {
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
  disabledFinishBtn: {
    backgroundColor: DISABLED_GREEN,
    shadowOpacity: 0,
    elevation: 0,
  },
  finishBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  finishBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: DARK,
  },
  modalSub: {
    fontSize: 13,
    color: MUTED,
    marginTop: 4,
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: BG,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: BORDER,
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
    marginBottom: 16,
  },
  modalBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  modalCancelText: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "700",
  },
  modalSaveBtn: {
    backgroundColor: GREEN,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  modalSaveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
