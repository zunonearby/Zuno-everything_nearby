import type { Config } from "tailwindcss";
import { brandColors } from "@zuno/config";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: brandColors,
    },
  },
} satisfies Config;
