import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Login/register pages don't need the sidebar
  const isAuthPage = false // handled per-page

  return (
    <SessionProvider>
      {session ? (
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar storeName={session.storeName} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      ) : (
        <>{children}</>
      )}
    </SessionProvider>
  )
}
