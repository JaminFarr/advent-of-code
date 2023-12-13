import { splitByLine } from "../../utils";

type NumberItem = {
  startIndex: number;
  endIndex: number;
  value: number;
};

type ExtractItem = {
  startIndex: number;
  endIndex: number;
  value: string;
};

function extractRegex(str: string, regex: RegExp): Array<ExtractItem> {
  const result: Array<ExtractItem> = [];

  for (const { 0: value, index } of str.matchAll(regex)) {
    if (typeof index === "number") {
      result.push({
        startIndex: index,
        endIndex: index + value.length - 1,
        value,
      });
    }
  }

  return result;
}

function extractNumbers(str: string): Array<NumberItem> {
  return extractRegex(str, /\d+/g).map((item) => ({
    ...item,
    value: parseInt(item.value),
  }));
}

function extractSymbols(str: string): Array<ExtractItem> {
  return extractRegex(str, /[^0-9.]/g);
}

type IndexedItem = {
  startIndex: number;
  endIndex: number;
};

function isAdjacent(itemA: IndexedItem, itemB: IndexedItem) {
  return (
    itemA.startIndex - 1 <= itemB.endIndex &&
    itemA.endIndex + 1 >= itemB.startIndex
  );
}

export function processPart1(input: string): string {
  const lines = splitByLine(input);

  let total = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const lineBefore = lines[lineIndex - 1] ?? "";
    const lineAfter = lines[lineIndex + 1] ?? "";

    const numberItems = extractNumbers(line);
    // By only getting the symbols in the line before and after they only need to checked horizontally to be adjacent
    const symbolItems = [
      ...extractSymbols(lineBefore),
      ...extractSymbols(line),
      ...extractSymbols(lineAfter),
    ];

    for (const numberItem of numberItems) {
      if (
        symbolItems.some((symbolItem) => isAdjacent(symbolItem, numberItem))
      ) {
        total += numberItem.value;
      }
    }
  }

  return String(total);
}

function extractGears(str: string): Array<ExtractItem> {
  return extractRegex(str, /\*/g);
}

export function processPart2(input: string): string {
  const lines = splitByLine(input);
  let total = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const lineBefore = lines[lineIndex - 1] ?? "";
    const lineAfter = lines[lineIndex + 1] ?? "";

    const gears = extractGears(line);
    const numbers = [
      ...extractNumbers(lineBefore),
      ...extractNumbers(line),
      ...extractNumbers(lineAfter),
    ];

    for (const gear of gears) {
      const adjacentNumbers = numbers.filter((number) =>
        isAdjacent(number, gear)
      );

      if (adjacentNumbers.length === 2) {
        total += adjacentNumbers[0].value * adjacentNumbers[1].value;
      }
    }
  }

  return String(total);
}
