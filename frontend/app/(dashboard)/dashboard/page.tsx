import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {session.user.name}
      </h1>
      <p className="text-gray-500 mt-1">
        Store:{" "}
        <span className="font-medium text-blue-600">{session.storeName}.storehubbd.com</span>
      </p>
      <p className="text-sm text-gray-400 mt-8">
        Dashboard summary coming in Phase 9.
      </p>
    </div>
  )
}
