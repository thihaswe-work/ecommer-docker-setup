// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_DOCKER_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "";

console.log("inside docker", API_URL);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  // const protectedRoutes = ["/profile"];
  // if (protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
  //   if (!token) {
  //     const loginUrl = new URL("/auth/login", req.url);
  //     return NextResponse.redirect(loginUrl);
  //   }
  // }
  // if (token && req.nextUrl.pathname.includes("login")) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  // return NextResponse.next();
  if (!API_URL) {
    console.error("API_URL is not defined");
    return NextResponse.next();
  }

  let underMaintenance = false;
  try {
    const res = await fetch(`${API_URL}/settings`, {
      cache: "no-store",
    });
    const data = await res.json();
    underMaintenance = data?.underMaintenance ?? false;
  } catch (err) {
    console.error("Failed to check maintenance status:", err);
    // fallback: treat as not under maintenance
  }

  // 2. Redirect if under maintenance
  if (underMaintenance && !req.nextUrl.pathname.startsWith("/maintenance")) {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  if (!underMaintenance && req.nextUrl.pathname.startsWith("/maintenance")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
