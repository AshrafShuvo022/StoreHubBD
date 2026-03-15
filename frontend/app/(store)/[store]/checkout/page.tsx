"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Suspense } from "react"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const total = searchParams.get("total")
  const [copied, setCopied] = useState(false)

  function copyCode() {
    if (!code) return
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 max-w-sm w-full text-center relative overflow-hidden">
        {/* Confetti pieces */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative">
            <div className="absolute w-3 h-3 bg-indigo-500 rounded-sm animate-confetti-1" style={{ top: "-20px", left: "-10px" }} />
            <div className="absolute w-2 h-2 bg-amber-400 rounded-sm animate-confetti-2" style={{ top: "-15px", right: "-10px" }} />
            <div className="absolute w-2.5 h-2.5 bg-green-400 rounded-sm animate-confetti-3" style={{ top: "-5px", left: "-30px" }} />
            <div className="absolute w-2 h-2 bg-indigo-300 rounded-sm animate-confetti-4" style={{ top: "-25px", right: "-20px" }} />
            <div className="absolute w-1.5 h-1.5 bg-amber-300 rounded-sm animate-confetti-5" style={{ top: "-10px", left: "20px" }} />
            <div className="absolute w-3 h-2 bg-indigo-400 rounded-sm animate-confetti-6" style={{ top: "-20px", right: "10px" }} />
          </div>
        </div>

        {/* Checkmark */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-scale-in">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900">Order Confirmed!</h1>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          You&apos;ll receive an SMS confirmation shortly.
        </p>

        {/* Order ID Box */}
        <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-2">
            Your Order ID
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-3xl font-mono font-extrabold text-indigo-700 tracking-widest">
              {code}
            </p>
            <button
              onClick={copyCode}
              title="Copy Order ID"
              className="ml-1 p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-100 transition-colors"
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-xs text-indigo-500 mt-1 animate-fade-in">Copied!</p>
          )}
          {total && (
            <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-indigo-100">
              <span className="text-indigo-400 font-medium">Total paid</span>
              <span className="font-bold text-indigo-700">৳{Number(total).toLocaleString()}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4 leading-relaxed">
          Save this order ID to ask the seller about your order status.
        </p>

        <Link
          href="/"
          className="mt-5 block w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-base hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          Continue Shopping →
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
