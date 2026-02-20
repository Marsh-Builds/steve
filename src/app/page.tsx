"use client"

import { useState } from "react"
import { Figure } from "@/data/figures"
import FigureGrid from "@/components/FigureGrid"
import ConversationView from "@/components/ConversationView"

export default function Home() {
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null)

  if (selectedFigure) {
    return (
      <ConversationView
        figure={selectedFigure}
        onEnd={() => setSelectedFigure(null)}
      />
    )
  }

  return <FigureGrid onSelect={setSelectedFigure} />
}
