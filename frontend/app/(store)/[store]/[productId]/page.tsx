import { notFound } from "next/navigation"
import Link from "next/link"
import OrderSheet from "@/components/store/OrderSheet"
import OrderFormInline from "@/components/store/OrderFormInline"
import CartIconButton from "@/components/store/CartIconButton"
import ProductImageGallery from "@/components/store/ProductImageGallery"

async function getProduct(storeName: string, productId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/store/${storeName}/products/${productId}`,
    { cache: "no-store" }
  )
  if (!res.ok) return null
  return res.json()
}

async function getStore(storeName: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/${storeName}`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ store: string; productId: string }>
}) {
  const { store: storeName, productId } = await params
  const [product, seller] = await Promise.all([
    getProduct(storeName, productId),
    getStore(storeName),
  ])

  if (!product) notFound()

  return (
    <div className="min-h-screen bg-white">

      {/* Sticky top nav */}
      <div className="sticky top-0 z-20" style={{ background: "#131921" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {seller ? (
              <span className="capitalize">{seller.display_name || seller.store_name}</span>
            ) : (
              "Back"
            )}
          </Link>
          <CartIconButton />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden">
        <div className="relative w-full bg-gray-50" style={{ minHeight: "320px" }}>
          <ProductImageGallery
            images={product.image_urls?.length ? product.image_urls : product.image_url ? [product.image_url] : []}
            productName={product.name}
          />
          <div className="absolute top-3 left-3 z-10">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
              product.is_available
                ? "bg-[#007600] text-white"
                : "bg-gray-700 text-gray-300"
            }`}>
              {product.is_available ? "In Stock" : "Unavailable"}
            </span>
          </div>
        </div>

        <div className="px-4 pt-5 pb-36 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900 leading-snug mb-2">
            {product.name}
          </h1>
          <div className="mb-1">
            <span className="text-2xl font-bold" style={{ color: "#B12704" }}>
              ৳{Number(product.price).toLocaleString()}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                ৳{Number(product.compare_at_price).toLocaleString()}
              </span>
            )}
          </div>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="inline-block mb-2 text-xs font-bold text-white px-2 py-0.5 rounded" style={{ background: "#B12704" }}>
              {Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
            </span>
          )}
          <p className="text-xs text-gray-500 mb-2">Inclusive of all taxes</p>
          {product.order_count > 0 && (
            <p className="text-xs text-gray-500 mb-4">
              <span className="font-semibold text-gray-700">{product.order_count}+</span> people ordered this
            </p>
          )}
          {!product.order_count && <div className="mb-4" />}

          {product.description && (
            <>
              <div className="h-px bg-gray-100 mb-4" />
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </>
          )}
        </div>

        {/* Ask the seller — mobile */}
        {seller && (seller.phone || seller.facebook_page) && (
          <div className="px-4 py-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Ask the seller</p>
            <div className="flex gap-2 flex-wrap">
              {seller.phone && (
                <a
                  href={`https://wa.me/880${seller.phone.replace(/^(\+880|880|0)/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
                  style={{ background: "#25D366" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
                  style={{ background: "#0084FF" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
                  </svg>
                  Messenger
                </a>
              )}
            </div>
          </div>
        )}

        {product.is_available && (
          <OrderSheet product={product} storeName={storeName} />
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block" style={{ background: "#f0f2f2" }}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-[1fr_400px] gap-5 items-start">

            {/* Left: image gallery */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-20" style={{ aspectRatio: "1/1" }}>
              <ProductImageGallery
                images={product.image_urls?.length ? product.image_urls : product.image_url ? [product.image_url] : []}
                productName={product.name}
              />
            </div>

            {/* Right: info + order */}
            <div className="space-y-3">
              {/* Product info card */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h1 className="text-xl font-semibold text-gray-900 leading-snug mb-3">
                  {product.name}
                </h1>

                <div className="border-t border-gray-100 pt-3 mb-3">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-bold" style={{ color: "#B12704" }}>
                      ৳{Number(product.price).toLocaleString()}
                    </span>
                    {product.compare_at_price && product.compare_at_price > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ৳{Number(product.compare_at_price).toLocaleString()}
                      </span>
                    )}
                    {product.compare_at_price && product.compare_at_price > product.price && (
                      <span className="text-xs font-bold text-white px-2 py-0.5 rounded" style={{ background: "#B12704" }}>
                        {Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Inclusive of all taxes</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${product.is_available ? "text-[#007600]" : "text-gray-500"}`}>
                    {product.is_available ? "In Stock" : "Currently unavailable"}
                  </span>
                  {product.order_count > 0 && (
                    <span className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">{product.order_count}+</span> sold
                    </span>
                  )}
                </div>

                {product.description && (
                  <div className="border-t border-gray-100 mt-3 pt-3">
                    <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                )}
              </div>

              {/* Order card */}
              {product.is_available ? (
                <OrderFormInline product={product} storeName={storeName} />
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
                  <p className="text-gray-500 text-sm">This product is currently unavailable.</p>
                  <Link href="/" className="mt-3 inline-block text-sm font-semibold hover:underline" style={{ color: "#007185" }}>
                    Browse other products →
                  </Link>
                </div>
              )}

              {/* Ask the seller — desktop */}
              {seller && (seller.phone || seller.facebook_page) && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Ask the seller</p>
                  <div className="flex gap-2 flex-wrap">
                    {seller.phone && (
                      <a
                        href={`https://wa.me/880${seller.phone.replace(/^(\+880|880|0)/, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
                        style={{ background: "#25D366" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
                        style={{ background: "#0084FF" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
                        </svg>
                        Messenger
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
