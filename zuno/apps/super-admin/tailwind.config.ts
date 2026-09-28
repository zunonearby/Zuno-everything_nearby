import type { Config } from "tailwindcss";
import { brandColors } from "@zuno/config";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: brandColors,
    },
  },
} satisfies Config;
