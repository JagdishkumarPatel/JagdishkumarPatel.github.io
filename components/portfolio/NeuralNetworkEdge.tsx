"use client";

import React from "react";
import { getBezierPath, EdgeProps, Position } from "react-flow-renderer";

export default function NeuralNetworkEdge({
  id, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition: sourcePosition ?? Position.Bottom,
    targetX,
    targetY,
    targetPosition: targetPosition ?? Position.Top,
  });
  const markerId = `arrow-${id}`;
  return (
    <g style={{ pointerEvents: "all" }}>
      <defs>
        <marker
          id={markerId}
          markerWidth="12"
          markerHeight="12"
          refX="12"
          refY="6"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M2,2 L12,6 L2,10 L6,6 L2,2" fill="#38bdf8" />
        </marker>
      </defs>
      <path
        d={edgePath}
        stroke="#38bdf8"
        strokeWidth={2}
        fill="none"
        opacity={0.8}
        markerEnd={`url(#${markerId})`}
      />
    </g>
  );
}
