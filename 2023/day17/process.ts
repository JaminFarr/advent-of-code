import { splitByLine } from "@utils";
import { Grid, parseGrid } from "../../utils/grid";
import { z } from "zod";

const DIRECTION_UP = 0;
const DIRECTION_RIGHT = 1;
const DIRECTION_DOWN = 2;
const DIRECTION_LEFT = 3;
type Direction =
  | typeof DIRECTION_UP
  | typeof DIRECTION_RIGHT
  | typeof DIRECTION_DOWN
  | typeof DIRECTION_LEFT;

type NextPosition = {
  direction: Direction;
  x: number;
  y: number;
};

function getNextPositions(
  x: number,
  y: number,
  travelDirection: Direction,
  isAtStraightLimit: boolean,
  grid: Grid<unknown>
): Array<NextPosition> {
  const nextPositions: Array<NextPosition> = [
    { direction: DIRECTION_RIGHT, x: x + 1, y },
    { direction: DIRECTION_DOWN, x, y: y + 1 },
    { direction: DIRECTION_UP, x, y: y - 1 },
    { direction: DIRECTION_LEFT, x: x - 1, y },
  ];

  const sourceDirection = ((travelDirection + 2) % 4) as Direction;

  return nextPositions.filter(
    (nextPosition) =>
      nextPosition.direction !== sourceDirection &&
      (isAtStraightLimit ? nextPosition.direction !== travelDirection : true) &&
      0 <= nextPosition.x &&
      nextPosition.x < grid.width &&
      0 <= nextPosition.y &&
      nextPosition.y < grid.height
  );
}

function createMinHeatLossGrid(grid: Grid<number>): Grid<number> {
  const minLossGrid: Grid<number> = {
    ...grid,
    rows: grid.rows.map((row) => row.map(() => Number.MAX_SAFE_INTEGER)),
  };

  const targetX = minLossGrid.width - 1;
  const targetY = minLossGrid.height - 1;
  const targetValue = grid.rows[targetY][targetX];
  minLossGrid.rows[targetY][targetX] = targetValue;

  const checkCellStack = [
    {
      neighbourValue: targetValue,
      checkX: targetX - 1,
      checkY: targetY,
    },
    {
      neighbourValue: targetValue,
      checkX: targetX,
      checkY: targetY - 1,
    },
  ];

  while (checkCellStack.length > 0) {
    const { checkX, checkY, neighbourValue } = checkCellStack.shift()!;

    if (
      checkX < 0 ||
      minLossGrid.width <= checkX ||
      checkY < 0 ||
      minLossGrid.height <= checkY
    )
      continue;

    const currentValue = minLossGrid.rows[checkY][checkX];
    const cellLoss = grid.rows[checkY][checkX];
    const newValue = cellLoss + neighbourValue;

    if (newValue >= currentValue) continue;

    minLossGrid.rows[checkY][checkX] = newValue;

    checkCellStack.push(
      {
        neighbourValue: newValue,
        checkX: checkX + 1,
        checkY,
      },
      {
        neighbourValue: newValue,
        checkX: checkX - 1,
        checkY,
      },
      {
        neighbourValue: newValue,
        checkX,
        checkY: checkY + 1,
      },
      {
        neighbourValue: newValue,
        checkX,
        checkY: checkY - 1,
      }
    );
  }

  return minLossGrid;
}

type CellCache = Record<Direction, [number, number, number]>;

function createCellCache(): CellCache {
  return {
    [DIRECTION_UP]: [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    ],
    [DIRECTION_DOWN]: [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    ],
    [DIRECTION_LEFT]: [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    ],
    [DIRECTION_RIGHT]: [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    ],
  };
}

export function processPart1(input: string): number {
  const cellCacheMap = new Map<`${number},${number}`, CellCache>();
  // const cellDirectionHeadLossMap = new Map<
  //   `${number},${number}:${Direction}@${number}`,
  //   number
  // >();
  const grid = parseGrid(input, { cellSchema: z.coerce.number() });

  const minHeatLossGrid = createMinHeatLossGrid(grid);

  let minHeatLoss = Number.MAX_SAFE_INTEGER;
  let minRoute: Array<{ x: number; y: number }> = [];

  const targetX = grid.width - 1;
  const targetY = grid.height - 1;

  function dfs(
    x: number,
    y: number,
    direction: Direction,
    straightCount: number,
    heatLoss: number,
    route: Array<{ x: number; y: number }>
  ) {
    const cellHeatLoss = grid.rows[y][x];
    heatLoss += cellHeatLoss;

    if (heatLoss >= minHeatLoss) {
      return;
    }

    const _route = [...route, { x, y }];

    if (x === targetX && y === targetY && heatLoss < minHeatLoss) {
      console.log(`Hit! ${heatLoss}`);
      minHeatLoss = heatLoss;
      minRoute = _route;
      return;
    }

    if (minHeatLossGrid.rows[y][x] > minHeatLoss) {
      return;
    }

    const nextPositions = getNextPositions(
      x,
      y,
      direction,
      straightCount === 2,
      grid
    );

    // const cellWeight = (x: number, y: number) => {
    //   const manhattanDistance = targetX - x + targetY - y;
    //   return grid.rows[y][x] + manhattanDistance * cellAverage;
    // };

    nextPositions.sort(
      (a, b) => minHeatLossGrid.rows[a.y][a.x] - minHeatLossGrid.rows[b.y][b.x]
    );

    const cellCacheKey = `${x},${y}` as const;
    const cellCache = cellCacheMap.get(cellCacheKey) ?? createCellCache();
    cellCacheMap.set(cellCacheKey, cellCache);

    for (const nextPosition of nextPositions) {
      const _straightCount =
        nextPosition.direction === direction ? straightCount + 1 : 0;

      const straightCaches = cellCache[nextPosition.direction];

      if (
        straightCaches[0] <= heatLoss ||
        (_straightCount > 0 &&
          straightCaches[1] <= heatLoss &&
          _straightCount > 1 &&
          straightCaches[2] <= heatLoss)
      )
        continue;

      straightCaches[_straightCount] = heatLoss;
      // switch (_straightCount) {
      //   case 2:
      //     straightCaches[2] = Math.min(straightCaches[2], heatLoss);
      //   case 1:
      //     straightCaches[1] = Math.min(straightCaches[1], heatLoss);
      //   case 0:
      //     straightCaches[0] = Math.min(straightCaches[0], heatLoss);
      // }

      dfs(
        nextPosition.x,
        nextPosition.y,
        nextPosition.direction,
        _straightCount,
        heatLoss,
        _route
      );
    }
  }

  dfs(1, 0, DIRECTION_RIGHT, 0, 0, []);
  dfs(0, 1, DIRECTION_DOWN, 0, 0, []);

  let _heatLoss = 0;
  console.log(
    minRoute
      .map((loc) => {
        const cell = grid.rows[loc.y][loc.x];
        _heatLoss += cell;
        return `${loc.x},${loc.y} ${cell} ${_heatLoss}`;
      })
      .join("\n")
  );

  return minHeatLoss;
}

export function processPart2(input: string): string {
  let total = 0;

  for (const line of splitByLine(input)) {
  }

  return String(total);
}
