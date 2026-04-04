import { notFound } from "next/navigation"
import Link from "next/link"
import OrderSheet from "@/components/store/OrderSheet"
import OrderFormInline from "@/components/store/OrderFormInline"
import CartIconButton from "@/components/store/CartIconButton"
import ProductImageGallery from "@/components/store/ProductImageGallery"
import ProductShareBar from "@/components/store/ProductShareBar"
import SellerContactButtons from "@/components/store/SellerContactButtons"

async function getProduct(storeName: string, slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/store/${storeName}/products/${slug}`,
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ store: string; productId: string }>
}) {
  const { store: storeName, productId: slug } = await params
  const [product, seller] = await Promise.all([
    getProduct(storeName, slug),
    getStore(storeName),
  ])

  if (!product) return {}

  const storeName_ = seller?.display_name || seller?.store_name || storeName
  const description = product.description
    ? product.description.slice(0, 160)
    : `৳${Number(product.price).toLocaleString()} — Available at ${storeName_}`

  return {
    title: `${product.name} — ${storeName_}`,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: product.image_url ? [{ url: product.image_url, width: 800, height: 800, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ store: string; productId: string }>
}) {
  const { store: storeName, productId: slug } = await params
  const [product, seller] = await Promise.all([
    getProduct(storeName, slug),
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
        <div className="relative w-full">
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

        <div className="px-4 pt-5 pb-5 border-b border-gray-100">
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

        {/* Share — mobile */}
        <div className="px-4 py-3 border-t border-gray-100 pb-4">
          <ProductShareBar productName={product.name} />
        </div>

        {/* Ask the seller — mobile */}
        {seller && (seller.phone || seller.facebook_page) && (
          <div className="px-4 py-4 pb-36 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ask the seller</p>
            <SellerContactButtons phone={seller.phone} facebookPage={seller.facebook_page} />
          </div>
        )}

        {product.is_available && (
          <OrderSheet product={product} storeName={storeName} />
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block" style={{ background: "#f0f2f2" }}>
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-[420px_1fr] gap-6 items-start">

            {/* Left: image gallery */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-20" style={{ aspectRatio: "1/1", maxWidth: "420px" }}>
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

                <div className="border-t border-gray-100 mt-3 pt-3">
                  <ProductShareBar productName={product.name} />
                </div>
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
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ask the seller</p>
                  <SellerContactButtons phone={seller.phone} facebookPage={seller.facebook_page} />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
