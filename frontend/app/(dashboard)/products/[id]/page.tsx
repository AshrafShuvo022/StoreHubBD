import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm initialData={product} />
    </div>
  )
}
