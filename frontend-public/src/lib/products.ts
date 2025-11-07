"use server";

import type { Product } from "@/types";
import { apiFetch } from "./utils";
import { cookies, headers } from "next/headers";

// Simulate API calls with delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export async function getAllProducts({
  query = "",
  min = "",
  max = "",
  order = "ASC",
  page = 1,
  limit = 12,
  category = [], // default as empty array
}: {
  query?: string;
  min?: string;
  max?: string;
  order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
  category?: string[]; // make it optional array
}) {
  const token = cookies().get("token")?.value;
  const params = new URLSearchParams({
    query,
    min,
    max,
    order,
    page: String(page),
    limit: String(limit),
  });

  // Ensure category is an array before mapping
  if (Array.isArray(category) && category.length > 0) {
    category.forEach((cat) => {
      params.append("category", cat);
    });
  }

  const data = await apiFetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?${params}`,
    {
      headers: { Cookie: `token=${token}` },
    }
  );

  return data;
}

export async function getProductById(id: number): Promise<Product> {
  const product = apiFetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`
  );
  return product;
}

export async function getFeaturedProducts({
  page = 1,
  limit = 4,
  order = "asc",
}: {
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
} = {}): Promise<Product[]> {
  const token = cookies().get("token")?.value;
  // await delay(5000);
  const res = await apiFetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?page=${page}&limit=${limit}&order=${order}`,

    {
      headers: { Cookie: `token=${token}` },
    }
  );

  return res.data.slice(0, 4);
}
