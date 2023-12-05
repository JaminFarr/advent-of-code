import { expect, test } from "bun:test";
import { processPart1, processPart2 } from "./process";

const sampleInput = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

test("day3 part1: sample", () => {
  expect(processPart1(sampleInput)).toBe("4361");
});

test("day3 part2: sample", () => {
  expect(processPart2(sampleInput)).toBe("467835");
});
