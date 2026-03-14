import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import OrderForm from "@/components/store/OrderForm"

async function getProduct(storeName: string, productId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/store/${storeName}/products/${productId}`,
    { cache: "no-store" }
  )
  if (!res.ok) return null
  return res.json()
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ store: string; productId: string }>
}) {
  const { store: storeName, productId } = await params
  const product = await getProduct(storeName, productId)

  if (!product) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to store
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={800}
              height={450}
              className="w-full h-64 sm:h-80 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-6xl">
              📦
            </div>
          )}

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              ৳{Number(product.price).toLocaleString()}
            </p>
            {product.description && (
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">{product.description}</p>
            )}

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Place Your Order</h2>
              <OrderForm product={product} storeName={storeName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
