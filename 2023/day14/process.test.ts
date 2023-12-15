import { expect, test } from "bun:test";
import { processPart1, processPart2 } from "./process";

const sampleInput = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`.trim();

test("part1: sample", () => {
  expect(processPart1(sampleInput)).toBe("136");
});

test("part2: sample", () => {
  expect(processPart2(sampleInput)).toBe("64");
});
