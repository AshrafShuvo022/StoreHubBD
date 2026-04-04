"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import MultiImageUploader from "./MultiImageUploader"

interface Variant {
  label: string
  price: string
  is_available: boolean
}

interface ProductFormProps {
  initialData?: {
    id: string
    name: string
    description: string | null
    price: number
    compare_at_price: number | null
    image_url: string | null
    image_urls: string[]
    is_available: boolean
    has_variants: boolean
    variants: { id: string; label: string; price: number; is_available: boolean }[]
  }
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.image_urls?.length ? initialData.image_urls
    : initialData?.image_url ? [initialData.image_url]
    : []
  )
  const [isAvailable, setIsAvailable] = useState(initialData?.is_available ?? true)
  const [hasVariants, setHasVariants] = useState(initialData?.has_variants ?? false)
  const [variants, setVariants] = useState<Variant[]>(
    initialData?.variants?.map((v) => ({
      label: v.label,
      price: String(v.price),
      is_available: v.is_available,
    })) ?? []
  )

  const isEdit = !!initialData

  function addVariant() {
    setVariants((v) => [...v, { label: "", price: "", is_available: true }])
  }

  function removeVariant(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i))
  }

  function updateVariant(i: number, field: keyof Variant, value: string | boolean) {
    setVariants((v) => v.map((row, idx) => idx === i ? { ...row, [field]: value } : row))
  }

  function toggleVariants(on: boolean) {
    setHasVariants(on)
    if (on && variants.length === 0) {
      setVariants([{ label: "", price: "", is_available: true }])
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (hasVariants && variants.length === 0) {
      setError("Add at least one variant, or turn off variants.")
      return
    }
    if (hasVariants && variants.some((v) => !v.label.trim() || !v.price)) {
      setError("All variants must have a label and price.")
      return
    }

    setLoading(true)

    const form = new FormData(e.currentTarget)
    const body: any = {
      name: form.get("name"),
      description: form.get("description") || null,
      compare_at_price: form.get("compare_at_price") ? parseFloat(form.get("compare_at_price") as string) : null,
      image_url: imageUrls[0] || null,
      image_urls: imageUrls,
      is_available: isAvailable,
      has_variants: hasVariants,
      variants: hasVariants
        ? variants.map((v) => ({
            label: v.label.trim(),
            price: parseFloat(v.price),
            is_available: v.is_available,
          }))
        : [],
    }

    // Base price: if no variants, read from form; if variants, backend sets it to min variant price
    if (!hasVariants) {
      body.price = parseFloat(form.get("price") as string)
    } else {
      body.price = Math.min(...variants.map((v) => parseFloat(v.price) || 0))
    }

    const url = isEdit
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${initialData.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/products`

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || "Failed to save product")
        setLoading(false)
        return
      }

      router.push("/products")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl">
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
              <input
                name="name"
                type="text"
                required
                defaultValue={initialData?.name}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all"
                placeholder="Handmade Bag"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                name="description"
                rows={3}
                defaultValue={initialData?.description || ""}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all resize-none"
                placeholder="Describe your product..."
              />
            </div>

            {/* Price — only shown when no variants */}
            {!hasVariants && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sale Price (BDT)</label>
                  <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-400 transition-all">
                    <span className="px-3 py-2.5 bg-gray-50 text-gray-700 text-sm font-semibold border-r border-gray-200 flex-shrink-0">৳</span>
                    <input
                      name="price"
                      type="number"
                      required={!hasVariants}
                      min="0"
                      step="0.01"
                      defaultValue={initialData?.price}
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                      placeholder="800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Compare at Price
                    <span className="ml-1 text-xs text-gray-400 font-normal">(optional)</span>
                  </label>
                  <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-400 transition-all">
                    <span className="px-3 py-2.5 bg-gray-50 text-gray-700 text-sm font-semibold border-r border-gray-200 flex-shrink-0">৳</span>
                    <input
                      name="compare_at_price"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={initialData?.compare_at_price || ""}
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                      placeholder="1200"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Shows as crossed-out original price</p>
                </div>
              </div>
            )}
          </div>

          {/* Variants Toggle + Table */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-sm font-semibold text-gray-800">Product has variants</p>
                <p className="text-xs text-gray-500 mt-0.5">Sizes, colors, weights, etc. — each with its own price</p>
              </div>
              <button
                type="button"
                onClick={() => toggleVariants(!hasVariants)}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                  hasVariants ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  hasVariants ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>

            {hasVariants && (
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-[1fr_100px_32px] gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-1">
                  <span>Variant (e.g. Small / Red)</span>
                  <span>Price (৳)</span>
                  <span />
                </div>

                {variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-[1fr_100px_32px] gap-2 items-center">
                    <input
                      type="text"
                      value={v.label}
                      onChange={(e) => updateVariant(i, "label", e.target.value)}
                      placeholder="Small / Red"
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => updateVariant(i, "price", e.target.value)}
                      placeholder="450"
                      min="0"
                      step="0.01"
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full mt-1 py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                >
                  + Add Variant
                </button>

                {variants.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Base price will be set to the lowest variant price automatically.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Image Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Photos</label>
            <p className="text-xs text-gray-400 mb-1">Upload multiple photos. First is the main image.</p>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-2.5 py-1.5 mb-3">
              Square images (1:1) look best — e.g. 800×800 or 1000×1000px. Any size works but may be auto-cropped.
            </p>
            <MultiImageUploader value={imageUrls} onChange={setImageUrls} />
          </div>

          {/* Availability Toggle */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Available for sale</p>
                <p className="text-xs text-gray-500 mt-0.5">Visible on your store when enabled</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailable((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  isAvailable ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  isAvailable ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 active:scale-[0.98] transition-all"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
