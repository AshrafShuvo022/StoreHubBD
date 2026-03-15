"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function DeleteProductButton({ productId }: { productId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    })
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1.5 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs font-medium text-gray-500 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs font-semibold text-red-500 border border-red-100 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
    >
      Delete
    </button>
  )
}
