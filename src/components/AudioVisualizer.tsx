"use client"

interface AudioVisualizerProps {
  isActive: boolean
  color: string
}

export default function AudioVisualizer({ isActive, color }: AudioVisualizerProps) {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-150"
          style={{
            backgroundColor: color,
            height: isActive ? `${12 + Math.random() * 20}px` : "4px",
            animation: isActive ? `pulse ${0.3 + i * 0.1}s ease-in-out infinite alternate` : "none",
          }}
        />
      ))}
    </div>
  )
}
