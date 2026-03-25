import { notFound } from "next/navigation"
import Image from "next/image"
import StoreGrid from "@/components/store/StoreGrid"
import CartFab from "@/components/store/CartFab"
import CartIconButton from "@/components/store/CartIconButton"

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

      {/* Sticky top nav */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-14 flex items-center px-4">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {seller.logo_url ? (
              <Image
                src={seller.logo_url}
                alt={seller.store_name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {seller.store_name[0].toUpperCase()}
              </div>
            )}
            <span className="font-bold text-gray-900 capitalize text-sm leading-tight">
              {seller.store_name}
            </span>
          </div>
          <CartIconButton />
        </div>
      </div>

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />

        <div className="relative max-w-6xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex items-center gap-5">
            {seller.logo_url ? (
              <Image
                src={seller.logo_url}
                alt={seller.store_name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/25 flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 ring-4 ring-white/10">
                {seller.store_name[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white capitalize leading-tight">
                {seller.store_name}
              </h1>
              {seller.description && (
                <p className="text-indigo-200 text-sm mt-1.5 leading-relaxed max-w-md line-clamp-2">
                  {seller.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-100 bg-white/15 px-3 py-1.5 rounded-full">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  {availableProducts.length} {availableProducts.length === 1 ? "product" : "products"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-100 bg-green-500/20 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Open
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products section */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        <StoreGrid products={availableProducts} />
      </div>

      {/* Footer */}
      <div className="py-8 text-center border-t border-gray-100">
        <a
          href="http://localhost:3000/register"
          className="text-xs text-gray-400 hover:text-indigo-500 transition-colors"
        >
          Powered by StoreHubBD · Create your free store →
        </a>
      </div>

      <CartFab />
    </div>
  )
}
