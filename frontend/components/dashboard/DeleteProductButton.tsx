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
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-red-600 font-medium hover:underline disabled:opacity-50"
        >
          {loading ? "..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-400 hover:underline"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-red-500 hover:underline text-xs"
    >
      Delete
    </button>
  )
}
