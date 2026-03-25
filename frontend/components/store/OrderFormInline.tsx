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
    <div className="bg-white rounded-lg border border-gray-200 p-5">

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
            <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
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

        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">
              Subtotal ({quantity} {quantity === 1 ? "item" : "items"})
            </span>
            <span className="text-xl font-bold" style={{ color: "#B12704" }}>
              ৳{(displayPrice * quantity).toLocaleString()}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-2.5 rounded font-bold text-sm text-gray-900 hover:brightness-95 active:scale-[0.98] transition-all"
              style={{ background: "#FFD814", border: "1px solid #FCD200" }}
            >
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={openCart}
              aria-label="View cart"
              className="px-3.5 py-2.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
