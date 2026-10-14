/**
 * Canonical event names. Add new events here first, then reference the
 * constant — never inline a raw string event name in a screen/page.
 */
export const AnalyticsEvent = {
  APP_OPENED: "app_opened",
  ONBOARDING_STARTED: "onboarding_started",
  ONBOARDING_COMPLETED: "onboarding_completed",
  LOCATION_SELECTION_COMPLETED: "location_selection_completed",
  REGISTRATION_STARTED: "registration_started",
  OTP_REQUESTED: "otp_requested",
  OTP_VERIFICATION_SUCCEEDED: "otp_verification_succeeded",
  PROFILE_COMPLETED: "profile_completed",
  SEARCH_PERFORMED: "search_performed",
  SHOP_VIEWED: "shop_viewed",
  PRODUCT_VIEWED: "product_viewed",
  PRODUCT_ADDED_TO_CART: "product_added_to_cart",
  CART_VIEWED: "cart_viewed",
  CHECKOUT_STARTED: "checkout_started",
  ORDER_CREATED: "order_created",
  ORDER_COMPLETED: "order_completed",
  ORDER_CANCELLED: "order_cancelled",
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];
