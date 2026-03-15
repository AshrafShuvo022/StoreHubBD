"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [shake, setShake] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Invalid email or password")
      setShake(true)
      setTimeout(() => setShake(false), 400)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — desktop only */}
      <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-indigo-700 to-indigo-900 flex-col justify-between p-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
            </svg>
          </div>
          <span className="font-bold text-white tracking-tight">StoreHubBD</span>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white leading-snug">
            Welcome back.
            <br />
            Your orders are waiting.
          </h2>
          <p className="text-indigo-200 mt-3 text-sm">
            Manage your store, track orders, and keep customers happy.
          </p>

          {/* Static status badges */}
          <div className="mt-8 space-y-2">
            {[
              { label: "ARJ-0042 · Pending", color: "bg-amber-400/20 text-amber-200" },
              { label: "ARJ-0041 · Delivered", color: "bg-green-400/20 text-green-200" },
              { label: "ARJ-0040 · Shipped", color: "bg-indigo-300/20 text-indigo-100" },
            ].map((b) => (
              <div
                key={b.label}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${b.color}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                {b.label}
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-300 text-sm">
          No account?{" "}
          <Link href="/register" className="text-white font-semibold hover:underline">
            Create your free store →
          </Link>
        </p>
      </div>

      {/* Right Panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className={`w-full max-w-sm ${shake ? "animate-shake" : ""}`}>
          {/* Mobile brand */}
          <div className="flex items-center gap-2.5 mb-8 md:hidden">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 tracking-tight">StoreHubBD</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back to your seller dashboard</p>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <button type="button" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all pr-11"
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
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 active:scale-[0.98] transition-all mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account?{" "}
            <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
              Create your free store →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
