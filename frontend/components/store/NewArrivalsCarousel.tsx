"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  slug: string
  name: string
  price: number
  compare_at_price: number | null
  image_url: string | null
  order_count: number
}

const AUTO_SPIN_MS = 2600
const CARD_W = 170
const CARD_H = 210
const RADIUS = 300

export default function NewArrivalsCarousel({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = products.length

  const next = useCallback(() => setActive((p) => (p + 1) % count), [count])
  const prev = useCallback(() => setActive((p) => (p - 1 + count) % count), [count])

  useEffect(() => {
    if (count <= 1 || paused) return
    const t = setInterval(next, AUTO_SPIN_MS)
    return () => clearInterval(t)
  }, [count, paused, next])

  if (count === 0) return null

  const angleStep = 360 / count

  return (
    <div className="mb-8">
      {/* Header — aligned with other section titles */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1 h-4 rounded-full" style={{ background: "#FF9900" }} />
        <h2 className="text-sm font-bold text-gray-900">New Arrivals</h2>
        <span
          className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
          style={{ background: "#131921" }}
        >
          NEW
        </span>
      </div>
      </div>

      {/* 3D Carousel stage */}
      <div
        className="relative flex items-center justify-center select-none"
        style={{ height: `${CARD_H + 120}px`, perspective: "1100px" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Rotating ring */}
        <div
          style={{
            width: `${CARD_W}px`,
            height: `${CARD_H}px`,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateY(${-active * angleStep}deg)`,
            transition: "transform 0.85s cubic-bezier(0.33, 1, 0.68, 1)",
          }}
        >
          {products.map((product, i) => {
            const angle = angleStep * i

            // Relative angle to front (normalized -180 to 180)
            let rel = ((i - active) * angleStep) % 360
            if (rel > 180) rel -= 360
            if (rel < -180) rel += 360

            // Cards more than 90° behind are hidden (facing away)
            const isBack = Math.abs(rel) > 90
            // Brightness: front = 1, sides = 0.75, back edge = 0.55
            const brightness = isBack ? 0 : 0.55 + 0.45 * Math.cos((rel * Math.PI) / 180)

            return (
              <Link
                key={product.id}
                href={`/${product.slug}`}
                tabIndex={i === active ? 0 : -1}
                onClick={(e) => {
                  if (i !== active) {
                    e.preventDefault()
                    setActive(i)
                  }
                }}
                style={{
                  position: "absolute",
                  width: `${CARD_W}px`,
                  height: `${CARD_H}px`,
                  left: 0,
                  top: 0,
                  transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  filter: `brightness(${brightness})`,
                  transition: "filter 0.85s ease",
                  pointerEvents: isBack ? "none" : "auto",
                }}
              >
                <div
                  className="w-full h-full rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    background: "white",
                    boxShadow:
                      i === active
                        ? "0 20px 60px rgba(0,0,0,0.22), 0 0 0 2px #FF9900"
                        : "0 8px 24px rgba(0,0,0,0.12)",
                  }}
                >
                  {/* Image — square crop using card width */}
                  <div
                    className="relative overflow-hidden bg-gray-50"
                    style={{ height: `${CARD_W}px`, flexShrink: 0 }}
                  >
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="180px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                      </div>
                    )}
                    {/* NEW ribbon */}
                    <span
                      className="absolute top-2.5 left-2.5 text-[10px] font-black text-white px-2 py-0.5 rounded"
                      style={{ background: "#FF9900" }}
                    >
                      NEW
                    </span>
                  </div>

                  {/* Info */}
                  <div className="px-3 py-2.5 flex flex-col flex-1">
                    <p className="text-[13px] text-gray-800 leading-snug line-clamp-2 flex-1">
                      {product.name}
                    </p>
                    <p className="text-base font-bold mt-2" style={{ color: "#B12704" }}>
                      ৳{Number(product.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-1 sm:left-4 z-10 w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white shadow-md transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-1 sm:right-4 z-10 w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white shadow-md transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? "18px" : "6px",
              height: "6px",
              background: i === active ? "#FF9900" : "#d1d5db",
            }}
          />
        ))}
      </div>
    </div>
  )
}
