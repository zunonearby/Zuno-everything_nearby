import { posthog } from "@/lib/posthog";

type CartUpdate = {
  action: "added" | "removed";
  productId: string;
  cartQuantity: number;
};

type ShopOpened = {
  shopId: string;
  shopType: string;
};

export const posthogLog = {
  cartUpdated({ action, productId, cartQuantity }: CartUpdate) {
    posthog?.logger.info("cart updated", {
      event: "cart_updated",
      cart_action: action,
      product_id: productId,
      cart_quantity: cartQuantity,
    });
  },

  shopOpened({ shopId, shopType }: ShopOpened) {
    posthog?.logger.info("shop opened", {
      event: "shop_opened",
      shop_id: shopId,
      shop_type: shopType,
    });
  },
};
