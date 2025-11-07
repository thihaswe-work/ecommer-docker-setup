import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  const data = await res.json().catch(() => null);

  if (res.status === 401 && data?.error === "TokenExpired") {
    console.warn("Token expired, calling /me...");

    const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`, {
      credentials: "include",
    });

    if (!meRes.ok) {
      throw new Error("Session refresh failed");
    }

    const meData = await meRes.json();
    // console.log("Refreshed user:", meData);

    // now retry original request
    const retryRes = await fetch(url, {
      ...options,
      credentials: "include",
    });

    return await retryRes.json();
  }

  return data;
}
