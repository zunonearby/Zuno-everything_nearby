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
  contact: {
    phone: "8887602317",
    phoneDisplay: "+91 8887602317",
    phoneTel: "8887602317",
    phoneHours: "7:00 AM – 11:00 PM Daily",
    email: "zunonearby@gmail.com",
    emailHours: "Response within 24 business hours",
    pin: "231217",
    locality: "Renukoot Central",
  },
} as const;
