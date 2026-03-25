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
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
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
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm">
            {query ? `No results for "${query}"` : "No products available."}
          </p>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="mt-3 text-sm font-semibold hover:underline"
              style={{ color: "#007185" }}
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-24">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/${product.id}`}
              className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-150 active:scale-[0.99] flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                  </div>
                )}

                {!product.is_available && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-300 px-2.5 py-1 rounded">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2.5 flex flex-col flex-1">
                <p className="text-[12.5px] text-gray-800 leading-snug line-clamp-2 flex-1">
                  {product.name}
                </p>
                <div className="mt-2">
                  {product.has_variants && (
                    <span className="text-[10px] text-gray-400">From </span>
                  )}
                  <span className="text-sm font-bold" style={{ color: "#B12704" }}>
                    ৳{Number(product.price).toLocaleString()}
                  </span>
                </div>
                {product.is_available && (
                  <div
                    className="mt-2 w-full text-center text-[11px] font-semibold text-gray-900 py-1.5 rounded border border-[#FCD200] transition-all"
                    style={{ background: "#FFD814" }}
                  >
                    Add to Cart
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
