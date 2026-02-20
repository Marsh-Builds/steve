"use client"

import { useEffect, useRef } from "react"

export interface TranscriptEntry {
  role: "user" | "assistant"
  text: string
}

interface TranscriptDisplayProps {
  entries: TranscriptEntry[]
  color: string
}

export default function TranscriptDisplay({ entries, color }: TranscriptDisplayProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [entries])

  if (entries.length === 0) {
    return (
      <div className="text-white/20 text-center text-sm py-8">
        Start speaking to begin the conversation...
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto px-4 scrollbar-thin">
      {entries.map((entry, i) => (
        <div
          key={i}
          className={`text-sm ${entry.role === "user" ? "text-white/50 text-right" : "text-left"}`}
          style={entry.role === "assistant" ? { color } : undefined}
        >
          {entry.text}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
