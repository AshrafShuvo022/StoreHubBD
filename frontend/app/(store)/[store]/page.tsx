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
    <div className="min-h-screen bg-white">

      {/* Sticky top nav — dark */}
      <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-sm h-14 flex items-center px-4">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {seller.logo_url ? (
              <Image
                src={seller.logo_url}
                alt={seller.store_name}
                width={30}
                height={30}
                className="w-7 h-7 rounded-lg object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {seller.store_name[0].toUpperCase()}
              </div>
            )}
            <span className="font-semibold text-white capitalize text-sm">
              {seller.store_name}
            </span>
          </div>
          <CartIconButton />
        </div>
      </div>

      {/* Store header */}
      <div className="bg-slate-950 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8 lg:py-10">
          <div className="flex items-center gap-5">
            {seller.logo_url ? (
              <Image
                src={seller.logo_url}
                alt={seller.store_name}
                width={72}
                height={72}
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover ring-2 ring-white/10 flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-2xl lg:text-3xl font-bold flex-shrink-0">
                {seller.store_name[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold text-white capitalize">
                {seller.store_name}
              </h1>
              {seller.description && (
                <p className="text-slate-400 text-sm mt-1 leading-relaxed max-w-md line-clamp-2">
                  {seller.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                  {availableProducts.length} {availableProducts.length === 1 ? "product" : "products"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Open
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
        <StoreGrid products={availableProducts} />
      </div>

      {/* Footer */}
      <div className="py-8 text-center border-t border-gray-100 mt-6">
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
