// lib/auth.ts

// no need in the code
import { cookies } from "next/headers";
export async function getUserFromCookie() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const res = await fetch("http://localhost:5000/me", {
      headers: { Cookie: `token=${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();

    return data.user;
  } catch {
    return null;
  }
}
