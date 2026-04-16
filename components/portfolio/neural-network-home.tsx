"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import "react-flow-renderer/dist/style.css";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Connection,
  Node,
} from "react-flow-renderer";
import { useRouter } from "next/navigation";
import NeuralNetworkNode from "./NeuralNetworkNode";
import NeuralNetworkEdge from "./NeuralNetworkEdge";
import { nodes as NODE_CONFIG, edges as EDGE_CONFIG } from "./network-config";
import { getConnectionLevels, searchNodes, getNodeWeight, buildAdjacency } from "./network-logic";
import ContextPanel from "./ContextPanel";


// Utility: random position for initial scatter
function randomPos(spread = 150) {
  return {
    x: (Math.random() - 0.5) * spread,
    y: (Math.random() - 0.5) * spread,
  };
}

// Build initial scattered nodes
function makeInitialNodes() {
  return NODE_CONFIG.map((n) => ({
    id: n.id,
    position: n.id === "jag" ? { x: -45, y: -45 } : randomPos(),
    data: {
      ...n,
      active: false,
      lit: false,
    },
    type: "neuralNode",
    draggable: true,
  }));
}

// Build edges for React Flow
function makeEdges(firingEdges: Set<string> = new Set()) {
  return EDGE_CONFIG.map((e) => ({
    id: `e-${e.source}-${e.target}`,
    source: e.source,
    target: e.target,
    animated: false,
    style: { stroke: "#38bdf8", strokeWidth: 1, opacity: 0.18 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#38bdf8" },
    data: { firing: false },
  }));
}

const nodeTypes = { neuralNode: NeuralNetworkNode };

// Node id → route mapping (outside component to keep stable reference)
const NODE_ROUTES: Record<string, string> = {
  jag: "/about",
  aiml: "/projects",
  mlops: "/projects",
  cloud: "/projects",
  llm: "/projects",
  proj: "/projects",
  certs: "/certifications",
  edu: "/education",
  blog: "/blog",
  devsec: "/projects",
  platform: "/projects",
  obs: "/projects",
  contact: "/contact",
  about: "/about",
};

export function NeuralNetworkHome({ onSkip }: { onSkip?: () => void }) {
  const router = useRouter();
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [litNodes, setLitNodes] = useState<Set<string>>(new Set());
  const [firingEdges, setFiringEdges] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [contextNode, setContextNode] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(performance.now());
  const pausedRef = useRef<boolean>(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Initial scatter, then animate to circle
  const [nodes, setNodes, onNodesChange] = useNodesState(makeInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(makeEdges());

  // Circular motion animation loop — fixed coord system, fitView handles scaling
  // Animation loop with pause/resume
  useEffect(() => {
    const nodeIds = NODE_CONFIG.map((n) => n.id);
    const totalNodes = nodeIds.filter((id) => id !== "jag").length;
    const speed = 0.00025;
    const breatheSpeed = 0.00013;
    // Fixed radius in ReactFlow coords — fitView scales to fill screen
    const BASE_RADIUS = 260;

    // 3D depth mapping helpers
    function getDepth(angleRad: number) {
      // 0 = top (farthest), pi = bottom (closest)
      // Map to [0,1]: 0 (back) to 1 (front)
      // Use cosine so bottom (pi) is 1, top (0/2pi) is 0
      return 0.5 * (1 + Math.cos(angleRad - Math.PI));
    }

    function tick() {
      if (pausedRef.current) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }
      const t = performance.now() - startTimeRef.current;
      const radius = BASE_RADIUS + BASE_RADIUS * 0.08 * Math.sin(t * breatheSpeed);

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === "jag") {
            return { ...n, position: { x: -45, y: -45 }, draggable: false, data: { ...n.data, depth: 1 } };
          }
          const idx = nodeIds.filter((id) => id !== "jag").indexOf(n.id);
          const angle = (2 * Math.PI * idx) / totalNodes + t * speed;
          const depth = getDepth(angle);
          return {
            ...n,
            position: {
              x: radius * Math.cos(angle),
              y: radius * Math.sin(angle),
            },
            draggable: true,
            data: {
              ...n.data,
              depth,
            },
          };
        })
      );

      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(animRef.current); };
  }, []);

  // Pause/resume animation based on hoveredNode
  useEffect(() => {
    pausedRef.current = hoveredNode !== null;
  }, [hoveredNode]);

  // Sync active/lit/hover highlight into node data
  useEffect(() => {
    let highlightLevels: Record<string, number> = {};
    if (hoveredNode) {
      highlightLevels = getConnectionLevels(hoveredNode, 3); // BFS: 0=self, 1=direct, 2=secondary
    }
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          active: activeNode === n.id,
          lit: litNodes.has(n.id),
          highlightLevel: highlightLevels[n.id] ?? null,
        },
      }))
    );
  }, [activeNode, litNodes, hoveredNode, setNodes]);

  // Sync firing and highlight into edge data
  useEffect(() => {
    let highlightLevels: Record<string, number> = {};
    if (hoveredNode) {
      highlightLevels = getConnectionLevels(hoveredNode, 3);
    }
    setEdges((eds) =>
      eds.map((e) => {
        // An edge is "direct" if both ends are within 1 hop of hoveredNode
        // i.e. one end IS hoveredNode (level 0) and the other is level 1
        const srcLevel = highlightLevels[e.source] ?? null;
        const tgtLevel = highlightLevels[e.target] ?? null;
        const isDirect =
          hoveredNode != null &&
          ((e.source === hoveredNode && tgtLevel === 1) ||
            (e.target === hoveredNode && srcLevel === 1));
        const isSecondary =
          hoveredNode != null && !isDirect &&
          srcLevel != null && tgtLevel != null &&
          Math.max(srcLevel, tgtLevel) <= 2;
        const isActive = firingEdges.has(e.id);
        const anyHover = hoveredNode != null;

        let stroke: string;
        let strokeWidth: number;
        let opacity: number;
        let animated: boolean;

        if (isActive) {
          stroke = "#00ffff";
          strokeWidth = 2.5;
          opacity = 1;
          animated = true;
        } else if (isDirect) {
          stroke = "#00ffff";
          strokeWidth = 2;
          opacity = 1;
          animated = true;
        } else if (isSecondary) {
          stroke = "#a855f7";
          strokeWidth = 1.5;
          opacity = 0.6;
          animated = false;
        } else if (anyHover) {
          // non-connected edges fade to near-invisible when something is hovered
          stroke = "#1e4060";
          strokeWidth = 1;
          opacity = 0.12;
          animated = false;
        } else {
          // default: very faint but visible
          stroke = "#38bdf8";
          strokeWidth = 1;
          opacity = 0.18;
          animated = false;
        }

        return {
          ...e,
          animated,
          style: { stroke, strokeWidth, opacity, transition: "stroke 0.25s, opacity 0.25s" },
          markerEnd: { type: MarkerType.ArrowClosed, color: stroke },
          data: { firing: isActive },
        };
      })
    );
  }, [firingEdges, hoveredNode, setEdges]);

  // Build adjacency map once
  const adjacency = buildAdjacency();

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const id = node.id;
      const targets = adjacency[id] ?? [];
      const edgeIds = new Set(targets.map((t) => `e-${id}-${t}`));

      setActiveNode(id);
      setFiringEdges(edgeIds);

      setTimeout(() => {
        setLitNodes(new Set(targets));
      }, 350);

      setTimeout(() => {
        setActiveNode(null);
        setLitNodes(new Set());
        setFiringEdges(new Set());
        const route = NODE_ROUTES[id];
        if (route) router.push(route);
      }, 800);
    },
    [adjacency, router]
  );

  // Node hover: set hoveredNode for highlight propagation
  const handleNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    setHoveredNode(node.id);
  }, []);
  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "neuralEdge", markerEnd: { type: MarkerType.ArrowClosed }, data: { firing: false } }, eds)
      ),
    [setEdges]
  );

      return (
        <div style={{ width: "100%", height: "100svh", background: "#020817", position: "relative" }}>
          {onSkip && (
            <button
              onClick={onSkip}
              style={{ position: "absolute", top: 12, right: 12, zIndex: 50 }}
              className="text-xs text-muted-foreground hover:text-primary border border-border bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md transition-colors"
            >
              Skip to Classic View
            </button>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onNodeMouseEnter={isMobile ? undefined : handleNodeMouseEnter}
            onNodeMouseLeave={isMobile ? undefined : handleNodeMouseLeave}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.18 }}
            nodesDraggable={false}
            panOnDrag={false}
            zoomOnScroll={false}
            panOnScroll={false}
            preventScrolling={false}
            zoomOnDoubleClick={false}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e293b" />
            <Controls showInteractive={false} />
            {/* Hide ReactFlow attribution */}
            <style>{`.react-flow__attribution { display: none !important; }`}</style>
          </ReactFlow>
        </div>
      );
}