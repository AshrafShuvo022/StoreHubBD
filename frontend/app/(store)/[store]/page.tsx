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

              {/* Contact buttons */}
              {(seller.phone || seller.facebook_page) && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {seller.phone && (
                    <a
                      href={`https://wa.me/880${seller.phone.replace(/^(\+880|880|0)/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:brightness-95"
                      style={{ background: "#25D366" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  )}
                  {seller.facebook_page && (
                    <a
                      href={`https://m.me/${seller.facebook_page}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:brightness-95"
                      style={{ background: "#0084FF" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
                      </svg>
                      Message
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4">
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
    </div>
  )
}
