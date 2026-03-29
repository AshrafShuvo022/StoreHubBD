"use client"

import { useState, useRef } from "react"
import Link from "next/link"

interface ImportResult {
  created: number
  failed: number
  errors: string[]
}

export default function BulkImportForm({ token }: { token: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  function downloadTemplate() {
    const header = ["name", "description", "price", "compare_at_price", "is_available", "image_url", "variant_label", "variant_price"]
    const examples = [
      ["Plain T-Shirt", "100% cotton", "500", "700", "TRUE", "https://example.com/tshirt.jpg", "", ""],
      ["Handmade Bag", "Handcrafted leather bag", "", "1200", "TRUE", "https://example.com/bag.jpg", "Small", "800"],
      ["", "", "", "", "", "", "Medium", "950"],
      ["", "", "", "", "", "", "Large", "1100"],
    ]

    const rows = [header, ...examples]
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "storehubbd_import_template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setError("")
    setResult(null)
    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/bulk-import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || "Import failed.")
      } else {
        setResult(data)
        setFile(null)
        if (inputRef.current) inputRef.current.value = ""
      }
    } catch {
      setError("Something went wrong. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* Template download */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Step 1 — Download Template</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Use the template to fill in your products. Each row is either a product or a variant of the product above it.
        </p>

        {/* Column guide */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-xs space-y-1.5">
          <p className="font-semibold text-gray-700 mb-2">Column guide:</p>
          <div className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-1.5 text-gray-600">
            <span className="font-mono font-semibold text-gray-800">name</span><span>Product name <span className="text-red-500">*required</span>. Leave blank on variant rows.</span>
            <span className="font-mono font-semibold text-gray-800">description</span><span>Short description (optional)</span>
            <span className="font-mono font-semibold text-gray-800">price</span><span>Price in BDT. Required if product has no variants.</span>
            <span className="font-mono font-semibold text-gray-800">compare_at_price</span><span>Original price before discount (optional)</span>
            <span className="font-mono font-semibold text-gray-800">is_available</span><span>TRUE or FALSE (default TRUE)</span>
            <span className="font-mono font-semibold text-gray-800">image_url</span><span>Direct image link (optional). For best results, upload images from the dashboard first and paste the Cloudinary URL here.</span>
            <span className="font-mono font-semibold text-gray-800">variant_label</span><span>Variant name e.g. Small, Red (optional)</span>
            <span className="font-mono font-semibold text-gray-800">variant_price</span><span>Price for this variant (required if variant_label is set)</span>
          </div>
        </div>

        <button
          type="button"
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-800 border border-gray-200 bg-white hover:bg-gray-50 transition-all"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Template (.csv)
        </button>
        <p className="text-xs text-gray-400 mt-2">Open in Excel, fill it in, then save as .xlsx before uploading.</p>
      </div>

      {/* Upload */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Step 2 — Upload Your File</h2>

        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
          onClick={() => inputRef.current?.click()}
        >
          <svg className="mx-auto mb-3 text-gray-300" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {file ? (
            <p className="text-sm font-semibold text-indigo-600">{file.name}</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-700">Click to choose file</p>
              <p className="text-xs text-gray-400 mt-1">.xlsx files only</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null)
              setResult(null)
              setError("")
            }}
          />
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={!file || loading}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 active:scale-[0.98] transition-all"
          >
            {loading ? "Importing..." : "Import Products"}
          </button>
          <Link
            href="/products"
            className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Result */}
      {result && (
        <div className={`rounded-2xl border p-5 ${result.failed === 0 ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}>
          <div className="flex items-center gap-2 mb-3">
            {result.failed === 0 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <p className="text-sm font-bold text-gray-900">
              {result.created} {result.created === 1 ? "product" : "products"} imported
              {result.failed > 0 && `, ${result.failed} failed`}
            </p>
          </div>

          {result.errors.length > 0 && (
            <ul className="space-y-1 mb-3">
              {result.errors.map((e, i) => (
                <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                  <span className="mt-0.5 flex-shrink-0">•</span>
                  {e}
                </li>
              ))}
            </ul>
          )}

          {result.created > 0 && (
            <Link
              href="/products"
              className="inline-block text-sm font-semibold text-indigo-600 hover:underline"
            >
              View your products →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
