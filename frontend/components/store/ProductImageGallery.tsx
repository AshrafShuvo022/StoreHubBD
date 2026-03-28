"use client"

import { useState } from "react"
import Image from "next/image"

interface Props {
  images: string[]
  productName: string
}

export default function ProductImageGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0)

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
      <div className="relative flex-1 min-h-0 bg-gray-50">
        <Image src={images[active]} alt={productName} fill className="object-contain p-4" priority sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto flex-shrink-0 bg-white border-t border-gray-100">
          {images.map((url, i) => (
            <button key={i} type="button" onClick={() => setActive(i)}
              className={`relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === active ? "border-indigo-500" : "border-transparent hover:border-gray-300"}`}>
              <Image src={url} alt={`${productName} ${i + 1}`} fill className="object-cover" sizes="56px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
