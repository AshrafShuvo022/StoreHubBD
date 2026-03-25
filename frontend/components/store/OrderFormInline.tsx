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

export default function OrderFormInline({
  product,
}: {
  product: Product
  storeName: string
}) {
  const { addItem, openCart } = useCart()
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
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Add to Cart</h2>

      <div className="space-y-5">
        {/* Variant selector */}
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
                  {v.label}
                  <span className={`ml-1.5 text-xs ${selectedVariantId === v.id ? "text-indigo-200" : "text-gray-400"}`}>
                    ৳{Number(v.price).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition text-xl font-light"
            >−</button>
            <span className="w-8 text-center font-bold text-lg">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition text-xl font-light"
            >+</button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">{error}</p>
        )}

        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="text-2xl font-bold text-indigo-600">৳{(displayPrice * quantity).toLocaleString()}</span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-base hover:bg-indigo-700 active:scale-[0.98] transition-all"
            >
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={openCart}
              aria-label="View cart"
              className="px-4 py-3.5 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61H19a2 2 0 001.98-1.68L23 6H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
