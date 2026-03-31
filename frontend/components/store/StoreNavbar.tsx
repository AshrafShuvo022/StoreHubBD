"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import CartIconButton from "@/components/store/CartIconButton"

interface Props {
  storeName: string
  logoUrl?: string | null
  heroRef: React.RefObject<HTMLDivElement | null>
}

export default function StoreNavbar({ storeName, logoUrl, heroRef }: Props) {
  const [heroVisible, setHeroVisible] = useState(true)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [heroRef])

  return (
    <div className="sticky top-0 z-20" style={{ background: "#131921" }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Store identity — only shown when hero is scrolled out of view */}
        <div
          className={`flex items-center gap-2.5 min-w-0 transition-all duration-300 ${
            heroVisible
              ? "opacity-0 -translate-y-1 pointer-events-none"
              : "opacity-100 translate-y-0"
          }`}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={storeName}
              width={28}
              height={28}
              className="w-7 h-7 rounded-md object-cover flex-shrink-0 ring-1 ring-white/20"
            />
          ) : (
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "#FF9900" }}
            >
              {storeName[0].toUpperCase()}
            </div>
          )}
          <p className="text-white text-sm font-bold capitalize truncate leading-tight">
            {storeName}
          </p>
        </div>

        {/* Placeholder to keep cart right-aligned when name is hidden */}
        {heroVisible && <div />}

        <CartIconButton />
      </div>
    </div>
  )
}
