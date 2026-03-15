"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Variant {
  id: string
  label: string
  price: number
  is_available: boolean
}

interface Product {
  id: string
  name: string
  price: number
  has_variants: boolean
  variants: Variant[]
}

function validatePhone(phone: string) {
  return /^01[3-9]\d{8}$/.test(phone)
}

export default function OrderSheet({
  product,
  storeName,
}: {
  product: Product
  storeName: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.has_variants ? null : null
  )

  const availableVariants = product.variants.filter((v) => v.is_available)
  const selectedVariant = availableVariants.find((v) => v.id === selectedVariantId)
  const displayPrice = selectedVariant ? selectedVariant.price : product.price
  const total = (displayPrice * quantity).toLocaleString()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (product.has_variants && !selectedVariantId) {
      setError("Please select a variant before placing your order.")
      return
    }

    const form = new FormData(e.currentTarget)
    const phone = form.get("customer_phone") as string

    if (!validatePhone(phone)) {
      setError("Enter a valid Bangladeshi number (e.g. 01711223344)")
      return
    }

    setLoading(true)

    const body = {
      customer_name: form.get("customer_name"),
      customer_phone: phone,
      customer_address: form.get("customer_address"),
      note: form.get("note") || undefined,
      items: [{
        product_id: product.id,
        quantity,
        variant_id: selectedVariantId || undefined,
      }],
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

  return (
    <>
      {/* Sticky "Place Order" bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 py-3 z-30">
        <div className="max-w-screen-sm mx-auto flex items-center gap-4">
          <div className="text-left">
            <p className="text-xs text-gray-400">
              {product.has_variants ? "From" : "Price"}
            </p>
            <p className="text-lg font-bold text-indigo-600">
              ৳{Number(displayPrice).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex-1 bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-base hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            Place Order →
          </button>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 inset-x-0 bg-white rounded-t-3xl z-50 max-h-[92vh] overflow-y-auto transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-5 pb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Place Your Order</h2>
              <p className="text-sm text-gray-500 truncate max-w-[240px]">{product.name}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Variant Selector */}
            {product.has_variants && availableVariants.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Variant <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableVariants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                        selectedVariantId === v.id
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      <span>{v.label}</span>
                      <span className={`ml-1.5 text-xs ${selectedVariantId === v.id ? "text-indigo-200" : "text-gray-400"}`}>
                        ৳{Number(v.price).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
              <input
                name="customer_name"
                type="text"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                placeholder="Rahim Uddin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input
                name="customer_phone"
                type="tel"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                placeholder="01711223344"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
              <textarea
                name="customer_address"
                required
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 resize-none"
                placeholder="House, Road, Area, City"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition text-xl font-light"
                >−</button>
                <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition text-xl font-light"
                >+</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Note (optional)</label>
              <input
                name="note"
                type="text"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                placeholder="Special request, delivery instructions..."
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
                {error}
              </p>
            )}

            {/* Total + Submit */}
            <div className="border-t border-gray-100 pt-4 flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-xl font-bold text-indigo-600">৳{total}</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-base hover:bg-indigo-700 disabled:opacity-50 active:scale-[0.98] transition-all"
              >
                {loading ? "Placing order..." : "Place Order →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
