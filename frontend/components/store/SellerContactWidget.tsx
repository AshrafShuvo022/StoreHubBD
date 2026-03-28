"use client"

import { useState } from "react"

const WA_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const MSG_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
  </svg>
)

interface Props {
  phone?: string | null
  facebookPage?: string | null
}

function waLink(phone: string) {
  return `https://wa.me/880${phone.replace(/^(\+880|880|0)/, "")}`
}

function messengerLink(page: string) {
  return `https://m.me/${page}`
}

export default function SellerContactWidget({ phone, facebookPage }: Props) {
  const [open, setOpen] = useState(false)

  if (!phone && !facebookPage) return null

  const hasBoth = !!(phone && facebookPage)

  return (
    <div className="fixed bottom-6 left-4 z-30 flex flex-col items-start gap-2">

      {/* Expanded contact options */}
      {open && (
        <div className="flex flex-col gap-2 animate-fade-in">
          {phone && (
            <a
              href={waLink(phone)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full shadow-lg text-white text-sm font-semibold transition-all hover:brightness-95 active:scale-95"
              style={{ background: "#25D366" }}
            >
              {WA_ICON}
              WhatsApp
            </a>
          )}
          {facebookPage && (
            <a
              href={messengerLink(facebookPage)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full shadow-lg text-white text-sm font-semibold transition-all hover:brightness-95 active:scale-95"
              style={{ background: "#0084FF" }}
            >
              {MSG_ICON}
              Messenger
            </a>
          )}
        </div>
      )}

      {/* If only one option, show it directly without toggle */}
      {!hasBoth && !open && (
        <>
          {phone && (
            <a
              href={waLink(phone)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full shadow-lg text-white text-sm font-semibold transition-all hover:brightness-95 active:scale-95"
              style={{ background: "#25D366" }}
            >
              {WA_ICON}
              WhatsApp
            </a>
          )}
          {facebookPage && (
            <a
              href={messengerLink(facebookPage)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full shadow-lg text-white text-sm font-semibold transition-all hover:brightness-95 active:scale-95"
              style={{ background: "#0084FF" }}
            >
              {MSG_ICON}
              Messenger
            </a>
          )}
        </>
      )}

      {/* Toggle button — only shown when both options exist */}
      {hasBoth && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:brightness-95 active:scale-95"
          style={{ background: open ? "#374151" : "#131921" }}
          aria-label="Contact seller"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          )}
        </button>
      )}
    </div>
  )
}
