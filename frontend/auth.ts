import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
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
      if (user) {
        token.id = user.id
        token.accessToken = user.accessToken
        token.storeName = user.storeName
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.storeName = token.storeName as string
      session.user.id = token.id as string
      return session
    },
  },
})
