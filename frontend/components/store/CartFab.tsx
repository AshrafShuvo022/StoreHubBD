"use client"

import { useCart } from "./CartContext"

export default function CartFab() {
  const { count, total, openCart } = useCart()
  if (count === 0) return null
  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-5 z-30 bg-slate-900 text-white rounded-2xl px-5 py-3 shadow-xl shadow-black/20 flex items-center gap-3 hover:bg-slate-800 active:scale-95 transition-all"
    >
      <div className="relative">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61H19a2 2 0 001.98-1.68L23 6H6" />
        </svg>
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      </div>
      <div className="text-left">
        <p className="text-[10px] font-medium text-slate-400 leading-none">Cart</p>
        <p className="text-sm font-bold leading-tight">৳{total.toLocaleString()}</p>
      </div>
    </button>
  )
}
