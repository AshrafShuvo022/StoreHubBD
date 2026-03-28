import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import Sidebar from "@/components/dashboard/Sidebar"
import BottomNav from "@/components/dashboard/BottomNav"
import SessionGuard from "@/components/dashboard/SessionGuard"
import { OrderNotificationProvider } from "@/context/OrderNotificationContext"
import NewOrderToast from "@/components/dashboard/NewOrderToast"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider>
      <OrderNotificationProvider>
        <SessionGuard />
        {session ? (
          <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar storeName={session.storeName} />
            <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
            <BottomNav />
            <NewOrderToast />
          </div>
        ) : (
          <>{children}</>
        )}
      </OrderNotificationProvider>
    </SessionProvider>
  )
}
