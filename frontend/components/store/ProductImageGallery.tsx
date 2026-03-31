"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"

interface Props {
  images: string[]
  productName: string
}

export default function ProductImageGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.offsetWidth)
    setActive(index)
  }, [])

  function scrollTo(index: number) {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" })
    setActive(index)
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">

      {/* Mobile: swipe carousel */}
      <div className="lg:hidden relative w-full aspect-square bg-gray-50">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((url, i) => (
            <div key={i} className="relative flex-shrink-0 w-full h-full snap-center bg-gray-50">
              <Image
                src={url}
                alt={`${productName} ${i + 1}`}
                fill
                className="object-contain p-4"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === active
                    ? "w-5 h-1.5 bg-gray-800"
                    : "w-1.5 h-1.5 bg-gray-400/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* Image counter top-right */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/40 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {active + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Desktop: main image + thumbnail strip */}
      <div className="hidden lg:flex flex-col w-full h-full">
        <div className="relative flex-1 min-h-0 bg-gray-50">
          <Image
            src={images[active]}
            alt={productName}
            fill
            className="object-contain p-4"
            priority
            sizes="50vw"
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto flex-shrink-0 bg-white border-t border-gray-100">
            {images.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                className={`relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  i === active ? "border-indigo-500" : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image src={url} alt={`${productName} ${i + 1}`} fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
