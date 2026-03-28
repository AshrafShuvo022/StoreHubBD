"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useOrderNotifications } from "@/context/OrderNotificationContext"

export default function NewOrderToast() {
  const { newOrders, clearNewOrders } = useOrderNotifications()
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Show toast whenever new orders arrive, reset dismiss state
  useEffect(() => {
    if (newOrders.length > 0) {
      setVisible(true)
      setDismissed(false)
    } else {
      setVisible(false)
    }
  }, [newOrders.length])

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!visible || dismissed) return
    const timer = setTimeout(() => setVisible(false), 8000)
    return () => clearTimeout(timer)
  }, [visible, dismissed])

  if (!visible || dismissed || newOrders.length === 0) return null

  const latest = newOrders[0]
  const count = newOrders.length

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 animate-slide-up">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl w-72 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10" style={{ background: "#FF9900" }}>
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-bold text-xs uppercase tracking-wide">
              {count > 1 ? `${count} New Orders!` : "New Order!"}
            </span>
          </div>
          <button
            onClick={() => { setDismissed(true); setVisible(false) }}
            className="text-gray-900/60 hover:text-gray-900 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <p className="font-mono font-bold text-white text-sm">{latest.order_code}</p>
          <p className="text-gray-300 text-xs mt-0.5">{latest.customer_name}</p>
          <p className="text-gray-400 text-xs mt-0.5">৳{Number(latest.total_amount).toLocaleString()}</p>
          {count > 1 && (
            <p className="text-gray-500 text-xs mt-1">+{count - 1} more order{count > 2 ? "s" : ""}</p>
          )}
        </div>

        {/* Action */}
        <div className="px-4 pb-3">
          <Link
            href="/orders"
            onClick={() => { clearNewOrders(); setVisible(false) }}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-gray-900 transition-all hover:brightness-95"
            style={{ background: "#FFD814" }}
          >
            View Orders
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
