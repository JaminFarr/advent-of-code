import { expect, test } from "bun:test";
import { processPart1, processPart2 } from "./process";

const sampleInputPart1 = `
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
  expect(processPart1(sampleInputPart1)).toBe(102);
});

// const sampleInputPart2 = sampleInputPart1;
const sampleInputPart2 = `
`;

test.skip("part2: sample", () => {
  expect(processPart2(sampleInputPart2)).toBe("");
});
// 764
// 763
