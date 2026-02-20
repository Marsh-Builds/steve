import { NextRequest, NextResponse } from "next/server"
import { getFigureById } from "@/data/figures"

export async function POST(req: NextRequest) {
  const { figureId } = await req.json()

  const figure = getFigureById(figureId)
  if (!figure) {
    return NextResponse.json({ error: "Figure not found" }, { status: 404 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 })
  }

  const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-realtime-preview-2024-12-17",
      voice: figure.voiceId,
      instructions: figure.systemPrompt,
      modalities: ["audio", "text"],
      input_audio_transcription: { model: "whisper-1" },
      turn_detection: { type: "server_vad" },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return NextResponse.json(
      { error: "OpenAI API error", details: err },
      { status: response.status }
    )
  }

  const data = await response.json()
  return NextResponse.json({ token: data.client_secret.value })
}
