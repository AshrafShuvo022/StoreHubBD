"use client"

import { useState, useMemo, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { getImageUrl } from "@/lib/imageUrl"

const PER_PAGE = 20

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
  const [page, setPage] = useState(1)
  const gridRef = useRef<HTMLDivElement>(null)

  const activeFilterCount = [
    sort !== "newest",
    !!minPrice,
    !!maxPrice,
    inStockOnly,
  ].filter(Boolean).length

  function resetPage() { setPage(1) }

  function clearFilters() {
    setSort("newest")
    setMinPrice("")
    setMaxPrice("")
    setInStockOnly(false)
    resetPage()
  }

  function goToPage(p: number) {
    setPage(p)
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
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

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const hasActiveFilters = activeFilterCount > 0

  // Page number list with ellipsis: always show first, last, current±1
  function pageNumbers(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const set = new Set([1, totalPages, page, page - 1, page + 1].filter(n => n >= 1 && n <= totalPages))
    const sorted = [...set].sort((a, b) => a - b)
    const result: (number | "…")[] = []
    sorted.forEach((n, i) => {
      if (i > 0 && (n as number) - (sorted[i - 1] as number) > 1) result.push("…")
      result.push(n)
    })
    return result
  }

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
              onChange={(e) => { setQuery(e.target.value); resetPage() }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20 transition-all"
            />
          </div>

          {/* Sort dropdown */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortOption); resetPage() }}
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
                  onChange={(e) => { setMinPrice(e.target.value); resetPage() }}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]/20"
                  min="0"
                />
                <span className="text-gray-400 text-sm">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); resetPage() }}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]/20"
                  min="0"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">In Stock Only</p>
              <button
                onClick={() => { setInStockOnly((v) => !v); resetPage() }}
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
      <div ref={gridRef} className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500">
          {filtered.length === 0
            ? "No products found"
            : `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length} products`}
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
        )}
      </div>

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
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {paginated.map((product) => {
            const discount = product.compare_at_price && product.compare_at_price > product.price
              ? Math.round((1 - product.price / product.compare_at_price) * 100)
              : 0

            return (
            <Link
              key={product.id}
              href={`/${product.slug}`}
              className="group bg-white rounded-xl overflow-hidden flex flex-col active:scale-[0.98] transition-all duration-200"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)")}
            >
              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                {product.image_url ? (
                  <Image
                    src={getImageUrl(product.image_url, "card")}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                  </div>
                )}

                {/* Discount badge — overlaid top-left */}
                {discount > 0 && (
                  <span
                    className="absolute top-2 left-2 text-[11px] font-black text-white px-2 py-0.5 rounded-md"
                    style={{ background: "#B12704" }}
                  >
                    -{discount}%
                  </span>
                )}

                {/* Out of stock overlay */}
                {!product.is_available && (
                  <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-full shadow-sm">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Cart hover overlay — desktop */}
                {product.is_available && (
                  <div className="absolute inset-x-0 bottom-0 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
                    style={{ background: "linear-gradient(to top, rgba(19,25,33,0.85) 0%, transparent 100%)" }}
                  >
                    <span className="text-white text-xs font-bold tracking-wide">View Product →</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                {/* Name */}
                <p className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2 flex-1 mb-2">
                  {product.name}
                </p>

                {/* Price row */}
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  {product.has_variants && <span className="text-[11px] text-gray-400">From </span>}
                  <span className="text-sm font-bold" style={{ color: "#B12704" }}>
                    ৳{Number(product.price).toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <span className="text-[11px] text-gray-400 line-through">
                      ৳{Number(product.compare_at_price).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Social proof */}
                {product.order_count > 0 && (
                  <p className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#FF9900"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {product.order_count}+ sold
                  </p>
                )}

                {/* Add to Cart button */}
                {product.is_available && (
                  <div
                    className="mt-2.5 w-full text-center text-xs font-bold text-gray-900 py-2 rounded-lg border border-[#FCD200] transition-all duration-150 group-hover:brightness-95"
                    style={{ background: "#FFD814" }}
                  >
                    Add to Cart
                  </div>
                )}
              </div>
            </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-8">
          {/* Prev */}
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Prev
          </button>

          {/* Page numbers */}
          {pageNumbers().map((n, i) =>
            n === "…" ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
            ) : (
              <button
                key={n}
                onClick={() => goToPage(n as number)}
                className="w-9 h-9 rounded-lg border text-sm font-medium transition-all"
                style={
                  n === page
                    ? { background: "#131921", borderColor: "#131921", color: "white" }
                    : { background: "white", borderColor: "#e5e7eb", color: "#374151" }
                }
              >
                {n}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
          >
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
