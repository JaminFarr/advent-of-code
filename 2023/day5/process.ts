import { splitByEmptyLines, splitByLine } from "@utils";

type Mapping = {
  srcType: string;
  destType: string;
  mappingRanges: Array<MappingRange>;
};

type MappingRange = {
  destStart: number;
  destEnd: number;
  srcStart: number;
  srcEnd: number;
  change: number;
};

function parseMap(mapString: string): Mapping {
  const [titleString, ...mappingStrings] = splitByLine(mapString);

  const mappingRanges: Array<MappingRange> = [];

  for (const mappingString of mappingStrings) {
    const [destStart, srcStart, size] = mappingString
      .split(" ")
      .map((num) => parseInt(num, 10));

    mappingRanges.push({
      destStart,
      destEnd: destStart + size - 1,
      srcStart,
      srcEnd: srcStart + size - 1,
      change: destStart - srcStart,
    });
  }

  mappingRanges.sort((a, b) => a.srcStart - b.srcStart);

  const [, srcType, destType] = titleString.match(/(\w+)-to-(\w+) /) ?? [];

  return {
    srcType,
    destType,
    mappingRanges,
  };
}

function parseInput(input: string) {
  const [seedsString, ...mapStrings] = splitByEmptyLines(input);
  const [, ...seeds] = seedsString.split(" ").map((num) => parseInt(num, 10));

  const mappings = mapStrings.map((mapString) => parseMap(mapString));

  return {
    seeds,
    mappings,
  };
}

function mapValue(value: number, mappingItems: Array<MappingRange>) {
  for (const mappingItem of mappingItems) {
    if (mappingItem.srcStart <= value && value <= mappingItem.srcEnd) {
      return value + mappingItem.change;
    }
  }

  return value;
}

export function processPart1(input: string): string {
  const { seeds, mappings } = parseInput(input);

  let currentValues = seeds;
  let currentType = "seed";

  while (currentType !== "location") {
    const mapping = mappings.find((mapping) => mapping.srcType === currentType);
    if (!mapping) throw new Error("No mapping found");

    currentValues = currentValues.map((value) =>
      mapValue(value, mapping.mappingRanges)
    );

    currentType = mapping.destType;
  }

  const closestLocation = Math.min(...currentValues);

  return String(closestLocation);
}

type ValueRange = {
  start: number;
  end: number;
};

function getSeedRanges(pairs: Array<number>): Array<ValueRange> {
  const seedRanges: Array<ValueRange> = [];

  for (let index = 0; index < pairs.length; index += 2) {
    const start = pairs[index];
    const amount = pairs[index + 1];

    seedRanges.push({
      start,
      end: start + amount - 1,
    });
  }

  return seedRanges;
}

function mapRanges(
  range: ValueRange,
  mappingRanges: Mapping["mappingRanges"]
): Array<ValueRange> {
  const resultValueRanges: Array<ValueRange> = [];
  let currentPosition = range.start;

  while (currentPosition <= range.end) {
    const nextMappingRange = mappingRanges.find(
      (mapping) =>
        currentPosition <= mapping.srcEnd && mapping.srcStart <= range.end
    );

    if (!nextMappingRange) {
      resultValueRanges.push({
        start: currentPosition,
        end: range.end,
      });
      break;
    }

    const mappingRangeCroppedStart = Math.max(
      currentPosition,
      nextMappingRange.srcStart
    );
    const mappingRageCroppedEnd = Math.min(range.end, nextMappingRange.srcEnd);

    if (mappingRangeCroppedStart > currentPosition) {
      resultValueRanges.push({
        start: currentPosition,
        end: mappingRangeCroppedStart - 1,
      });
    }

    resultValueRanges.push({
      start: mappingRangeCroppedStart + nextMappingRange.change,
      end: mappingRageCroppedEnd + nextMappingRange.change,
    });

    currentPosition = nextMappingRange.srcEnd + 1;
  }

  return resultValueRanges;
}

export function processPart2(input: string): string {
  const { seeds, mappings } = parseInput(input);

  let currentRanges = getSeedRanges(seeds);
  let currentType = "seed";

  while (currentType !== "location") {
    const mapping = mappings.find((mapping) => mapping.srcType === currentType);
    if (!mapping) throw new Error("No mapping found");

    currentRanges = currentRanges.flatMap((range) =>
      mapRanges(range, mapping.mappingRanges)
    );

    currentType = mapping.destType;
  }

  const closestLocation = Math.min(
    ...currentRanges.map((range) => range.start)
  );

  return String(closestLocation);
}
