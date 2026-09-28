/**
 * ZUNO brand tokens. Keep the primary identity to Deep Green + Warm Off-White.
 * Category accents (src/categoryColors.ts) are secondary and used sparingly —
 * do not turn the UI into a rainbow.
 */
export const brandColors = {
  primary: "#0F5D3A",
  secondary: "#22A06B",
  accent: "#A7D56B",
  background: "#F8FAF6",
  surface: "#FFFFFF",
  text: "#17231D",
} as const;

export const brand = {
  name: "ZUNO",
  tagline: "Everything nearby.",
  colors: brandColors,
} as const;
