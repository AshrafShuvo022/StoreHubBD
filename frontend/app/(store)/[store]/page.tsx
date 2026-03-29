import { notFound } from "next/navigation"
import Image from "next/image"
import StoreGrid from "@/components/store/StoreGrid"
import StoreSectionRow from "@/components/store/StoreSectionRow"
import CartFab from "@/components/store/CartFab"
import CartIconButton from "@/components/store/CartIconButton"
import SellerContactWidget from "@/components/store/SellerContactWidget"

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

async function getBestSellers(storeName: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/${storeName}/products/best-sellers`, {
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

async function getNewArrivals(storeName: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/${storeName}/products/new-arrivals`, {
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

export async function generateMetadata({ params }: { params: Promise<{ store: string }> }) {
  const { store: storeName } = await params
  const seller = await getStore(storeName)

  if (!seller) return {}

  const name = seller.display_name || seller.store_name
  const description = seller.description
    ? seller.description.slice(0, 160)
    : `Shop at ${name} on StoreHubBD`

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      type: "website",
      images: seller.logo_url ? [{ url: seller.logo_url, width: 400, height: 400, alt: name }] : [],
    },
    twitter: {
      card: "summary",
      title: name,
      description,
      images: seller.logo_url ? [seller.logo_url] : [],
    },
  }
}

export default async function StorePage({ params }: { params: Promise<{ store: string }> }) {
  const { store: storeName } = await params
  const [seller, products, bestSellers, newArrivals] = await Promise.all([
    getStore(storeName),
    getProducts(storeName),
    getBestSellers(storeName),
    getNewArrivals(storeName),
  ])

  if (!seller) notFound()

  const availableProducts = products.filter((p: any) => p.is_available !== false)

  return (
    <div className="min-h-screen" style={{ background: "#f0f2f2" }}>

      {/* Top nav */}
      <div className="sticky top-0 z-20" style={{ background: "#131921" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {seller.logo_url ? (
              <Image
                src={seller.logo_url}
                alt={seller.display_name || seller.store_name}
                width={30}
                height={30}
                className="w-7 h-7 rounded-md object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "#FF9900" }}>
                {(seller.display_name || seller.store_name)[0].toUpperCase()}
              </div>
            )}
            <span className="font-semibold text-white text-sm capitalize">
              {seller.display_name || seller.store_name}
            </span>
          </div>
          <CartIconButton />
        </div>
      </div>

      {/* Store info banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-5 lg:py-6">
          <div className="flex items-center gap-4">
            {seller.logo_url ? (
              <Image
                src={seller.logo_url}
                alt={seller.display_name || seller.store_name}
                width={64}
                height={64}
                className="w-14 h-14 lg:w-16 lg:h-16 rounded-lg object-cover flex-shrink-0 border border-gray-200"
              />
            ) : (
              <div
                className="w-14 h-14 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center text-white text-xl lg:text-2xl font-bold flex-shrink-0"
                style={{ background: "#131921" }}
              >
                {(seller.display_name || seller.store_name)[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 capitalize">
                {seller.display_name || seller.store_name}
              </h1>
              {seller.description && (
                <p className="text-gray-500 text-sm mt-0.5 line-clamp-1 max-w-lg">
                  {seller.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-xs text-gray-500">
                  {availableProducts.length} {availableProducts.length === 1 ? "product" : "products"} available
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Open Now
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4">
        {/* Best Sellers section */}
        <StoreSectionRow title="Best Sellers" badge="HOT" products={bestSellers} />

        {/* New Arrivals section */}
        <StoreSectionRow title="New Arrivals" products={newArrivals} />

        {/* All products grid */}
        {(bestSellers.length > 0 || newArrivals.length > 0) && (
          <div className="mb-3">
            <h2 className="text-sm font-bold text-gray-900">All Products</h2>
          </div>
        )}
        <StoreGrid products={availableProducts} />
      </div>

      {/* Footer */}
      <div className="py-8 text-center border-t border-gray-200 bg-white mt-4">
        <a
          href="http://localhost:3000/register"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Powered by StoreHubBD · Create your free store →
        </a>
      </div>

      <CartFab />
      <SellerContactWidget phone={seller.phone} facebookPage={seller.facebook_page} />
    </div>
  )
}
