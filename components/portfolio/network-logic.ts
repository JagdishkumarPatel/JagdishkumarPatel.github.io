// Graph traversal and utility logic for neural network portfolio
// Includes BFS/DFS, weighting, search, and connection highlighting

import { nodes, edges } from "./network-config";

// Build adjacency map for quick lookup
export function buildAdjacency() {
  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach(({ source, target }) => {
    adj[source].push(target);
    // For undirected highlighting, also add reverse:
    adj[target].push(source);
  });
  return adj;
}

// BFS to get connection levels from a node
export function getConnectionLevels(startId: string, maxDepth = 3) {
  const adj = buildAdjacency();
  const visited: Record<string, number> = { [startId]: 0 };
  const queue: [string, number][] = [[startId, 0]];
  while (queue.length) {
    const [curr, depth] = queue.shift()!;
    if (depth >= maxDepth) continue;
    for (const neighbor of adj[curr]) {
      if (!(neighbor in visited)) {
        visited[neighbor] = depth + 1;
        queue.push([neighbor, depth + 1]);
      }
    }
  }
  return visited; // { nodeId: level }
}

// Search nodes by keyword (label, skills, summary)
export function searchNodes(keyword: string) {
  const lower = keyword.toLowerCase();
  return nodes.filter(
    (n) =>
      n.label.toLowerCase().includes(lower) ||
      n.skills.some((s: string) => s.toLowerCase().includes(lower)) ||
      n.summary.toLowerCase().includes(lower)
  );
}

// Get node weight (strong/medium/learning)
export function getNodeWeight(id: string) {
  const node = nodes.find((n) => n.id === id);
  return node?.weight || "learning";
}

// Get node data by id
export function getNodeData(id: string) {
  return nodes.find((n) => n.id === id);
}
