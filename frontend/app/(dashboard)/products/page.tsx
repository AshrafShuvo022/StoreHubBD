import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import ProductsSearchList from "@/components/dashboard/ProductsSearchList"

async function getProducts(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

export default async function ProductsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const products = await getProducts(session.accessToken)

  return (
    <div className="p-6 sm:p-8 lg:p-10 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
            {products.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/products/import"
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Import
          </Link>
          <Link
            href="/products/new"
            className="bg-[#FF9900] text-gray-900 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gray-200 py-20 px-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <p className="font-bold text-gray-900 text-lg mb-1">No products yet</p>
          <p className="text-sm text-gray-500 mb-5">Add your first product to start selling</p>
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 bg-[#FF9900] text-gray-900 transition"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <ProductsSearchList products={products} />
      )}
    </div>
  )
}
