import { supabase } from "../../lib/supabase";
import { getCurrentDeliveryPartner, saveStoredDeliveryPartner, DeliveryPartnerAccount } from "../auth/api";

export async function updateDeliveryPartnerProfile(
  updates: Partial<DeliveryPartnerAccount>
): Promise<DeliveryPartnerAccount> {
  const current = (await getCurrentDeliveryPartner()) || {
    id: "partner-demo-101",
    userId: "user-demo-101",
    fullName: "Rohit Patel",
    phone: "+91 98765 43210",
    role: "DELIVERY",
    approvalStatus: "APPROVED",
    isAvailable: true,
    vehicleType: "Honda Activa 6G",
    vehicleNumber: "UP64 AB 1234",
    rating: 4.8,
    completedDeliveries: 142,
  };

  const updated: DeliveryPartnerAccount = {
    ...current,
    ...updates,
  };

  await saveStoredDeliveryPartner(updated);

  try {
    const { error } = await supabase
      .from("delivery_partners")
      .update({
        full_name: updated.fullName,
        phone: updated.phone,
        vehicle_type: updated.vehicleType,
        vehicle_number: updated.vehicleNumber,
      })
      .eq("id", updated.id);

    if (error) {
      console.warn("[DeliveryProfile] DB update notice:", error.message);
    }
  } catch {
    // fallback
  }

  return updated;
}
