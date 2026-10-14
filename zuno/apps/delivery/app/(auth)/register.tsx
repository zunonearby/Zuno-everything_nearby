import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Bike, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Truck } from "lucide-react-native";
import { sendDeliveryOtp } from "@/features/auth/api";

const GREEN = "#0F5D3A";
const SECONDARY_GREEN = "#22A06B";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#6B7A70";
const BORDER = "#E2E8F0";

export default function RegisterScreen() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("231217");
  const [locality, setLocality] = useState("Renukoot Region");
  const [vehicleType, setVehicleType] = useState("Two Wheeler / Scooter");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNextStep = () => {
    if (step === 1) {
      if (fullName.trim().length < 2) {
        Alert.alert("Validation Error", "Please enter your full name.");
        return;
      }
      const cleaned = phone.replace(/\D/g, "");
      if (cleaned.length < 10) {
        Alert.alert("Validation Error", "Please enter a valid 10-digit mobile number.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (pincode !== "231217") {
        Alert.alert("Service Coverage Notice", "ZUNO delivery partner operations are currently active in PIN 231217, Renukoot.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!vehicleNumber.trim()) {
        Alert.alert("Validation Error", "Please enter your vehicle registration number.");
        return;
      }
      setStep(4);
    }
  };

  const handleSubmitApplication = async () => {
    const cleaned = phone.replace(/\D/g, "");
    setLoading(true);
    try {
      await sendDeliveryOtp(cleaned);
      router.push({
        pathname: "/(auth)/verify" as never,
        params: {
          phone: cleaned,
          fullName: fullName.trim(),
          vehicleType,
          vehicleNumber: vehicleNumber.trim().toUpperCase(),
        },
      });
    } catch (err: any) {
      Alert.alert("Registration Error", err.message || "Unable to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => (step > 1 ? setStep((prev) => (prev - 1) as any) : router.back())}
        >
          <ArrowLeft size={20} color={DARK} />
        </Pressable>
        <Text style={styles.headerTitle}>Delivery Partner Registration</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Progress Indicator */}
          <View style={styles.stepProgressRow}>
            <View style={[styles.stepPill, step >= 1 && styles.stepPillActive]}>
              <Text style={styles.stepPillText}>1. Personal</Text>
            </View>
            <View style={[styles.stepPill, step >= 2 && styles.stepPillActive]}>
              <Text style={styles.stepPillText}>2. Region</Text>
            </View>
            <View style={[styles.stepPill, step >= 3 && styles.stepPillActive]}>
              <Text style={styles.stepPillText}>3. Vehicle</Text>
            </View>
            <View style={[styles.stepPill, step >= 4 && styles.stepPillActive]}>
              <Text style={styles.stepPillText}>4. Review</Text>
            </View>
          </View>

          {step === 1 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <Text style={styles.cardSub}>Enter your basic details to get started as a ZUNO partner.</Text>

              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name as per Aadhaar / ID"
                placeholderTextColor={MUTED}
              />

              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.prefixBox}>
                  <Text style={styles.prefixText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="10-digit mobile number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor={MUTED}
                />
              </View>

              <Pressable style={styles.primaryBtn} onPress={handleNextStep}>
                <Text style={styles.primaryBtnText}>Continue to Service Region</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          )}

          {step === 2 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Service Area & Region</Text>
              <Text style={styles.cardSub}>Select the locality where you will provide delivery services.</Text>

              <Text style={styles.label}>PIN Code</Text>
              <TextInput
                style={styles.input}
                value={pincode}
                onChangeText={setPincode}
                placeholder="231217"
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor={MUTED}
              />

              <Text style={styles.label}>Preferred Region</Text>
              <TextInput
                style={styles.input}
                value={locality}
                onChangeText={setLocality}
                placeholder="Renukoot, Uttar Pradesh"
                placeholderTextColor={MUTED}
              />

              <View style={styles.infoBadge}>
                <MapPin size={16} color={GREEN} />
                <Text style={styles.infoBadgeText}>
                  Active Coverage Zone: PIN 231217, Renukoot Region
                </Text>
              </View>

              <Pressable style={styles.primaryBtn} onPress={handleNextStep}>
                <Text style={styles.primaryBtnText}>Continue to Vehicle Details</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          )}

          {step === 3 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Vehicle Details</Text>
              <Text style={styles.cardSub}>Provide vehicle details used for order deliveries.</Text>

              <Text style={styles.label}>Vehicle Type</Text>
              <View style={styles.typeSelectorRow}>
                {["Two Wheeler / Scooter", "Motorcycle / Bike", "E-Rickshaw"].map((t) => (
                  <Pressable
                    key={t}
                    style={[styles.typeOption, vehicleType === t && styles.typeOptionSelected]}
                    onPress={() => setVehicleType(t)}
                  >
                    <Text style={[styles.typeOptionText, vehicleType === t && styles.typeOptionTextSelected]}>
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.label}>Vehicle Registration Number</Text>
              <TextInput
                style={styles.input}
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
                placeholder="e.g. UP64 AB 1234"
                autoCapitalize="characters"
                placeholderTextColor={MUTED}
              />

              <Pressable style={styles.primaryBtn} onPress={handleNextStep}>
                <Text style={styles.primaryBtnText}>Review & Submit Application</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          )}

          {step === 4 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Review & Application Summary</Text>
              <Text style={styles.cardSub}>Please verify your information before submitting to Admin for approval.</Text>

              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Applicant Name:</Text>
                  <Text style={styles.summaryVal}>{fullName}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Mobile Number:</Text>
                  <Text style={styles.summaryVal}>+91 {phone}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Service Zone:</Text>
                  <Text style={styles.summaryVal}>PIN {pincode}, Renukoot</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Vehicle Info:</Text>
                  <Text style={styles.summaryVal}>{vehicleType} ({vehicleNumber})</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Initial Approval Status:</Text>
                  <Text style={[styles.summaryVal, { color: "#D97706", fontWeight: "900" }]}>
                    PENDING (Admin Verification)
                  </Text>
                </View>
              </View>

              <View style={styles.securityRow}>
                <ShieldCheck size={16} color={GREEN} />
                <Text style={styles.securityText}>
                  Your application will be verified by ZUNO Admin. Approvals default to PENDING status.
                </Text>
              </View>

              <Pressable
                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                onPress={handleSubmitApplication}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.primaryBtnText}>Submit Application via OTP</Text>
                    <CheckCircle2 size={18} color="#FFFFFF" />
                  </>
                )}
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F1",
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
    fontSize: 15,
    fontWeight: "800",
    color: DARK,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  stepProgressRow: {
    flexDirection: "row",
    gap: 6,
  },
  stepPill: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  stepPillActive: {
    backgroundColor: GREEN,
  },
  stepPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: DARK,
  },
  cardSub: {
    fontSize: 12.5,
    color: MUTED,
    lineHeight: 18,
    marginBottom: 4,
  },
  label: {
    fontSize: 12.5,
    fontWeight: "700",
    color: DARK,
    marginTop: 4,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    fontSize: 14.5,
    fontWeight: "700",
    color: DARK,
  },
  phoneInputRow: {
    flexDirection: "row",
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },
  prefixBox: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: BORDER,
  },
  prefixText: {
    fontSize: 14,
    fontWeight: "700",
    color: DARK,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
  },
  typeSelectorRow: {
    gap: 8,
  },
  typeOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  typeOptionSelected: {
    borderColor: GREEN,
    backgroundColor: LIGHT_GREEN,
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: "700",
    color: DARK,
  },
  typeOptionTextSelected: {
    color: GREEN,
    fontWeight: "900",
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: LIGHT_GREEN,
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  infoBadgeText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: GREEN,
  },
  summaryBox: {
    backgroundColor: BG,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 12,
    color: MUTED,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: "700",
    color: DARK,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  securityText: {
    fontSize: 11,
    color: MUTED,
    flex: 1,
  },
  primaryBtn: {
    backgroundColor: GREEN,
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
