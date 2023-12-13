import { expect, test } from "bun:test";
import { processPart1, processPart2 } from "./process";

const sampleInput = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`.trim();

test("part1: sample", () => {
  expect(processPart1(sampleInput)).toBe("405");
});

test("part2: sample", () => {
  expect(processPart2(sampleInput)).toBe("400");
});
