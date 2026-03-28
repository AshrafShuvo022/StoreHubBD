"use client"

import { useState, useEffect } from "react"
import { signIn, getSession, signOut } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#FF9900" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#131921">
          <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
        </svg>
      </div>
      <span className="font-bold text-white tracking-tight">StoreHubBD</span>
    </div>
  )
}

// ── Root domain: "Find your store" ────────────────────────────────────────────
function StoreFinder() {
  const [slug, setSlug] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleFind(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const name = slug.trim().toLowerCase()
    if (!name) return

    setLoading(true)
    // Verify the store exists before redirecting
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/${name}`)
      if (!res.ok) {
        setError("No store found with that name. Check the spelling and try again.")
        setLoading(false)
        return
      }
    } catch {
      setError("Could not connect. Please try again.")
      setLoading(false)
      return
    }

    const { port } = window.location
    const host = port ? `${name}.localhost:${port}` : `${name}.localhost`
    window.location.href = `http://${host}/login`
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex md:w-[45%] flex-col justify-between p-10" style={{ background: "#131921" }}>
        <BrandLogo />
        <div>
          <h2 className="text-2xl font-extrabold text-white leading-snug">
            Sign in to your store.
          </h2>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed">
            Every store has its own login page at<br />
            <span className="text-gray-300 font-mono text-xs">yourstore.storehubbd.com</span>
          </p>
          <div className="mt-8 space-y-2 text-sm text-gray-500">
            <p>Enter your store name to continue →</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          No store yet?{" "}
          <Link href="/register" className="text-white font-semibold hover:underline">
            Create one free →
          </Link>
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
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

          <h1 className="text-2xl font-bold text-gray-900">Find your store</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your store name to go to your login page</p>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleFind} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
              <div className="flex items-stretch border border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9900] focus-within:border-[#FF9900] transition-all">
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                  className="flex-1 px-4 py-2.5 text-sm outline-none bg-white"
                  placeholder="arjha"
                  autoFocus
                />
                <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-sm border-l border-gray-200 flex-shrink-0 whitespace-nowrap">
                  .storehubbd.com
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !slug}
              className="w-full py-3 rounded font-bold text-sm text-gray-900 hover:brightness-95 disabled:opacity-50 transition-all"
              style={{ background: "#FFD814", border: "1px solid #FCD200" }}
            >
              {loading ? "Looking up store..." : "Continue →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            No store yet?{" "}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: "#007185" }}>
              Create your free store →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Subdomain: full email + password login ────────────────────────────────────
function StoreLogin({ storeName }: { storeName: string }) {
  const searchParams = useSearchParams()
  const switchingFrom = searchParams.get("switch")
  const justRegistered = searchParams.get("registered") === "true"
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
      store_name: storeName,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      // Show the specific error from backend if available
      setError(result.error === "CredentialsSignin"
        ? "Invalid email or password for this store"
        : result.error)
      setShake(true)
      setTimeout(() => setShake(false), 400)
    } else {
      // Full page load (not router.push) so the session cookie is sent in the
      // initial HTML request — prevents the sidebar flash where auth() returns
      // null on the first RSC fetch right after signIn sets the cookie
      window.location.href = "/dashboard"
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex md:w-[45%] flex-col justify-between p-10" style={{ background: "#131921" }}>
        <BrandLogo />
        <div>
          <h2 className="text-2xl font-extrabold text-white leading-snug">
            Welcome back.
            <br />
            Your orders are waiting.
          </h2>
          <p className="text-gray-400 mt-3 text-sm">
            Manage your store, track orders, and keep customers happy.
          </p>
          <div className="mt-6 px-4 py-3 rounded-lg" style={{ background: "rgba(255,153,0,0.1)", border: "1px solid rgba(255,153,0,0.2)" }}>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Signing in to</p>
            <p className="text-white font-bold capitalize text-lg">{storeName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{storeName}.storehubbd.com</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          No account?{" "}
          <Link href="/register" className="text-white font-semibold hover:underline">
            Create your free store →
          </Link>
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className={`w-full max-w-sm ${shake ? "animate-shake" : ""}`}>
          {/* Mobile brand */}
          <div className="flex items-center gap-2.5 mb-6 md:hidden">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#FF9900" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#131921">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 tracking-tight">StoreHubBD</span>
          </div>

          {/* Store context badge */}
          <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded border border-gray-200 bg-gray-50 w-fit">
            <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: "#131921" }}>
              {storeName[0].toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-gray-700 capitalize">{storeName}</span>
            <a href="/" className="text-xs ml-1" style={{ color: "#007185" }}>Change</a>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your <span className="font-medium capitalize">{storeName}</span> dashboard</p>

          {justRegistered && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Store created! Sign in to open your dashboard.
            </div>
          )}

          {switchingFrom && (
            <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded flex items-start gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div>
                <p className="font-semibold">Currently logged in as <span className="capitalize">{switchingFrom}</span></p>
                <p className="text-xs text-amber-700 mt-0.5">Sign in below to switch accounts.</p>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: window.location.href })}
                  className="text-xs font-semibold underline mt-1 text-amber-900 hover:text-amber-700"
                >
                  Go back to {switchingFrom} →
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                autoFocus
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <button type="button" className="text-xs font-medium" style={{ color: "#007185" }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account?{" "}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: "#007185" }}>
              Create your free store →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Page: detect root vs subdomain ────────────────────────────────────────────
export default function LoginPage() {
  const [storeName, setStoreName] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const hostname = window.location.hostname
    const isSubdomain = hostname !== "localhost" && hostname !== "127.0.0.1"
    setStoreName(isSubdomain ? hostname.split(".")[0] : null)
    setReady(true)
  }, [])

  if (!ready) return null // avoid hydration flash

  return storeName ? <StoreLogin storeName={storeName} /> : <StoreFinder />
}
