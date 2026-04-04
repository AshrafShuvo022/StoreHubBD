import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import RevenueChart from "@/components/dashboard/RevenueChart"
import AutoSignOut from "@/components/dashboard/AutoSignOut"

async function getAnalytics(token: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const STATUS_BADGE: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 border-amber-100",
  confirmed: "bg-violet-50 text-violet-700 border-violet-100",
  shipped:   "bg-blue-50 text-blue-700 border-blue-100",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
}

const STATUS_BAR: Record<string, string> = {
  pending:   "bg-amber-400",
  confirmed: "bg-violet-500",
  shipped:   "bg-blue-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-red-400",
}

const STATUS_ORDER = ["pending", "confirmed", "shipped", "delivered", "cancelled"]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const analytics = await getAnalytics(session.accessToken)

  if (!analytics) {
    return <AutoSignOut />
  }

  const {
    total_revenue,
    monthly_revenue,
    total_orders,
    pending_orders,
    status_breakdown,
    daily_revenue,
    top_products,
    recent_orders,
  } = analytics

  const totalNonCancelled = STATUS_ORDER.filter(s => s !== "cancelled")
    .reduce((sum: number, s: string) => sum + (status_breakdown[s] || 0), 0)

  return (
    <div className="p-6 sm:p-8 lg:p-10 w-full space-y-6">

      {/* Welcome row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
              className="text-sm text-[#FF9900] font-medium hover:underline flex items-center gap-1"
            >
              {session.storeName}.storehubbd.com
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#FF9900] border border-[#FF9900]/30 bg-[#FF9900]/8 px-4 py-2 rounded-xl hover:bg-[#FF9900]/10 transition-colors"
        >
          View Live Store
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Revenue",
            value: `৳${Number(total_revenue).toLocaleString()}`,
            sub: "All time (excl. cancelled)",
            bar: "bg-[#FF9900]/80",
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            ),
          },
          {
            label: "This Month",
            value: `৳${Number(monthly_revenue).toLocaleString()}`,
            sub: "Current month revenue",
            bar: "bg-violet-500",
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            ),
          },
          {
            label: "Total Orders",
            value: total_orders,
            sub: `${status_breakdown.delivered || 0} delivered`,
            bar: "bg-blue-500",
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" />
              </svg>
            ),
          },
          {
            label: "Pending",
            value: pending_orders,
            sub: "Awaiting action",
            bar: "bg-amber-400",
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            ),
          },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className={`h-1 ${card.bar}`} />
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.label}</span>
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                  {card.icon}
                </div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-900">Revenue Trend</h2>
          <span className="text-xs text-gray-400">Last 30 days</span>
        </div>
        <RevenueChart data={daily_revenue} />
      </div>

      {/* Status breakdown + Top products */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Order status breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {STATUS_ORDER.map((status) => {
              const count = status_breakdown[status] || 0
              const pct = total_orders > 0 ? (count / total_orders) * 100 : 0
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${STATUS_BAR[status]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          {total_orders === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No orders yet</p>
          )}
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Top Products</h2>
          {top_products.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No sales yet</p>
          ) : (
            <div className="space-y-3">
              {top_products.map((p: any, i: number) => {
                const maxRevenue = top_products[0].revenue
                const pct = maxRevenue > 0 ? (p.revenue / maxRevenue) * 100 : 0
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-gray-400 w-4 flex-shrink-0">
                          #{i + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-700 truncate">{p.name}</span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <span className="text-sm font-bold text-gray-900">৳{Number(p.revenue).toLocaleString()}</span>
                        <span className="text-xs text-gray-400 ml-1.5">{p.orders} sold</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF9900]/80 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
          <Link href="/orders" className="text-xs font-semibold text-[#FF9900] hover:underline">
            View All →
          </Link>
        </div>

        {recent_orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-400 text-sm">No orders yet. Share your store link to get started!</p>
            <a
              href={`http://${session.storeName}.localhost:3000`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-[#FF9900] text-sm font-semibold hover:underline"
            >
              View your store →
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
            {recent_orders.map((o: any) => (
              <Link
                key={o.id}
                href={`/orders/${o.id}`}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#FF9900]/8 flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#FF9900]">{o.order_code}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_BADGE[o.status] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {o.customer_name} · {formatDate(o.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <p className="text-sm font-bold text-gray-900">৳{Number(o.total_amount).toLocaleString()}</p>
                  <svg width="14" height="14" className="text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/products/new" className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-4 flex items-center gap-3 hover:border-[#FF9900]/50 hover:bg-[#FF9900]/5 transition-all group">
          <div className="w-9 h-9 rounded-xl bg-[#FF9900]/15 group-hover:bg-[#FF9900]/20 flex items-center justify-center transition-colors flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Add Product</p>
            <p className="text-xs text-gray-500">List a new item</p>
          </div>
        </Link>
        <Link href="/orders" className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Orders</p>
            <p className="text-xs text-gray-500">{pending_orders} pending</p>
          </div>
        </Link>
        <Link href="/products" className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Products</p>
            <p className="text-xs text-gray-500">Manage listings</p>
          </div>
        </Link>
        <Link href="/settings" className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Settings</p>
            <p className="text-xs text-gray-500">Store profile</p>
          </div>
        </Link>
      </div>

    </div>
  )
}
