import { create } from "zustand";

export interface SelectedLocationData {
  pincode: string;
  city: string;
  state: string;
  locality?: string;
  area_name?: string;
  lat?: number | null;
  lng?: number | null;
  line1?: string;
  line2?: string;
  source: "CURRENT_LOCATION" | "MANUAL";
  is_serviceable: boolean;
}

interface LocationStoreState {
  selectedLocation: SelectedLocationData | null;
  setSelectedLocation: (location: SelectedLocationData | null) => void;
  clearSelectedLocation: () => void;
}

export const useLocationStore = create<LocationStoreState>((set) => ({
  selectedLocation: {
    pincode: "231217",
    city: "Renukoot",
    state: "Uttar Pradesh",
    area_name: "Renukoot",
    source: "MANUAL",
    is_serviceable: true,
  },
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  clearSelectedLocation: () => set({ selectedLocation: null }),
}));
