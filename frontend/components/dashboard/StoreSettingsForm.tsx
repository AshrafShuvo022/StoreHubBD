"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import ImageUploader from "./ImageUploader"

interface Seller {
  store_name: string
  display_name: string | null
  owner_name: string
  phone: string | null
  facebook_page: string | null
  logo_url: string | null
  description: string | null
  email: string
  show_best_sellers: boolean
  show_new_arrivals: boolean
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
  const [showBestSellers, setShowBestSellers] = useState(seller.show_best_sellers)
  const [showNewArrivals, setShowNewArrivals] = useState(seller.show_new_arrivals)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const body = {
      display_name: (form.get("display_name") as string)?.trim() || null,
      owner_name: form.get("owner_name"),
      phone: form.get("phone") || null,
      facebook_page: (form.get("facebook_page") as string)?.trim().replace(/^(https?:\/\/)?(www\.)?facebook\.com\//i, "").replace(/\/$/, "") || null,
      logo_url: logoUrl || null,
      description: form.get("description") || null,
      show_best_sellers: showBestSellers,
      show_new_arrivals: showNewArrivals,
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
        <div className="flex items-start gap-5 mb-6">
          <div className="w-32 flex-shrink-0">
            <ImageUploader value={logoUrl} onChange={setLogoUrl} />
          </div>
          <div className="pt-1">
            <p className="text-sm font-semibold text-gray-800">Store Logo</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Upload a square image for best results.<br />JPG, PNG or WebP · Max 5MB
            </p>
            {!logoUrl && (
              <div className="mt-3 w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold" style={{ background: "#131921" }}>
                {initials}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Store Info (readonly) */}
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Store URL (permanent)</p>
              <p className="font-semibold font-mono text-xs" style={{ color: "#007185" }}>{seller.store_name}.storehubbd.com</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Email</p>
              <p className="font-medium truncate">{seller.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Display Name</label>
            <input
              name="display_name"
              type="text"
              defaultValue={seller.display_name || ""}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] transition-all"
              placeholder={seller.store_name}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              What customers see instead of your URL slug. Leave blank to use <span className="font-mono">{seller.store_name}</span>.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
            <input
              name="owner_name"
              type="text"
              required
              defaultValue={seller.owner_name}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={seller.description || ""}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] transition-all resize-none"
              placeholder="Tell customers about your store..."
            />
          </div>
        </div>
      </Section>

      {/* Section 2 — Contact */}
      <Section title="Contact">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp / Phone Number</label>
            <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9900] focus-within:border-[#FF9900] transition-all">
              <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-sm border-r border-gray-200 flex-shrink-0">+880</span>
              <input
                name="phone"
                type="tel"
                defaultValue={seller.phone || ""}
                className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                placeholder="1711223344"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Shown as WhatsApp button on your store. Also used for SMS order alerts.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook Page</label>
            <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9900] focus-within:border-[#FF9900] transition-all">
              <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-sm border-r border-gray-200 flex-shrink-0 whitespace-nowrap">facebook.com/</span>
              <input
                name="facebook_page"
                type="text"
                defaultValue={seller.facebook_page || ""}
                className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                placeholder="arjhafashion"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Shown as Messenger button on your store. Enter your page username only.</p>
          </div>
        </div>
      </Section>

      {/* Section 3 — Store Sections */}
      <Section title="Store Sections">
        <p className="text-xs text-gray-500 mb-4">Choose which sections appear on your store homepage. Sections only show when there is data to display.</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Best Sellers</p>
              <p className="text-xs text-gray-400 mt-0.5">Shows your top-ordered products automatically</p>
            </div>
            <button
              type="button"
              onClick={() => setShowBestSellers((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${showBestSellers ? "bg-indigo-600" : "bg-gray-200"}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${showBestSellers ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">New Arrivals</p>
              <p className="text-xs text-gray-400 mt-0.5">Shows your most recently added products</p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewArrivals((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${showNewArrivals ? "bg-indigo-600" : "bg-gray-200"}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${showNewArrivals ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
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
        className="w-full sm:w-auto px-8 py-2.5 rounded-xl text-sm font-bold text-gray-900 hover:brightness-95 disabled:opacity-50 active:scale-[0.98] transition-all"
        style={{ background: "#FFD814", border: "1px solid #FCD200" }}
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </form>
  )
}
