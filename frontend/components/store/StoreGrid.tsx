"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  slug: string
  name: string
  price: number
  compare_at_price: number | null
  image_url: string | null
  is_available: boolean
  has_variants: boolean
  order_count: number
}

type SortOption = "newest" | "price_asc" | "price_desc" | "best_selling"

export default function StoreGrid({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortOption>("newest")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [inStockOnly, setInStockOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const activeFilterCount = [
    sort !== "newest",
    !!minPrice,
    !!maxPrice,
    inStockOnly,
  ].filter(Boolean).length

  function clearFilters() {
    setSort("newest")
    setMinPrice("")
    setMaxPrice("")
    setInStockOnly(false)
  }

  const filtered = useMemo(() => {
    let result = [...products]

    // Search
    if (query) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
    }

    // In stock
    if (inStockOnly) {
      result = result.filter((p) => p.is_available)
    }

    // Price range
    if (minPrice) {
      result = result.filter((p) => p.price >= parseFloat(minPrice))
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(maxPrice))
    }

    // Sort
    switch (sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "best_selling":
        result.sort((a, b) => b.order_count - a.order_count)
        break
      // "newest" is default order from server
    }

    return result
  }, [products, query, sort, minPrice, maxPrice, inStockOnly])

  const hasActiveFilters = activeFilterCount > 0

  return (
    <>
      {/* Search + Filter bar */}
      <div className="pb-3 space-y-2">
        <div className="flex gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

          {/* Sort dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="hidden sm:block px-3 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20 transition-all cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="best_selling">Best Selling</option>
          </select>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-md border text-sm font-medium transition-all ${
              showFilters || hasActiveFilters
                ? "border-[#FF9900] bg-[#FF9900]/10 text-[#FF9900]"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#FF9900] text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">

            {/* Sort — mobile only */}
            <div className="sm:hidden">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sort By</p>
              <div className="grid grid-cols-2 gap-2">
                {(["newest", "price_asc", "price_desc", "best_selling"] as SortOption[]).map((opt) => {
                  const labels: Record<SortOption, string> = {
                    newest: "Newest",
                    price_asc: "Price: Low → High",
                    price_desc: "Price: High → Low",
                    best_selling: "Best Selling",
                  }
                  return (
                    <button
                      key={opt}
                      onClick={() => setSort(opt)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        sort === opt
                          ? "border-[#FF9900] bg-[#FF9900]/10 text-[#FF9900]"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {labels[opt]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Price range */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price Range (৳)</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]/20"
                  min="0"
                />
                <span className="text-gray-400 text-sm">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]/20"
                  min="0"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">In Stock Only</p>
              <button
                onClick={() => setInStockOnly((v) => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors ${inStockOnly ? "bg-[#FF9900]" : "bg-gray-200"}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${inStockOnly ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-red-500 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      {(hasActiveFilters || query) && (
        <p className="text-xs text-gray-500 mb-3">
          {filtered.length} {filtered.length === 1 ? "product" : "products"} found
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm">
            {query ? `No results for "${query}"` : "No products match your filters."}
          </p>
          <button
            onClick={() => { clearFilters(); setQuery("") }}
            className="mt-3 text-sm font-semibold hover:underline"
            style={{ color: "#007185" }}
          >
            Clear all
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-24">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/${product.slug}`}
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
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="ml-1.5 text-[11px] text-gray-400 line-through">
                      ৳{Number(product.compare_at_price).toLocaleString()}
                    </span>
                  )}
                </div>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="inline-block mt-1 text-[10px] font-bold text-white px-1.5 py-0.5 rounded" style={{ background: "#B12704" }}>
                    {Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
                  </span>
                )}
                {product.order_count > 0 && (
                  <p className="mt-1 text-[10px] text-gray-400">
                    {product.order_count}+ sold
                  </p>
                )}
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
