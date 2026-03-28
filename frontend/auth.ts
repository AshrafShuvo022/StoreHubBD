import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"

const isProd = process.env.NODE_ENV === "production"

// Refresh 1 minute before the 30-minute access token expires
const ACCESS_TOKEN_TTL_MS = 29 * 60 * 1000

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: token.refreshToken }),
      }
    )

    if (!res.ok) throw new Error("Refresh failed")

    const data = await res.json()

    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token, // rotate the refresh token
      accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL_MS,
      error: undefined,
    }
  } catch {
    // Refresh token is expired or invalid — force re-login
    return { ...token, error: "RefreshAccessTokenError" }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days — matches refresh token TTL
  },
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        // In prod: share across all subdomains via .storehubbd.com
        // In dev: no domain (host-only) — browsers reject .localhost as a cookie domain
        domain: isProd ? ".storehubbd.com" : undefined,
        secure: isProd,
      },
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        store_name: { label: "Store", type: "text" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                store_name: credentials.store_name || undefined,
              }),
            }
          )
          if (!res.ok) return null
          const data = await res.json()
          return {
            id: data.seller.id,
            name: data.seller.owner_name,
            email: data.seller.email,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            storeName: data.seller.store_name,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in — store both tokens + expiry
      if (user) {
        return {
          ...token,
          id: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL_MS,
          storeName: user.storeName,
        }
      }

      // Access token still valid — return as-is
      if (Date.now() < (token.accessTokenExpires ?? 0)) {
        return token
      }

      // Access token expired — silently refresh
      return refreshAccessToken(token)
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.storeName = token.storeName as string
      session.user.id = token.id as string
      if (token.error) {
        session.error = token.error
      }
      return session
    },
  },
})
