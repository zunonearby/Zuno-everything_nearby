/**
 * Web-specific image source for ZUNO brand logo.
 * Returns public static asset URL (/brandlogo.png) to bypass Metro web asset registry bundle errors on web.
 */
export function getBrandLogoSource() {
  return { uri: "/brandlogo.png" };
}

export function getShopStorefrontSource() {
  return { uri: "/shop-storefront.jpg" };
}
