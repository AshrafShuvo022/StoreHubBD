"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
}

export default function MultiImageUploader({ value, onChange }: Props) {
  const { data: session } = useSession()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setError("")
    setUploading(true)

    const uploaded: string[] = []
    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session?.accessToken}` },
          body: formData,
        })
        const data = await res.json()
        if (res.ok) uploaded.push(data.url)
        else setError(data.detail || "Upload failed")
      } catch {
        setError("Upload failed. Please try again.")
      }
    }

    if (uploaded.length) onChange([...value, ...uploaded])
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function moveLeft(index: number) {
    if (index === 0) return
    const next = [...value]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChange(next)
  }

  function moveRight(index: number) {
    if (index === value.length - 1) return
    const next = [...value]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={url + i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <Image src={url} alt={`Product image ${i + 1}`} fill className="object-cover" sizes="150px" />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 text-[10px] font-bold bg-[#FF9900] text-gray-900 px-1.5 py-0.5 rounded-md">
                  Main
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {i > 0 && (
                  <button type="button" onClick={() => moveLeft(i)}
                    className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-gray-700 hover:bg-white transition">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                )}
                <button type="button" onClick={() => remove(i)}
                  className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
                {i < value.length - 1 && (
                  <button type="button" onClick={() => moveRight(i)}
                    className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-gray-700 hover:bg-white transition">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleFiles} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-[#FF9900]/50 hover:bg-[#FF9900]/5 hover:text-[#FF9900] disabled:opacity-50 transition-all"
      >
        {uploading ? (
          <><div className="w-4 h-4 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin" />Uploading...</>
        ) : (
          <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>{value.length === 0 ? "Upload Photos" : "Add More Photos"}</>
        )}
      </button>

      {value.length > 0 && (
        <p className="text-xs text-gray-400">First image is the main photo. Hover to reorder or remove.</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
