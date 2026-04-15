import React, { createContext, useContext, useState } from "react";

interface NeuralNetworkContextType {
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
  activeNode: string | null;
  setActiveNode: (id: string | null) => void;
}

const NeuralNetworkContext = createContext<NeuralNetworkContextType | null>(null);

export function NeuralNetworkProvider({ children }: { children: React.ReactNode }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  return (
    <NeuralNetworkContext.Provider value={{ hoveredNode, setHoveredNode, activeNode, setActiveNode }}>
      {children}
    </NeuralNetworkContext.Provider>
  );
}

export function useNeuralNetwork() {
  return useContext(NeuralNetworkContext);
}
