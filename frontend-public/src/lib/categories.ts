import { cookies } from "next/headers";
import { apiFetch } from "./utils";

export async function getAllCateogires() {
  const token = cookies().get("token")?.value;

  const data = await apiFetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories?`,
    {
      headers: { Cookie: `token=${token}` },
    }
  );
  return data;
}
