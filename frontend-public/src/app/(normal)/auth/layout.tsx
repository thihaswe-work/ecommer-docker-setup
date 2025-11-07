"use client";
import React, { ReactElement, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const AuthLayout = ({ children }: { children: ReactElement }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);
  return <div>{children}</div>;
};

export default AuthLayout;
