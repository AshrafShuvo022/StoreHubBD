import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import OrderStatusUpdater from "@/components/dashboard/OrderStatusUpdater"

const STATUS_CONFIG = [
  { key: "pending",   label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped",   label: "Shipped" },
  { key: "delivered", label: "Delivered" },
]

const STATUS_BADGE: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 border-amber-100",
  confirmed: "bg-violet-50 text-violet-700 border-violet-100",
  shipped:   "bg-blue-50 text-blue-700 border-blue-100",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
}

async function getOrder(id: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

function StatusTimeline({ currentStatus }: { currentStatus: string }) {
  const cancelled = currentStatus === "cancelled"
  const currentIndex = STATUS_CONFIG.findIndex((s) => s.key === currentStatus)

  if (cancelled) {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-red-600">Order Cancelled</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0">
      {STATUS_CONFIG.map((step, i) => {
        const completed = i < currentIndex
        const active = i === currentIndex
        const future = i > currentIndex

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                completed
                  ? "bg-indigo-600"
                  : active
                  ? "bg-indigo-600 ring-4 ring-indigo-100"
                  : "bg-gray-200"
              }`}>
                {completed && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {active && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
              <span className={`text-[10px] font-semibold mt-1.5 ${
                completed || active ? "text-indigo-700" : "text-gray-400"
              }`}>
                {step.label}
              </span>
            </div>
            {i < STATUS_CONFIG.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-5 ${completed ? "bg-indigo-600" : "bg-gray-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
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
    <div className="p-6 sm:p-8 lg:p-10 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/orders" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Orders
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-mono font-extrabold text-gray-900 tracking-wider">
              {order.order_code}
            </h1>
            {order.created_at && (
              <p className="text-xs text-gray-500 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString("en-BD", {
                  year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                })}
              </p>
            )}
          </div>
          <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border capitalize ${STATUS_BADGE[order.status] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {order.status}
          </span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">Order Progress</h2>
        <StatusTimeline currentStatus={order.status} />
      </div>

      {/* Customer Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Customer</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-start gap-4">
            <span className="text-gray-500 flex-shrink-0">Name</span>
            <span className="font-semibold text-gray-900 text-right">{order.customer_name}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-500 flex-shrink-0">Phone</span>
            <div className="flex items-center gap-2">
              <a href={`tel:${order.customer_phone}`} className="font-semibold text-indigo-600">
                {order.customer_phone}
              </a>
              <a
                href={`tel:${order.customer_phone}`}
                className="bg-green-50 text-green-700 border border-green-100 rounded-lg text-xs font-semibold px-2 py-0.5"
              >
                Call
              </a>
            </div>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="text-gray-500 flex-shrink-0">Address</span>
            <span className="font-medium text-gray-700 text-right max-w-xs">{order.customer_address}</span>
          </div>
          {order.note && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-gray-500 flex-shrink-0">Note</span>
              <span className="font-medium text-gray-700 text-right max-w-xs">{order.note}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Items</h2>
        <div className="space-y-2.5">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-start text-sm gap-4">
              <div>
                <span className="text-gray-700 font-medium">{item.product_name}</span>
                {item.variant_label && (
                  <span className="ml-2 text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                    {item.variant_label}
                  </span>
                )}
                <span className="text-gray-400 ml-1">× {item.quantity}</span>
              </div>
              <span className="font-semibold text-gray-900 flex-shrink-0">৳{Number(item.subtotal).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center font-bold">
            <span className="text-gray-900">Total</span>
            <span className="text-lg text-indigo-600">৳{Number(order.total_amount).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Status Update Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Update Status</h2>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  )
}
