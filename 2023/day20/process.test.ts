import { describe, expect, test } from "bun:test";
import { processPart1 } from "./process";

const exampleInput1 = `
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a
`.trim();

const exampleInput2 = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`.trim();

describe("part1", () => {
  test("example1", () => {
    expect(processPart1(exampleInput1)).toBe(32000000);
  });

  test("example2", () => {
    expect(processPart1(exampleInput2)).toBe(11687500);
  });
});

// No tests for part2
