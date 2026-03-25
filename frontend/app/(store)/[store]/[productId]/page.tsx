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
          <div className="absolute top-3 left-3">
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
          <p className="text-2xl font-bold mb-1" style={{ color: "#B12704" }}>
            ৳{Number(product.price).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mb-4">Inclusive of all taxes</p>

          {product.description && (
            <>
              <div className="h-px bg-gray-100 mb-4" />
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </>
          )}
        </div>

        {product.is_available && (
          <OrderSheet product={product} storeName={storeName} />
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block" style={{ background: "#f0f2f2" }}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-[1fr_400px] gap-5 items-start">

            {/* Left: image */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden aspect-square sticky top-20">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
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
            <div className="space-y-3">
              {/* Product info card */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h1 className="text-xl font-semibold text-gray-900 leading-snug mb-3">
                  {product.name}
                </h1>

                <div className="border-t border-gray-100 pt-3 mb-3">
                  <p className="text-2xl font-bold" style={{ color: "#B12704" }}>
                    ৳{Number(product.price).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Inclusive of all taxes</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${product.is_available ? "text-[#007600]" : "text-gray-500"}`}>
                    {product.is_available ? "In Stock" : "Currently unavailable"}
                  </span>
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
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
