import { expect, test } from "bun:test";
import { hash, processPart1, processPart2 } from "./process";

test("hash test", () => {
  expect(hash("HASH")).toBe(52);
});

const sampleInput = `
rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`.trim();

test("part1: sample", () => {
  expect(processPart1(sampleInput)).toBe("1320");
});

test("part2: sample", () => {
  expect(processPart2(sampleInput)).toBe("145");
});
