"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  is_available: boolean
  has_variants: boolean
}

export default function StoreGrid({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("")

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      {/* Search */}
      <div className="pb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-400 text-sm">
            {query ? `No products match "${query}"` : "No products yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
          {filtered.map((product, i) => (
            <Link
              key={product.id}
              href={`/${product.id}`}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-150 active:scale-[0.97]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {product.image_url ? (
                <div className="aspect-square w-full overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full bg-gray-50 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </div>
              )}
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-indigo-600 font-bold text-sm">
                    {product.has_variants ? "From " : ""}৳{Number(product.price).toLocaleString()}
                  </p>
                  <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Order →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
