"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  shape?: "square" | "rounded"
}

export default function ImageUploader({
  value,
  onChange,
  shape = "square",
}: ImageUploaderProps) {
  const { data: session } = useSession()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError("")
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.accessToken}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || "Upload failed")
      } else {
        onChange(data.url)
      }
    } catch {
      setError("Upload failed. Please try again.")
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  const radius = shape === "rounded" ? "rounded-2xl" : "rounded-2xl"

  return (
    <div className="space-y-2">
      {/* Preview box */}
      <div className={`relative aspect-square w-full overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 ${radius}`}>
        {value ? (
          <>
            <Image
              src={value}
              alt="preview"
              fill
              className="object-cover"
              onError={() => onChange("")}
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-xs text-gray-400">No image</p>
          </div>
        )}

        {/* Upload overlay spinner */}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Upload button */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        {uploading ? "Uploading..." : value ? "Change Photo" : "Upload Photo"}
      </button>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
