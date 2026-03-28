"use client"

import { useEffect } from "react"
import { useSession, signOut } from "next-auth/react"

// Watches for RefreshAccessTokenError (refresh token expired/revoked).
// When detected, signs the user out so they're sent to the login page.
export default function SessionGuard() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: `${window.location.origin}/login` })
    }
  }, [session?.error])

  return null
}
