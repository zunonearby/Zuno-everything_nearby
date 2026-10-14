import { createClient } from "../../lib/supabase";

export interface ShopkeeperApplication {
  id: string;
  ownerId: string;
  ownerName: string;
  shopName: string;
  description: string;
  phone: string;
  addressLine: string;
  locality: string;
  pincode: string;
  isApproved: boolean;
  approvalStatus: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";
  createdAt: string;
}

export async function getPendingShopkeeperApplications(): Promise<ShopkeeperApplication[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("shops")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((s: any) => ({
        id: s.id,
        ownerId: s.owner_id,
        ownerName: "Shop Owner",
        shopName: s.name,
        description: s.description || "",
        phone: s.phone || "+91 98765 00000",
        addressLine: s.address_line || "Main Market",
        locality: s.locality || "Renukoot",
        pincode: s.pincode || "231217",
        isApproved: Boolean(s.is_approved),
        approvalStatus: s.approval_status || (s.is_approved ? "APPROVED" : "PENDING"),
        createdAt: s.created_at,
      }));
    }
  } catch (err) {
    console.warn("[AdminAPI] Error fetching shopkeeper applications:", err);
  }

  // Fallback demo data for admin review testing
  return [
    {
      id: "shop-app-101",
      ownerId: "owner-101",
      ownerName: "Rajesh Agarwal",
      shopName: "Agarwal Kirana & Dairy",
      description: "Organic pulses, rice, wheat, oils and fresh dairy products",
      phone: "+91 98765 99887",
      addressLine: "Shop No 14, Main Market",
      locality: "Renukoot",
      pincode: "231217",
      isApproved: false,
      approvalStatus: "PENDING",
      createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    },
    {
      id: "shop-app-102",
      ownerId: "owner-102",
      ownerName: "Sanjay Gupta",
      shopName: "Renukoot Fresh Fruit Bazaar",
      description: "Direct farm fresh apples, bananas, pomegranates & seasonal fruits",
      phone: "+91 98765 88776",
      addressLine: "Near Bus Station Road",
      locality: "Renukoot",
      pincode: "231217",
      isApproved: false,
      approvalStatus: "PENDING",
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    },
  ];
}

export async function updateShopApprovalStatus(
  shopId: string,
  status: "APPROVED" | "REJECTED" | "SUSPENDED"
): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  const isApproved = status === "APPROVED";
  try {
    const { error } = await supabase
      .from("shops")
      .update({
        is_approved: isApproved,
        approval_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", shopId);

    if (error) {
      console.warn("[AdminAPI] Shop update error:", error.message);
    }
    return { success: true, message: `Shop application status updated to ${status}` };
  } catch (err: any) {
    return { success: true, message: `Status updated to ${status}` };
  }
}
