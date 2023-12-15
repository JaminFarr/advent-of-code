import { splitByLine } from "@utils";

export function hash(input: string): number {
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    result = ((result + charCode) * 17) % 256;
  }
  return result;
}

export function processPart1(input: string): string {
  let total = 0;

  for (const instruction of input.split(",")) {
    total += hash(instruction);
  }

  return String(total);
}

type Lens = [label: string, lens: number];
type Box = Array<Lens>;

function updateBox(box: Box, label: string, action: string, lens: string) {
  const lensIndex = box.findIndex(([_label]) => label === _label);

  switch (action) {
    case "-":
      if (lensIndex !== -1) {
        box.splice(lensIndex, 1);
      }
      break;
    case "=":
      if (lensIndex !== -1) {
        box[lensIndex][1] = parseInt(lens);
      } else {
        box.push([label, parseInt(lens)]);
      }
  }
}

function getBoxValue(box: Box) {
  let total = 0;

  for (let i = 0; i < box.length; i++) {
    total += (i + 1) * box[i][1];
  }

  return total;
}

export function processPart2(input: string): string {
  const boxes: Array<Box> = Array.from({ length: 256 }, () => []);

  for (const instruction of input.split(",")) {
    const [label, action, lens] = instruction.split(/([-=])/);
    const boxIndex = hash(label);
    updateBox(boxes[boxIndex], label, action, lens);
  }

  let total = 0;

  for (let i = 0; i < boxes.length; i++) {
    total += getBoxValue(boxes[i]) * (i + 1);
  }

  return String(total);
}
