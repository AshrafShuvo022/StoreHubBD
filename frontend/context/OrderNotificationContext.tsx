"use client"

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react"
import { useSession } from "next-auth/react"

interface NewOrder {
  id: string
  order_code: string
  customer_name: string
  total_amount: number
}

interface OrderNotificationContextValue {
  newOrders: NewOrder[]
  clearNewOrders: () => void
}

const OrderNotificationContext = createContext<OrderNotificationContextValue>({
  newOrders: [],
  clearNewOrders: () => {},
})

export function useOrderNotifications() {
  return useContext(OrderNotificationContext)
}

const POLL_INTERVAL_MS = 30_000 // 30 seconds

export function OrderNotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [newOrders, setNewOrders] = useState<NewOrder[]>([])

  // The created_at of the most recent order on first load — used as baseline.
  // Orders arriving after this timestamp trigger notifications.
  const baselineRef = useRef<string | null>(null)
  const isFirstPoll = useRef(true)

  const clearNewOrders = useCallback(() => {
    setNewOrders([])
  }, [])

  useEffect(() => {
    if (!session?.accessToken) return

    async function poll() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${session!.accessToken}` },
        } as any)
        if (!res.ok) return
        const orders: any[] = await res.json()

        if (orders.length === 0) {
          isFirstPoll.current = false
          return
        }

        // Sort newest first (API already does this, but be safe)
        const sorted = [...orders].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

        if (isFirstPoll.current) {
          // Set baseline silently — don't notify for existing orders
          baselineRef.current = sorted[0].created_at
          isFirstPoll.current = false
          return
        }

        // Find orders newer than baseline
        const incoming = sorted.filter(
          (o) => baselineRef.current === null || new Date(o.created_at) > new Date(baselineRef.current!)
        )

        if (incoming.length > 0) {
          // Advance baseline to the newest order
          baselineRef.current = sorted[0].created_at
          setNewOrders((prev) => {
            const existingIds = new Set(prev.map((o) => o.id))
            const fresh = incoming
              .filter((o) => !existingIds.has(o.id))
              .map((o) => ({
                id: o.id,
                order_code: o.order_code,
                customer_name: o.customer_name,
                total_amount: o.total_amount,
              }))
            return fresh.length > 0 ? [...fresh, ...prev] : prev
          })
        }
      } catch {
        // Network error — silently skip
      }
    }

    // Run immediately, then on interval
    poll()
    const interval = setInterval(poll, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [session?.accessToken])

  return (
    <OrderNotificationContext.Provider value={{ newOrders, clearNewOrders }}>
      {children}
    </OrderNotificationContext.Provider>
  )
}
