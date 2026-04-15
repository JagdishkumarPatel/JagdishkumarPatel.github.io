"use client";

import React, { useState } from "react";
import { Handle, Position, NodeProps } from "react-flow-renderer";
import { motion } from "framer-motion";

export default function NeuralNetworkNode({ data, selected }: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const active: boolean = data.active ?? false;
  const lit: boolean = data.lit ?? false;
  const highlight = active || lit || hovered || selected;

  const ringColor = active ? "#0ff" : lit ? "#a855f7" : "#0ff";
  const glowColor = active ? "#0ff" : lit ? "#a855f7" : "#0ff";
  const bgColor = active ? "#0ff3" : lit ? "#a855f720" : "transparent";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
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
            ? `0 0 0 2px ${ringColor}, 0 0 28px 10px ${glowColor}88`
            : `0 0 0 1.5px ${ringColor}88, 0 0 10px 2px ${glowColor}22`,
          scale: active ? 1.18 : lit ? 1.1 : hovered ? 1.08 : 1,
          backgroundColor: bgColor,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: `1.5px solid ${ringColor}`,
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
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: `1.5px solid ${ringColor}`,
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
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: `2px solid ${ringColor}`,
              pointerEvents: "none",
            }}
          />
        )}
      </motion.div>

      {/* Label */}
      <motion.div
        animate={{ color: highlight ? ringColor : "#94a3b8", textShadow: highlight ? `0 0 10px ${glowColor}` : "none" }}
        transition={{ duration: 0.2 }}
        style={{ marginTop: 6, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}
      >
        {data.label}
      </motion.div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  );
}
