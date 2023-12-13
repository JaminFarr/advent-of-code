export function splitByLine(str: string): Array<string> {
  return str.trim().split(/\n\r|\r|\n/);
}

export function splitByEmptyLines(str: string): Array<string> {
  return str.trim().split(/(?:\n\r|\r|\n){2,}/);
}

export function extractInts(str: string): Array<number> {
  const numbers: Array<number> = [];

  for (const match of str.matchAll(/\b\d+\b/g)) {
    numbers.push(parseInt(match[0], 10));
  }

  return numbers;
}
