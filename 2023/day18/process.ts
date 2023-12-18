import { splitByLine } from "@utils";
import invariant from "tiny-invariant";

type Trench = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  walls: Array<Wall>;
};

const DIRECTION_RIGHT = 0;
const DIRECTION_DOWN = 1;
const DIRECTION_LEFT = 2;
const DIRECTION_UP = 3;

type Direction =
  | typeof DIRECTION_UP
  | typeof DIRECTION_RIGHT
  | typeof DIRECTION_DOWN
  | typeof DIRECTION_LEFT;

type Wall = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  direction: Direction;
  colour: string;
};

const DIRECTION_CHAR_MAP: Record<string, Direction> = {
  U: DIRECTION_UP,
  R: DIRECTION_RIGHT,
  D: DIRECTION_DOWN,
  L: DIRECTION_LEFT,
};

type WallDescription = {
  direction: Direction;
  colour: string;
  length: number;
};

function parseInput(input: string): Array<WallDescription> {
  const lines = splitByLine(input);
  const walls: Array<WallDescription> = [];

  for (const line of lines) {
    const [direction, lengthStr, colour] = line.split(" ");
    const length = parseInt(lengthStr, 10);
    walls.push({
      direction: DIRECTION_CHAR_MAP[direction],
      colour: colour.slice(2, -1),
      length,
    });
  }

  return walls;
}

function createTrench(wallDescriptions: Array<WallDescription>): Trench {
  let x = 0;
  let y = 0;
  let minX = 0;
  let minY = 0;
  let maxX = 0;
  let maxY = 0;
  const walls: Array<Wall> = [];

  for (const { direction, length, colour } of wallDescriptions) {
    let x2 = x;
    let y2 = y;

    switch (direction) {
      case DIRECTION_UP:
        y2 += length;
        break;
      case DIRECTION_RIGHT:
        x2 += length;
        break;
      case DIRECTION_DOWN:
        y2 -= length;
        break;
      case DIRECTION_LEFT:
        x2 -= length;
        break;
      default:
        invariant(false);
    }

    const wall: Wall = {
      x1: x,
      y1: y,
      x2,
      y2,
      direction: direction,
      colour,
    };
    walls.push(wall);

    minX = Math.min(wall.x1, minX);
    minY = Math.min(wall.y1, minY);
    maxX = Math.max(wall.x2, maxX);
    maxY = Math.max(wall.y2, maxY);
    x = x2;
    y = y2;
  }

  invariant(x === 0 && y === 0, "x and y should be 0");

  return {
    minX,
    minY,
    maxX,
    maxY,
    walls,
  };
}

function trenchArea(trench: Trench): number {
  const verticalEdges = trench.walls
    .filter(
      (wall) =>
        wall.direction === DIRECTION_UP || wall.direction === DIRECTION_DOWN
    )
    .map((wall) => ({
      yMin: Math.min(wall.y1, wall.y2),
      yMax: Math.max(wall.y1, wall.y2),
      x: wall.x1,
    }))
    .sort((a, b) => a.x - b.x);

  let area = 0;
  for (let y = trench.minY; y <= trench.maxY; y++) {
    const rowEdges = verticalEdges.filter(
      (edge) => edge.yMin <= y && y <= edge.yMax
    );

    let isUpWithin = false;
    let isDownWithin = false;
    let startX: number | null = null;

    for (const { x, yMax, yMin } of rowEdges) {
      if (yMin < y) {
        isUpWithin = !isUpWithin;
      }
      if (yMax > y) {
        isDownWithin = !isDownWithin;
      }

      if ((isUpWithin || isDownWithin) && startX === null) {
        startX = x;
      }

      if (!isUpWithin && !isDownWithin && startX !== null) {
        area += x - startX + 1;
        startX = null;
      }
    }
  }
  return area;
}

export function processPart1(input: string): number {
  const wallDescriptions = parseInput(input);
  const trench = createTrench(wallDescriptions);

  return trenchArea(trench);
}

function correctWallDescription({ colour }: WallDescription): WallDescription {
  const length = parseInt(colour.slice(0, 5), 16);
  const direction = parseInt(colour.slice(5, 6), 10);

  invariant(
    direction === DIRECTION_DOWN ||
      direction === DIRECTION_RIGHT ||
      direction === DIRECTION_UP ||
      direction === DIRECTION_LEFT
  );

  return {
    colour: colour,
    direction,
    length,
  };
}

export function processPart2(input: string): number {
  const wallDescriptions = parseInput(input).map(correctWallDescription);
  const trench = createTrench(wallDescriptions);

  return trenchArea(trench);
}
