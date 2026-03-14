"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

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
      is_available: form.get("is_available") === "on",
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
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={initialData?.name}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Handmade Bag"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initialData?.description || ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your product..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price (BDT)</label>
        <input
          name="price"
          type="number"
          required
          min="0"
          step="0.01"
          defaultValue={initialData?.price}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="1200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
          <span className="text-gray-400 font-normal ml-1">(paste Cloudinary or any image URL)</span>
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://res.cloudinary.com/..."
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt="preview"
            className="mt-2 h-32 w-full object-cover rounded-lg border border-gray-200"
            onError={() => setImageUrl("")}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          name="is_available"
          type="checkbox"
          id="is_available"
          defaultChecked={initialData?.is_available ?? true}
          className="w-4 h-4 accent-blue-600"
        />
        <label htmlFor="is_available" className="text-sm text-gray-700">
          Available for sale
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
