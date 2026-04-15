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

// Page route for each node
const NODE_ROUTES: Record<string, string> = {
  jag: "/about",
  aiml: "/about",
  mlops: "/about",
  cloud: "/about",
  llm: "/about",
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

// Which nodes each node connects TO
const ADJACENCY: Record<string, string[]> = {
  jag: ["aiml", "mlops", "cloud", "llm"],
  aiml: ["proj", "blog"],
  mlops: ["proj", "certs"],
  cloud: ["proj", "edu"],
  llm: ["blog", "certs"],
  proj: ["devsec", "platform", "obs"],
  blog: ["obs", "contact"],
  certs: ["about", "contact"],
  edu: ["about", "platform"],
  devsec: [], platform: [], obs: [], contact: [], about: [],
};

// Base positions (layered)
const BASE: Record<string, { x: number; y: number }> = {
  jag:      { x: 350, y: 30  },
  aiml:     { x: 50,  y: 180 },
  mlops:    { x: 210, y: 180 },
  cloud:    { x: 370, y: 180 },
  llm:      { x: 530, y: 180 },
  proj:     { x: 50,  y: 340 },
  certs:    { x: 210, y: 340 },
  edu:      { x: 370, y: 340 },
  blog:     { x: 530, y: 340 },
  devsec:   { x: 0,   y: 490 },
  platform: { x: 130, y: 490 },
  obs:      { x: 270, y: 490 },
  contact:  { x: 430, y: 490 },
  about:    { x: 570, y: 490 },
};

// Unique float phase per node so they drift independently
const PHASES: Record<string, number> = {
  jag: 0, aiml: 0.8, mlops: 1.6, cloud: 2.4, llm: 3.2,
  proj: 0.4, certs: 1.2, edu: 2.0, blog: 2.8,
  devsec: 0.6, platform: 1.4, obs: 2.2, contact: 3.0, about: 3.8,
};

function makeNodes(active: string | null, lit: Set<string>): Node[] {
  return Object.keys(BASE).map((id) => ({
    id,
    position: { ...BASE[id] },
    data: {
      label: {
        jag: "Jag Patel", aiml: "AI / ML", mlops: "MLOps", cloud: "Cloud Eng",
        llm: "LLM Eng", proj: "Projects", certs: "Certs", edu: "Education",
        blog: "Blogs", devsec: "DevSecOps", platform: "Platform",
        obs: "Observability", contact: "Contact", about: "About",
      }[id],
      description: {
        jag: "Principal AI/ML Engineer", aiml: "Machine Learning · Agents",
        mlops: "Pipelines · CI/CD · Monitoring", cloud: "Azure · AWS · Platform Engineering",
        llm: "Prompt Design · RAG · Fine-tuning", proj: "Real-world AI & cloud systems",
        certs: "Azure · AWS · Professional certs", edu: "Academic & professional background",
        blog: "Thoughts, tutorials & deep dives", devsec: "Security · Compliance · Zero Trust",
        platform: "Self-hosted infra · Developer portals", obs: "Logging SDK · Dashboards · Alerting",
        contact: "Get in touch", about: "Background & experience",
      }[id],
      active: active === id,
      lit: lit.has(id),
      href: NODE_ROUTES[id],
    },
    type: "neuralNode",
    draggable: true,
  }));
}

const BASE_EDGES = Object.entries(ADJACENCY).flatMap(([src, targets]) =>
  targets.map((tgt) => ({
    id: `e-${src}-${tgt}`,
    source: src,
    target: tgt,
    type: "neuralEdge",
    markerEnd: { type: MarkerType.ArrowClosed },
    data: { firing: false },
  }))
);

const nodeTypes = { neuralNode: NeuralNetworkNode };
const edgeTypes = { neuralEdge: NeuralNetworkEdge };

export function NeuralNetworkHome({ onSkip }: { onSkip?: () => void }) {
  const router = useRouter();
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [litNodes, setLitNodes] = useState<Set<string>>(new Set());
  const [firingEdges, setFiringEdges] = useState<Set<string>>(new Set());
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(performance.now());

  const [nodes, setNodes, onNodesChange] = useNodesState(makeNodes(null, new Set()));
  const [edges, setEdges, onEdgesChange] = useEdgesState(BASE_EDGES);

  // Circular motion animation loop
  useEffect(() => {
    const center = { x: 320, y: 320 }; // Center of the circle
    const baseRadius = 220;
    const nodeIds = Object.keys(BASE);
    const totalNodes = nodeIds.length - 1; // Exclude center node
    const speed = 0.00025;
    const zoomSpeed = 0.00013;

    function tick() {
      const t = (performance.now() - startTimeRef.current);
      // Animate radius for breathing effect
      const radius = baseRadius + 40 * Math.sin(t * zoomSpeed);
      // Animate zoom for React Flow
      const zoom = 0.85 + 0.18 * Math.sin(t * zoomSpeed);

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === "jag") {
            // Keep Jag Patel at the center
            return {
              ...n,
              position: { x: center.x, y: center.y },
              draggable: false,
            };
          }
          // Arrange other nodes in a circle
          const idx = nodeIds.filter((id) => id !== "jag").indexOf(n.id);
          const angle = (2 * Math.PI * idx) / totalNodes + t * speed;
          return {
            ...n,
            position: {
              x: center.x + radius * Math.cos(angle),
              y: center.y + radius * Math.sin(angle),
            },
            draggable: true,
          };
        })
      );

      // Animate zoom in/out
      try {
        const rf = document.querySelector('.react-flow__renderer');
        if (rf) {
          rf.style.transition = 'transform 0.3s cubic-bezier(0.4,0,0.2,1)';
          rf.style.transform = `scale(${zoom})`;
        }
      } catch {}

      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animRef.current);
      // Reset zoom
      const rf = document.querySelector('.react-flow__renderer');
      if (rf) rf.style.transform = '';
    };
  }, []);

  // Sync active/lit into node data
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          active: activeNode === n.id,
          lit: litNodes.has(n.id),
        },
      }))
    );
  }, [activeNode, litNodes]);

  // Sync firing into edge data
  useEffect(() => {
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        data: { firing: firingEdges.has(e.id) },
      }))
    );
  }, [firingEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const id = node.id;
      const targets = ADJACENCY[id] ?? [];
      const edgeIds = new Set(targets.map((t) => `e-${id}-${t}`));

      // Fire: activate node + firing edges
      setActiveNode(id);
      setFiringEdges(edgeIds);

      // 350ms later: light up target nodes
      setTimeout(() => {
        setLitNodes(new Set(targets));
      }, 350);

      // 800ms later: navigate
      setTimeout(() => {
        setActiveNode(null);
        setLitNodes(new Set());
        setFiringEdges(new Set());
        const route = NODE_ROUTES[id];
        if (route) router.push(route);
      }, 800);
    },
    [router]
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "neuralEdge", markerEnd: { type: MarkerType.ArrowClosed }, data: { firing: false } }, eds)
      ),
    [setEdges]
  );

  return (
    <div style={{ width: "100%", height: "100vh", background: "#020817", position: "relative" }}>
      {onSkip && (
        <button
          onClick={onSkip}
          style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}
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
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        nodesDraggable
        panOnDrag
        zoomOnScroll
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e293b" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}