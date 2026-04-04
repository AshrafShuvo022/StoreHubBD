import Link from "next/link"
import Image from "next/image"
import { getImageUrl } from "@/lib/imageUrl"

interface Product {
  id: string
  slug: string
  name: string
  price: number
  compare_at_price: number | null
  image_url: string | null
  has_variants: boolean
  order_count: number
}

interface StoreSectionRowProps {
  title: string
  badge?: string
  products: Product[]
}

export default function StoreSectionRow({ title, badge, products }: StoreSectionRowProps) {
  if (products.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        {badge && (
          <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded" style={{ background: "#B12704" }}>
            {badge}
          </span>
        )}
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide lg:grid lg:grid-cols-6 lg:overflow-visible">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/${product.slug}`}
            className="group flex-shrink-0 w-36 lg:w-auto bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-150 active:scale-[0.99] flex flex-col"
          >
            {/* Image */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
              {product.image_url ? (
                <Image
                  src={getImageUrl(product.image_url, "card")}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  sizes="(max-width: 1024px) 144px, 20vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-2 flex flex-col flex-1">
              <p className="text-[11.5px] text-gray-800 leading-snug line-clamp-2 flex-1">
                {product.name}
              </p>
              <div className="mt-1.5">
                {product.has_variants && (
                  <span className="text-[10px] text-gray-400">From </span>
                )}
                <span className="text-sm font-bold" style={{ color: "#B12704" }}>
                  ৳{Number(product.price).toLocaleString()}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="ml-1 text-[10px] text-gray-400 line-through">
                    ৳{Number(product.compare_at_price).toLocaleString()}
                  </span>
                )}
              </div>
              {product.order_count > 0 && (
                <p className="text-[10px] text-gray-400 mt-0.5">{product.order_count}+ sold</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
