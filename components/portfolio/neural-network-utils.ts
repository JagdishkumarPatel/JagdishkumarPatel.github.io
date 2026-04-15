// Utility functions for neural network visualization

export function getEdgeAnimationSpeed(isActive: boolean): number {
  return isActive ? 0.5 : 1.5;
}

export function getNodeGlowColor(isActive: boolean): string {
  return isActive ? "#0ff" : "#222";
}
