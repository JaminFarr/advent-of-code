import { expect, test } from "bun:test";
import { processPart1, processPart2 } from "./process";

const sampleInputPart1 = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`.trim();

test("part1: sample", () => {
  expect(processPart1(sampleInputPart1)).toBe("6440");
});

const sampleInputPart2 = sampleInputPart1;

test("part2: sample", () => {
  expect(processPart2(sampleInputPart2)).toBe("5905");
});
