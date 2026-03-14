import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

async function getOrders(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const orders = await getOrders(session.accessToken)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🛒</p>
          <p>No orders yet. Share your store link to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Order</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Phone</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Total</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o: any) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-gray-900">{o.order_code}</td>
                  <td className="px-4 py-3 text-gray-700">{o.customer_name}</td>
                  <td className="px-4 py-3 text-gray-700">{o.customer_phone}</td>
                  <td className="px-4 py-3 text-gray-700">৳{Number(o.total_amount).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/orders/${o.id}`} className="text-blue-600 hover:underline text-xs">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
