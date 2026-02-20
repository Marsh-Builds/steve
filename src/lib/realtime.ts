export interface RealtimeConnection {
  pc: RTCPeerConnection
  dc: RTCDataChannel
  audioEl: HTMLAudioElement
  close: () => void
}

export type RealtimeEvent = {
  type: string
  [key: string]: unknown
}

export async function connectRealtime(
  ephemeralToken: string,
  onEvent: (event: RealtimeEvent) => void,
  onConnectionChange: (state: RTCPeerConnectionState) => void
): Promise<RealtimeConnection> {
  const pc = new RTCPeerConnection()

  pc.onconnectionstatechange = () => {
    onConnectionChange(pc.connectionState)
  }

  // Add local audio
  const ms = await navigator.mediaDevices.getUserMedia({ audio: true })
  pc.addTrack(ms.getTracks()[0])

  // Play remote audio
  const audioEl = document.createElement("audio")
  audioEl.autoplay = true
  pc.ontrack = (e) => {
    audioEl.srcObject = e.streams[0]
  }

  // Data channel for events
  const dc = pc.createDataChannel("oai-events")
  dc.onmessage = (e) => {
    try {
      const event = JSON.parse(e.data)
      onEvent(event)
    } catch {
      // ignore parse errors
    }
  }

  // Create and send offer
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  const sdpResponse = await fetch(
    "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
    {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${ephemeralToken}`,
        "Content-Type": "application/sdp",
      },
    }
  )

  const answerSdp = await sdpResponse.text()
  await pc.setRemoteDescription({ type: "answer", sdp: answerSdp })

  const close = () => {
    ms.getTracks().forEach((t) => t.stop())
    dc.close()
    pc.close()
    audioEl.srcObject = null
  }

  return { pc, dc, audioEl, close }
}
