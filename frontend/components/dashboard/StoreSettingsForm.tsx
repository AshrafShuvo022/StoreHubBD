"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

interface Seller {
  owner_name: string
  phone: string | null
  logo_url: string | null
  description: string | null
  store_name: string
  email: string
}

export default function StoreSettingsForm({ seller }: { seller: Seller }) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [logoUrl, setLogoUrl] = useState(seller.logo_url || "")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const body = {
      owner_name: form.get("owner_name"),
      phone: form.get("phone") || null,
      logo_url: logoUrl || null,
      description: form.get("description") || null,
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || "Failed to save settings")
      } else {
        setSuccess(true)
      }
    } catch {
      setError("Something went wrong.")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
        <div><span className="font-medium">Store URL:</span> {seller.store_name}.storehubbd.com</div>
        <div><span className="font-medium">Email:</span> {seller.email}</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
        <input
          name="owner_name"
          type="text"
          required
          defaultValue={seller.owner_name}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          name="phone"
          type="tel"
          defaultValue={seller.phone || ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="01711223344"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={seller.description || ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell customers about your store..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logo URL
          <span className="text-gray-400 font-normal ml-1">(paste Cloudinary or any image URL)</span>
        </label>
        <input
          type="url"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://res.cloudinary.com/..."
        />
        {logoUrl && (
          <img
            src={logoUrl}
            alt="logo preview"
            className="mt-2 h-20 w-20 object-cover rounded-full border border-gray-200"
            onError={() => setLogoUrl("")}
          />
        )}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      {success && <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">Settings saved successfully.</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </form>
  )
}
