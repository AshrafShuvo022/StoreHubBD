import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req) => {
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
    const isLoggedIn = !!req.auth
    const isAuthPage =
      nextUrl.pathname === "/login" || nextUrl.pathname === "/register"

    if (!isLoggedIn && !isAuthPage) {
      const loginUrl = nextUrl.clone()
      loginUrl.pathname = "/login"
      return NextResponse.redirect(loginUrl)
    }

    if (isLoggedIn && isAuthPage) {
      const dashboardUrl = nextUrl.clone()
      dashboardUrl.pathname = "/dashboard"
      return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
  }

  // {store}.localhost — rewrite to /{store}/* so Next.js dynamic route [store] picks it up
  const url = nextUrl.clone()
  url.pathname = `/${subdomain}${nextUrl.pathname === "/" ? "" : nextUrl.pathname}`
  return NextResponse.rewrite(url)
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
