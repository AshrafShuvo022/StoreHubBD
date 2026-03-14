import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import OrderStatusUpdater from "@/components/dashboard/OrderStatusUpdater"

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

async function getOrder(id: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params
  const order = await getOrder(id, session.accessToken)
  if (!order) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/orders" className="text-sm text-blue-600 hover:underline">
            ← Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 font-mono">{order.order_code}</h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${STATUS_STYLES[order.status]}`}>
          {order.status}
        </span>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">Customer</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{order.customer_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phone</span>
            <a href={`tel:${order.customer_phone}`} className="font-medium text-blue-600">
              {order.customer_phone}
            </a>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Address</span>
            <span className="font-medium text-right max-w-xs">{order.customer_address}</span>
          </div>
          {order.note && (
            <div className="flex justify-between">
              <span className="text-gray-500">Note</span>
              <span className="font-medium text-right max-w-xs">{order.note}</span>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">Items</h2>
        <div className="space-y-2">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.product_name} × {item.quantity}
              </span>
              <span className="font-medium">৳{Number(item.subtotal).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-blue-600">৳{Number(order.total_amount).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Update Status</h2>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  )
}
