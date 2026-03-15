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

const STATUS_CONFIG = [
  { key: "total",     label: "Total Orders", bar: "bg-indigo-500" },
  { key: "pending",   label: "Pending",      bar: "bg-amber-400" },
  { key: "confirmed", label: "Confirmed",    bar: "bg-violet-500" },
  { key: "shipped",   label: "Shipped",      bar: "bg-blue-500" },
  { key: "delivered", label: "Delivered",    bar: "bg-emerald-500" },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const orders = await getOrders(session.accessToken)

  const counts: Record<string, number> = {
    total: orders.length,
    pending:   orders.filter((o: any) => o.status === "pending").length,
    confirmed: orders.filter((o: any) => o.status === "confirmed").length,
    shipped:   orders.filter((o: any) => o.status === "shipped").length,
    delivered: orders.filter((o: any) => o.status === "delivered").length,
  }

  const recentOrders = orders.slice(0, 5)

  const STATUS_BADGE: Record<string, string> = {
    pending:   "bg-amber-50 text-amber-700 border-amber-100",
    confirmed: "bg-violet-50 text-violet-700 border-violet-100",
    shipped:   "bg-blue-50 text-blue-700 border-blue-100",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
    cancelled: "bg-red-50 text-red-700 border-red-100",
  }

  return (
    <div className="p-5 sm:p-8 max-w-5xl">
      {/* Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {session.user.name?.split(" ")[0] || "there"} 👋
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">Your store:</span>
            <a
              href={`http://${session.storeName}.localhost:3000`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
            >
              {session.storeName}.storehubbd.com
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
        <a
          href={`http://${session.storeName}.localhost:3000`}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
        >
          View Live Store
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {STATUS_CONFIG.map((s) => (
          <div key={s.key} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className={`h-1 w-full ${s.bar}`} />
            <div className="p-4">
              <p className="text-3xl font-extrabold text-gray-900">{counts[s.key]}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link
          href="/products/new"
          className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 flex items-center gap-3 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Add Product</p>
            <p className="text-xs text-gray-500">List a new item</p>
          </div>
        </Link>

        <Link
          href="/orders"
          className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-3 hover:shadow-md hover:border-gray-300 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <line x1="9" y1="12" x2="15" y2="12" />
              <line x1="9" y1="16" x2="13" y2="16" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">View Orders</p>
            <p className="text-xs text-gray-500">{counts.pending} pending</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
            <Link href="/orders" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
            {recentOrders.map((o: any) => (
              <Link
                key={o.id}
                href={`/orders/${o.id}`}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-indigo-700">{o.order_code}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_BADGE[o.status] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{o.customer_name}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-sm font-semibold text-gray-900">৳{Number(o.total_amount).toLocaleString()}</p>
                  <svg width="14" height="14" className="ml-auto mt-0.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
