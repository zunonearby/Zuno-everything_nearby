/**
 * Native-specific image source for ZUNO brand logo.
 * Uses Metro static require for iOS and Android native builds.
 */
export function getBrandLogoSource() {
  return require("../assets/brandlogo.png");
}

export function getShopStorefrontSource() {
  return require("../assets/shop-storefront.jpg");
}
