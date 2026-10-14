// Centralized ZUNO product image mapping for local static assets
export const PRODUCT_IMAGE_MAP: Record<string, any> = {
  "veg-1": require("./products/tomato.jpg"),
  "veg-2": require("./products/onion.jpg"),
  "veg-3": require("./products/potato.jpg"),
  "veg-4": require("./products/chilli.jpg"),
  "veg-5": require("./products/spinach.jpg"),
  "veg-6": require("./products/cauliflower.jpg"),
  "fruit-1": require("./products/banana.jpg"),
  "fruit-2": require("./products/apple.jpg"),
  "groc-1": require("./products/rice.jpg"),
  "groc-2": require("./products/dal.jpg"),
  "dairy-1": require("./products/milk.jpg"),
  "dairy-2": require("./products/paneer.jpg"),
  "snack-1": require("./products/chips.jpg"),
};

export function getProductImageSource(product: { id?: string; name?: string; image_url?: string | null }) {
  if (product.image_url) {
    return { uri: product.image_url };
  }
  if (product.id && PRODUCT_IMAGE_MAP[product.id]) {
    return PRODUCT_IMAGE_MAP[product.id];
  }
  // Fallback by product name match
  const nameLower = (product.name || "").toLowerCase();
  if (nameLower.includes("tomato")) return PRODUCT_IMAGE_MAP["veg-1"];
  if (nameLower.includes("onion")) return PRODUCT_IMAGE_MAP["veg-2"];
  if (nameLower.includes("potato") && !nameLower.includes("chip")) return PRODUCT_IMAGE_MAP["veg-3"];
  if (nameLower.includes("chilli")) return PRODUCT_IMAGE_MAP["veg-4"];
  if (nameLower.includes("spinach") || nameLower.includes("palak")) return PRODUCT_IMAGE_MAP["veg-5"];
  if (nameLower.includes("cauliflower") || nameLower.includes("gobi")) return PRODUCT_IMAGE_MAP["veg-6"];
  if (nameLower.includes("banana")) return PRODUCT_IMAGE_MAP["fruit-1"];
  if (nameLower.includes("apple")) return PRODUCT_IMAGE_MAP["fruit-2"];
  if (nameLower.includes("rice") || nameLower.includes("basmati")) return PRODUCT_IMAGE_MAP["groc-1"];
  if (nameLower.includes("dal") || nameLower.includes("toor") || nameLower.includes("arhar")) return PRODUCT_IMAGE_MAP["groc-2"];
  if (nameLower.includes("milk")) return PRODUCT_IMAGE_MAP["dairy-1"];
  if (nameLower.includes("paneer")) return PRODUCT_IMAGE_MAP["dairy-2"];
  if (nameLower.includes("chip")) return PRODUCT_IMAGE_MAP["snack-1"];

  return null;
}
