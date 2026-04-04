"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"

interface Props {
  images: string[]
  productName: string
}

const ZOOM_FACTOR = 3      // 3× magnification
const LENS_FRAC   = 1 / ZOOM_FACTOR   // lens is 1/3 of the image

export default function ProductImageGallery({ images, productName }: Props) {
  const [active, setActive]       = useState(0)
  const scrollRef                 = useRef<HTMLDivElement>(null)
  const imgContainerRef           = useRef<HTMLDivElement>(null)

  // Zoom state
  const [zooming, setZooming]     = useState(false)
  const [lensX,   setLensX]       = useState(0)   // 0–1 within image
  const [lensY,   setLensY]       = useState(0)
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({})

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

  // Mouse tracking on desktop image
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = imgContainerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()

    // Normalised cursor position (0–1) clamped to lens half-width boundary
    const half = LENS_FRAC / 2
    const rawX = (e.clientX - rect.left)  / rect.width
    const rawY = (e.clientY - rect.top)   / rect.height
    const x = Math.min(Math.max(rawX, half), 1 - half)
    const y = Math.min(Math.max(rawY, half), 1 - half)

    setLensX(x)
    setLensY(y)

    // Position the zoom panel fixed next to the image container
    const gap = 12
    setZoomStyle({
      position:  "fixed",
      top:       rect.top,
      left:      rect.right + gap,
      width:     rect.width,
      height:    rect.height,
      zIndex:    50,
    })
  }, [])

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

  // Lens box: positioned so it stays within the image
  const lensLeft  = `${(lensX - LENS_FRAC / 2) * 100}%`
  const lensTop   = `${(lensY - LENS_FRAC / 2) * 100}%`
  const lensW     = `${LENS_FRAC * 100}%`

  // Background-position for zoom panel: mirrors lens centre
  const bgX = `${lensX * 100}%`
  const bgY = `${lensY * 100}%`

  return (
    <div className="w-full h-full flex flex-col">

      {/* ── Mobile: swipe carousel ── */}
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
        {images.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === active ? "w-5 h-1.5 bg-gray-800" : "w-1.5 h-1.5 bg-gray-400/60"
                }`}
              />
            ))}
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/40 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {active + 1}/{images.length}
          </div>
        )}
      </div>

      {/* ── Desktop: main image + thumbnails + zoom ── */}
      <div className="hidden lg:flex flex-col w-full h-full">

        {/* Main image — zoom trigger */}
        <div
          ref={imgContainerRef}
          className="relative flex-1 min-h-0 bg-gray-50 overflow-hidden"
          style={{ cursor: zooming ? "crosshair" : "zoom-in" }}
          onMouseEnter={() => setZooming(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setZooming(false)}
        >
          <Image
            src={images[active]}
            alt={productName}
            fill
            className="object-contain p-4 pointer-events-none"
            priority
            sizes="50vw"
          />

          {/* Lens overlay */}
          {zooming && (
            <div
              className="absolute pointer-events-none"
              style={{
                left:    lensLeft,
                top:     lensTop,
                width:   lensW,
                paddingBottom: lensW,   // square via padding trick
                background: "rgba(255,216,20,0.2)",
                border: "1.5px solid rgba(255,216,20,0.7)",
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.04)",
              }}
            />
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto flex-shrink-0 bg-white border-t border-gray-100">
            {images.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                className={`relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  i === active ? "border-[#FF9900]" : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image src={url} alt={`${productName} ${i + 1}`} fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Zoom panel (fixed, outside component flow) ── */}
      {zooming && images[active] && (
        <div
          style={{
            ...zoomStyle,
            background:         `url(${images[active]}) no-repeat`,
            backgroundSize:     `${ZOOM_FACTOR * 100}%`,
            backgroundPosition: `${bgX} ${bgY}`,
            border:             "1px solid #e5e7eb",
            borderRadius:       "8px",
            boxShadow:          "0 8px 32px rgba(0,0,0,0.15)",
            overflow:           "hidden",
            pointerEvents:      "none",
          }}
        />
      )}
    </div>
  )
}
