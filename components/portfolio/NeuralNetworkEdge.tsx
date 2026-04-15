"use client";

import React, { useState } from "react";
import { getBezierPath, EdgeProps } from "react-flow-renderer";
import { motion } from "framer-motion";

export default function NeuralNetworkEdge({
  id, sourceX, sourceY, targetX, targetY, selected, data,
}: EdgeProps) {
  const [hovered, setHovered] = useState(false);
  const firing: boolean = data?.firing ?? false;
  const highlight = firing || hovered || selected;

  const edgePath: string = getBezierPath({ sourceX, sourceY, targetX, targetY })[0];
  const strokeColor = firing ? "#0ff" : hovered || selected ? "#7c3aed" : "#1e3a5f";
  const strokeWidth = firing ? 2.5 : hovered || selected ? 2 : 1.2;

  return (
    <g
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{ pointerEvents: "all" }}
    >
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L7,3.5 L0,7 Z" fill={strokeColor} />
        </marker>
      </defs>

      {/* Base edge path */}
      <motion.path
        d={edgePath}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={highlight ? "10 6" : "6 8"}
        animate={{
          strokeDashoffset: [20, 0],
          filter: firing
            ? ["drop-shadow(0 0 4px #0ff)", "drop-shadow(0 0 10px #0ff)", "drop-shadow(0 0 4px #0ff)"]
            : highlight
            ? "drop-shadow(0 0 4px #7c3aed)"
            : "none",
        }}
        transition={{
          strokeDashoffset: { duration: firing ? 0.3 : 1.5, repeat: Infinity, ease: "linear" },
          filter: { duration: 0.4, repeat: firing ? Infinity : 0 },
        }}
        markerEnd={`url(#arrow-${id})`}
      />

      {/* Enhanced firing particles — multiple glowing dots for visible effect */}
      {firing && [0, 0.2, 0.4].map((delay, idx) => (
        <motion.circle
          key={idx}
          r={6 - idx * 1.5}
          fill="#0ff"
          style={{ offsetPath: `path('${edgePath}')`, filter: `drop-shadow(0 0 12px #0ff)` } as React.CSSProperties}
          animate={{ offsetDistance: ["0%", "100%"], opacity: [0.7, 1, 0] }}
          transition={{ duration: 0.7, ease: "easeInOut", repeat: Infinity, delay }}
        />
      ))}
    </g>
  );
}
