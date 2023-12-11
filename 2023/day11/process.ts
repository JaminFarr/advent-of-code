import { splitByLine } from "@utils";

type Galaxy = {
  x: number;
  y: number;
};

function parseSpaceGrid(input: string) {
  const spaceGrid = splitByLine(input);
  const width = spaceGrid[0].length;
  const height = spaceGrid.length;
  const emptyRows = Array.from({ length: height }, () => true);
  const emptyColumns = Array.from({ length: width }, () => true);
  const galaxies: Array<Galaxy> = [];

  for (let y = 0; y < spaceGrid.length; y++) {
    const row = spaceGrid[y];
    for (let x = 0; x < row.length; x++) {
      const cell = row[x];
      if (cell === "#") {
        galaxies.push({ x, y });
        emptyColumns[x] = false;
        emptyRows[y] = false;
      }
    }
  }

  return {
    grid: spaceGrid,
    width,
    height,
    galaxies,
    emptyColumns,
    emptyRows,
  };
}

function getExpandedMap(isEmptyList: boolean[], expansionSize = 2): number[] {
  let expansion = 0;
  const resultMap: number[] = [];
  for (let i = 0; i < isEmptyList.length; i++) {
    const isEmpty = isEmptyList[i];
    if (isEmpty) {
      expansion += expansionSize - 1;
    }
    resultMap.push(i + expansion);
  }

  return resultMap;
}

export function processPart1(input: string): string {
  const { galaxies, emptyColumns, emptyRows } = parseSpaceGrid(input);

  const horizontalExpansionMap = getExpandedMap(emptyColumns);
  const verticalExpansionMap = getExpandedMap(emptyRows);

  let totalDistance = 0;

  for (let i = 0; i < galaxies.length - 1; i++) {
    const galaxyA = galaxies[i];
    for (let i2 = i + 1; i2 < galaxies.length; i2++) {
      const galaxyB = galaxies[i2];

      const baseDistance =
        Math.abs(
          horizontalExpansionMap[galaxyB.x] - horizontalExpansionMap[galaxyA.x]
        ) +
        Math.abs(
          verticalExpansionMap[galaxyB.y] - verticalExpansionMap[galaxyA.y]
        );

      totalDistance += baseDistance;
    }
  }

  return String(totalDistance);
}

export function processPart2(input: string, expansionSize = 1000000): string {
  const { galaxies, emptyColumns, emptyRows } = parseSpaceGrid(input);

  const horizontalExpansionMap = getExpandedMap(emptyColumns, expansionSize);
  const verticalExpansionMap = getExpandedMap(emptyRows, expansionSize);

  let totalDistance = 0;

  for (let i = 0; i < galaxies.length - 1; i++) {
    const galaxyA = galaxies[i];
    for (let i2 = i + 1; i2 < galaxies.length; i2++) {
      const galaxyB = galaxies[i2];

      const distance =
        Math.abs(
          horizontalExpansionMap[galaxyB.x] - horizontalExpansionMap[galaxyA.x]
        ) +
        Math.abs(
          verticalExpansionMap[galaxyB.y] - verticalExpansionMap[galaxyA.y]
        );

      totalDistance += distance;
    }
  }

  return String(totalDistance);
}
