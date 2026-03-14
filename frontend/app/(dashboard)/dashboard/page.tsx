import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

async function getOrders(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const orders = await getOrders(session.accessToken)

  const counts = {
    total: orders.length,
    pending: orders.filter((o: any) => o.status === "pending").length,
    confirmed: orders.filter((o: any) => o.status === "confirmed").length,
    shipped: orders.filter((o: any) => o.status === "shipped").length,
    delivered: orders.filter((o: any) => o.status === "delivered").length,
  }

  const stats = [
    { label: "Total Orders", value: counts.total, color: "bg-blue-50 text-blue-700" },
    { label: "Pending", value: counts.pending, color: "bg-yellow-50 text-yellow-700" },
    { label: "Confirmed", value: counts.confirmed, color: "bg-purple-50 text-purple-700" },
    { label: "Shipped", value: counts.shipped, color: "bg-indigo-50 text-indigo-700" },
    { label: "Delivered", value: counts.delivered, color: "bg-green-50 text-green-700" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session.user.name}</h1>
        <p className="text-gray-500 text-sm mt-1">
          Your store:{" "}
          <span className="font-medium text-blue-600">{session.storeName}.storehubbd.com</span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          + Add Product
        </Link>
        <Link
          href="/orders"
          className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          View Orders
        </Link>
      </div>
    </div>
  )
}
