import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SELLER_ROUTES = ["/dashboard", "/products", "/orders", "/settings"]

export default async function proxy(req: NextRequest) {
  const host = req.headers.get("host") || ""
  const hostname = host.split(":")[0]
  const port = host.split(":")[1]
  const { nextUrl } = req
  const pathname = nextUrl.pathname

  // Root domain — landing + register only
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const isSellerOrAuthRoute =
      pathname === "/login" ||
      SELLER_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))

    if (isSellerOrAuthRoute) {
      const session = await auth()
      if (session?.storeName) {
        const storeHost = port
          ? `${session.storeName}.localhost:${port}`
          : `${session.storeName}.localhost`
        return NextResponse.redirect(new URL(`http://${storeHost}${pathname}`))
      }
    }
    return NextResponse.next()
  }

  const storeName = hostname.split(".")[0]

  // /login on store subdomain
  if (pathname === "/login") {
    const session = await auth()
    if (session) {
      if (session.storeName === storeName) {
        // Same store already logged in — go to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      // Different store logged in — let them see the login page to switch accounts
      // The login page will show a "switching account" notice
      const url = req.nextUrl.clone()
      url.searchParams.set("switch", session.storeName)
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  // /register on store subdomain — send to main site
  if (pathname === "/register") {
    const mainHost = port ? `localhost:${port}` : "localhost"
    return NextResponse.redirect(new URL(`http://${mainHost}/register`))
  }

  // Seller admin routes — require auth + must own this store
  const isSellerRoute = SELLER_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  )

  if (isSellerRoute) {
    const session = await auth()
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    // Wrong store — redirect to their own store dashboard
    if (session.storeName !== storeName) {
      const theirHost = port
        ? `${session.storeName}.localhost:${port}`
        : `${session.storeName}.localhost`
      return NextResponse.redirect(new URL(`http://${theirHost}/dashboard`))
    }
    return NextResponse.next()
  }

  // Public store routes — rewrite to /{storeName}{pathname}
  const newPath = `/${storeName}${pathname === "/" ? "" : pathname}`
  return NextResponse.rewrite(new URL(newPath, req.url))
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
}
