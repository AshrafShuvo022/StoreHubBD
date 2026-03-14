import Link from "next/link"

export default function StoreNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 text-center">
      <div>
        <p className="text-6xl mb-4">🏪</p>
        <h1 className="text-2xl font-bold text-gray-900">Store not found</h1>
        <p className="text-gray-500 mt-2 text-sm">
          This store does not exist or has been deactivated.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Go to StoreHubBD
        </Link>
      </div>
    </div>
  )
}
