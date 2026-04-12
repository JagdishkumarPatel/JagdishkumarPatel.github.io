"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// ─── Data ───────────────────────────────────────────────────────────────────

type Node = {
  id: string
  label: string
  href: string | null
  layer: number
  description?: string
}

const NODES: Node[] = [
  // Layer 0 – Identity
  { id: "jag", label: "Jag Patel", href: "/about", layer: 0, description: "Principal AI/ML Engineer" },
  // Layer 1 – Core Capabilities
  { id: "ai", label: "AI Systems", href: "/projects", layer: 1, description: "LLM · RAG · Agents" },
  { id: "mlops", label: "MLOps", href: "/projects", layer: 1, description: "Pipelines · CI/CD · Monitoring" },
  { id: "obs", label: "Observability", href: "/projects", layer: 1, description: "Logging SDK · Dashboards" },
  { id: "llm", label: "LLM Eng", href: "/blog", layer: 1, description: "Prompt Design · Fine-tuning" },
  // Layer 2 – Proof
  { id: "proj", label: "Projects", href: "/projects", layer: 2, description: "Real-world AI systems" },
  { id: "pipe", label: "Pipelines", href: "/projects", layer: 2, description: "End-to-end ML pipelines" },
  { id: "sdk", label: "Logging SDK", href: "/projects", layer: 2, description: "Open-source observability" },
  { id: "blog", label: "Blogs", href: "/blog", layer: 2, description: "Thoughts & tutorials" },
  // Layer 3 – Utility
  { id: "contact", label: "Contact", href: "/contact", layer: 3, description: "Get in touch" },
  { id: "about", label: "About", href: "/about", layer: 3, description: "Background & experience" },
]

// Edges: [from, to]
const EDGES: [string, string][] = [
  ["jag", "ai"], ["jag", "mlops"], ["jag", "obs"], ["jag", "llm"],
  ["ai", "proj"], ["mlops", "pipe"], ["obs", "sdk"], ["llm", "blog"],
  ["proj", "contact"], ["proj", "about"], ["blog", "contact"], ["sdk", "about"],
  ["pipe", "contact"],
]

// ─── Layout positions (relative to 0,0 center, in a 900×600 vb) ─────────────

const POSITIONS: Record<string, [number, number]> = {
  jag:     [0,    0],
  ai:      [-270, -140],
  mlops:   [-90,  -170],
  obs:     [90,   -170],
  llm:     [270,  -140],
  proj:    [-300, 90],
  pipe:    [-100, 120],
  sdk:     [100,  120],
  blog:    [300,  90],
  contact: [-140, 270],
  about:   [140,  270],
}

// ─── Colours per layer ───────────────────────────────────────────────────────

const LAYER_COLORS: Record<number, string> = {
  0: "#7c3aed", // violet
  1: "#2563eb", // blue
  2: "#059669", // emerald
  3: "#d97706", // amber
}

const LAYER_GLOW: Record<number, string> = {
  0: "0 0 28px 8px #7c3aed88",
  1: "0 0 18px 5px #2563eb66",
  2: "0 0 14px 4px #05966966",
  3: "0 0 12px 3px #d9770666",
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NeuralNetworkHome({ onSkip }: { onSkip: () => void }) {
  const router = useRouter()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  const connectedToHovered = hoveredId
    ? EDGES
        .filter(([a, b]) => a === hoveredId || b === hoveredId)
        .flatMap(([a, b]) => [a, b])
    : []

  const isHighlighted = (id: string) =>
    !hoveredId || hoveredId === id || connectedToHovered.includes(id)

  const isEdgeHighlighted = (a: string, b: string) =>
    !hoveredId || a === hoveredId || b === hoveredId

  // ViewBox: [-450, -320, 900, 620]
  const VW = 900, VH = 620, ox = 450, oy = 270

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Dot-grid bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Title */}
      <motion.p
        className="text-muted-foreground text-sm tracking-widest uppercase mb-4 z-10"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : -12 }}
        transition={{ duration: 0.6 }}
      >
        Click any node to explore
      </motion.p>

      {/* SVG Network */}
      <motion.div
        className="relative w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.92 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <svg
          viewBox={`${-ox} ${-oy} ${VW} ${VH}`}
          className="w-full h-auto"
          style={{ minHeight: 340 }}
        >
          {/* Edges */}
          {EDGES.map(([a, b]) => {
            const [ax, ay] = POSITIONS[a]
            const [bx, by] = POSITIONS[b]
            const highlighted = isEdgeHighlighted(a, b)
            return (
              <motion.line
                key={`${a}-${b}`}
                x1={ax} y1={ay} x2={bx} y2={by}
                stroke={highlighted ? "#7c3aed" : "#334155"}
                strokeWidth={highlighted ? 2 : 1}
                strokeOpacity={highlighted ? 0.7 : 0.18}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{ filter: highlighted && hoveredId ? "drop-shadow(0 0 4px #7c3aed88)" : undefined }}
              />
            )
          })}

          {/* Animated pulse along edges on hover */}
          {hoveredId && EDGES.filter(([a, b]) => a === hoveredId || b === hoveredId).map(([a, b]) => {
            const [ax, ay] = POSITIONS[a]
            const [bx, by] = POSITIONS[b]
            return (
              <motion.circle
                key={`pulse-${a}-${b}`}
                r={3}
                fill="#a78bfa"
                initial={{ offsetDistance: "0%" } as never}
                animate={{ offsetDistance: "100%" } as never}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              >
                <animateMotion dur="0.9s" repeatCount="indefinite">
                  <mpath />
                </animateMotion>
              </motion.circle>
            )
          })}

          {/* Nodes rendered in SVG foreignObject for rich styling */}
          {NODES.map((node) => {
            const [x, y] = POSITIONS[node.id]
            const color = LAYER_COLORS[node.layer]
            const glow = LAYER_GLOW[node.layer]
            const highlighted = isHighlighted(node.id)
            const isCenter = node.layer === 0

            return (
              <motion.g
                key={node.id}
                transform={`translate(${x},${y})`}
                style={{ cursor: node.href ? "pointer" : "default" }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: highlighted ? 1 : 0.25 }}
                transition={{ duration: 0.5, delay: node.layer * 0.15 + 0.1 }}
                whileHover={{ scale: 1.15 }}
                onHoverStart={() => setHoveredId(node.id)}
                onHoverEnd={() => setHoveredId(null)}
                onClick={() => node.href && router.push(node.href)}
              >
                {/* Glow ring */}
                <motion.circle
                  r={isCenter ? 48 : 34}
                  fill="transparent"
                  stroke={color}
                  strokeWidth={isCenter ? 3 : 2}
                  opacity={0.35}
                  animate={hoveredId === node.id ? { r: isCenter ? 54 : 40, opacity: 0.7 } : {}}
                  transition={{ duration: 0.3 }}
                  style={{ filter: hoveredId === node.id ? glow : undefined }}
                />
                {/* Main circle */}
                <circle
                  r={isCenter ? 42 : 28}
                  fill={color}
                  opacity={0.92}
                />
                {/* Label */}
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={isCenter ? 13 : 10}
                  fontWeight={isCenter ? 700 : 600}
                  style={{ pointerEvents: "none", fontFamily: "inherit" }}
                >
                  {node.label}
                </text>
                {/* Description tooltip on hover */}
                <AnimatePresence>
                  {hoveredId === node.id && node.description && (
                    <motion.g
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <rect
                        x={-60} y={isCenter ? 50 : 35}
                        width={120} height={22}
                        rx={6} fill="#1e1b4b" opacity={0.92}
                      />
                      <text
                        x={0} y={isCenter ? 64 : 49}
                        textAnchor="middle"
                        fill="#c4b5fd"
                        fontSize={8}
                        fontWeight={500}
                        style={{ pointerEvents: "none", fontFamily: "inherit" }}
                      >
                        {node.description}
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </motion.g>
            )
          })}
        </svg>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="flex flex-wrap gap-4 mt-4 z-10 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 0.9 }}
      >
        {[
          { label: "Identity", color: LAYER_COLORS[0] },
          { label: "Core Capabilities", color: LAYER_COLORS[1] },
          { label: "Proof of Work", color: LAYER_COLORS[2] },
          { label: "Utility", color: LAYER_COLORS[3] },
        ].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
            {label}
          </span>
        ))}
      </motion.div>

      {/* Skip button */}
      <motion.button
        className="mt-8 z-10 px-5 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.2 }}
        onClick={onSkip}
      >
        Classic View →
      </motion.button>
    </div>
  )
}
