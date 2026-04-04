"use client"

import { useCart } from "./CartContext"

export default function CartFab() {
  const { count, total, openCart } = useCart()
  if (count === 0) return null
  return (
    <button
      onClick={openCart}
      className="fixed bottom-[72px] right-4 z-40 lg:bottom-[200px] lg:right-5 text-gray-900 rounded px-4 py-2.5 shadow-lg flex items-center gap-3 active:scale-95 transition-all hover:brightness-95"
      style={{ background: "#FFD814", border: "1px solid #FCD200" }}
    >
      <div className="relative">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61H19a2 2 0 001.98-1.68L23 6H6" />
        </svg>
        <span className="absolute -top-2 -right-2 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center" style={{ background: "#131921" }}>
          {count > 9 ? "9+" : count}
        </span>
      </div>
      <div className="text-left">
        <p className="text-[10px] font-medium text-gray-600 leading-none">Cart</p>
        <p className="text-sm font-bold leading-tight">৳{total.toLocaleString()}</p>
      </div>
    </button>
  )
}
