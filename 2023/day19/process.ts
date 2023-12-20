import { splitByEmptyLines, splitByLine } from "@utils";
import invariant from "tiny-invariant";
import { z } from "zod";

type Part = z.infer<typeof partSchema>;
const partSchema = z.object({
  x: z.number(),
  m: z.number(),
  a: z.number(),
  s: z.number(),
});

type PartProperty = z.infer<typeof partPropertyNames>;
const partPropertyNames = partSchema.keyof();

type Workflow = z.infer<typeof workflowSchema>;
const workflowSchema = z.object({
  name: z.string(),
  rules: z.array(
    z.object({
      property: partPropertyNames,
      operator: z.enum(["<", ">"]),
      value: z.number(),
      target: z.string(),
    })
  ),
  defaultTarget: z.string(),
});

type Rule = z.infer<typeof ruleSchema>;
const ruleSchema = workflowSchema.shape.rules.element;

function parseWorkflow(input: string): Workflow {
  const match = input.match(/^(?<name>\w+){(?<rulesString>[^}]+)}$/);
  invariant(match, "Invalid workflow");
  const { name, rulesString } = match.groups!;

  const ruleStrings = rulesString.split(",");
  const defaultTarget = ruleStrings.pop();

  const rules = ruleStrings.map((ruleString) => {
    const match = ruleString.match(
      /^(?<property>\w+)(?<operator>[><])(?<value>\d+):(?<target>\w+)?$/
    );
    invariant(match, "Invalid rule");
    const { property, operator, value, target } = match.groups!;
    return {
      property,
      operator,
      value: Number(value),
      target,
    };
  });

  // Ditch rules that have no effect
  while (rules.at(-1)?.target === defaultTarget) {
    rules.pop();
  }

  return workflowSchema.parse({
    name,
    rules,
    defaultTarget,
  });
}

function parsePart(input: string): Part {
  const part: Record<string, number> = {};

  for (const property of input.slice(1, -1).split(",")) {
    const [name, value] = property.split("=");
    part[name] = Number(value);
  }

  return partSchema.parse(part);
}

function parseInput(input: string) {
  const [workflowsString, partsString] = splitByEmptyLines(input);
  const workflowMap = new Map(
    splitByLine(workflowsString)
      .map(parseWorkflow)
      .map((workflow) => [workflow.name, workflow])
  );
  const parts = splitByLine(partsString).map(parsePart);

  return { workflowMap, parts };
}

export function processPart1(input: string): number {
  const { parts, workflowMap } = parseInput(input);

  let total = 0;
  for (const part of parts) {
    let target = "in";

    while (target !== "A" && target !== "R") {
      const workflow = workflowMap.get(target)!;

      target = workflow.defaultTarget;
      for (const rule of workflow.rules) {
        if (rule.operator === "<") {
          if (part[rule.property] < rule.value) {
            target = rule.target;
            break;
          }
        } else if (rule.operator === ">") {
          if (part[rule.property] > rule.value) {
            target = rule.target;
            break;
          }
        }
      }

      if (target === "A") {
        total += part.x + part.m + part.a + part.s;
      }
    }
  }

  return total;
}

type PartsRange = {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
};

function getRangePartsCount(partsRange: PartsRange): number {
  return (
    (partsRange.x[1] - partsRange.x[0] + 1) *
    (partsRange.m[1] - partsRange.m[0] + 1) *
    (partsRange.a[1] - partsRange.a[0] + 1) *
    (partsRange.s[1] - partsRange.s[0] + 1)
  );
}

function splitPartsRange(
  partsRange: PartsRange,
  rule: Rule
): { selected: PartsRange; remaining: PartsRange } {
  const { property, operator, value } = rule;

  const selected = { ...partsRange };
  const remaining = { ...partsRange };

  const [min, max] = partsRange[property];

  if (operator === "<") {
    selected[property] = [Math.min(min, value - 1), Math.min(max, value - 1)];
    remaining[property] = [Math.max(min, value), Math.max(max, value)];
  } else {
    selected[property] = [Math.max(min, value + 1), Math.max(max, value + 1)];
    remaining[property] = [Math.min(min, value), Math.min(max, value)];
  }

  // invariant(
  //   getRangePartsCount(partsRange) ===
  //     getRangePartsCount(selected) + getRangePartsCount(remaining),
  //   "Parts count should not change on split. " +
  //     `${property} ${operator} ${value}`
  // );

  return {
    selected,
    remaining,
  };
}

export function processPart2(input: string): number {
  const { workflowMap } = parseInput(input);

  const initPartsRange: PartsRange = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  };

  function recurse(workflowName: string, range: PartsRange): number {
    if (workflowName === "A") {
      return getRangePartsCount(range);
    } else if (workflowName === "R") {
      return 0;
    }

    const workflow = workflowMap.get(workflowName)!;

    let acceptedCount: number = 0;

    for (const rule of workflow.rules) {
      const { selected, remaining } = splitPartsRange(range, rule);

      if (getRangePartsCount(selected) > 0) {
        acceptedCount += recurse(rule.target, selected);
      }

      range = remaining;
    }

    if (getRangePartsCount(range) > 0) {
      acceptedCount += recurse(workflow.defaultTarget, range);
    }

    return acceptedCount;
  }

  return recurse("in", initPartsRange);
}
