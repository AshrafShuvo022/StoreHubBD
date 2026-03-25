"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "./CartContext"

function validatePhone(phone: string) {
  return /^01[3-9]\d{8}$/.test(phone)
}

export default function CartDrawer({ storeName }: { storeName: string }) {
  const { items, removeItem, updateQty, clearCart, total, count, isOpen, closeCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<"cart" | "checkout">("cart")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleClose() {
    closeCart()
    setStep("cart")
    setError("")
  }

  async function handleOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
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
      items: items.map((i) => ({
        product_id: i.productId,
        quantity: i.quantity,
        variant_id: i.variantId || undefined,
      })),
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/${storeName}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || "Failed to place order")
        setLoading(false)
        return
      }
      clearCart()
      handleClose()
      router.push(`/checkout?code=${data.order_code}&total=${data.total_amount}`)
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={handleClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {step === "checkout" && (
              <button
                onClick={() => { setStep("cart"); setError("") }}
                className="text-sm text-indigo-600 font-medium flex items-center gap-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
            )}
            <h2 className="text-lg font-bold text-gray-900">
              {step === "cart"
                ? <>{`Cart`}{count > 0 && <span className="text-indigo-600 ml-1">({count})</span>}</>
                : "Checkout"
              }
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {step === "cart" ? (
            items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-8">
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-gray-500 text-sm font-medium">Your cart is empty</p>
                <button onClick={handleClose} className="mt-4 text-indigo-600 text-sm font-semibold hover:underline">
                  Continue shopping →
                </button>
              </div>
            ) : (
              <div className="px-5 py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">{item.name}</p>
                      {item.variantLabel && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.variantLabel}</p>
                      )}
                      <p className="text-sm font-bold text-indigo-600 mt-1">
                        ৳{Number(item.price).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition text-base font-light"
                        >−</button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition text-base font-light"
                        >+</button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-400 transition flex-shrink-0 mt-0.5"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <form id="cart-checkout-form" onSubmit={handleOrder} className="px-5 py-4 space-y-4">
              {/* Mini order summary */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Summary</p>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate max-w-[180px]">
                      {item.name}{item.variantLabel ? ` (${item.variantLabel})` : ""} ×{item.quantity}
                    </span>
                    <span className="font-semibold text-gray-800 ml-2">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                <input
                  name="customer_name"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                  placeholder="Rahim Uddin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input
                  name="customer_phone"
                  type="tel"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                  placeholder="01711223344"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
                <textarea
                  name="customer_address"
                  required
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 resize-none"
                  placeholder="House, Road, Area, City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Note (optional)</label>
                <input
                  name="note"
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                  placeholder="Special request, delivery instructions..."
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 font-medium">Total</span>
              <span className="text-xl font-bold text-indigo-600">৳{total.toLocaleString()}</span>
            </div>
            {step === "cart" ? (
              <button
                onClick={() => setStep("checkout")}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-base hover:bg-indigo-700 active:scale-[0.98] transition-all"
              >
                Proceed to Checkout →
              </button>
            ) : (
              <button
                type="submit"
                form="cart-checkout-form"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-base hover:bg-indigo-700 disabled:opacity-50 active:scale-[0.98] transition-all"
              >
                {loading ? "Placing order..." : "Place Order →"}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
