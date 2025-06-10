import { CartItem } from "./cartItem";

export interface Order {
    id?: string;
    cart: Record<string, CartItem>
  }