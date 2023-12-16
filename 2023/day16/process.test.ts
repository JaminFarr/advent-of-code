import { expect, test } from "bun:test";
import { processPart1, processPart2 } from "./process";

const sampleInput = `
.|...L....
|.-.L.....
.....|-...
........|.
..........
.........L
..../.LL..
.-.-/..|..
.|....-|.L
..//.|....
`
  .trim()
  .replaceAll("L", "\\");

test("part1: sample", () => {
  expect(processPart1(sampleInput)).toBe(46);
});

test("part2: sample", () => {
  expect(processPart2(sampleInput)).toBe(51);
});
