import { auth } from "@/auth"
import { redirect } from "next/navigation"
import BulkImportForm from "@/components/dashboard/BulkImportForm"

export default async function ImportPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Import Products</h1>
        <p className="text-sm text-gray-500 mt-1">Upload an Excel file to add multiple products at once</p>
      </div>
      <BulkImportForm token={session.accessToken} />
    </div>
  )
}
