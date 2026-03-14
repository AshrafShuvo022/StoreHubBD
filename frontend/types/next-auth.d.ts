import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    accessToken?: string
    storeName?: string
  }
  interface Session {
    accessToken: string
    storeName: string
    user: {
      id: string
      name?: string | null
      email?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    storeName?: string
    id?: string
  }
}
