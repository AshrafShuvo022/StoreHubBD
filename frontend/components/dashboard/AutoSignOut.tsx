"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"

// Rendered by the dashboard when the backend returns 401.
// Clears the stale NextAuth session and sends the user to the login page.
export default function AutoSignOut() {
  useEffect(() => {
    // Use absolute URL so NextAuth redirects back to the same subdomain's login page
    // (relative "/login" resolves to localhost:3000/login — the wrong host)
    signOut({ callbackUrl: `${window.location.origin}/login` })
  }, [])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <svg className="animate-spin text-gray-300" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 11-6.219-8.56" />
      </svg>
      <p className="text-sm text-gray-400">Session expired — redirecting to login…</p>
    </div>
  )
}
