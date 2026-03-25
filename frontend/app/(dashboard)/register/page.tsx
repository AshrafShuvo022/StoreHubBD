"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [storeSlug, setStoreSlug] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const body = {
      store_name: (form.get("store_name") as string).toLowerCase().trim(),
      display_name: (form.get("display_name") as string)?.trim() || undefined,
      owner_name: form.get("owner_name"),
      email: form.get("email"),
      password: form.get("password"),
      phone: form.get("phone") || undefined,
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || "Registration failed")
        setLoading(false)
        return
      }

      await signIn("credentials", {
        email: body.email,
        password: form.get("password"),
        redirect: false,
      })

      router.push("/dashboard")
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — desktop only */}
      <div className="hidden md:flex md:w-[45%] flex-col justify-between p-10" style={{ background: "#131921" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#FF9900" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#131921">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
            </svg>
          </div>
          <span className="font-bold text-white tracking-tight">StoreHubBD</span>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white leading-snug">
            Your professional store,
            <br />
            ready in 60 seconds.
          </h2>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed">
            Stop taking orders over DMs. Give every customer a real checkout link.
          </p>
          <div className="mt-8 space-y-3 text-sm text-gray-400">
            {[
              "✓  Your own store link",
              "✓  SMS alerts on every order",
              "✓  Order tracking dashboard",
              "✓  Free forever for small stores",
            ].map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>

        <p className="text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-semibold hover:underline">
            Sign in →
          </Link>
        </p>
      </div>

      {/* Right Panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="flex items-center gap-2.5 mb-8 md:hidden">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#FF9900" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#131921">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 tracking-tight">StoreHubBD</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Create your store</h1>
          <p className="text-gray-500 text-sm mt-1">Start selling in under a minute</p>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
              <div className="flex items-stretch border border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9900] focus-within:border-[#FF9900] transition-all">
                <input
                  name="store_name"
                  type="text"
                  required
                  pattern="[a-zA-Z0-9]+"
                  value={storeSlug}
                  onChange={(e) => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                  className="flex-1 px-4 py-2.5 text-sm outline-none bg-white"
                  placeholder="arjha"
                />
                <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-sm font-medium border-l border-gray-200 flex-shrink-0">
                  .storehubbd.com
                </span>
              </div>
              {storeSlug && (
                <p className="text-xs mt-1.5 animate-fade-in" style={{ color: "#007185" }}>
                  Your store will be at:{" "}
                  <span className="font-semibold">{storeSlug}.storehubbd.com</span>
                </p>
              )}
              {!storeSlug && (
                <p className="text-xs text-gray-400 mt-1.5">Letters and numbers only.</p>
              )}
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Store Display Name <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                name="display_name"
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] transition-all"
                placeholder="Arjha Fashion Store"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                What customers see. Your URL slug (<span className="font-mono">{storeSlug || "yourstore"}</span>) stays permanent.
              </p>
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
              <input
                name="owner_name"
                type="text"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] transition-all"
                placeholder="Rahim Uddin"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone <span className="text-gray-400 font-normal">(for SMS alerts)</span>
              </label>
              <div className="flex items-stretch border border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9900] focus-within:border-[#FF9900] transition-all">
                <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-sm border-r border-gray-200 flex-shrink-0">
                  +880
                </span>
                <input
                  name="phone"
                  type="tel"
                  className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                  placeholder="1711223344"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] transition-all pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded font-bold text-sm text-gray-900 hover:brightness-95 disabled:opacity-50 active:scale-[0.98] transition-all mt-2"
              style={{ background: "#FFD814", border: "1px solid #FCD200" }}
            >
              {loading ? "Creating store..." : "Create My Store →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: "#007185" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
