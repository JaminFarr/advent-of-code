import { expect, test } from "bun:test";
import { processPart1, processPart2 } from "./process";

const sampleInput = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`.trim();

test("part1: sample", () => {
  expect(processPart1(sampleInput)).toBe(102);
});

test("part2: sample", () => {
  expect(processPart2(sampleInput)).toBe(94);
});

const sampleInput2 = `
111111111111
999999999991
999999999991
999999999991
999999999991
`.trim();

test("part2: sample2", () => {
  expect(processPart2(sampleInput2)).toBe(71);
});
