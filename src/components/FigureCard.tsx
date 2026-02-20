"use client"

import { Figure } from "@/data/figures"

interface FigureCardProps {
  figure: Figure
  onClick: (figure: Figure) => void
}

export default function FigureCard({ figure, onClick }: FigureCardProps) {
  return (
    <button
      onClick={() => onClick(figure)}
      className="group relative overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-white/20 transition-all duration-300 text-left w-full aspect-[3/4]"
    >
      {/* Avatar */}
      <div className="absolute inset-0">
        <img
          src={figure.avatar}
          alt={figure.name}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div
          className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase mb-2"
          style={{ backgroundColor: figure.color + "30", color: figure.color }}
        >
          {figure.era}
        </div>
        <h3 className="text-xl font-semibold text-white mb-1">{figure.name}</h3>
        <p className="text-sm text-white/60 leading-snug">{figure.tagline}</p>
      </div>

      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 80%, ${figure.color}, transparent 70%)` }}
      />
    </button>
  )
}
