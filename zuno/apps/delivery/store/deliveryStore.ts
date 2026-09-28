import { create } from "zustand";

interface DeliveryState {
  isAvailable: boolean;
  activeDeliveryId: string | null;
  // TODO: setAvailability, setActiveDelivery actions
}

export const useDeliveryStore = create<DeliveryState>(() => ({
  isAvailable: false,
  activeDeliveryId: null,
}));
