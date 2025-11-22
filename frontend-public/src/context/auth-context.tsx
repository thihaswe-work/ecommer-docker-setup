"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    remember: boolean
  ) => Promise<boolean>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updatePassword: ({
    newPassword,
    currentPassword,
  }: {
    newPassword: string;
    currentPassword: string;
  }) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const fetchIsLogin = async () => {
      return isLogin();
    };

    fetchIsLogin();
    // setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [user]);

  const login = async (
    email: string,
    password: string,
    remember: boolean
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, remember }),
          credentials: "include",
        }
      );
      if (!res.ok) return false;
      const data = await res.json();
      setUser(data.user);
      return true;
    } catch (err: any) {
      console.log(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) return false;
      const data = await res.json();
      setUser(data.user);
      return true;
    } catch (err: any) {
      console.log(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ firstName, lastName, email, password }),
        }
      );

      if (!res.ok) return false;

      const data = await res.json();

      console.log("register response", register);
      if (data?.user) {
        setUser(data.user);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Registration failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) return false;
      setUser(null);
      return true;
    } catch (err: any) {
      console.log(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
    } catch (err: any) {
      console.error("Error updating user:", err.message);
    }
  };

  const updatePassword = async ({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }): Promise<boolean> => {
    if (newPassword === currentPassword) {
      console.warn("New password must be different from current password");
      return false;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/me/password`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update password");
      }

      return true;
    } catch (err: any) {
      console.error("Error updating password:", err.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        isLoading,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
