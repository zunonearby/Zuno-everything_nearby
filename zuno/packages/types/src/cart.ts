export interface CartItem {
  id: string;
  cart_id: string;
  shop_product_id: string;
  quantity: number;
}

export interface Cart {
  id: string;
  customer_id: string;
  shop_id: string; // a cart is scoped to a single shop
  items: CartItem[];
}
