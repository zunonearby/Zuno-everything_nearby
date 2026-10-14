import React, { useState, useEffect, useRef } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useLocationStore } from "../../store/locationStore";
import { useUserRegistrationStore } from "../../store/registrationStore";
import { requestPhoneOtp, verifyPhoneOtp } from "../../features/auth/api";

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

export default function VerifyScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ phone?: string; email?: string; fullName?: string }>();

  const { selectedLocation } = useLocationStore();
  const { phone: storePhone, fullName: storeName, email: storeEmail } = useUserRegistrationStore();

  const activePhone = searchParams.phone || storePhone || "9876543210";
  const displayPhone = activePhone.length === 10
    ? `+91 ${activePhone.slice(0, 5)} ${activePhone.slice(5)}`
    : `+91 ${activePhone}`;

  // 6 OTP Box inputs state
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSentNotice, setOtpSentNotice] = useState(false);

  // 30-Second Countdown Timer State
  const [resendSeconds, setResendSeconds] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendSeconds > 0) {
      timer = setInterval(() => {
        setResendSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (text: string, index: number) => {
    setOtpError(null);
    const cleanText = text.replace(/\D/g, "");

    // Handle 6-digit paste
    if (cleanText.length === 6) {
      const newOtp = cleanText.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      return;
    }

    const lastChar = cleanText.slice(-1);
    const updated = [...otp];
    updated[index] = lastChar;
    setOtp(updated);

    // Auto-advance focus to next input
    if (lastChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const updated = [...otp];
        updated[index - 1] = "";
        setOtp(updated);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleEditPhone = () => {
    router.replace("/(auth)/login" as never);
  };

  const handleResend = async () => {
    if (resendSeconds > 0 || isResending) return;

    setIsResending(true);
    setOtpError(null);

    try {
      const res = await requestPhoneOtp(activePhone);
      if (res.success) {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setResendSeconds(30);
        setOtpSentNotice(true);
        setTimeout(() => setOtpSentNotice(false), 4000);
      }
    } catch (err: any) {
      setOtpError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const fullOtpCode = otp.join("");
  const isOtpComplete = fullOtpCode.length === 6;

  const handleVerify = async () => {
    if (!isOtpComplete || isVerifying) return;

    setIsVerifying(true);
    setOtpError(null);

    try {
      const res = await verifyPhoneOtp(activePhone, fullOtpCode);

      if (res.success) {
        // Navigate to Profile Completion screen upon successful verification
        router.replace("/profile-completion" as never);
      }
    } catch (err: any) {
      console.error("[VerifyScreen] Verification error:", err.message);
      setOtpError(err.message || "Invalid or expired OTP code. Please try again.");
    } finally {
      setIsVerifying(false);
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
              onPress={handleEditPhone}
              hitSlop={12}
              accessibilityLabel="Back to registration details"
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

          {/* Three-step Progress Indicator (Step 2 of 3) */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.dotCompleted]} />
            <View style={styles.progressLineActive} />
            <View style={[styles.progressDot, styles.dotActive]} />
            <View style={styles.progressLineInactive} />
            <View style={[styles.progressDot, styles.dotInactive]} />
          </View>

          {/* Main Heading & Phone Info */}
          <View style={styles.titleSection}>
            <Text style={styles.mainHeading}>Verify your{"\n"}phone number</Text>

            <View style={styles.phoneSubContainer}>
              <Text style={styles.subTitle}>We've sent a 6-digit OTP to</Text>
              <View style={styles.phoneEditRow}>
                <Text style={styles.phoneNumberText}>{displayPhone}</Text>
                <Pressable onPress={handleEditPhone} hitSlop={8} style={{ marginLeft: 8 }}>
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Error Banner if validation fails */}
          {otpError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{otpError}</Text>
            </View>
          )}

          {/* 6 OTP Separate Input Boxes */}
          <View style={styles.otpGridRow}>
            {otp.map((digit, index) => {
              const isFocused = inputRefs.current[index]?.isFocused();
              return (
                <View
                  key={index}
                  style={[
                    styles.otpBoxContainer,
                    digit !== "" && styles.otpBoxFilled,
                    isFocused && styles.otpBoxFocused,
                    Boolean(otpError) && styles.otpBoxError,
                  ]}
                >
                  <TextInput
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.otpTextInput}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={6}
                    selectTextOnFocus
                    accessibilityLabel={`OTP digit ${index + 1}`}
                  />
                </View>
              );
            })}
          </View>

          <Text style={styles.otpInstructionText}>Enter the 6-digit code</Text>

          {/* Countdown / SMS Info Card */}
          {otpSentNotice ? (
            <View style={styles.infoCardSuccess}>
              <View style={styles.infoIconCircleSuccess}>
                <Ionicons name="checkmark-circle" size={22} color={GREEN} />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoTitleSuccess}>Code sent!</Text>
                <Text style={styles.infoSubSuccess}>Please check your SMS</Text>
              </View>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="chatbox-ellipses-outline" size={22} color={GREEN} />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoTitle}>Didn't receive the code?</Text>
                <Text style={styles.infoSub}>
                  You can request a new one in{" "}
                  <Text style={styles.timerText}>{formatTimer(resendSeconds)}</Text>
                </Text>
              </View>
            </View>
          )}

          {/* Primary CTA: Verify & Continue Button */}
          <View style={styles.ctaFooter}>
            <Pressable
              style={[
                styles.primaryVerifyBtn,
                (!isOtpComplete || isVerifying) && styles.disabledVerifyBtn,
              ]}
              onPress={handleVerify}
              disabled={!isOtpComplete || isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.verifyBtnRow}>
                  <Text style={styles.verifyBtnText}>Verify & Continue</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </View>
              )}
            </Pressable>

            {/* Resend OTP Link */}
            <Pressable
              style={styles.resendLinkBtn}
              onPress={handleResend}
              disabled={resendSeconds > 0 || isResending}
            >
              {isResending ? (
                <ActivityIndicator color={GREEN} size="small" />
              ) : resendSeconds > 0 ? (
                <Text style={styles.resendDisabledText}>
                  Resend OTP ({formatTimer(resendSeconds)})
                </Text>
              ) : (
                <Text style={styles.resendActiveText}>Resend OTP</Text>
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
    backgroundColor: "#D9DEDA",
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
  phoneSubContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  subTitle: {
    fontSize: 15,
    color: MUTED,
    textAlign: "center",
    fontWeight: "500",
  },
  phoneEditRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  phoneNumberText: {
    fontSize: 18,
    fontWeight: "800",
    color: DARK,
  },
  editText: {
    fontSize: 15,
    fontWeight: "800",
    color: GREEN,
    textDecorationLine: "underline",
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
  otpGridRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  otpBoxContainer: {
    width: 50,
    height: 62,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#A7D56B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  otpBoxFilled: {
    borderColor: GREEN,
    backgroundColor: "#FFFFFF",
  },
  otpBoxFocused: {
    borderWidth: 2,
    borderColor: GREEN,
  },
  otpBoxError: {
    borderColor: ERROR_RED,
  },
  otpTextInput: {
    fontSize: 24,
    fontWeight: "800",
    color: DARK,
    textAlign: "center",
    width: "100%",
    height: "100%",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  otpInstructionText: {
    fontSize: 14,
    color: MUTED,
    textAlign: "center",
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 18,
    padding: 16,
    width: "100%",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#D2E8D7",
  },
  infoCardSuccess: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    borderRadius: 18,
    padding: 16,
    width: "100%",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#86EFAC",
  },
  infoIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  infoIconCircleSuccess: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  infoTextCol: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: DARK,
  },
  infoSub: {
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
    fontWeight: "500",
  },
  timerText: {
    color: GREEN,
    fontWeight: "800",
  },
  infoTitleSuccess: {
    fontSize: 14,
    fontWeight: "800",
    color: GREEN,
  },
  infoSubSuccess: {
    fontSize: 13,
    color: SECONDARY_GREEN,
    marginTop: 2,
    fontWeight: "600",
  },
  ctaFooter: {
    width: "100%",
    alignItems: "center",
  },
  primaryVerifyBtn: {
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
  disabledVerifyBtn: {
    backgroundColor: DISABLED_GREEN,
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  verifyBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  resendLinkBtn: {
    marginTop: 16,
    paddingVertical: 8,
  },
  resendActiveText: {
    fontSize: 15,
    fontWeight: "800",
    color: GREEN,
    textDecorationLine: "underline",
  },
  resendDisabledText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#9AA29D",
    textDecorationLine: "underline",
  },
});
