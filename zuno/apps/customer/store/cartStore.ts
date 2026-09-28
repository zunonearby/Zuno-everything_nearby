import { create } from "zustand";

interface CartState {
  shopId: string | null;
  itemsByShopProductId: Record<string, number>;
  // TODO: add/remove/clear actions once checkout flow is implemented
}

export const useCartStore = create<CartState>(() => ({
  shopId: null,
  itemsByShopProductId: {},
}));
