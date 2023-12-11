import { splitByLine } from "@utils";
import invariant from "tiny-invariant";

type Cell = {
  U: boolean;
  R: boolean;
  D: boolean;
  L: boolean;
};

const cellCharMap: Record<string, Cell> = {
  "-": { U: false, R: true, D: false, L: true },
  "|": { U: true, R: false, D: true, L: false },
  L: { U: true, R: true, D: false, L: false },
  F: { U: false, R: true, D: true, L: false },
  J: { U: true, R: false, D: false, L: true },
  "7": { U: false, R: false, D: true, L: true },
  ".": { U: false, R: false, D: false, L: false },
};

const fallbackCell = cellCharMap["."];

function getCell<T>(pos: [number, number], grid: T[][], fallback: T): T {
  const [x, y] = pos;
  if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) {
    return fallback;
  }

  return grid[y]?.[x] ?? fallback;
}

type PipeGrid = {
  start: [number, number];
  grid: Cell[][];
};

function parsePipeGridInput(input: string): PipeGrid {
  const cells: (Cell | "unknown")[][] = [];
  let start: [number, number];

  const inputRows = splitByLine(input);
  for (let y = 0; y < inputRows.length; y++) {
    const inputRow = inputRows[y];
    const row: (Cell | "unknown")[] = [];
    for (let x = 0; x < inputRow.length; x++) {
      const inputCell = inputRow[x];
      if (inputCell === "S") {
        start = [x, y];
        row.push("unknown");
        continue;
      }

      row.push({ ...cellCharMap[inputCell] });
    }
    cells.push(row);
  }

  function getUnknownCell(pos: [number, number]): Cell {
    const [x, y] = pos;
    const upCell = getCell([x, y - 1], cells, fallbackCell);
    invariant(upCell !== "unknown");
    const downCell = getCell([x, y + 1], cells, fallbackCell);
    invariant(downCell !== "unknown");
    const rightCell = getCell([x + 1, y], cells, fallbackCell);
    invariant(rightCell !== "unknown");
    const leftCell = getCell([x - 1, y], cells, fallbackCell);
    invariant(leftCell !== "unknown");

    return {
      U: upCell.D,
      R: rightCell.L,
      D: downCell.U,
      L: leftCell.R,
    };
  }

  const grid = cells.map((row, y) =>
    row.map((cell, x) => {
      return cell === "unknown" ? getUnknownCell([x, y]) : cell;
    })
  );

  // @ts-ignore
  invariant(start, "Start not found");

  return {
    start,
    grid,
  };
}

type RouteStep = {
  pos: [number, number];
  cameFrom: keyof Cell;
};

const OPPOSITE_DIRECTION_MAP: Record<keyof Cell, keyof Cell> = {
  D: "U",
  U: "D",
  L: "R",
  R: "L",
};

const DIRECTIONS: Array<keyof Cell> = ["D", "L", "R", "U"];

function getExits(cell: Cell) {
  return DIRECTIONS.filter((direction) => cell[direction]);
}

function nextRouteStep(
  currentPos: [number, number],
  direction: keyof Cell
): RouteStep {
  const [x, y] = currentPos;
  const cameFrom = OPPOSITE_DIRECTION_MAP[direction];
  switch (direction) {
    case "U":
      return {
        pos: [x, y - 1],
        cameFrom,
      };
    case "R":
      return {
        pos: [x + 1, y],
        cameFrom,
      };
    case "D":
      return {
        pos: [x, y + 1],
        cameFrom,
      };
    case "L":
      return {
        pos: [x - 1, y],
        cameFrom,
      };
  }
}

function getRouteStepExit(routeStep: RouteStep, grid: Cell[][]) {
  const [exit1, exit2] = getExits(getCell(routeStep.pos, grid, fallbackCell));

  return exit1 === routeStep.cameFrom ? exit2 : exit1;
}

export function processPart1(input: string): string {
  const { grid, start } = parsePipeGridInput(input);
  let moves = 0;

  const [exit1, exit2] = getExits(getCell(start, grid, fallbackCell));
  let route1 = nextRouteStep(start, exit1);
  let route2 = nextRouteStep(start, exit2);
  moves++;

  while (
    !(route1.pos[0] === route2.pos[0] && route1.pos[1] === route2.pos[1])
  ) {
    moves++;
    route1 = nextRouteStep(route1.pos, getRouteStepExit(route1, grid));
    route2 = nextRouteStep(route2.pos, getRouteStepExit(route2, grid));
  }

  return String(moves);
}

export function processPart2(input: string): string {
  const { grid, start } = parsePipeGridInput(input);
  let nestCells = 0;

  const startCell = getCell(start, grid, fallbackCell);
  const loopCells = [startCell];
  const [exit] = getExits(startCell);
  let routeStep = nextRouteStep(start, exit);
  let routeStepCell = getCell(routeStep.pos, grid, fallbackCell);

  while (!loopCells.includes(routeStepCell)) {
    loopCells.push(routeStepCell);
    routeStep = nextRouteStep(routeStep.pos, getRouteStepExit(routeStep, grid));
    routeStepCell = getCell(routeStep.pos, grid, fallbackCell);
  }

  // Remove none loop pipe symbols
  const cleanGrid = grid.map((row) =>
    row.map((cell) => (loopCells.includes(cell) ? cell : { ...fallbackCell }))
  );

  for (let y = 0; y < cleanGrid.length; y++) {
    const row = cleanGrid[y];
    for (let x = 0; x < row.length; x++) {
      const cell = row[x];
      // Check if its a loop cell
      if (loopCells.includes(cell)) continue;

      if (getIsWithinLoop([x, y], cleanGrid)) {
        nestCells++;
      }
    }
  }

  return String(nestCells);
}

/**
 * Trace from cell to the right all the way to the edge of the grid If the row
 * crosses pipes as odd amounts of times the cell is within the pipe loop
 *
 * To allow for pipes going along the row check up exits and down exits
 * independency. When there has been both up and down exits it counts as a loop crossing.
 *
 */
function getIsWithinLoop([x, y]: [number, number], grid: Cell[][]): boolean {
  const traceRow = grid[y];
  const traceOffset = x > traceRow.length / 2 ? 1 : -1;

  let isWithinLoop = false;
  let pipeHasExitedUp = false;
  let pipeHasExitedDown = false;
  let traceX = x + traceOffset;

  while (traceRow[traceX] !== undefined) {
    const cell = traceRow[traceX];
    if (cell.U) {
      pipeHasExitedUp = !pipeHasExitedUp;
    }
    if (cell.D) {
      pipeHasExitedDown = !pipeHasExitedDown;
    }
    if (pipeHasExitedUp && pipeHasExitedDown) {
      isWithinLoop = !isWithinLoop;
      pipeHasExitedUp = false;
      pipeHasExitedDown = false;
    }
    traceX += traceOffset;
  }

  return isWithinLoop;
}
