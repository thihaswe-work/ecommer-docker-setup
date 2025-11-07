export interface Address {
  id: number;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  userId: string;
}
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: number;
  // type: 'card' | 'paypal'; // e.g., "card", "paypal", etc.
  cardLast4?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: Date;
  userId: string; // if you want to reference the user's ID
}
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  password?: string;
}
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  productImage: string;
  price: number;
  order: Order;
}

export interface Order {
  id: string;
  paymentType: 'card' | 'paypal';
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddressId: number;
  paymentMethodId: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}
