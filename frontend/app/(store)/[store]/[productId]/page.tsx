import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import OrderSheet from "@/components/store/OrderSheet"
import OrderFormInline from "@/components/store/OrderFormInline"
import CartIconButton from "@/components/store/CartIconButton"

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

      {/* Sticky top nav — dark, matches store nav */}
      <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-sm h-14 flex items-center px-4">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {seller?.store_name ? (
              <span className="capitalize">{seller.store_name}</span>
            ) : (
              "Back"
            )}
          </Link>
          <CartIconButton />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden">
        {/* Product image */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              product.is_available
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-300"
            }`}>
              {product.is_available ? "In Stock" : "Unavailable"}
            </span>
          </div>
        </div>

        {/* Product info */}
        <div className="px-4 pt-5 pb-36">
          <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2">
            {product.name}
          </h1>
          <p className="text-2xl font-bold text-slate-900 mb-4">
            ৳{Number(product.price).toLocaleString()}
          </p>

          {product.description && (
            <>
              <div className="h-px bg-gray-100 mb-4" />
              <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
            </>
          )}
        </div>

        {/* Sticky bottom bar */}
        {product.is_available && (
          <OrderSheet product={product} storeName={storeName} />
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-2 max-w-6xl mx-auto min-h-[calc(100vh-56px)]">
        {/* Left: sticky image */}
        <div className="sticky top-14 h-[calc(100vh-56px)] overflow-hidden bg-gray-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
          )}
        </div>

        {/* Right: info + order */}
        <div className="overflow-y-auto px-10 py-10 flex flex-col justify-center">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 w-fit ${
            product.is_available
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-gray-100 text-gray-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${product.is_available ? "bg-emerald-500" : "bg-gray-400"}`} />
            {product.is_available ? "In Stock" : "Unavailable"}
          </span>

          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            {product.name}
          </h1>

          <p className="text-4xl font-bold text-slate-900 mb-6">
            ৳{Number(product.price).toLocaleString()}
          </p>

          {product.description && (
            <div className="mb-8">
              <div className="h-px bg-gray-100 mb-5" />
              <p className="text-base text-gray-500 leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.is_available ? (
            <OrderFormInline product={product} storeName={storeName} />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <p className="text-gray-500 text-sm">This product is currently unavailable.</p>
              <Link href="/" className="mt-3 inline-block text-slate-700 text-sm font-semibold hover:underline">
                Browse other products →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
