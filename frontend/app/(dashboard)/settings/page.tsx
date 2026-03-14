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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Store Settings</h1>
      <StoreSettingsForm seller={seller} />
    </div>
  )
}
