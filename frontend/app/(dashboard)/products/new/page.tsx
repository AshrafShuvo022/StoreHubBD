import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ProductForm from "@/components/dashboard/ProductForm"

export default async function NewProductPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Product</h1>
      <ProductForm />
    </div>
  )
}
