"use client";

import { Address, Order, PaymentMethod } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { apiFetch } from "@/lib/utils";

interface ProfileContextType {
  addresses: Address[];
  defaultAddress: Address | undefined;
  defaultPaymentMethod: PaymentMethod | undefined;
  paymentMethods: PaymentMethod[];
  orders: Order[];
  refreshProfile: () => Promise<void>;
  createAddress: (data: Partial<Address>) => Promise<Address>;
  updateAddress: (id: number, data: Partial<Address>) => Promise<Address>;
  deleteAddress: (id: number) => Promise<void>;
  createPaymentMethod: (data: Partial<PaymentMethod>) => Promise<PaymentMethod>;
  updatePaymentMethod: (
    id: number,
    data: Partial<PaymentMethod>
  ) => Promise<PaymentMethod>;
  deletePaymentMethod: (id: number) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | undefined>(
    undefined
  );
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<
    PaymentMethod | undefined
  >(undefined);

  const fetchProfile = async () => {
    const data = await apiFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`);
    setAddresses(data.addresses);
    setPaymentMethods(data.paymentMethods);
    setOrders(data.orders);
  };

  useEffect(() => {
    if (!user) return;

    fetchProfile();
  }, [user]);

  useEffect(() => {
    setDefaultAddress(addresses.find((item) => item.isDefault));
    setDefaultPaymentMethod(paymentMethods.find((item) => item.isDefault));
  }, [addresses, paymentMethods]);

  const createAddress = async (data: Partial<Address>) => {
    const newAddress = await apiFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/me/addresses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // <-- important
        },
        body: JSON.stringify(data),
      }
    );
    setAddresses((prev) => [...prev, newAddress]);
    return newAddress;
  };

  const updateAddress = async (id: number, data: Partial<Address>) => {
    const updated = await apiFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/me/addresses/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // <-- important
        },
        body: JSON.stringify(data),
      }
    );
    setAddresses((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  };

  const deleteAddress = async (id: number) => {
    await apiFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/me/addresses/${id}`,
      {
        method: "DELETE",
      }
    );
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const createPaymentMethod = async (data: Partial<PaymentMethod>) => {
    const newPM = await apiFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/me/payment-methods`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // <-- important
        },
        body: JSON.stringify(data),
      }
    );
    setPaymentMethods((prev) => [...prev, newPM]);
    return newPM;
  };

  const updatePaymentMethod = async (
    id: number,
    data: Partial<PaymentMethod>
  ) => {
    const updated = await apiFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/me/payment-methods/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // <-- important
        },
        body: JSON.stringify(data),
      }
    );
    setPaymentMethods((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deletePaymentMethod = async (id: number) => {
    await apiFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/me/payment-methods/${id}`,
      {
        method: "DELETE",
      }
    );
    setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProfileContext.Provider
      value={{
        defaultPaymentMethod,
        defaultAddress,
        addresses,
        paymentMethods,
        orders,
        refreshProfile: fetchProfile,
        createAddress,
        updateAddress,
        deleteAddress,
        createPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("useProfile must be used within ProfileProvider");
  return context;
};
