// @ts-nocheck
import { apiClient } from "@/api/client";
import type { User } from "@/types/type";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  setUser: (user: any) => void;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  login: async (email, password, remember = false) => {
    try {
      const res = await apiClient.post("/auth/login", {
        email,
        password,
        remember,
      });
      if (res.data.user.role !== "admin") {
        await apiClient.post("/auth/logout");
        throw new Error("Unauthorized User");
      }

      set({ user: res.data.user });
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err: any) {
      if (err.message === "Unauthorized User")
        throw new Error("Unauthorized User");

      throw new Error(err.response?.data?.message || "Login failed");
    }
  },

  logout: async () => {
    const currentUser = useAuthStore.getState().user;
    try {
      await apiClient.post("/auth/logout", { userRole: currentUser?.role }); // clear cookie on backend
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      set({ user: null });
      localStorage.removeItem("user");
    }
  },

  register: async (email, password, confirmPassword) => {
    try {
      const res = await apiClient.post("/auth/register", {
        email,
        password,
        confirmPassword,
      });
      set({ user: res.data.user });
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Register failed");
    }
  },
  resetPassword: async (email) => {
    try {
      const res = await apiClient.post("/auth/reset-password", { email });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Password Reset failed");
    }
  },
}));
