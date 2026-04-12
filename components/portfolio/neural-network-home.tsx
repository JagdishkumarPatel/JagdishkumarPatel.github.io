"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

type Node = {
  id: string
  label: string
  href: string
  layer: 0 | 1 | 2 | 3
  description: string
}

const NODES: Node[] = [
  // Layer 0 – Identity
  { id: "jag",      label: "Jag Patel",       href: "/about",           layer: 0, description: "Principal AI/ML Engineer · 18+ yrs" },
  // Layer 1 – Who I am
  { id: "aiml",     label: "AI/ML",            href: "/projects",        layer: 1, description: "Machine Learning · Deep Learning · Agents" },
  { id: "mlops",    label: "MLOps",            href: "/projects",        layer: 1, description: "Pipelines · CI/CD · Monitoring" },
  { id: "cloud",    label: "Cloud Eng",        href: "/projects",        layer: 1, description: "Azure · AWS · Platform Engineering" },
  { id: "llm",      label: "LLM Eng",          href: "/blog",            layer: 1, description: "Prompt Design · RAG · Fine-tuning" },
  // Layer 2 – What I show
  { id: "proj",     label: "Projects",         href: "/projects",        layer: 2, description: "Real-world AI & cloud systems" },
  { id: "certs",    label: "Certifications",   href: "/certifications",  layer: 2, description: "Azure · AWS · Professional certs" },
  { id: "edu",      label: "Education",        href: "/education",       layer: 2, description: "Academic & professional background" },
  { id: "blog",     label: "Blogs",            href: "/blog",            layer: 2, description: "Thoughts, tutorials & deep dives" },
  // Layer 3 – Skills & utility
  { id: "devsec",   label: "DevSecOps",        href: "/projects",        layer: 3, description: "Security · Compliance · Zero Trust" },
  { id: "platform", label: "Platform Eng",     href: "/projects",        layer: 3, description: "Self-hosted infra · Developer portals" },
  { id: "obs",      label: "Observability",    href: "/projects",        layer: 3, description: "Logging SDK · Dashboards · Alerting" },
  { id: "contact",  label: "Contact",          href: "/contact",         layer: 3, description: "Get in touch" },
  { id: "about",    label: "About",            href: "/about",           layer: 3, description: "Background & experience" },
]

// Positions as percentage [left%, top%] of canvas
const POS: Record<string, [number, number]> = {
  jag:      [50,  46],
  aiml:     [20,  24],
  mlops:    [38,  14],
  cloud:    [62,  14],
  llm:      [80,  24],
  proj:     [14,  63],
  certs:    [37,  73],
  edu:      [63,  73],
  blog:     [86,  63],
  devsec:   [18,  90],
  platform: [35,  93],
  obs:      [50,  88],
  contact:  [65,  93],
  about:    [82,  90],
}

const EDGES: [string, string][] = [
  ["jag","aiml"], ["jag","mlops"], ["jag","cloud"], ["jag","llm"],
  ["aiml","proj"], ["aiml","blog"],
  ["mlops","proj"], ["mlops","certs"],
  ["cloud","proj"], ["cloud","edu"],
  ["llm","blog"], ["llm","certs"],
  ["proj","devsec"], ["proj","platform"], ["proj","obs"],
  ["blog","obs"], ["blog","contact"],
  ["certs","about"], ["certs","contact"],
  ["edu","about"], ["edu","platform"],
]

const LAYER_COLOR: Record<number, string> = {
  0: "#7c3aed", 1: "#3b82f6", 2: "#10b981", 3: "#f59e0b",
}
const LAYER_BG: Record<number, string> = {
  0: "from-violet-600 to-violet-800",
  1: "from-blue-500 to-blue-700",
  2: "from-emerald-500 to-emerald-700",
  3: "from-amber-500 to-amber-700",
}
const NODE_SIZE: Record<number, number> = { 0: 72, 1: 56, 2: 52, 3: 48 }

export function NeuralNetworkHome({ onSkip }: { onSkip: () => void }) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 800, h: 500 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<Node | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect()
        setDims({ w: r.width, h: r.height })
      }
    }
    measure()
    window.addEventListener("resize", measure)
    const t = setTimeout(() => setReady(true), 80)
    return () => { window.removeEventListener("resize", measure); clearTimeout(t) }
  }, [])

  const px = (id: string) => ({
    x: (POS[id][0] / 100) * dims.w,
    y: (POS[id][1] / 100) * dims.h,
  })

  const connectedIds = hoveredId
    ? EDGES.filter(([a, b]) => a === hoveredId || b === hoveredId).flatMap(([a, b]) => [a, b])
    : []

  const isHighlighted = (id: string) => !hoveredId || hoveredId === id || connectedIds.includes(id)
  const isEdgeActive  = (a: string, b: string) => !hoveredId || a === hoveredId || b === hoveredId

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Dot-grid bg */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <motion.p className="text-muted-foreground text-xs tracking-widest uppercase mb-3 z-10"
        initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 1 }}>
        Hover to explore · Click to navigate
      </motion.p>

      {/* Canvas: SVG lines behind, div nodes on top */}
      <div ref={containerRef} className="relative w-full max-w-4xl" style={{ height: "min(82vh, 640px)" }}>

        {/* SVG lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <filter id="ln-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {EDGES.map(([a, b]) => {
            const pa = px(a), pb = px(b)
            const active = isEdgeActive(a, b)
            const srcColor = LAYER_COLOR[NODES.find(n => n.id === a)!.layer]
            return (
              <motion.line key={`${a}-${b}`}
                x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke={active && hoveredId ? srcColor : "#334155"}
                strokeWidth={active && hoveredId ? 2 : 1}
                strokeOpacity={active ? (hoveredId ? 0.85 : 0.28) : 0.06}
                filter={active && hoveredId ? "url(#ln-glow)" : undefined}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            )
          })}
          {/* Pulse dots on active edges */}
          {hoveredId && EDGES.filter(([a, b]) => a === hoveredId || b === hoveredId).map(([a, b]) => {
            const pa = px(a), pb = px(b)
            return (
              <motion.circle key={`pulse-${a}-${b}`} r={3.5} fill="#a78bfa"
                initial={{ x: pa.x, y: pa.y }}
                animate={{ x: pb.x, y: pb.y }}
                transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
              />
            )
          })}
        </svg>

        {/* Div nodes */}
        {NODES.map((node, i) => {
          const { x, y } = px(node.id)
          const size = NODE_SIZE[node.layer]
          const highlighted = isHighlighted(node.id)

          return (
            <motion.div key={node.id}
              className="absolute"
              style={{ left: x, top: y, width: size, height: size, marginLeft: -size/2, marginTop: -size/2, zIndex: 2 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: highlighted ? 1 : 0.15 }}
              transition={{ duration: 0.4, delay: node.layer * 0.1 + i * 0.025, type: "spring", stiffness: 200 }}
            >
              <motion.button
                className={`w-full h-full rounded-full bg-gradient-to-br ${LAYER_BG[node.layer]} text-white font-bold flex items-center justify-center text-center leading-tight border-2 border-white/20 cursor-pointer shadow-lg focus:outline-none`}
                style={{ fontSize: node.layer === 0 ? 11 : 9, boxShadow: hoveredId === node.id ? `0 0 22px 6px ${LAYER_COLOR[node.layer]}77` : undefined }}
                whileHover={{ scale: 1.18 }}
                whileTap={{ scale: 0.93 }}
                onHoverStart={() => { setHoveredId(node.id); setTooltip(node) }}
                onHoverEnd={() => { setHoveredId(null); setTooltip(null) }}
                onClick={() => router.push(node.href)}
                aria-label={node.label}
              >
                <span className="px-1 break-words">{node.label}</span>
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {tooltip?.id === node.id && (
                  <motion.div
                    className="absolute whitespace-nowrap bg-[#1e1b4b] text-violet-200 text-[10px] px-2.5 py-1 rounded-full shadow-xl pointer-events-none border border-violet-700"
                    style={{ bottom: "110%", left: "50%", x: "-50%", zIndex: 20 }}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    {node.description}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <motion.div className="flex flex-wrap gap-4 mt-4 z-10 justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 1 }}>
        {([0,1,2,3] as const).map(l => (
          <span key={l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: LAYER_COLOR[l] }} />
            {["Identity","Core Capabilities","Proof of Work","Utility"][l]}
          </span>
        ))}
      </motion.div>

      {/* Skip */}
      <motion.button
        className="mt-6 z-10 px-5 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 1.3 }}
        onClick={onSkip}
      >
        Classic View →
      </motion.button>
    </div>
  )
}
