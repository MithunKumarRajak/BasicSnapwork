import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register" || path === "/"

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and trying to access login/register page, redirect to dashboard
    if (path === "/login" || path === "/register") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // If user is not logged in and trying to access protected routes
  if (!isPublicPath && !token) {
    // Store the original path to redirect back after login
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/dashboard/:path*", "/post-job", "/login", "/register"],
}
