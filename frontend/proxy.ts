import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default async function proxy(req: NextRequest) {
  const host = req.headers.get("host") || ""
  const hostname = host.split(":")[0]
  const { nextUrl } = req

  // Root domain — serve landing page as-is
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return NextResponse.next()
  }

  const subdomain = hostname.split(".")[0]

  // app.localhost — dashboard, requires auth
  if (subdomain === "app") {
    const session = await auth()
    const isLoggedIn = !!session
    const isAuthPage =
      nextUrl.pathname === "/login" || nextUrl.pathname === "/register"

    if (!isLoggedIn && !isAuthPage) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (isLoggedIn && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  }

  // {store}.localhost — rewrite to /{store}/* so Next.js dynamic route [store] picks it up
  const newPath = `/${subdomain}${nextUrl.pathname === "/" ? "" : nextUrl.pathname}`
  return NextResponse.rewrite(new URL(newPath, req.url))
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
}
