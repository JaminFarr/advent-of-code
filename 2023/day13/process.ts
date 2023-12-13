import { splitByEmptyLines, splitByLine } from "@utils";

function getRowsAboveReflection(rows: string[]) {
  // Find possible reflection point
  for (let i = 0; i < rows.length - 1; i++) {
    // Check possible reflection
    let upperRefectionIndex = i;
    let lowerRefectionIndex = i + 1;
    let isRefection = true;
    while (upperRefectionIndex >= 0 && lowerRefectionIndex < rows.length) {
      if (rows[upperRefectionIndex] !== rows[lowerRefectionIndex]) {
        isRefection = false;
        break;
      }
      upperRefectionIndex--;
      lowerRefectionIndex++;
    }

    if (isRefection) {
      return i + 1;
    }
  }

  return null;
}

function transposePattern(pattern: string[]): string[] {
  const newPattern: string[] = [];

  for (let x = 0; x < pattern[0].length; x++) {
    let row = "";
    for (let y = 0; y < pattern.length; y++) {
      row += pattern[y][x];
    }
    newPattern.push(row);
  }

  return newPattern;
}

function parseInput(input: string) {
  const patterns = splitByEmptyLines(input);

  return patterns.map((pattern) => splitByLine(pattern));
}

export function processPart1(input: string): string {
  let total = 0;

  for (const pattern of parseInput(input)) {
    const rowsAboveReflection = getRowsAboveReflection(pattern);

    if (rowsAboveReflection !== null) {
      total += rowsAboveReflection * 100;
    } else {
      total += getRowsAboveReflection(transposePattern(pattern)) ?? 0;
    }
  }

  return String(total);
}

function toBinaryRow(row: string) {
  let binaryRow = 0;
  let bit = 1;
  for (let index = row.length - 1; index >= 0; index--) {
    if (row[index] === "#") {
      binaryRow += bit;
    }
    bit <<= 1;
  }

  return binaryRow;
}

function countSetBits(binaryRow: number) {
  let bitsCount = 0;

  while (binaryRow) {
    bitsCount += binaryRow & 1;
    binaryRow >>= 1;
  }

  return bitsCount;
}

function getRowsAboveSmudgeReflection(rows: string[]) {
  const binaryRows = rows.map((row) => toBinaryRow(row));

  // Find possible reflection point
  for (let i = 0; i < binaryRows.length - 1; i++) {
    // Check possible reflection
    let upperRefectionIndex = i;
    let lowerRefectionIndex = i + 1;
    let smudgeCount = 0;

    while (
      upperRefectionIndex >= 0 &&
      lowerRefectionIndex < binaryRows.length
    ) {
      smudgeCount += countSetBits(
        binaryRows[upperRefectionIndex] ^ binaryRows[lowerRefectionIndex]
      );

      upperRefectionIndex--;
      lowerRefectionIndex++;
    }

    if (smudgeCount === 1) {
      return i + 1;
    }
  }

  return null;
}

export function processPart2(input: string): string {
  let total = 0;

  for (const pattern of parseInput(input)) {
    const rowsAboveReflection = getRowsAboveSmudgeReflection(pattern);

    if (rowsAboveReflection !== null) {
      total += rowsAboveReflection * 100;
    } else {
      total += getRowsAboveSmudgeReflection(transposePattern(pattern)) ?? 0;
    }
  }

  return String(total);
}
