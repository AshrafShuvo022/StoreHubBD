import Link from "next/link"

export default function StoreNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 text-center">
      <div className="max-w-xs">
        {/* Broken storefront illustration */}
        <div className="flex justify-center mb-6">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <rect x="15" y="45" width="70" height="45" rx="4" stroke="#D1D5DB" strokeWidth="3" />
            <path d="M10 45L25 20h50l15 25" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
            <rect x="35" y="60" width="18" height="30" rx="2" stroke="#D1D5DB" strokeWidth="2.5" />
            <rect x="58" y="65" width="15" height="12" rx="2" stroke="#D1D5DB" strokeWidth="2.5" />
            <circle cx="72" cy="38" r="5" stroke="#E5E7EB" strokeWidth="2" />
            <line x1="68" y1="38" x2="76" y2="38" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
            <line x1="72" y1="34" x2="72" y2="42" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Store not found</h1>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          This store doesn&apos;t exist or has been deactivated.
        </p>

        <div className="w-12 h-px bg-gray-200 mx-auto my-5" />

        <Link
          href="http://app.localhost:3000"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          Go to StoreHubBD
        </Link>
      </div>
    </div>
  )
}
