"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

const STATUS_BADGE: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 border-amber-100",
  confirmed: "bg-violet-50 text-violet-700 border-violet-100",
  shipped:   "bg-blue-50 text-blue-700 border-blue-100",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
}

const FILTERS = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"]

function relativeDate(iso: string) {
  const d = new Date(iso)
  const now = Date.now()
  const diff = Math.floor((now - d.getTime()) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (!session?.accessToken) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
      cache: "no-store",
    } as any)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [session])

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter)

  if (loading) {
    return (
      <div className="p-6 sm:p-8 lg:p-10 flex items-center justify-center min-h-[300px]">
        <div className="w-6 h-6 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10 w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
          {orders.length}
        </span>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {FILTERS.map((f) => {
          const count = f === "all" ? orders.length : orders.filter((o) => o.status === f).length
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === f
                  ? "bg-[#FF9900] text-gray-900"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gray-200 py-20 px-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <p className="font-bold text-gray-900 text-lg mb-1">
            {filter === "all" ? "No orders yet" : `No ${filter} orders`}
          </p>
          <p className="text-sm text-gray-500">
            {filter === "all" ? "Share your store link to start receiving orders" : "Check other status filters"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Order</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FF9900]/5/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-[#FF9900] text-sm">{o.order_code}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{o.customer_name}</p>
                      <p className="text-xs text-gray-500">{o.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700">
                      ৳{Number(o.total_amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {o.created_at ? relativeDate(o.created_at) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${STATUS_BADGE[o.status] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/orders/${o.id}`}
                        className="text-xs font-semibold text-[#FF9900] hover:brightness-75 flex items-center gap-1 justify-end"
                      >
                        View
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="sm:hidden space-y-2">
            {filtered.map((o) => (
              <Link
                key={o.id}
                href={`/orders/${o.id}`}
                className="block bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-[#FF9900]">{o.order_code}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${STATUS_BADGE[o.status] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
                    <span className="w-1 h-1 rounded-full bg-current" />
                    {o.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{o.customer_name}</p>
                <p className="text-xs text-gray-500">{o.customer_phone}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <span className="font-bold text-gray-900">৳{Number(o.total_amount).toLocaleString()}</span>
                  <span className="text-xs text-gray-400">{o.created_at ? relativeDate(o.created_at) : "—"}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
