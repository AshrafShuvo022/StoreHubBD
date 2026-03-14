"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/products", label: "Products", icon: "📦" },
  { href: "/orders", label: "Orders", icon: "🛒" },
  { href: "/settings", label: "Store Settings", icon: "⚙️" },
]

export default function Sidebar({ storeName }: { storeName: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-4 py-5 border-b border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-wider">StoreHubBD</p>
        <p className="font-semibold text-gray-900 mt-0.5 truncate">{storeName}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  )
}
