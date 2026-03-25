"use client"

import { useCart } from "./CartContext"

export default function CartIconButton() {
  const { count, openCart } = useCart()
  return (
    <button
      onClick={openCart}
      className="relative p-1.5 text-gray-600 hover:text-indigo-600 transition"
      aria-label="Open cart"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61H19a2 2 0 001.98-1.68L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  )
}
