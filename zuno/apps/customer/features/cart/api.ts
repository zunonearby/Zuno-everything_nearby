import { supabase } from "../../lib/supabase";
import { CartItem } from "../../store/cartStore";

export async function syncCartWithSupabase(shopId: string, items: CartItem[]): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return false;

    // Check existing active cart
    const { data: cartData } = await supabase
      .from("carts")
      .select("id")
      .eq("customer_id", userData.user.id)
      .single();

    let cartId = cartData?.id;

    if (!cartId) {
      const { data: newCart } = await supabase
        .from("carts")
        .insert({
          customer_id: userData.user.id,
          shop_id: shopId,
        })
        .select("id")
        .single();

      cartId = newCart?.id;
    }

    if (!cartId) return false;

    // Delete existing cart items and insert current items
    await supabase.from("cart_items").delete().eq("cart_id", cartId);

    if (items.length > 0) {
      const rows = items.map((item) => ({
        cart_id: cartId,
        shop_product_id: item.id,
        quantity: item.quantity,
      }));
      await supabase.from("cart_items").insert(rows);
    }

    return true;
  } catch {
    return false;
  }
}
