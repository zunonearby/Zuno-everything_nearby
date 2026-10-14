import { supabase } from "../../lib/supabase";
import { CartItem } from "../../store/cartStore";
import {
  saveLocalPlacedOrder,
  CustomerOrderListItem,
} from "../orders/api";
import { OrderStatus } from "@zuno/types";

export interface CheckoutQuoteInput {
  addressId?: string;
  pincode: string;
  items: CartItem[];
  paymentMethod: "COD" | "UPI" | "ONLINE";
  couponCode?: string;
  deliveryInstructions?: string;
}

export interface CheckoutQuoteResult {
  isServiceable: boolean;
  serviceMessage?: string;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  total: number;
  items: CartItem[];
  shopId: string;
  shopName: string;
}

export interface PlaceOrderInput extends CheckoutQuoteInput {
  quote: CheckoutQuoteResult;
}

export interface PlaceOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  message?: string;
}

export async function calculateCheckoutQuote(
  input: CheckoutQuoteInput
): Promise<CheckoutQuoteResult> {
  const { pincode, items, couponCode } = input;

  const isServiceable = pincode === "231217" || pincode.length === 6;
  const serviceMessage = isServiceable
    ? "Service available in Renukoot - 231217"
    : "PIN code currently not serviceable by ZUNO";

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 20;
  const platformFee = subtotal > 0 ? 5 : 0;
  const discount = couponCode?.toUpperCase() === "ZUNO50" ? Math.min(50, subtotal * 0.1) : 0;

  const total = Math.max(0, subtotal + deliveryFee + platformFee - discount);

  const shopId = items[0]?.shopId || "shop-1";
  const shopName = items[0]?.shopName || "Eureka Fresh Mart";

  return {
    isServiceable,
    serviceMessage,
    subtotal,
    deliveryFee,
    platformFee,
    discount,
    total,
    items,
    shopId,
    shopName,
  };
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  try {
    const { data: userData } = await supabase.auth.getUser();

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ZUNO-${Math.floor(100000 + Math.random() * 900000)}`;

    let finalOrderId = orderId;

    if (userData?.user && input.addressId) {
      const { data: orderData, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_id: userData.user.id,
          shop_id: input.quote.shopId !== "shop-1" ? input.quote.shopId : "11111111-1111-1111-1111-111111111111",
          address_id: input.addressId,
          status: "PLACED",
          subtotal: input.quote.subtotal,
          delivery_fee: input.quote.deliveryFee,
          total: input.quote.total,
        })
        .select("id")
        .single();

      if (!orderErr && orderData) {
        finalOrderId = orderData.id;
        const itemRows = input.quote.items.map((item) => ({
          order_id: orderData.id,
          product_id: item.id !== "veg-1" ? item.id : "11111111-1111-1111-1111-111111111111",
          product_name_snapshot: item.name,
          unit_price_snapshot: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        }));

        await supabase.from("order_items").insert(itemRows);
      }
    }

    const itemPreview = input.quote.items
      .map((it) => `${it.name} (${it.quantity})`)
      .join(", ");

    const newOrderListItem: CustomerOrderListItem = {
      id: finalOrderId,
      orderNumber,
      shopId: input.quote.shopId,
      shopName: input.quote.shopName,
      shopDistance: "2.5 km away",
      createdAt: new Date().toISOString(),
      status: OrderStatus.PLACED,
      total: input.quote.total,
      subtotal: input.quote.subtotal,
      itemsCount: input.quote.items.reduce((sum, item) => sum + item.quantity, 0),
      itemPreview: itemPreview || "Grocery items",
      items: input.quote.items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        unit: it.unit || "1 pack",
        emoji: it.emoji,
      })),
      addressLine: "Near Railway Station, Renukoot - 231217",
    };

    await saveLocalPlacedOrder(newOrderListItem);

    return {
      success: true,
      orderId: finalOrderId,
      orderNumber,
      message: "Order placed successfully!",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to place order. Please try again.",
    };
  }
}
