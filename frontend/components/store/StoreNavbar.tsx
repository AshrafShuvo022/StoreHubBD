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
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [heroRef])

  return (
    <div
      className="sticky top-0 z-20 transition-all duration-300"
      style={{
        background: "#131921",
        borderBottom: heroVisible ? "1px solid transparent" : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Store identity — invisible (but holds space) when hero visible, fades in on scroll */}
        <div
          className="flex items-center gap-2.5 min-w-0 transition-all duration-300"
          style={{
            opacity:        heroVisible ? 0 : 1,
            transform:      heroVisible ? "translateY(-4px)" : "translateY(0)",
            pointerEvents:  heroVisible ? "none" : "auto",
            visibility:     "visible",   // always holds layout space — no shift
          }}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={storeName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-cover flex-shrink-0 ring-1 ring-white/20"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "#FF9900" }}
            >
              {storeName[0].toUpperCase()}
            </div>
          )}
          <p className="text-white text-sm font-semibold capitalize truncate leading-tight">
            {storeName}
          </p>
        </div>

        <CartIconButton />
      </div>
    </div>
  )
}
