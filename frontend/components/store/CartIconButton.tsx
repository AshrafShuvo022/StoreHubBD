"use client"

import { useCart } from "./CartContext"

export default function CartIconButton() {
  const { count, total, openCart } = useCart()

  return (
    <button
      onClick={openCart}
      aria-label="Open cart"
      className="relative flex items-center gap-2 transition-all duration-200 active:scale-95"
    >
      {/* Icon + badge */}
      <div className="relative p-1.5 text-gray-300 hover:text-white transition">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61H19a2 2 0 001.98-1.68L23 6H6" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center" style={{ background: "#FF9900" }}>
            {count > 9 ? "9+" : count}
          </span>
        )}
      </div>

      {/* Total pill — only shown when cart has items */}
      {count > 0 && (
        <span
          className="hidden sm:flex items-center px-2.5 py-1 rounded-lg text-xs font-bold text-gray-900 leading-none"
          style={{ background: "#FFD814", border: "1px solid #FCD200" }}
        >
          ৳{total.toLocaleString()}
        </span>
      )}
    </button>
  )
}
