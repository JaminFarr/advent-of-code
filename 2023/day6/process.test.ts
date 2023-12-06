import { describe, expect, test } from "bun:test";
import { getDistance, processPart1, processPart2 } from "./process";

const sampleInputPart1 = `
Time:      7  15   30
Distance:  9  40  200
`.trim();

test("part1: sample", () => {
  expect(processPart1(sampleInputPart1)).toBe("288");
});

describe("getDistance", () => {
  test("race 1 held for 2ms", () => {
    expect(getDistance(7, 2)).toBe(10);
  });
  test("race 1 held for 3ms", () => {
    expect(getDistance(7, 3)).toBe(12);
  });
});

const sampleInputPart2 = sampleInputPart1;

test("part2: sample", () => {
  expect(processPart2(sampleInputPart2)).toBe("71503");
});
