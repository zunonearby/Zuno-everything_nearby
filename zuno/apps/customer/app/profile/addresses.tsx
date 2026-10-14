import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Plus,
  MapPin,
  Home,
  Briefcase,
  Trash2,
  Edit2,
  Check,
  X,
  Building,
} from "lucide-react-native";
import {
  getCustomerAddresses,
  saveCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultAddress,
} from "@/features/location/api";
import type { Address } from "@zuno/types";

const GREEN = "#0F5D3A";
const LIGHT_GREEN = "#EAF4E5";
const BG = "#F8FAF6";
const DARK = "#17231D";
const MUTED = "#718078";

export default function SavedAddressesScreen() {
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [label, setLabel] = useState<"Home" | "Work" | "Other">("Home");
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [pincode, setPincode] = useState("231217");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    setLoading(true);
    try {
      const data = await getCustomerAddresses();
      setAddresses(data);
    } catch (err) {
      console.error("[SavedAddresses] Error loading addresses:", err);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingAddress(null);
    setLabel("Home");
    setRecipientName("");
    setPhone("");
    setLine1("");
    setLine2("");
    setPincode("231217");
    setIsDefault(addresses.length === 0);
    setModalVisible(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setLabel((addr.label as any) || "Home");
    setRecipientName(addr.recipient_name || "");
    setPhone(addr.phone_number || "");
    setLine1(addr.line1 || "");
    setLine2(addr.line2 || "");
    setPincode(addr.pincode || "231217");
    setIsDefault(addr.is_default || false);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!line1.trim()) {
      Alert.alert("Validation Error", "Please enter Address Line 1.");
      return;
    }
    if (!pincode.trim() || pincode.trim().length !== 6) {
      Alert.alert("Validation Error", "Please enter a valid 6-digit PIN code.");
      return;
    }

    setSaving(true);
    try {
      if (editingAddress) {
        await updateCustomerAddress(editingAddress.id, {
          label,
          recipient_name: recipientName.trim() || undefined,
          phone_number: phone.trim() || undefined,
          line1: line1.trim(),
          line2: line2.trim() || undefined,
          pincode: pincode.trim(),
          is_default: isDefault,
        });
        if (isDefault) {
          await setDefaultAddress(editingAddress.id);
        }
      } else {
        await saveCustomerAddress({
          label,
          recipient_name: recipientName.trim() || undefined,
          phone_number: phone.trim() || undefined,
          line1: line1.trim(),
          line2: line2.trim() || undefined,
          locality: "Renukoot",
          city: "Renukoot",
          state: "Uttar Pradesh",
          pincode: pincode.trim(),
          country_code: "IN",
          is_default: isDefault,
        });
      }

      setModalVisible(false);
      await loadAddresses();
    } catch (err: any) {
      Alert.alert("Save Error", err.message || "Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (addrId: string) => {
    try {
      await setDefaultAddress(addrId);
      await loadAddresses();
    } catch (err) {
      Alert.alert("Error", "Could not set address as default.");
    }
  };

  const handleDelete = (addr: Address) => {
    Alert.alert(
      "Delete Address",
      `Are you sure you want to remove "${addr.label} - ${addr.line1}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCustomerAddress(addr.id);
              await loadAddresses();
            } catch {
              Alert.alert("Error", "Could not delete address.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push("/(tabs)/profile" as never);
              }
            }}
          >
            <ArrowLeft size={20} color={DARK} />
          </Pressable>
          <Text style={styles.headerTitle}>Saved Addresses</Text>
          <Pressable style={styles.addHeaderBtn} onPress={openAddModal}>
            <Plus size={16} color={GREEN} />
            <Text style={styles.addHeaderBtnText}>Add New</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={GREEN} />
            <Text style={styles.loadingText}>Fetching saved addresses...</Text>
          </View>
        ) : addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <MapPin size={32} color={GREEN} />
            </View>
            <Text style={styles.emptyTitle}>No Saved Addresses Yet</Text>
            <Text style={styles.emptySub}>
              Save your delivery address for faster checkout on ZUNO.
            </Text>
            <Pressable style={styles.addFirstBtn} onPress={openAddModal}>
              <Plus size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.addFirstBtnText}>Add Delivery Address</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {addresses.map((addr) => {
              const isHome = addr.label.toLowerCase() === "home";
              const isWork = addr.label.toLowerCase() === "work";

              return (
                <View
                  key={addr.id}
                  style={[styles.addressCard, addr.is_default && styles.defaultCard]}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.labelGroup}>
                      {isHome ? (
                        <Home size={16} color={GREEN} />
                      ) : isWork ? (
                        <Briefcase size={16} color={GREEN} />
                      ) : (
                        <Building size={16} color={GREEN} />
                      )}
                      <Text style={styles.labelTitle}>{addr.label}</Text>

                      {addr.is_default && (
                        <View style={styles.defaultTag}>
                          <Text style={styles.defaultTagText}>Default</Text>
                        </View>
                      )}
                    </View>

                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <Pressable
                        style={styles.cardIconBtn}
                        onPress={() => openEditModal(addr)}
                      >
                        <Edit2 size={16} color={DARK} />
                      </Pressable>
                      <Pressable
                        style={styles.cardIconBtn}
                        onPress={() => handleDelete(addr)}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </Pressable>
                    </View>
                  </View>

                  {addr.recipient_name && (
                    <Text style={styles.recipientName}>{addr.recipient_name}</Text>
                  )}
                  <Text style={styles.addressText}>
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""}
                  </Text>
                  <Text style={styles.addressMeta}>
                    Renukoot - {addr.pincode}
                    {addr.phone_number ? ` · ${addr.phone_number}` : ""}
                  </Text>

                  {!addr.is_default && (
                    <Pressable
                      style={styles.setDefaultBtn}
                      onPress={() => handleSetDefault(addr.id)}
                    >
                      <Check size={14} color={GREEN} style={{ marginRight: 4 }} />
                      <Text style={styles.setDefaultText}>Set as Default</Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Add/Edit Modal Sheet */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingAddress ? "Edit Address" : "Add Delivery Address"}
                </Text>
                <Pressable onPress={() => setModalVisible(false)}>
                  <X size={20} color={DARK} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Address Label Chips */}
                <Text style={styles.inputLabel}>Save Address As</Text>
                <View style={styles.chipRow}>
                  {(["Home", "Work", "Other"] as const).map((item) => {
                    const sel = label === item;
                    return (
                      <Pressable
                        key={item}
                        style={[styles.chip, sel && styles.chipSelected]}
                        onPress={() => setLabel(item)}
                      >
                        <Text style={[styles.chipText, sel && styles.chipTextSelected]}>
                          {item}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Recipient Name */}
                <Text style={styles.inputLabel}>Recipient Name (Optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={recipientName}
                  onChangeText={setRecipientName}
                  placeholder="e.g. John Doe"
                  placeholderTextColor={MUTED}
                />

                {/* Phone */}
                <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+91 98765 43210"
                  keyboardType="phone-pad"
                  placeholderTextColor={MUTED}
                />

                {/* Address Line 1 */}
                <Text style={styles.inputLabel}>Address Line 1 *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={line1}
                  onChangeText={setLine1}
                  placeholder="House/Flat No., Building Name, Street"
                  placeholderTextColor={MUTED}
                />

                {/* Address Line 2 */}
                <Text style={styles.inputLabel}>Address Line 2 (Landmark)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={line2}
                  onChangeText={setLine2}
                  placeholder="Near Railway Station, Colony, Landmark"
                  placeholderTextColor={MUTED}
                />

                {/* PIN Code */}
                <Text style={styles.inputLabel}>PIN Code *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={pincode}
                  onChangeText={setPincode}
                  placeholder="231217"
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor={MUTED}
                />
                <Text style={styles.pincodeHelper}>
                  ZUNO active launch area: 231217, Renukoot, Uttar Pradesh
                </Text>

                {/* Set as Default Switch */}
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Set as Default Delivery Address</Text>
                  <Switch
                    value={isDefault}
                    onValueChange={setIsDefault}
                    trackColor={{ false: "#CBD5E1", true: LIGHT_GREEN }}
                    thumbColor={isDefault ? GREEN : "#F8FAFC"}
                  />
                </View>
              </ScrollView>

              <Pressable
                style={[styles.saveModalBtn, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveModalBtnText}>
                    {editingAddress ? "Update Address" : "Save Address"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </Modal>
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
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
    color: MUTED,
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: DARK,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
  },
  addHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: LIGHT_GREEN,
  },
  addHeaderBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: GREEN,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: DARK,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: MUTED,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  addFirstBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 23,
    backgroundColor: GREEN,
  },
  addFirstBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  addressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  defaultCard: {
    borderColor: GREEN,
    backgroundColor: "#F4FAF0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  labelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
  },
  defaultTag: {
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  defaultTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: GREEN,
  },
  cardIconBtn: {
    padding: 4,
  },
  recipientName: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: DARK,
    lineHeight: 18,
  },
  addressMeta: {
    fontSize: 13,
    color: MUTED,
    marginTop: 4,
  },
  setDefaultBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  setDefaultText: {
    fontSize: 13,
    fontWeight: "600",
    color: GREEN,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: DARK,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: DARK,
    marginBottom: 6,
    marginTop: 10,
  },
  chipRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 6,
  },
  chip: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: {
    borderColor: GREEN,
    backgroundColor: LIGHT_GREEN,
  },
  chipText: {
    fontSize: 13,
    color: DARK,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: GREEN,
    fontWeight: "700",
  },
  modalInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    fontSize: 14,
    color: DARK,
  },
  pincodeHelper: {
    fontSize: 11,
    color: GREEN,
    marginTop: 4,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: DARK,
  },
  saveModalBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  saveModalBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
