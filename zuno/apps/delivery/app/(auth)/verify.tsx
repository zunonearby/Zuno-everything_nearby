import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react-native";
import { verifyDeliveryOtp, DeliveryPartnerAccount } from "@/features/auth/api";

const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#6B7A70";

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = params.phone || "9876543210";

  const [otp, setOtp] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [partnerState, setPartnerState] = useState<DeliveryPartnerAccount | null>(null);

  const handleVerify = async () => {
    if (otp.length < 4) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const partner = await verifyDeliveryOtp(phone, otp);
      setPartnerState(partner);

      if (partner.approvalStatus === "APPROVED") {
        router.replace("/(tabs)" as never);
      }
    } catch (err: any) {
      Alert.alert("Verification Failed", err.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  if (partnerState && partnerState.approvalStatus === "PENDING") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.pendingContainer}>
          <View style={styles.pendingIconCircle}>
            <ShieldAlert size={42} color="#D97706" />
          </View>
          <Text style={styles.pendingTitle}>Account Under Review</Text>
          <Text style={styles.pendingSub}>
            Hello {partnerState.fullName}, your ZUNO delivery partner registration has been submitted and is currently being verified by the admin team.
          </Text>
          <View style={styles.statusBox}>
            <Text style={styles.statusBoxLabel}>Current Status:</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>PENDING APPROVAL</Text>
            </View>
          </View>
          <Text style={styles.noticeText}>
            You will be notified once your profile and vehicle verification are complete (Renukoot Region).
          </Text>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.replace("/(auth)/login" as never)}
          >
            <Text style={styles.backBtnText}>Back to Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.iconBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={DARK} />
          </Pressable>
          <Text style={styles.headerTitle}>OTP Verification</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            Code sent to <Text style={{ fontWeight: "800", color: DARK }}>+91 {phone}</Text>
          </Text>

          <View style={styles.otpContainer}>
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <Pressable
            style={[styles.verifyBtn, loading && { opacity: 0.7 }]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.verifyBtnText}>Verify & Proceed</Text>
            )}
          </Pressable>

          <Pressable style={styles.resendBtn} onPress={() => Alert.alert("Resent", "A new OTP code has been sent to your phone.")}>
            <Text style={styles.resendText}>Resend OTP Code</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEFEA",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: DARK,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13.5,
    color: MUTED,
    marginBottom: 24,
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpInput: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: GREEN,
    backgroundColor: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    color: DARK,
    letterSpacing: 8,
  },
  verifyBtn: {
    backgroundColor: GREEN,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  verifyBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  resendBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  resendText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "700",
  },
  pendingContainer: {
    flex: 1,
    backgroundColor: BG,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  pendingIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  pendingTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: DARK,
    marginBottom: 10,
  },
  pendingSub: {
    fontSize: 13.5,
    color: MUTED,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FEF3C7",
    marginBottom: 20,
  },
  statusBoxLabel: {
    fontSize: 12.5,
    fontWeight: "700",
    color: DARK,
  },
  statusPill: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusPillText: {
    color: "#D97706",
    fontSize: 11,
    fontWeight: "900",
  },
  noticeText: {
    fontSize: 12,
    color: MUTED,
    textAlign: "center",
    marginBottom: 30,
  },
  backBtn: {
    backgroundColor: GREEN,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "800",
  },
});
