import { posthog } from "./posthog";

export type ProductViewedProperties = {
  productId: string;
  productName: string;
  category?: string;
  price?: number;
};

export type SearchPerformedProperties = {
  query: string;
  resultsCount?: number;
};

export type AddToCartProperties = {
  productId: string;
  productName: string;
  price?: number;
  quantity: number;
};

export type CheckoutStartedProperties = {
  cartCount: number;
  cartTotal: number;
};

export type OrderPlacedProperties = {
  orderId: string;
  orderTotal: number;
  itemsCount: number;
};

export type OrderCancelledProperties = {
  orderId: string;
  reason?: string;
};

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  try {
    posthog?.capture(eventName, {
      platform: "customer_app",
      timestamp: new Date().toISOString(),
      ...properties,
    });
  } catch (err) {
    console.warn("[Analytics] Error tracking event:", err);
  }
}

export const analytics = {
  trackAppOpened() {
    trackEvent("app_opened");
  },

  trackProductViewed(props: ProductViewedProperties) {
    trackEvent("product_viewed", {
      product_id: props.productId,
      product_name: props.productName,
      category: props.category ?? "",
      price: props.price ?? 0,
    });
  },

  trackSearchPerformed(props: SearchPerformedProperties) {
    trackEvent("search_performed", {
      search_query: props.query,
      results_count: props.resultsCount ?? 0,
    });
  },

  trackAddToCart(props: AddToCartProperties) {
    trackEvent("add_to_cart", {
      product_id: props.productId,
      product_name: props.productName,
      price: props.price ?? 0,
      quantity: props.quantity,
    });
  },

  trackCheckoutStarted(props: CheckoutStartedProperties) {
    trackEvent("checkout_started", {
      cart_count: props.cartCount,
      cart_total: props.cartTotal,
    });
  },

  trackOrderPlaced(props: OrderPlacedProperties) {
    trackEvent("order_placed", {
      order_id: props.orderId,
      order_total: props.orderTotal,
      items_count: props.itemsCount,
    });
  },

  trackOrderCancelled(props: OrderCancelledProperties) {
    trackEvent("order_cancelled", {
      order_id: props.orderId,
      reason: props.reason ?? "",
    });
  },
};
