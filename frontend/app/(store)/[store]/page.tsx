import { notFound } from "next/navigation"
import Image from "next/image"
import StoreGrid from "@/components/store/StoreGrid"
import StoreSectionRow from "@/components/store/StoreSectionRow"
import NewArrivalsCarousel from "@/components/store/NewArrivalsCarousel"
import CartFab from "@/components/store/CartFab"
import SellerContactWidget from "@/components/store/SellerContactWidget"
import StorePageClient from "@/components/store/StorePageClient"

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

  const storeName_ = seller.display_name || seller.store_name

  const heroBanner = (
    <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a2332 0%, #131921 60%, #0f1923 100%)" }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: "#FF9900", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5" style={{ background: "#FF9900", transform: "translate(-30%, 30%)" }} />

        <div className="relative max-w-6xl mx-auto px-4 lg:px-6 py-8 lg:py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Logo */}
            {seller.logo_url ? (
              <Image
                src={seller.logo_url}
                alt={storeName_}
                width={88}
                height={88}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover flex-shrink-0 ring-2 ring-white/20 shadow-xl"
              />
            ) : (
              <div
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center text-white text-3xl lg:text-4xl font-black flex-shrink-0 shadow-xl ring-2 ring-white/10"
                style={{ background: "linear-gradient(135deg, #FF9900, #e07b00)" }}
              >
                {storeName_[0].toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div className="text-center sm:text-left min-w-0 flex-1">
              <h1 className="text-2xl lg:text-3xl font-black text-white capitalize leading-tight mb-1">
                {storeName_}
              </h1>
              {seller.description && (
                <p className="text-gray-400 text-sm leading-relaxed mb-3 max-w-lg line-clamp-2">
                  {seller.description}
                </p>
              )}
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Open Now
                </span>
                <span className="text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  {availableProducts.length} {availableProducts.length === 1 ? "product" : "products"}
                </span>
                {seller.phone && (
                  <a
                    href={`https://wa.me/880${seller.phone.replace(/^(\+880|880|0)/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                )}
                {seller.facebook_page && (
                  <a
                    href={`https://m.me/${seller.facebook_page}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-[#0084FF]/30 bg-[#0084FF]/10 text-[#60a5fa] hover:bg-[#0084FF]/20 transition-all"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/></svg>
                    Messenger
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  )

  return (
    <div className="min-h-screen" style={{ background: "#f0f2f2" }}>
      <StorePageClient
        storeName={storeName_}
        logoUrl={seller.logo_url}
        heroContent={heroBanner}
      >

      {/* Products */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-5">
        <StoreSectionRow title="Best Sellers" badge="HOT" products={bestSellers} />
        <NewArrivalsCarousel products={newArrivals} />
        {(bestSellers.length > 0 || newArrivals.length > 0) && (
          <div className="mb-3">
            <h2 className="text-sm font-bold text-gray-900">All Products</h2>
          </div>
        )}
        <StoreGrid products={availableProducts} />
      </div>

      {/* Footer */}
      <footer style={{ background: "#131921" }}>
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Store info */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                {seller.logo_url ? (
                  <Image src={seller.logo_url} alt={storeName_} width={40} height={40} className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg" style={{ background: "#FF9900" }}>
                    {storeName_[0].toUpperCase()}
                  </div>
                )}
                <p className="text-white font-bold capitalize">{storeName_}</p>
              </div>
              {seller.description && (
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{seller.description}</p>
              )}
              <p className="text-gray-500 text-xs mt-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Open & accepting orders
              </p>
            </div>

            {/* Contact */}
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Contact</p>
              <div className="space-y-2">
                {seller.phone && (
                  <a
                    href={`https://wa.me/880${seller.phone.replace(/^(\+880|880|0)/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Chat on WhatsApp
                  </a>
                )}
                {seller.facebook_page && (
                  <a
                    href={`https://m.me/${seller.facebook_page}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0084FF"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/></svg>
                    Message on Messenger
                  </a>
                )}
              </div>
            </div>

            {/* Powered by */}
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Powered By</p>
              <a
                href={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}
                className="inline-flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: "#FF9900" }}>S</div>
                <div>
                  <p className="text-white text-sm font-bold group-hover:text-[#FF9900] transition-colors">StoreHubBD</p>
                  <p className="text-gray-500 text-xs">Create your free store →</p>
                </div>
              </a>
              <p className="text-gray-600 text-xs mt-4">
                Built for Bangladeshi sellers.<br />
                Simple. Fast. Professional.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-gray-600 text-xs">© {new Date().getFullYear()} {storeName_}. All rights reserved.</p>
            <p className="text-gray-600 text-xs">Powered by <span className="text-gray-400 font-medium">StoreHubBD</span></p>
          </div>
        </div>
      </footer>

      </StorePageClient>

      <CartFab />
      <SellerContactWidget phone={seller.phone} facebookPage={seller.facebook_page} />
    </div>
  )
}
