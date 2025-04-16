import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/images",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path))

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check if user is authenticated by checking for the auth token
  const authToken = request.cookies.get("auth_token")?.value

  // If there's no token and the path is not public, redirect to login
  if (!authToken) {
    const url = new URL("/auth/login", request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/health|_next/static|_next/image).*)"],
}
