import { describe, expect, test } from "bun:test";
import {
  getRowArrangementCount,
  getUnfoldedRowArrangementCount,
  processPart1,
  processPart2,
} from "./process";

describe("part1 row tests", () => {
  test('row1: "???.### 1,1,3"', () => {
    expect(getRowArrangementCount("???.### 1,1,3")).toBe(1);
  });

  test('row2: ".??..??...?##. 1,1,3"', () => {
    expect(getRowArrangementCount(".??..??...?##. 1,1,3")).toBe(4);
  });

  test('row3: "?#?#?#?#?#?#?#? 1,3,1,6"', () => {
    expect(getRowArrangementCount("?#?#?#?#?#?#?#? 1,3,1,6")).toBe(1);
  });

  test('row4: "????.#...#... 4,1,1"', () => {
    expect(getRowArrangementCount("????.#...#... 4,1,1")).toBe(1);
  });

  test('row5: "????.######..#####. 1,6,5"', () => {
    expect(getRowArrangementCount("????.######..#####. 1,6,5")).toBe(4);
  });

  test('row6: "?###???????? 3,2,1"', () => {
    expect(getRowArrangementCount("?###???????? 3,2,1")).toBe(10);
  });

  test('issue1: "???.????????#? 1,3,1,1"', () => {
    expect(getRowArrangementCount("???.????????#? 1,3,1,1")).toBe(19);
  });
});

const sampleInputPart1 = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`.trim();

test("part1: sample", () => {
  expect(processPart1(sampleInputPart1)).toBe("21");
});

const sampleInputPart2 = sampleInputPart1;

describe("part2 row tests", () => {
  test('row1: "???.### 1,1,3"', () => {
    expect(getUnfoldedRowArrangementCount("???.### 1,1,3")).toBe(1);
  });

  test('row2: ".??..??...?##. 1,1,3"', () => {
    expect(getUnfoldedRowArrangementCount(".??..??...?##. 1,1,3")).toBe(16384);
  });

  test('row3: "?#?#?#?#?#?#?#? 1,3,1,6"', () => {
    expect(getUnfoldedRowArrangementCount("?#?#?#?#?#?#?#? 1,3,1,6")).toBe(1);
  });

  test('row4: "????.#...#... 4,1,1"', () => {
    expect(getUnfoldedRowArrangementCount("????.#...#... 4,1,1")).toBe(16);
  });

  test('row5: "????.######..#####. 1,6,5"', () => {
    expect(getUnfoldedRowArrangementCount("????.######..#####. 1,6,5")).toBe(
      2500
    );
  });

  test('row6: "?###???????? 3,2,1"', () => {
    expect(getUnfoldedRowArrangementCount("?###???????? 3,2,1")).toBe(506250);
  });
});

test("part2: sample", () => {
  expect(processPart2(sampleInputPart2)).toBe("525152");
});
