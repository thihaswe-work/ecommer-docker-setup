export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Payment {
  id: number;
  number: string;
  cardName: string;
  holderName: string;
  amount: number;
  paymentType: string;
}

export interface ShippingAddress {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface OrderItem {
  id: number;
  prodcutId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  contact?: Contact;
  payment?: Payment;
  shippingAddress?: ShippingAddress;
  orderItems?: OrderItem[];
}

export interface Inventory {
  id: number;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  desc: string;
  status: boolean;
  inventory?: Inventory;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod?: PaymentMethod[];
  address?: Address[];
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
export interface Setting {
  id: number;
  underMaintenance: boolean;
}
export type Role = "user" | "admin" | "merchant";
