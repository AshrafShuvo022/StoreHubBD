import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">StoreHubBD</h1>
      <p className="text-gray-500 mt-4 max-w-md text-lg">
        Turn your Facebook orders into a clean, tracked, professional store.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Start Free
        </Link>
        <Link
          href="/login"
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
