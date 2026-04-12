"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { useRouter } from "next/navigation"

// ─── Types & Data ────────────────────────────────────────────────────────────

type Node = { id: string; label: string; href: string; layer: 0|1|2|3; description: string }

const NODES: Node[] = [
  { id: "jag",      label: "Jag Patel",    href: "/about",          layer: 0, description: "Principal AI/ML Engineer · 18+ yrs" },
  { id: "aiml",     label: "AI / ML",      href: "/projects",       layer: 1, description: "Machine Learning · Deep Learning · Agents" },
  { id: "mlops",    label: "MLOps",        href: "/projects",       layer: 1, description: "Pipelines · CI/CD · Monitoring" },
  { id: "cloud",    label: "Cloud Eng",    href: "/projects",       layer: 1, description: "Azure · AWS · Platform Engineering" },
  { id: "llm",      label: "LLM Eng",      href: "/blog",           layer: 1, description: "Prompt Design · RAG · Fine-tuning" },
  { id: "proj",     label: "Projects",     href: "/projects",       layer: 2, description: "Real-world AI & cloud systems" },
  { id: "certs",    label: "Certs",        href: "/certifications", layer: 2, description: "Azure · AWS · Professional certs" },
  { id: "edu",      label: "Education",    href: "/education",      layer: 2, description: "Academic & professional background" },
  { id: "blog",     label: "Blogs",        href: "/blog",           layer: 2, description: "Thoughts, tutorials & deep dives" },
  { id: "devsec",   label: "DevSecOps",    href: "/projects",       layer: 3, description: "Security · Compliance · Zero Trust" },
  { id: "platform", label: "Platform",     href: "/projects",       layer: 3, description: "Self-hosted infra · Developer portals" },
  { id: "obs",      label: "Observ-ability", href: "/projects",     layer: 3, description: "Logging SDK · Dashboards · Alerting" },
  { id: "contact",  label: "Contact",      href: "/contact",        layer: 3, description: "Get in touch" },
  { id: "about",    label: "About",        href: "/about",          layer: 3, description: "Background & experience" },
]

// Initial positions as % [left, top]
const POS: Record<string, [number, number]> = {
  jag:      [50, 44], aiml:     [22, 22], mlops:    [39, 13],
  cloud:    [61, 13], llm:      [78, 22], proj:     [16, 62],
  certs:    [38, 72], edu:      [62, 72], blog:     [84, 62],
  devsec:   [20, 88], platform: [36, 93], obs:      [50, 87],
  contact:  [64, 93], about:    [80, 88],
}

const EDGES: [string, string][] = [
  ["jag","aiml"],["jag","mlops"],["jag","cloud"],["jag","llm"],
  ["aiml","proj"],["aiml","blog"],["mlops","proj"],["mlops","certs"],
  ["cloud","proj"],["cloud","edu"],["llm","blog"],["llm","certs"],
  ["proj","devsec"],["proj","platform"],["proj","obs"],
  ["blog","obs"],["blog","contact"],["certs","about"],["certs","contact"],
  ["edu","about"],["edu","platform"],
]

const LAYER_COLOR: Record<number, string> = { 0:"#7c3aed", 1:"#3b82f6", 2:"#10b981", 3:"#f59e0b" }
const LAYER_BG: Record<number, string> = {
  0: "from-violet-600 to-violet-800",
  1: "from-blue-500 to-blue-700",
  2: "from-emerald-500 to-emerald-700",
  3: "from-amber-500 to-amber-700",
}
const NODE_SIZE: Record<number, number> = { 0: 80, 1: 64, 2: 58, 3: 54 }

/** Returns { fontSize, lines } so text fills the circle as best as possible */
function fitText(label: string, size: number): { fontSize: number; lineHeight: number } {
  // Usable square inside circle ≈ size * 0.65
  const usable = size * 0.65
  // Try fitting in 1, 2, 3 lines — pick largest font that fits
  for (const lines of [1, 2, 3]) {
    const charsPerLine = Math.ceil(label.length / lines)
    // approx 5.5px per char at 10px fontSize → scale proportionally
    const fontForWidth = (usable / charsPerLine) / 0.55
    const fontForHeight = (usable / lines) * 0.72
    const fs = Math.min(fontForWidth, fontForHeight)
    if (fs >= 7) return { fontSize: Math.min(fs, 14), lineHeight: 1.15 }
  }
  return { fontSize: 7, lineHeight: 1.15 }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NeuralNetworkHome({ onSkip }: { onSkip: () => void }) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<Node | null>(null)
  const [ready, setReady] = useState(false)
  // resetKey forces full remount of motion.divs (clears Framer Motion internal drag offset)
  const [resetKey, setResetKey] = useState(0)

  // ── Position tracking ──────────────────────────────────────────────────────
  // initPosRef: stable pixel positions for left/top CSS — NEVER updated by drag
  const initPosRef = useRef<Record<string, { x: number; y: number }>>({})
  // dragOffRef: accumulated drag offset per node — used only for SVG line positions
  const dragOffRef = useRef<Record<string, { dx: number; dy: number }>>({})
  // SVG line DOM refs for direct updates (no re-render on drag)
  const lineElRefs = useRef<Record<string, SVGLineElement | null>>({})
  // Per-node: was this a drag gesture (vs a click)?
  const dragOccurredRef = useRef<Record<string, boolean>>({})

  const initPositions = useCallback((w: number, h: number) => {
    NODES.forEach(n => {
      initPosRef.current[n.id] = {
        x: (POS[n.id][0] / 100) * w,
        y: (POS[n.id][1] / 100) * h,
      }
      dragOffRef.current[n.id] = { dx: 0, dy: 0 }
    })
  }, [])

  // Current visual center of a node = stable init pos + accumulated drag offset
  const getCenter = useCallback((id: string) => {
    const ip = initPosRef.current[id]
    if (!ip) return { x: 0, y: 0 }
    const off = dragOffRef.current[id] ?? { dx: 0, dy: 0 }
    return { x: ip.x + off.dx, y: ip.y + off.dy }
  }, [])

  // Update connected SVG lines directly via DOM (zero re-render overhead)
  const updateLines = useCallback((id: string) => {
    EDGES.forEach(([a, b]) => {
      if (a !== id && b !== id) return
      const el = lineElRefs.current[`${a}-${b}`]
      if (!el) return
      const pa = getCenter(a), pb = getCenter(b)
      el.setAttribute("x1", String(pa.x))
      el.setAttribute("y1", String(pa.y))
      el.setAttribute("x2", String(pb.x))
      el.setAttribute("y2", String(pb.y))
    })
  }, [getCenter])

  // Called on every drag frame — only updates refs + DOM, no setState
  const handleDrag = useCallback((id: string, info: PanInfo) => {
    dragOccurredRef.current[id] = true
    const off = dragOffRef.current[id] ?? { dx: 0, dy: 0 }
    dragOffRef.current[id] = { dx: off.dx + info.delta.x, dy: off.dy + info.delta.y }
    updateLines(id)
  }, [updateLines])

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return
      const r = containerRef.current.getBoundingClientRect()
      if (r.width === 0) return
      setDims({ w: r.width, h: r.height })
      initPositions(r.width, r.height)
    }
    measure()
    const t1 = setTimeout(measure, 50)
    const t2 = setTimeout(() => setReady(true), 120)
    window.addEventListener("resize", measure)
    return () => { window.removeEventListener("resize", measure); clearTimeout(t1); clearTimeout(t2) }
  }, [initPositions])

  const isHighlighted = (id: string) =>
    !hoveredId || hoveredId === id ||
    EDGES.some(([a,b]) => (a===hoveredId||b===hoveredId) && (a===id||b===id))

  const handleReset = () => {
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect()
      initPositions(r.width, r.height)
    }
    setResetKey(k => k + 1)
  }

  if (dims.w === 0) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background pt-20 pb-6">
        <div ref={containerRef} className="relative w-full max-w-4xl mx-auto px-4" style={{ height: "min(80vh, 620px)" }} />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden pt-20 pb-6">
      {/* Dot-grid bg */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <motion.p className="text-muted-foreground text-[10px] tracking-widest uppercase mb-2 z-10 select-none"
        initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 0.8 }}>
        Drag nodes · Hover to explore · Click to navigate
      </motion.p>

      {/* Canvas */}
      <div ref={containerRef} className="relative w-full max-w-4xl mx-auto px-4" style={{ height: "min(80vh, 620px)" }}>

        {/* SVG edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <filter id="ln-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {EDGES.map(([a, b]) => {
            const pa = getCenter(a), pb = getCenter(b)
            const active = !hoveredId || a === hoveredId || b === hoveredId
            const srcColor = LAYER_COLOR[NODES.find(n => n.id === a)!.layer]
            return (
              <line
                key={`${a}-${b}`}
                ref={el => { lineElRefs.current[`${a}-${b}`] = el }}
                x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke={active && hoveredId ? srcColor : "#334155"}
                strokeWidth={active && hoveredId ? 2 : 1}
                strokeOpacity={active ? (hoveredId ? 0.85 : 0.3) : 0.07}
                filter={active && hoveredId ? "url(#ln-glow)" : undefined}
              />
            )
          })}
          {/* Animated pulse dots on hover */}
          {hoveredId && EDGES.filter(([a,b]) => a===hoveredId||b===hoveredId).map(([a,b]) => {
            const pa = getCenter(a), pb = getCenter(b)
            return (
              <motion.circle key={`p-${a}-${b}`} r={3.5} fill="#a78bfa"
                initial={{ x: pa.x, y: pa.y }}
                animate={{ x: pb.x, y: pb.y }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
              />
            )
          })}
        </svg>

        {/* Nodes — key includes resetKey so remounting clears Framer internal drag offset */}
        {ready && NODES.map((node, i) => {
          const ip = initPosRef.current[node.id]
          if (!ip) return null
          const size = NODE_SIZE[node.layer]
          const highlighted = isHighlighted(node.id)
          const { fontSize, lineHeight } = fitText(node.label, size)

          return (
            <motion.div
              key={`${resetKey}-${node.id}`}
              className="absolute select-none"
              style={{
                // left/top use ONLY the stable init positions — never updated by drag
                left: ip.x,
                top: ip.y,
                width: size,
                height: size,
                marginLeft: -size/2,
                marginTop: -size/2,
                zIndex: hoveredId === node.id ? 10 : 2,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: highlighted ? 1 : 0.18 }}
              transition={{ duration: 0.35, delay: node.layer * 0.08 + i * 0.02, type: "spring", stiffness: 220 }}
              drag
              dragMomentum={false}
              dragElastic={0}
              onDragStart={() => { dragOccurredRef.current[node.id] = false }}
              onDrag={(_, info) => handleDrag(node.id, info)}
              whileDrag={{ scale: 1.15, zIndex: 20 }}
            >
              <button
                className={`w-full h-full rounded-full bg-gradient-to-br ${LAYER_BG[node.layer]} text-white font-semibold flex items-center justify-center text-center border-2 border-white/20 shadow-lg focus:outline-none cursor-grab active:cursor-grabbing`}
                style={{
                  fontSize,
                  lineHeight,
                  padding: "6px",
                  boxShadow: hoveredId === node.id ? `0 0 28px 8px ${LAYER_COLOR[node.layer]}66` : undefined,
                }}
                onPointerEnter={() => { setHoveredId(node.id); setTooltip(node) }}
                onPointerLeave={() => { setHoveredId(null); setTooltip(null) }}
                onClick={() => {
                  if (dragOccurredRef.current[node.id]) return
                  router.push(node.href)
                }}
                aria-label={node.label}
              >
                <span style={{
                  display: "block",
                  width: "100%",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  textAlign: "center",
                  hyphens: "auto",
                }}>
                  {node.label}
                </span>
              </button>

              {/* Tooltip */}
              <AnimatePresence>
                {tooltip?.id === node.id && (
                  <motion.div
                    className="absolute whitespace-nowrap bg-[#1e1b4b] text-violet-200 text-[10px] px-2.5 py-1 rounded-full shadow-xl pointer-events-none border border-violet-700"
                    style={{ bottom: "110%", left: "50%", x: "-50%", zIndex: 30 }}
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
      <motion.div className="flex flex-wrap gap-3 mt-3 z-10 justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 0.9 }}>
        {([0,1,2,3] as const).map(l => (
          <span key={l} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: LAYER_COLOR[l] }} />
            {["Identity","Core Capabilities","Proof of Work","Utility"][l]}
          </span>
        ))}
      </motion.div>

      {/* Reset & Skip */}
      <motion.button
        className="mt-2 z-10 text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 1 }}
        onClick={handleReset}
      >
        ↺ Reset layout
      </motion.button>

      <motion.button
        className="mt-3 z-10 px-5 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 1.1 }}
        onClick={onSkip}
      >
        Classic View →
      </motion.button>
    </div>
  )
}
