"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Figure } from "@/data/figures"
import { connectRealtime, RealtimeConnection, RealtimeEvent } from "@/lib/realtime"
import TranscriptDisplay, { TranscriptEntry } from "./TranscriptDisplay"

interface ConversationViewProps {
  figure: Figure
  onEnd: () => void
}

export default function ConversationView({ figure, onEnd }: ConversationViewProps) {
  const [status, setStatus] = useState<"connecting" | "connected" | "error" | "ended">("connecting")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [error, setError] = useState<string>("")
  const connRef = useRef<RealtimeConnection | null>(null)

  const handleEvent = useCallback((event: RealtimeEvent) => {
    switch (event.type) {
      case "response.audio_transcript.done":
        setTranscript((prev) => [
          ...prev,
          { role: "assistant", text: event.transcript as string },
        ])
        setIsSpeaking(false)
        break
      case "response.audio.delta":
        setIsSpeaking(true)
        break
      case "conversation.item.input_audio_transcription.completed":
        setTranscript((prev) => [
          ...prev,
          { role: "user", text: event.transcript as string },
        ])
        break
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function start() {
      try {
        // Get ephemeral token
        const res = await fetch("/api/realtime/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ figureId: figure.id }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to get token")
        if (cancelled) return

        // Connect WebRTC
        const conn = await connectRealtime(
          data.token,
          handleEvent,
          (state) => {
            if (state === "connected") setStatus("connected")
            else if (state === "failed" || state === "disconnected") {
              setStatus("error")
              setError("Connection lost")
            }
          }
        )
        if (cancelled) {
          conn.close()
          return
        }
        connRef.current = conn
        setStatus("connected")
      } catch (err) {
        if (!cancelled) {
          setStatus("error")
          setError(err instanceof Error ? err.message : "Connection failed")
        }
      }
    }

    start()
    return () => {
      cancelled = true
      connRef.current?.close()
    }
  }, [figure.id, handleEvent])

  const handleEnd = () => {
    connRef.current?.close()
    setStatus("ended")
    onEnd()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 relative">
      {/* Grain */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />

      {/* Back button */}
      <button
        onClick={handleEnd}
        className="absolute top-6 left-6 text-white/40 hover:text-white transition-colors text-sm flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      {/* Avatar with pulsing ring */}
      <div className="relative mb-8">
        <div
          className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 relative z-10"
          style={{ borderColor: figure.color + "60" }}
        >
          <img
            src={figure.avatar}
            alt={figure.name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Pulse animation when speaking */}
        {isSpeaking && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: figure.color }}
            />
            <div
              className="absolute -inset-2 rounded-full animate-pulse opacity-10"
              style={{ backgroundColor: figure.color }}
            />
          </>
        )}
      </div>

      {/* Name & status */}
      <h2 className="text-2xl font-semibold text-white mb-1">{figure.name}</h2>
      <div className="text-sm mb-8" style={{ color: figure.color }}>
        {status === "connecting" && "Connecting..."}
        {status === "connected" && "Listening..."}
        {status === "error" && error}
        {status === "ended" && "Conversation ended"}
      </div>

      {/* Waveform bars */}
      {status === "connected" && (
        <div className="flex items-center justify-center gap-[3px] h-8 mb-8">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full"
              style={{
                backgroundColor: figure.color,
                opacity: isSpeaking ? 0.8 : 0.2,
                animation: isSpeaking
                  ? `waveform ${0.4 + (i % 3) * 0.15}s ease-in-out infinite alternate`
                  : "none",
                height: isSpeaking ? undefined : "4px",
              }}
            />
          ))}
        </div>
      )}

      {/* Transcript */}
      <div className="w-full max-w-lg mb-8">
        <TranscriptDisplay entries={transcript} color={figure.color} />
      </div>

      {/* End button */}
      {status === "connected" && (
        <button
          onClick={handleEnd}
          className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all text-sm"
        >
          End conversation
        </button>
      )}

      {status === "error" && (
        <button
          onClick={onEnd}
          className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all text-sm"
        >
          Go back
        </button>
      )}
    </div>
  )
}
