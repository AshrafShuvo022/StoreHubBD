"use client"

import { useState } from "react"

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

const WA_SVG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const MSG_SVG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
  </svg>
)

export default function SellerContactWidget({ phone, facebookPage }: Props) {
  const [waHovered, setWaHovered] = useState(false)
  const [msgHovered, setMsgHovered] = useState(false)

  if (!phone && !facebookPage) return null

  return (
    <>
      {/* ── Mobile: sticky bottom bar ── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-4 py-3"
        style={{
          background: "linear-gradient(to top, #0f1923 0%, #131921 100%)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <p className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Contact Seller · We reply fast ⚡
        </p>
        <div className="flex gap-3">
          {phone && (
            <a
              href={waLink(phone)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold active:scale-95 transition-transform"
              style={{
                background: "#25D366",
                boxShadow: "0 4px 16px rgba(37,211,102,0.4)",
              }}
            >
              {WA_SVG}
              WhatsApp
            </a>
          )}
          {facebookPage && (
            <a
              href={messengerLink(facebookPage)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg, #0084FF, #0099FF)",
                boxShadow: "0 4px 16px rgba(0,132,255,0.4)",
              }}
            >
              {MSG_SVG}
              Messenger
            </a>
          )}
        </div>
      </div>

      {/* ── Desktop: floating icon buttons, bottom-right, expand on hover ── */}
      <div className="hidden lg:flex fixed bottom-8 right-6 z-30 flex-col items-end gap-3">
        {/* Label */}
        <span className="text-[10px] font-semibold uppercase tracking-widest mr-1" style={{ color: "#131921" }}>
          Contact
        </span>

        {/* WhatsApp */}
        {phone && (
          <a
            href={waLink(phone)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center overflow-hidden rounded-full text-white text-sm font-bold transition-all duration-300"
            style={{
              background: "#25D366",
              boxShadow: waHovered
                ? "0 0 0 6px rgba(37,211,102,0.2), 0 8px 28px rgba(37,211,102,0.5)"
                : "0 0 0 4px rgba(37,211,102,0.15), 0 4px 18px rgba(37,211,102,0.4)",
              height: "48px",
              width: waHovered ? "172px" : "48px",
              paddingLeft: waHovered ? "14px" : "0px",
              justifyContent: waHovered ? "flex-start" : "center",
              gap: waHovered ? "10px" : "0px",
            }}
            onMouseEnter={() => setWaHovered(true)}
            onMouseLeave={() => setWaHovered(false)}
          >
            <span className="flex-shrink-0">{WA_SVG}</span>
            <span
              className="whitespace-nowrap transition-all duration-300"
              style={{
                opacity: waHovered ? 1 : 0,
                maxWidth: waHovered ? "120px" : "0px",
              }}
            >
              Chat on WhatsApp
            </span>
          </a>
        )}

        {/* Messenger */}
        {facebookPage && (
          <a
            href={messengerLink(facebookPage)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center overflow-hidden rounded-full text-white text-sm font-bold transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #0084FF, #0099FF)",
              boxShadow: msgHovered
                ? "0 0 0 6px rgba(0,132,255,0.2), 0 8px 28px rgba(0,132,255,0.5)"
                : "0 0 0 4px rgba(0,132,255,0.15), 0 4px 18px rgba(0,132,255,0.4)",
              height: "48px",
              width: msgHovered ? "196px" : "48px",
              paddingLeft: msgHovered ? "14px" : "0px",
              justifyContent: msgHovered ? "flex-start" : "center",
              gap: msgHovered ? "10px" : "0px",
            }}
            onMouseEnter={() => setMsgHovered(true)}
            onMouseLeave={() => setMsgHovered(false)}
          >
            <span className="flex-shrink-0">{MSG_SVG}</span>
            <span
              className="whitespace-nowrap transition-all duration-300"
              style={{
                opacity: msgHovered ? 1 : 0,
                maxWidth: msgHovered ? "150px" : "0px",
              }}
            >
              Message on Messenger
            </span>
          </a>
        )}
      </div>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes wa-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(37,211,102,0.15), 0 4px 18px rgba(37,211,102,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(37,211,102,0.08), 0 4px 18px rgba(37,211,102,0.4); }
        }
      `}</style>
    </>
  )
}
