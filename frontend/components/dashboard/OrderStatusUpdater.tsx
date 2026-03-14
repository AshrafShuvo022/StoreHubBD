"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const NEXT_STATUS: Record<string, string | null> = {
  pending: "confirmed",
  confirmed: "shipped",
  shipped: "delivered",
  delivered: null,
  cancelled: null,
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirm Order",
  shipped: "Mark Shipped",
  delivered: "Mark Delivered",
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
  const [loading, setLoading] = useState(false)

  const nextStatus = NEXT_STATUS[currentStatus]

  async function handleUpdate() {
    if (!nextStatus) return
    setLoading(true)

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    })

    router.refresh()
    setLoading(false)
  }

  if (!nextStatus) {
    return <p className="text-sm text-gray-400">No further status updates.</p>
  }

  return (
    <button
      onClick={handleUpdate}
      disabled={loading}
      className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
    >
      {loading ? "Updating..." : STATUS_LABELS[nextStatus]}
    </button>
  )
}
