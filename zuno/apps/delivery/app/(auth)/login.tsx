import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Bike, ShieldCheck, ArrowRight } from "lucide-react-native";
import { sendDeliveryOtp } from "@/features/auth/api";
import { getBrandLogoSource } from "@/lib/assets";

const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#6B7A70";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("9876543210");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      Alert.alert("Invalid Phone", "Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      await sendDeliveryOtp(cleaned);
      router.push({
        pathname: "/(auth)/verify" as never,
        params: { phone: cleaned },
      });
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          {/* Header Brand Banner */}
          <View style={styles.brandCard}>
            <Image
              source={getBrandLogoSource()}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <View style={styles.partnerBadge}>
              <Bike size={14} color={GREEN} />
              <Text style={styles.partnerBadgeText}>Delivery Partner</Text>
            </View>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.title}>Welcome to ZUNO</Text>
            <Text style={styles.subtitle}>
              Deliver groceries & daily essentials nearby with complete flexibility.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.prefixBox}>
                <Text style={styles.prefixText}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter 10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor={MUTED}
              />
            </View>

            <Pressable
              style={[styles.continueBtn, loading && { opacity: 0.7 }]}
              onPress={handleContinue}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.continueBtnText}>Continue with OTP</Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </>
              )}
            </Pressable>

            <View style={styles.securityRow}>
              <ShieldCheck size={14} color={GREEN} />
              <Text style={styles.securityText}>
                Secured by ZUNO OTP Verification · PIN 231217
              </Text>
            </View>

            <Pressable
              style={styles.registerLinkBtn}
              onPress={() => router.push("/(auth)/register" as never)}
            >
              <Text style={styles.registerLinkText}>New Partner? Join ZUNO Delivery</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: "center",
  },
  brandCard: {
    alignItems: "center",
    marginBottom: 24,
  },
  brandLogo: {
    width: 140,
    height: 40,
    marginBottom: 10,
  },
  partnerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GREEN,
  },
  partnerBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: GREEN,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: DARK,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13.5,
    color: MUTED,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EAEFEA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: DARK,
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 16,
  },
  prefixBox: {
    backgroundColor: "#F1F5F9",
    height: "100%",
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#CBD5E1",
  },
  prefixText: {
    fontSize: 14,
    fontWeight: "700",
    color: DARK,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "700",
    color: DARK,
  },
  continueBtn: {
    backgroundColor: GREEN,
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  securityText: {
    fontSize: 11,
    color: MUTED,
  },
  registerLinkBtn: {
    marginTop: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: LIGHT_GREEN,
  },
  registerLinkText: {
    fontSize: 12.5,
    fontWeight: "800",
    color: GREEN,
  },
});
