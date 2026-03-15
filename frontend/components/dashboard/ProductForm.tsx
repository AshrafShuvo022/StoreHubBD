"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"

interface ProductFormProps {
  initialData?: {
    id: string
    name: string
    description: string | null
    price: number
    image_url: string | null
    is_available: boolean
  }
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "")
  const [isAvailable, setIsAvailable] = useState(initialData?.is_available ?? true)

  const isEdit = !!initialData

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const body = {
      name: form.get("name"),
      description: form.get("description") || null,
      price: parseFloat(form.get("price") as string),
      image_url: imageUrl || null,
      is_available: isAvailable,
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
    <form onSubmit={handleSubmit} className="max-w-3xl">
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
                rows={4}
                defaultValue={initialData?.description || ""}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all resize-none"
                placeholder="Describe your product..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (BDT)</label>
              <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-400 transition-all">
                <span className="px-3 py-2.5 bg-gray-50 text-gray-700 text-sm font-semibold border-r border-gray-200 flex-shrink-0">
                  ৳
                </span>
                <input
                  name="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  defaultValue={initialData?.price}
                  className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                  placeholder="1200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Image Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">Product Image</label>

            {imageUrl ? (
              <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-gray-200 mb-3">
                <Image
                  src={imageUrl}
                  alt="preview"
                  fill
                  className="object-cover"
                  onError={() => setImageUrl("")}
                />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="aspect-square w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-3 bg-gray-50">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p className="text-xs text-gray-400">No image yet</p>
              </div>
            )}

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all"
              placeholder="Paste image URL..."
            />
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
