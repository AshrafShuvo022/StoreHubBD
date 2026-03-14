"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  price: number
}

export default function OrderForm({
  product,
  storeName,
}: {
  product: Product
  storeName: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(1)

  function validatePhone(phone: string) {
    return /^01[3-9]\d{8}$/.test(phone)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    const form = new FormData(e.currentTarget)
    const phone = form.get("customer_phone") as string

    if (!validatePhone(phone)) {
      setError("Phone number must be a valid Bangladeshi number (e.g. 01711223344)")
      return
    }

    setLoading(true)

    const body = {
      customer_name: form.get("customer_name"),
      customer_phone: phone,
      customer_address: form.get("customer_address"),
      note: form.get("note") || undefined,
      items: [{ product_id: product.id, quantity }],
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/store/${storeName}/order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || "Failed to place order")
        setLoading(false)
        return
      }

      router.push(`/checkout?code=${data.order_code}&total=${data.total_amount}`)
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const total = (product.price * quantity).toLocaleString()

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
        <input
          name="customer_name"
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Rahim Uddin"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          name="customer_phone"
          type="tel"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="01711223344"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
        <textarea
          name="customer_address"
          required
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="House, Road, Area, City"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
          >
            −
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
        <input
          name="note"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Color, size, special request..."
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 text-sm">Total</span>
          <span className="text-xl font-bold text-blue-600">৳{total}</span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </form>
  )
}
