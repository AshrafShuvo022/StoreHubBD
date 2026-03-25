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
        <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 flex-shrink-0" style={{ background: "#131921" }}>
          <div className="flex items-center gap-3">
            {step === "checkout" && (
              <button
                onClick={() => { setStep("cart"); setError("") }}
                className="text-sm text-gray-300 hover:text-white font-medium flex items-center gap-1"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
            )}
            <h2 className="text-base font-bold text-white">
              {step === "cart"
                ? <>{`Cart`}{count > 0 && <span className="ml-1" style={{ color: "#FF9900" }}>({count})</span>}</>
                : "Checkout"
              }
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-white">
          {step === "cart" ? (
            items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-8">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61H19a2 2 0 001.98-1.68L23 6H6" />
                </svg>
                <p className="text-gray-600 text-sm font-semibold">Your Cart is Empty</p>
                <p className="text-gray-400 text-xs mt-1">Add items to get started</p>
                <button onClick={handleClose} className="mt-4 text-sm font-semibold hover:underline" style={{ color: "#007185" }}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="px-4 py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded object-cover flex-shrink-0 border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-tight line-clamp-2">{item.name}</p>
                      {item.variantLabel && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.variantLabel}</p>
                      )}
                      <p className="text-sm font-bold mt-1" style={{ color: "#B12704" }}>
                        ৳{Number(item.price).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                        >−</button>
                        <span className="w-6 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                        >+</button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-400 transition flex-shrink-0 mt-0.5"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <form id="cart-checkout-form" onSubmit={handleOrder} className="px-4 py-4 space-y-4">
              {/* Mini order summary */}
              <div className="bg-gray-50 rounded border border-gray-200 p-3 space-y-2">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Order Summary</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  name="customer_name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                  placeholder="Rahim Uddin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  name="customer_phone"
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                  placeholder="01711223344"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  name="customer_address"
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] resize-none"
                  placeholder="House, Road, Area, City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <input
                  name="note"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                  placeholder="Special request or delivery instructions..."
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 font-medium">
                {step === "checkout" ? "Order Total" : `Subtotal (${count} items)`}
              </span>
              <span className="text-lg font-bold" style={{ color: "#B12704" }}>৳{total.toLocaleString()}</span>
            </div>
            {step === "cart" ? (
              <button
                onClick={() => setStep("checkout")}
                className="w-full py-3 rounded font-bold text-sm text-gray-900 hover:brightness-95 active:scale-[0.98] transition-all"
                style={{ background: "#FFD814", border: "1px solid #FCD200" }}
              >
                Proceed to Checkout →
              </button>
            ) : (
              <button
                type="submit"
                form="cart-checkout-form"
                disabled={loading}
                className="w-full py-3 rounded font-bold text-sm text-gray-900 hover:brightness-95 disabled:opacity-50 active:scale-[0.98] transition-all"
                style={{ background: "#FF9900", border: "1px solid #e8870a" }}
              >
                {loading ? "Placing Order..." : "Place Order →"}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
