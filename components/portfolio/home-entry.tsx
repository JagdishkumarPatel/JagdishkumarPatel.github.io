"use client"

import React, { useEffect, useState } from "react"
import { NeuralNetworkHome } from "@/components/portfolio/neural-network-home"

const STORAGE_KEY = "portfolio-view"

export function HomeEntry({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<"neural" | "classic" | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    setView(saved === "classic" ? "classic" : "neural")
  }, [])

  const skipToClassic = () => {
    localStorage.setItem(STORAGE_KEY, "classic")
    setView("classic")
  }

  // Avoid hydration mismatch — render nothing until we know the view
  if (view === null) return null

  if (view === "neural") {
    return <NeuralNetworkHome onSkip={skipToClassic} />
  }

  return (
    <div>
      <div className="flex justify-end px-6 pt-4">
        <button
          className="text-xs text-muted-foreground hover:text-primary border border-border rounded-full px-4 py-1.5 transition-colors"
          onClick={() => {
            localStorage.removeItem(STORAGE_KEY)
            setView("neural")
          }}
        >
          🧠 Neural View
        </button>
      </div>
      {children}
    </div>
  )
}
