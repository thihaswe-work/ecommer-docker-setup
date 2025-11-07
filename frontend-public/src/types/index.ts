export interface Category {
  id: number;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventory {
  id: number;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface Product {
  id: number;
  name: string;
  image: string;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
  inventory: Inventory;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface Payment {
  id: number;
  number?: string;
  cardName?: string;
  holderName?: string;
  amount?: string;
  paymentType: "card" | "paypal" | "onDelivery";
}

export interface Order {
  id: string;
  userId: string;
  orderItems: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentType: "card" | "paypal";
  shippingAddress: Address;
  payment: Payment;
  shippingAddressId: number;
  paymentMethodId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: number;
  type: "card";
  cardName: string;
  number: string;
  numberLast4?: string;
  holderName?: string;
  userId: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: number;
  addressName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
