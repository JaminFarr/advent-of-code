import { splitByLine } from "@utils";

function getDiffSeq(seq: Array<number>): Array<number> {
  const resultSeq: Array<number> = [];
  for (let index = 1; index < seq.length; index++) {
    resultSeq.push(seq[index] - seq[index - 1]);
  }

  return resultSeq;
}

function isAllZeros(seq: Array<number>): boolean {
  return seq.every((x) => x === 0);
}

function getNextSeqValue(seq: Array<number>): number {
  const seqStack = [seq];
  let currentSeq = seq;

  while (!isAllZeros(currentSeq)) {
    currentSeq = getDiffSeq(currentSeq);
    seqStack.push(currentSeq);
  }

  currentSeq.push(0);

  while (seqStack.length > 0) {
    const lastNumberOfLastSeq = currentSeq.at(-1)!;
    currentSeq = seqStack.pop()!;
    currentSeq.push(currentSeq.at(-1)! + lastNumberOfLastSeq);
  }

  return currentSeq.at(-1)!;
}

function parseSeq(line: string): Array<number> {
  return line.split(" ").map((x) => parseInt(x));
}

export function processPart1(input: string): string {
  let total = 0;

  for (const line of splitByLine(input)) {
    const inputSeq = parseSeq(line);
    const nextValue = getNextSeqValue(inputSeq);
    total += nextValue;
  }

  return String(total);
}

export function processPart2(input: string): string {
  let total = 0;

  for (const line of splitByLine(input)) {
    const inputSeq = parseSeq(line).reverse();
    const previousValue = getNextSeqValue(inputSeq);
    total += previousValue;
  }

  return String(total);
}
