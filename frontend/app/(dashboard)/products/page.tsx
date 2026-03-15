import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import DeleteProductButton from "@/components/dashboard/DeleteProductButton"

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
    <div className="p-5 sm:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
            {products.length}
          </span>
        </div>
        <Link
          href="/products/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </Link>
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
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p: any) => (
                  <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <Image
                            src={p.image_url}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            </svg>
                          </div>
                        )}
                        <span className="font-medium text-gray-900 truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700">৳{Number(p.price).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.is_available
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.is_available ? "bg-emerald-500" : "bg-gray-400"}`} />
                        {p.is_available ? "Available" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.id}`}
                          className="text-xs font-semibold text-indigo-600 border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton productId={p.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="sm:hidden space-y-2">
            {products.map((p: any) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3">
                {p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-indigo-600 font-bold text-sm">৳{Number(p.price).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    p.is_available ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {p.is_available ? "Live" : "Hidden"}
                  </span>
                  <div className="flex gap-1.5">
                    <Link href={`/products/${p.id}`} className="text-xs text-indigo-600 font-semibold">Edit</Link>
                    <DeleteProductButton productId={p.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
