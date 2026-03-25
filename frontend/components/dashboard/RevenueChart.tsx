"use client"

import { useState } from "react"

interface DayData {
  date: string
  revenue: number
  orders: number
}

const W = 600
const H = 180
const PAD = { top: 12, right: 12, bottom: 28, left: 52 }
const CW = W - PAD.left - PAD.right
const CH = H - PAD.top - PAD.bottom

function formatLabel(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

function formatRevenue(v: number) {
  if (v >= 100000) return `৳${(v / 1000).toFixed(0)}k`
  if (v >= 1000) return `৳${(v / 1000).toFixed(1)}k`
  return `৳${v.toFixed(0)}`
}

export default function RevenueChart({ data }: { data: DayData[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)
  const totalOrders = data.reduce((s, d) => s + d.orders, 0)

  const xScale = (i: number) => (i / (data.length - 1)) * CW
  const yScale = (v: number) => CH - (v / maxRevenue) * CH

  const pathPoints = data.map((d, i) => `${xScale(i)},${yScale(d.revenue)}`).join(" ")
  const areaPath = [
    `M 0 ${CH}`,
    ...data.map((d, i) => `L ${xScale(i)} ${yScale(d.revenue)}`),
    `L ${CW} ${CH}`,
    "Z",
  ].join(" ")

  const yTicks = [0, 0.33, 0.66, 1].map((t) => ({
    value: maxRevenue * t,
    y: CH - t * CH,
  }))

  const xLabelIdxs = [0, 7, 14, 21, 29]

  return (
    <div>
      {/* Summary row */}
      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-xs text-gray-400">30-day Revenue</p>
          <p className="text-sm font-semibold text-gray-800">৳{totalRevenue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">30-day Orders</p>
          <p className="text-sm font-semibold text-gray-800">{totalOrders}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          <g transform={`translate(${PAD.left},${PAD.top})`}>
            {/* Grid */}
            {yTicks.map((t, i) => (
              <g key={i}>
                <line x1={0} y1={t.y} x2={CW} y2={t.y} stroke="#F3F4F6" strokeWidth="1" />
                {t.value > 0 && (
                  <text x={-8} y={t.y + 4} textAnchor="end" fontSize="7" fill="#9CA3AF">
                    {formatRevenue(t.value)}
                  </text>
                )}
              </g>
            ))}

            {/* Area */}
            <path d={areaPath} fill="url(#rg)" />

            {/* Line */}
            <polyline
              points={pathPoints}
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Hover interaction areas */}
            {data.map((d, i) => (
              <rect
                key={i}
                x={xScale(i) - CW / data.length / 2}
                y={0}
                width={CW / data.length}
                height={CH}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
              />
            ))}

            {/* Hover dot + vertical line */}
            {hovered !== null && (
              <>
                <line
                  x1={xScale(hovered)}
                  y1={0}
                  x2={xScale(hovered)}
                  y2={CH}
                  stroke="#E0E7FF"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                />
                <circle
                  cx={xScale(hovered)}
                  cy={yScale(data[hovered].revenue)}
                  r="4"
                  fill="#4F46E5"
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Tooltip */}
                <g transform={`translate(${Math.min(xScale(hovered) + 8, CW - 100)}, ${Math.max(yScale(data[hovered].revenue) - 36, 2)})`}>
                  <rect rx="6" ry="6" width="96" height="32" fill="#1E1B4B" />
                  <text x="8" y="13" fontSize="7.5" fill="#A5B4FC" fontWeight="600">
                    {formatLabel(data[hovered].date)}
                  </text>
                  <text x="8" y="25" fontSize="8.5" fill="white" fontWeight="700">
                    ৳{data[hovered].revenue.toLocaleString()} · {data[hovered].orders} orders
                  </text>
                </g>
              </>
            )}

            {/* X-axis labels */}
            {xLabelIdxs.map((i) => (
              <text key={i} x={xScale(i)} y={CH + 18} textAnchor="middle" fontSize="7" fill="#9CA3AF">
                {formatLabel(data[i].date)}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
