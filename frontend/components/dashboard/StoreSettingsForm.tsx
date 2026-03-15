"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"

interface Seller {
  owner_name: string
  phone: string | null
  logo_url: string | null
  description: string | null
  store_name: string
  email: string
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">{title}</h2>
      {children}
    </div>
  )
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
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError("Something went wrong.")
    }

    setLoading(false)
  }

  const initials = seller.store_name
    .split(/[\s_-]/)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Section 1 — Store Identity */}
      <Section title="Store Identity">
        {/* Logo */}
        <div className="flex items-center gap-5 mb-6">
          <div className="flex-shrink-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="store logo"
                width={80}
                height={80}
                className="w-20 h-20 rounded-2xl object-cover border border-gray-200"
                onError={() => setLogoUrl("")}
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold">
                {initials}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo URL</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all"
              placeholder="https://res.cloudinary.com/..."
            />
            <p className="text-xs text-gray-400 mt-1">Paste a Cloudinary or any image URL</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Store Info (readonly) */}
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Store URL</p>
              <p className="font-semibold text-indigo-600">{seller.store_name}.storehubbd.com</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Email</p>
              <p className="font-medium truncate">{seller.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
            <input
              name="owner_name"
              type="text"
              required
              defaultValue={seller.owner_name}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={seller.description || ""}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all resize-none"
              placeholder="Tell customers about your store..."
            />
          </div>
        </div>
      </Section>

      {/* Section 2 — Contact */}
      <Section title="Contact">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
          <input
            name="phone"
            type="tel"
            defaultValue={seller.phone || ""}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all"
            placeholder="01711223344"
          />
          <p className="text-xs text-gray-400 mt-1.5">Used for SMS order alerts</p>
        </div>
      </Section>

      {/* Feedback */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Settings saved successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 active:scale-[0.98] transition-all"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </form>
  )
}
