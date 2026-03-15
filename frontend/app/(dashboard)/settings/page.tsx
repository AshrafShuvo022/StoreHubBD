import { auth } from "@/auth"
import { redirect } from "next/navigation"
import StoreSettingsForm from "@/components/dashboard/StoreSettingsForm"

async function getSeller(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

export default async function SettingsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const seller = await getSeller(session.accessToken)

  return (
    <div className="p-5 sm:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your store profile and contact details</p>
      </div>
      <StoreSettingsForm seller={seller} />
    </div>
  )
}
