import { z } from "zod";
import { parseGrid } from "../../utils/grid";
import { createPriorityQueue } from "./priority-queue";
import invariant from "tiny-invariant";

type Orientation = "-" | "|";
const OrientationMaskH = 1;
const OrientationMaskV = 2;

type NodeId = `${number},${number}:${Orientation}`;
type Node = {
  id: NodeId;
  x: number;
  y: number;
  orientation: Orientation;
  distance: number;
};

export function processPart1(input: string): number {
  const grid = parseGrid(input, { cellSchema: z.coerce.number() });

  const seenGrid = {
    ...grid,
    rows: grid.rows.map((row) => row.map((cell) => 0)),
  };

  const targetX = grid.width - 1;
  const targetY = grid.height - 1;

  const visitedNodes = new Set<NodeId>();
  const nodePriorityQueue = createPriorityQueue<Node>();

  nodePriorityQueue.enqueue(
    { id: "0,0:-", x: 0, y: 0, orientation: "-", distance: 0 },
    0
  );
  nodePriorityQueue.enqueue(
    { id: "0,0:|", x: 0, y: 0, orientation: "|", distance: 0 },
    0
  );

  for (const node of nodePriorityQueue) {
    if (node.x === targetX && node.y === targetY) {
      return node.distance;
    }

    if (visitedNodes.has(node.id)) continue;
    visitedNodes.add(node.id);

    switch (node.orientation) {
      case "-":
        {
          // Enqueue nodes to the right
          let distance = node.distance;
          for (let x = node.x + 1; x <= node.x + 3 && x < grid.width; x++) {
            distance += grid.rows[node.y][x];
            const id = `${x},${node.y}:|` as const;
            if (!visitedNodes.has(id)) {
              nodePriorityQueue.enqueue(
                {
                  id,
                  x,
                  y: node.y,
                  orientation: "|",
                  distance,
                },
                distance
              );
            }
          }
          // Enqueue nodes to the left
          distance = node.distance;
          for (let x = node.x - 1; x >= node.x - 3 && 0 <= x; x--) {
            distance += grid.rows[node.y][x];
            const id = `${x},${node.y}:|` as const;
            if (!visitedNodes.has(id)) {
              nodePriorityQueue.enqueue(
                {
                  id,
                  x,
                  y: node.y,
                  orientation: "|",
                  distance,
                },
                distance
              );
            }
          }
        }
        break;
      case "|":
        {
          // Enqueue nodes below
          let distance = node.distance;
          for (let y = node.y + 1; y <= node.y + 3 && y < grid.height; y++) {
            distance += grid.rows[y][node.x];
            const id = `${node.x},${y}:-` as const;
            if (!visitedNodes.has(id)) {
              nodePriorityQueue.enqueue(
                {
                  id,
                  x: node.x,
                  y,
                  orientation: "-",
                  distance,
                },
                distance
              );
            }
          }
          // Enqueue nodes above
          distance = node.distance;
          for (let y = node.y - 1; y >= node.y - 3 && 0 <= y; y--) {
            distance += grid.rows[y][node.x];
            const id = `${node.x},${y}:-` as const;

            if (!visitedNodes.has(id)) {
              nodePriorityQueue.enqueue(
                {
                  id,
                  x: node.x,
                  y,
                  orientation: "-",
                  distance,
                },
                distance
              );
            }
          }
        }
        break;
    }
  }

  invariant(false, "No solution found");
}

export function processPart2(input: string): number {
  const grid = parseGrid(input, { cellSchema: z.coerce.number() });

  const seenGrid = {
    ...grid,
    rows: grid.rows.map((row) => row.map((cell) => 0)),
  };

  const targetX = grid.width - 1;
  const targetY = grid.height - 1;

  const visitedNodes = new Set<NodeId>();
  const nodePriorityQueue = createPriorityQueue<Node>();

  nodePriorityQueue.enqueue(
    { id: "0,0:-", x: 0, y: 0, orientation: "-", distance: 0 },
    0
  );
  nodePriorityQueue.enqueue(
    { id: "0,0:|", x: 0, y: 0, orientation: "|", distance: 0 },
    0
  );

  for (const node of nodePriorityQueue) {
    if (node.x === targetX && node.y === targetY) {
      return node.distance;
    }

    if (visitedNodes.has(node.id)) continue;
    visitedNodes.add(node.id);

    switch (node.orientation) {
      case "-":
        {
          // Enqueue nodes to the right
          let distance = node.distance;
          for (let x = node.x + 1; x <= node.x + 10 && x < grid.width; x++) {
            distance += grid.rows[node.y][x];
            if (x < node.x + 4) continue;
            const id = `${x},${node.y}:|` as const;
            if (!visitedNodes.has(id)) {
              nodePriorityQueue.enqueue(
                {
                  id,
                  x,
                  y: node.y,
                  orientation: "|",
                  distance,
                },
                distance
              );
            }
          }
          // Enqueue nodes to the left
          distance = node.distance;
          for (let x = node.x - 1; x >= node.x - 10 && 0 <= x; x--) {
            distance += grid.rows[node.y][x];

            if (x > node.x - 4) continue;

            const id = `${x},${node.y}:|` as const;
            if (!visitedNodes.has(id)) {
              nodePriorityQueue.enqueue(
                {
                  id,
                  x,
                  y: node.y,
                  orientation: "|",
                  distance,
                },
                distance
              );
            }
          }
        }
        break;
      case "|":
        {
          // Enqueue nodes below
          let distance = node.distance;
          for (let y = node.y + 1; y <= node.y + 10 && y < grid.height; y++) {
            distance += grid.rows[y][node.x];
            if (y < node.y + 4) continue;
            const id = `${node.x},${y}:-` as const;
            if (!visitedNodes.has(id)) {
              nodePriorityQueue.enqueue(
                {
                  id,
                  x: node.x,
                  y,
                  orientation: "-",
                  distance,
                },
                distance
              );
            }
          }
          // Enqueue nodes above
          distance = node.distance;
          for (let y = node.y - 1; y >= node.y - 10 && 0 <= y; y--) {
            distance += grid.rows[y][node.x];
            if (y > node.y - 4) continue;
            const id = `${node.x},${y}:-` as const;

            if (!visitedNodes.has(id)) {
              nodePriorityQueue.enqueue(
                {
                  id,
                  x: node.x,
                  y,
                  orientation: "-",
                  distance,
                },
                distance
              );
            }
          }
        }
        break;
    }
  }

  invariant(false, "No solution found");
}
