import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import ProductForm from "@/components/dashboard/ProductForm"

export default async function NewProductPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Add New Product</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
      </div>
      <ProductForm />
    </div>
  )
}
