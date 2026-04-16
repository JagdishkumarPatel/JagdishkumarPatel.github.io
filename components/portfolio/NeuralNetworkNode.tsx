"use client";

import React, { useState } from "react";
import { Handle, Position, NodeProps } from "react-flow-renderer";
import { motion } from "framer-motion";

import { getNodeWeight } from "./network-logic";

export default function NeuralNetworkNode({ data, selected }: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const active: boolean = data.active ?? false;
  const lit: boolean = data.lit ?? false;
  const highlight = active || lit || hovered || selected;
  const weight = data.weight || getNodeWeight(data.id);
  const isCentral = data.id === "jag";

  // 3D depth-based visual mapping
  const depth = typeof data.depth === "number" ? data.depth : 1; // [0,1], 1=front, 0=back
  // Node size and glow by weight — larger on mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const baseSize = isCentral ? 90 : weight === "strong" ? (isMobile ? 48 : 56) : weight === "medium" ? (isMobile ? 40 : 46) : (isMobile ? 32 : 36);
  // Scale: 0.85 (back) to 1.15 (front)
  const scale3d = 0.85 + 0.3 * depth;
  // Opacity: 0.45 (back) to 1 (front)
  const opacity3d = 0.45 + 0.55 * depth;
  // zIndex: 1 (back) to 100 (front), central always 200
  const zIndex3d = isCentral ? 200 : Math.round(1 + 99 * depth);
  const size = baseSize * scale3d;
  const ringColor = isCentral
    ? "#38bdf8"
    : active
    ? "#0ff"
    : lit
    ? "#a855f7"
    : "#0ff";
  const glowColor = isCentral
    ? "#38bdf8"
    : active
    ? "#0ff"
    : lit
    ? "#a855f7"
    : "#0ff";
  const bgColor = active
    ? isCentral
      ? "#38bdf833"
      : "#0ff3"
    : lit
    ? "#a855f720"
    : "transparent";

  // Mobile tap-to-focus handler

  function handleTouchStart(e: React.TouchEvent) {
    setHovered(true);
  }
  function handleTouchEnd(e: React.TouchEvent) {
    setHovered(false);
  }

  function handleMouseEnter() {
    setHovered(true);
  }
  function handleMouseLeave() {
    setHovered(false);
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        opacity: opacity3d,
        zIndex: zIndex3d,
        transition: "opacity 0.3s, z-index 0.3s",
        minWidth: 44, // ensure touch target size
        minHeight: 44,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />

      {/* Tooltip */}
      {hovered && !active && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#0f172a",
          color: "#a5f3fc",
          border: `1px solid ${ringColor}44`,
          borderRadius: 8,
          padding: "4px 12px",
          fontSize: 11,
          whiteSpace: "nowrap",
          boxShadow: `0 2px 16px ${glowColor}44`,
          pointerEvents: "none",
          zIndex: 100,
        }}>
          {data.description || data.label}
        </div>
      )}

      {/* Node circle */}
      <motion.div
        animate={{
          boxShadow: highlight
            ? `0 0 0 3px ${ringColor}, 0 0 48px 16px ${glowColor}cc`
            : `0 0 0 1.5px ${ringColor}88, 0 0 16px 4px ${glowColor}22`,
          scale: (active ? 1.18 : lit ? 1.1 : hovered ? 1.08 : 1) * scale3d,
          backgroundColor: bgColor,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `2px solid ${ringColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Continuous slow pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: active ? 0.5 : 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: "50%",
            border: `2px solid ${ringColor}`,
            pointerEvents: "none",
          }}
        />
        {/* Active burst ring */}
        {active && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: `2.5px solid ${ringColor}`,
              pointerEvents: "none",
            }}
          />
        )}
        {/* Central node: name inside circle */}
        {isCentral && (
          <motion.div
            animate={{ color: highlight ? "#fff" : "#e2e8f0", textShadow: highlight ? `0 0 16px ${glowColor}` : "none" }}
            transition={{ duration: 0.2 }}
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              lineHeight: 1.2,
              pointerEvents: "none",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: ringColor, letterSpacing: "0.04em" }}>JAG</div>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#94a3b8" }}>PATEL</div>
          </motion.div>
        )}
      </motion.div>

      {/* Orbit node label below circle — hidden for central (name is inside) */}
      {!isCentral && (
      <motion.div
        animate={{ color: highlight ? ringColor : "#94a3b8", textShadow: highlight ? `0 0 10px ${glowColor}` : "none" }}
        transition={{ duration: 0.2 }}
        style={{ marginTop: 5, fontSize: isMobile ? 9 : 10, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: "0.03em" }}
      >
        {data.label}
      </motion.div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  );
}
