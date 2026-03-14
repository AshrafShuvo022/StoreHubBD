import Link from "next/link"

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>
  searchParams: Promise<{ code?: string; total?: string }>
}) {
  const { store: storeName } = await params
  const { code, total } = await searchParams

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Order Placed!</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Your order has been received. You will get an SMS confirmation shortly.
        </p>

        <div className="mt-6 bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="font-bold text-gray-900 text-lg tracking-wide">{code}</span>
          </div>
          {total && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-semibold text-blue-600">৳{Number(total).toLocaleString()}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Save your order ID to track your order status.
        </p>

        <Link
          href="/"
          className="mt-6 block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Back to Store
        </Link>
      </div>
    </div>
  )
}
