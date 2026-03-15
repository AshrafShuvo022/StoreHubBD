import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import ProductForm from "@/components/dashboard/ProductForm"

async function getProduct(id: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return null
  const products = await res.json()
  return products.find((p: any) => p.id === id) || null
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params
  const product = await getProduct(id, session.accessToken)
  if (!product) notFound()

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>
      <ProductForm initialData={product} />
    </div>
  )
}
