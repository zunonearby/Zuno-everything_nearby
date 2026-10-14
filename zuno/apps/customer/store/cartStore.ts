import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  discountPercentage?: number;
  unit: string;
  quantity: number;
  shopId?: string;
  shopName?: string;
  shopDistance?: string;
  shopIsOpen?: boolean;
  image_url?: string | null;
  emoji?: string;
  color?: string;
}

interface CartState {
  shopId: string | null;
  items: Record<string, CartItem>;
  savedForLater: Record<string, CartItem>;
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    mrp?: number;
    discountPercentage?: number;
    unit: string;
    shopId?: string;
    shopName?: string;
    shopDistance?: string;
    shopIsOpen?: boolean;
    image_url?: string | null;
    emoji?: string;
    color?: string;
  }) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  removeItemCompletely: (productId: string) => void;
  moveToSavedForLater: (productId: string) => void;
  moveToCartFromSaved: (productId: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  getDeliveryFee: () => number;
  getPlatformFee: () => number;
  getEstimatedTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  shopId: null,
  items: {},
  savedForLater: {},

  addToCart: (product) => {
    set((state) => {
      const existing = state.items[product.id];
      const quantity = existing ? existing.quantity + 1 : 1;
      return {
        shopId: product.shopId || state.shopId || "shop-1",
        items: {
          ...state.items,
          [product.id]: {
            ...product,
            quantity,
          },
        },
      };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        const nextItems = { ...state.items };
        delete nextItems[productId];
        return { items: nextItems };
      }

      const existing = state.items[productId];
      if (!existing) return state;

      return {
        items: {
          ...state.items,
          [productId]: {
            ...existing,
            quantity,
          },
        },
      };
    });
  },

  removeFromCart: (productId) => {
    set((state) => {
      const existing = state.items[productId];
      if (!existing) return state;

      const nextItems = { ...state.items };
      if (existing.quantity <= 1) {
        delete nextItems[productId];
      } else {
        nextItems[productId] = {
          ...existing,
          quantity: existing.quantity - 1,
        };
      }

      return { items: nextItems };
    });
  },

  removeItemCompletely: (productId) => {
    set((state) => {
      const nextItems = { ...state.items };
      delete nextItems[productId];
      return { items: nextItems };
    });
  },

  moveToSavedForLater: (productId) => {
    set((state) => {
      const item = state.items[productId];
      if (!item) return state;

      const nextItems = { ...state.items };
      delete nextItems[productId];

      return {
        items: nextItems,
        savedForLater: {
          ...state.savedForLater,
          [productId]: item,
        },
      };
    });
  },

  moveToCartFromSaved: (productId) => {
    set((state) => {
      const item = state.savedForLater[productId];
      if (!item) return state;

      const nextSaved = { ...state.savedForLater };
      delete nextSaved[productId];

      return {
        savedForLater: nextSaved,
        items: {
          ...state.items,
          [productId]: item,
        },
      };
    });
  },

  clearCart: () => set({ items: {}, savedForLater: {}, shopId: null }),

  getCartCount: () => {
    const items = get().items;
    return Object.values(items).reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartTotal: () => {
    const items = get().items;
    return Object.values(items).reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getDeliveryFee: () => {
    const total = get().getCartTotal();
    if (total === 0) return 0;
    return total >= 500 ? 0 : 20;
  },

  getPlatformFee: () => {
    const total = get().getCartTotal();
    return total > 0 ? 5 : 0;
  },

  getEstimatedTotal: () => {
    const total = get().getCartTotal();
    if (total === 0) return 0;
    return total + get().getDeliveryFee() + get().getPlatformFee();
  },
}));
