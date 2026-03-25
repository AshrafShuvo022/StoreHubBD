"use client"

import { useState } from "react"
import { useCart } from "./CartContext"
import { makeCartItemId } from "@/lib/cart"

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
  image_url?: string | null
  has_variants: boolean
  variants: Variant[]
}

export default function OrderSheet({
  product,
}: {
  product: Product
  storeName: string
}) {
  const { addItem, openCart, count } = useCart()
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [added, setAdded] = useState(false)

  const availableVariants = (product.variants || []).filter((v) => v.is_available)
  const selectedVariant = availableVariants.find((v) => v.id === selectedVariantId)
  const displayPrice = selectedVariant ? selectedVariant.price : product.price

  function handleAddToCart() {
    setError("")
    if (product.has_variants && !selectedVariantId) {
      setError("Please select a variant first.")
      return
    }
    addItem({
      id: makeCartItemId(product.id, selectedVariantId || undefined),
      productId: product.id,
      variantId: selectedVariantId || undefined,
      name: product.name,
      variantLabel: selectedVariant?.label,
      price: displayPrice,
      imageUrl: product.image_url || undefined,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    setOpen(false)
  }

  return (
    <>
      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 px-4 py-3 z-30">
        <div className="max-w-screen-sm mx-auto flex items-center gap-3">
          <div className="text-left flex-shrink-0">
            <p className="text-[10px] text-gray-400">{product.has_variants ? "From" : "Price"}</p>
            <p className="text-lg font-bold" style={{ color: "#B12704" }}>৳{Number(displayPrice).toLocaleString()}</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex-1 py-3 rounded font-bold text-sm text-gray-900 hover:brightness-95 active:scale-[0.98] transition-all"
            style={{ background: "#FFD814", border: "1px solid #FCD200" }}
          >
            Add to Cart
          </button>
          {count > 0 && (
            <button
              onClick={openCart}
              className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              aria-label="Open cart"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61H19a2 2 0 001.98-1.68L23 6H6" />
              </svg>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center" style={{ background: "#FF9900" }}>
                {count > 9 ? "9+" : count}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 inset-x-0 bg-white rounded-t-2xl z-50 max-h-[75vh] overflow-y-auto transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-5 pb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">Add to Cart</h2>
              <p className="text-sm text-gray-500 truncate max-w-[240px]">{product.name}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
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
                      className={`px-3 py-1.5 rounded border text-sm font-medium transition-all ${
                        selectedVariantId === v.id
                          ? "border-[#FF9900] bg-orange-50 text-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {v.label}
                      <span className="ml-1.5 text-xs text-gray-400">
                        ৳{Number(v.price).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-lg"
                >−</button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-lg"
                >+</button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded">
                {error}
              </p>
            )}

            <div className="border-t border-gray-100 pt-4 flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-400">Subtotal</p>
                <p className="text-xl font-bold" style={{ color: "#B12704" }}>৳{(displayPrice * quantity).toLocaleString()}</p>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded font-bold text-sm text-gray-900 hover:brightness-95 active:scale-[0.98] transition-all"
                style={{ background: "#FFD814", border: "1px solid #FCD200" }}
              >
                {added ? "Added ✓" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
