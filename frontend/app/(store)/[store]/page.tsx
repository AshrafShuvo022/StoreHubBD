import { notFound } from "next/navigation"
import Image from "next/image"
import StoreGrid from "@/components/store/StoreGrid"

async function getStore(storeName: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/${storeName}`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

async function getProducts(storeName: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/${storeName}/products`, {
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

export default async function StorePage({ params }: { params: Promise<{ store: string }> }) {
  const { store: storeName } = await params
  const [seller, products] = await Promise.all([getStore(storeName), getProducts(storeName)])

  if (!seller) notFound()

  const availableProducts = products.filter((p: any) => p.is_available !== false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Banner — taller on desktop */}
      <div className="h-32 lg:h-48 bg-gradient-to-br from-indigo-600 to-indigo-500 relative" />

      {/* Content area — max-w-6xl on desktop */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* Store Identity */}
        <div className="pb-4">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            {seller.logo_url ? (
              <Image
                src={seller.logo_url}
                alt={seller.store_name}
                width={72}
                height={72}
                className="w-18 h-18 rounded-2xl object-cover ring-4 ring-white flex-shrink-0"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-2xl bg-indigo-600 ring-4 ring-white flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {seller.store_name[0].toUpperCase()}
              </div>
            )}
            <div className="pb-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 capitalize leading-tight truncate">
                {seller.store_name}
              </h1>
              {seller.description && (
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{seller.description}</p>
              )}
            </div>
          </div>

          {/* Meta chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {availableProducts.length} {availableProducts.length === 1 ? "product" : "products"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-4" />

        {/* Product Grid with Search */}
        <StoreGrid products={availableProducts} />
      </div>

      {/* Powered by footer */}
      <div className="pb-6 text-center">
        <a
          href="http://app.localhost:3000/register"
          className="text-xs text-gray-400 hover:text-indigo-500 transition-colors"
        >
          Powered by StoreHubBD · Create your free store →
        </a>
      </div>
    </div>
  )
}
