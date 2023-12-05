import { expect, test } from "bun:test";
import { processPart1, processPart2 } from "./process";

const part1sample = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

test("day1 part1: sample", () => {
  expect(processPart1(part1sample)).toBe("142");
});

const part2sample = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

test("day1 part2: sample", () => {
  expect(processPart2(part2sample)).toBe("281");
});
