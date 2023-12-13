import { expect, test } from "bun:test";
import { processPart1, processPart2 } from "./process";

const sampleInputPart1 = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`.trim();

test("part1: sample", () => {
  expect(processPart1(sampleInputPart1)).toBe("114");
});

const sampleInputPart2 = sampleInputPart1;

test("part2: sample", () => {
  expect(processPart2(sampleInputPart2)).toBe("2");
});
