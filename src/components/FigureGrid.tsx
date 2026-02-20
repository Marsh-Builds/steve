"use client"

import { Figure, figures } from "@/data/figures"
import FigureCard from "./FigureCard"

interface FigureGridProps {
  onSelect: (figure: Figure) => void
}

export default function FigureGrid({ onSelect }: FigureGridProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4">
            Steve
          </h1>
          <p className="text-lg text-white/40 max-w-md mx-auto">
            Have a real-time voice conversation with history&apos;s greatest minds.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {figures.map((figure) => (
            <FigureCard key={figure.id} figure={figure} onClick={onSelect} />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-white/20 text-sm">
          Powered by OpenAI Realtime API
        </div>
      </div>
    </div>
  )
}
