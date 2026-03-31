"use client"

import { useRef } from "react"
import StoreNavbar from "@/components/store/StoreNavbar"

interface Props {
  storeName: string
  logoUrl?: string | null
  children: React.ReactNode
  heroContent: React.ReactNode
}

export default function StorePageClient({ storeName, logoUrl, children, heroContent }: Props) {
  const heroRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <StoreNavbar storeName={storeName} logoUrl={logoUrl} heroRef={heroRef} />
      <div ref={heroRef}>{heroContent}</div>
      {children}
    </>
  )
}
