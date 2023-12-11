import { expect, test } from "bun:test";
import { processPart1, processPart2 } from "./process";

const sampleInputPart1 = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`.trim();

test("part1: sample", () => {
  expect(processPart1(sampleInputPart1)).toBe("374");
});

const sampleInputPart2 = sampleInputPart1;

test("part2: sample", () => {
  expect(processPart2(sampleInputPart2, 10)).toBe("1030");
  expect(processPart2(sampleInputPart2, 100)).toBe("8410");
});
