import { splitByLine } from "@utils";
import { number, z } from "zod";
import { Grid, parseGrid } from "../../utils/grid";

type Cell = z.infer<typeof cellSchema>;
const cellSchema = z.enum([".", "|", "-", "\\", "/"]);

type Direction = z.infer<typeof directionSchema>;
const directionSchema = z.enum(["^", "v", ">", "<"]);

function nextPosition(
  x: number,
  y: number,
  direction: Direction
): [number, number] {
  switch (direction) {
    case "^":
      return [x, y - 1];
    case "v":
      return [x, y + 1];
    case ">":
      return [x + 1, y];
    case "<":
      return [x - 1, y];
  }
}

const refectionMaps: Record<"\\" | "/", Record<Direction, Direction>> = {
  "/": {
    "<": "v",
    ">": "^",
    "^": ">",
    v: "<",
  },
  "\\": {
    "<": "^",
    ">": "v",
    "^": "<",
    v: ">",
  },
};

function traceBeamPath(
  grid: Grid<Cell>,
  x: number,
  y: number,
  direction: Direction
) {
  const energisedCells = new Set<`${number},${number}`>();
  const beamPathCells = new Set<`${number},${number}:${Direction}`>();

  function tracePathRecursive(x: number, y: number, direction: Direction) {
    if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) return;

    const beamPathCell = `${x},${y}:${direction}` as const;
    if (beamPathCells.has(beamPathCell)) return;

    beamPathCells.add(beamPathCell);
    energisedCells.add(`${x},${y}`);

    function continueBeam(_direction: Direction = direction) {
      const [_x, _y] = nextPosition(x, y, _direction);
      tracePathRecursive(_x, _y, _direction);
    }

    const isHorizontal = direction === ">" || direction === "<";

    const cell = grid.rows[y][x];
    switch (cell) {
      case ".":
        continueBeam();
        break;

      case "|":
        if (isHorizontal) {
          continueBeam("^");
          continueBeam("v");
        } else {
          continueBeam();
        }
        break;

      case "-":
        if (isHorizontal) {
          continueBeam();
        } else {
          continueBeam("<");
          continueBeam(">");
        }
        break;

      case "\\":
      case "/":
        continueBeam(refectionMaps[cell][direction]);
        break;
    }
  }

  tracePathRecursive(x, y, direction);

  return {
    energisedCells,
    beamPathCells,
  };
}

export function processPart1(input: string): number {
  const grid = parseGrid(input, { cellSchema });

  const { energisedCells } = traceBeamPath(grid, 0, 0, ">");

  return energisedCells.size;
}

export function processPart2(input: string): number {
  const grid = parseGrid(input, { cellSchema });

  let max = 0;

  for (let x = 0; x < grid.width; x++) {
    max = Math.max(
      max,
      traceBeamPath(grid, x, 0, "v").energisedCells.size,
      traceBeamPath(grid, x, grid.height - 1, "^").energisedCells.size
    );
  }

  for (let y = 0; y < grid.height; y++) {
    max = Math.max(
      max,
      traceBeamPath(grid, 0, y, ">").energisedCells.size,
      traceBeamPath(grid, grid.width - 1, y, "<").energisedCells.size
    );
  }

  return max;
}
