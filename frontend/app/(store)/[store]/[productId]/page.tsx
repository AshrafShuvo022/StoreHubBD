import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import OrderSheet from "@/components/store/OrderSheet"
import OrderFormInline from "@/components/store/OrderFormInline"

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
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        {seller && (
          <div className="flex items-center gap-2">
            {seller.logo_url ? (
              <Image
                src={seller.logo_url}
                alt={seller.store_name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                {seller.store_name[0].toUpperCase()}
              </div>
            )}
            <span className="text-sm font-semibold text-gray-700 capitalize">{seller.store_name}</span>
          </div>
        )}
      </div>

      {/* Mobile layout (< lg) */}
      <div className="lg:hidden">
        {/* Product Image — edge-to-edge on mobile */}
        {product.image_url ? (
          <div className="aspect-video w-full overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              width={800}
              height={450}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
        )}

        {/* Product Info */}
        <div className="px-4 pt-5 pb-32">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            <span
              className={`flex-shrink-0 mt-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                product.is_available
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {product.is_available ? "In Stock" : "Unavailable"}
            </span>
          </div>

          <p className="text-2xl font-bold text-indigo-600 mb-4">
            ৳{Number(product.price).toLocaleString()}
          </p>

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          )}
        </div>

        {/* Sticky order bar + bottom sheet (mobile only) */}
        <OrderSheet product={product} storeName={storeName} />
      </div>

      {/* Desktop layout (>= lg) */}
      <div className="hidden lg:grid lg:grid-cols-2 max-w-7xl mx-auto min-h-[calc(100vh-48px)]">
        {/* Left: sticky image */}
        <div className="sticky top-12 h-[calc(100vh-48px)] overflow-hidden bg-gray-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
          )}
        </div>

        {/* Right: scrollable info + inline form */}
        <div className="overflow-y-auto px-10 py-10">
          {/* Product name + availability */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            <span
              className={`flex-shrink-0 mt-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                product.is_available
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {product.is_available ? "In Stock" : "Unavailable"}
            </span>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-indigo-600 mb-4">
            ৳{Number(product.price).toLocaleString()}
          </p>

          {/* Description */}
          {product.description && (
            <p className="text-base text-gray-600 leading-relaxed mb-8">{product.description}</p>
          )}

          {/* Inline order form */}
          {product.is_available && (
            <OrderFormInline product={product} storeName={storeName} />
          )}
        </div>
      </div>
    </div>
  )
}
