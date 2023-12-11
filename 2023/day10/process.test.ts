import { expect, test } from "bun:test";
import { processPart1, processPart2 } from "./process";

const sampleInputPart1Sample1 = `
-L|F7
7S-7|
L|7||
-L-J|
L|-JF
`.trim();

const sampleInputPart1Sample2 = `
7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ
`.trim();

test("part1: sample", () => {
  expect(processPart1(sampleInputPart1Sample1)).toBe("4");
  expect(processPart1(sampleInputPart1Sample2)).toBe("8");
});

// const sampleInputPart2 = sampleInputPart1;
const sampleInputPart2 = `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJIF7FJ-
L---JF-JLJIIIIFJLJJ7
|F|F-JF---7IIIL7L|7|
|FFJF7L7F-JF7IIL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`.trim();

test("part2: sample", () => {
  expect(processPart2(sampleInputPart2)).toBe("10");
});
