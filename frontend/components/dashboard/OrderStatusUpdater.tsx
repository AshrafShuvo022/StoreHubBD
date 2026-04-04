"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const ALL_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"]

const STATUS_CONFIG: Record<string, { label: string; active: string; ring: string }> = {
  pending:   { label: "Pending",   active: "bg-amber-500 text-white border-amber-500",   ring: "ring-amber-100" },
  confirmed: { label: "Confirmed", active: "bg-violet-600 text-white border-violet-600", ring: "ring-violet-100" },
  shipped:   { label: "Shipped",   active: "bg-blue-600 text-white border-blue-600",     ring: "ring-blue-100" },
  delivered: { label: "Delivered", active: "bg-emerald-600 text-white border-emerald-600", ring: "ring-emerald-100" },
  cancelled: { label: "Cancelled", active: "bg-red-600 text-white border-red-600",       ring: "ring-red-100" },
}

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [selected, setSelected] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const hasChange = selected !== currentStatus

  async function handleUpdate() {
    if (!hasChange || loading) return
    setLoading(true)
    setSuccess(false)

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({ status: selected }),
    })

    setLoading(false)
    setSuccess(true)
    router.refresh()
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <div>
      {/* Segmented Status Control */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        {ALL_STATUSES.map((s) => {
          const config = STATUS_CONFIG[s]
          const isSelected = selected === s
          return (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                isSelected
                  ? `${config.active} ring-2 ${config.ring}`
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {config.label}
            </button>
          )
        })}
      </div>

      <button
        onClick={handleUpdate}
        disabled={!hasChange || loading}
        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
          hasChange
            ? "bg-[#FF9900] text-gray-900 active:scale-[0.98]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        } disabled:opacity-60`}
      >
        {loading ? "Updating..." : success ? "✓ Updated!" : hasChange ? "Confirm Update" : "Select a new status to update"}
      </button>
    </div>
  )
}
