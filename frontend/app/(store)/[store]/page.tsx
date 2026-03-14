import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
          {seller.logo_url ? (
            <Image
              src={seller.logo_url}
              alt={seller.store_name}
              width={56}
              height={56}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
              {seller.store_name[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900 capitalize">{seller.store_name}</h1>
            {seller.description && (
              <p className="text-sm text-gray-500 mt-0.5">{seller.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No products yet.</div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/${storeName}/${product.id}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition"
                >
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">
                      📦
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-blue-600 font-semibold text-sm mt-1">
                      ৳{Number(product.price).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
