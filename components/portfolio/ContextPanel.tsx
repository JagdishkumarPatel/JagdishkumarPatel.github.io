import React from "react";
import { getNodeData } from "./network-logic";
import { motion, AnimatePresence } from "framer-motion";

export default function ContextPanel({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
  const node = getNodeData(nodeId);
  if (!node) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35 }}
        className="fixed left-1/2 top-24 z-50 w-[340px] -translate-x-1/2 rounded-2xl bg-[#0f172aee] shadow-2xl border border-[#38bdf8] backdrop-blur-lg p-6 text-white"
        style={{ boxShadow: "0 8px 48px #0ff6, 0 1.5px 0 #38bdf8" }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-cyan-300 hover:text-white text-lg"
          aria-label="Close"
        >
          ×
        </button>
        <div className="text-xl font-bold mb-2" style={{ color: "#38bdf8" }}>{node.label}</div>
        <div className="mb-2 text-sm text-cyan-200">{node.skills.join(", ")}</div>
        <div className="mb-3 text-base text-cyan-100">{node.summary}</div>
        {node.projects?.length > 0 && (
          <div className="mt-2">
            <div className="font-semibold text-cyan-300 mb-1">Related Projects:</div>
            <ul className="list-disc ml-5 text-cyan-100 text-sm">
              {node.projects.map((p: string) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
