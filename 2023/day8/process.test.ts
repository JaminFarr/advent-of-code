import { expect, test } from "bun:test";
import { processPart1, processPart2 } from "./process";

const sampleInputPart1 = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`.trim();

test("part1: sample", () => {
  expect(processPart1(sampleInputPart1)).toBe("6");
});

// const sampleInputPart2 = sampleInputPart1;
const sampleInputPart2 = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`.trim();

test("part2: sample", () => {
  expect(processPart2(sampleInputPart2)).toBe("6");
});
