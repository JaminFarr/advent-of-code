import { splitByLine } from "@utils";
import memoize from "fast-memoize";
import invariant from "tiny-invariant";
import { z } from "zod";

type Cell = z.infer<typeof cellSchema>;
const cellSchema = z.enum([".", "#", "O"]);

type Grid = z.infer<typeof gridSchema>;
const gridSchema = z.object({
  height: z.number(),
  width: z.number(),
  cells: z.array(z.array(cellSchema)),
});

function parseGrid(input: string) {
  const cells = splitByLine(input).map((row) => row.split(""));

  return gridSchema.parse({
    height: cells.length,
    width: cells[0].length,
    cells,
  });
}

export function processPart1(input: string): string {
  const { cells, width, height } = parseGrid(input);

  let total = 0;

  for (let x = 0; x < width; x++) {
    let rockLoad = height;
    for (let y = 0; y < height; y++) {
      const cell = cells[y][x];
      switch (cell) {
        case "O":
          total += rockLoad;
          rockLoad--;
          break;
        case "#":
          rockLoad = height - (y + 1);
          break;
        case ".":
          break;
      }
    }
  }

  return String(total);
}

function gridSnapshot(grid: Grid) {
  return grid.cells.map((row) => row.join("")).join("\n");
}

function tiltCycle(width: number, height: number, cells: Cell[][]) {
  // tilt north
  for (let x = 0; x < width; x++) {
    let rockY = 0;
    for (let y = 0; y < height; y++) {
      switch (cells[y][x]) {
        case "O":
          cells[y][x] = ".";
          cells[rockY][x] = "O";
          rockY++;
          break;
        case "#":
          rockY = y + 1;
          break;
        case ".":
          break;
      }
    }
  }

  // tilt west
  for (let y = 0; y < height; y++) {
    let rockX = 0;
    for (let x = 0; x < width; x++) {
      switch (cells[y][x]) {
        case "O":
          cells[y][x] = ".";
          cells[y][rockX] = "O";
          rockX++;
          break;
        case "#":
          rockX = x + 1;
          break;
        case ".":
          break;
      }
    }
  }

  // tilt south
  for (let x = 0; x < width; x++) {
    let rockY = height - 1;
    for (let y = height - 1; y >= 0; y--) {
      switch (cells[y][x]) {
        case "O":
          cells[y][x] = ".";
          cells[rockY][x] = "O";
          rockY--;
          break;
        case "#":
          rockY = y - 1;
          break;
        case ".":
          break;
      }
    }
  }

  // tilt east
  for (let y = 0; y < height; y++) {
    let rockX = width - 1;
    for (let x = width - 1; x >= 0; x--) {
      switch (cells[y][x]) {
        case "O":
          cells[y][x] = ".";
          cells[y][rockX] = "O";
          rockX--;
          break;
        case "#":
          rockX = x - 1;
          break;
        case ".":
          break;
      }
    }
  }
}

function cloneGrid(grid: Grid): Grid {
  return {
    ...grid,
    cells: grid.cells.map((row) => row.map((cell) => cell)),
  };
}

function processCycleLoop(initGrid: Grid): {
  loopStartGrid: Grid;
  loopStart: number;
  loopSize: number;
} {
  const grid = cloneGrid(initGrid);
  const { cells, width, height } = grid;

  const snapshotToIndexMap = new Map<string, number>();
  let i = 0;
  while (true) {
    let snapshot = gridSnapshot(grid);
    if (snapshotToIndexMap.has(snapshot)) {
      const loopStart = snapshotToIndexMap.get(snapshot);
      invariant(loopStart);

      return {
        loopStartGrid: grid,
        loopStart: loopStart,
        loopSize: i - loopStart,
      };
    }
    snapshotToIndexMap.set(snapshot, i);
    tiltCycle(width, height, cells);
    i++;
  }
}

function gridTotalLoad({ cells, height, width }: Grid) {
  let total = 0;

  for (let y = 0; y < height; y++) {
    const rockLoad = height - y;

    for (let x = 0; x < width; x++) {
      if (cells[y][x] === "O") {
        total += rockLoad;
      }
    }
  }

  return total;
}

const TARGET_CYCLE_COUNT = 1_000_000_000;

export function processPart2(input: string): string {
  const grid = parseGrid(input);

  const loop = processCycleLoop(grid);

  let cyclesLeft = (TARGET_CYCLE_COUNT - loop.loopStart) % loop.loopSize;
  const { width, height, cells } = loop.loopStartGrid;
  while (cyclesLeft--) {
    tiltCycle(width, height, cells);
  }

  return String(gridTotalLoad({ width, height, cells }));
}
