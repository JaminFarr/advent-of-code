export function splitByLine(str: string): Array<string> {
  return str.trim().split(/\n\r|\r|\n/);
}

export function splitByEmptyLines(str: string): Array<string> {
  return str.trim().split(/(?:\n\r|\r|\n){2,}/);
}
