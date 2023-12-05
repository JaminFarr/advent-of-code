function splitByLine(str: string): Array<string> {
  return str.trim().split(/\n\r|\r|\n/);
}

function getCalibrationValue(str: string): number {
  let firstDigit = "";
  let lastDigit = "";

  for (let index = 0; index < str.length; index++) {
    const character = str[index];
    if ("0" <= character && character <= "9") {
      firstDigit = character;
      break;
    }
  }

  for (let index = str.length - 1; index >= 0; index--) {
    const character = str[index];
    if ("0" <= character && character <= "9") {
      lastDigit = character;
      break;
    }
  }

  return parseInt(`${firstDigit}${lastDigit}`);
}

const digitMap = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function getDigitAt(str: string, index: number): string | null {
  const character = str[index];
  if ("0" <= character && character <= "9") {
    return character;
  }

  for (const stringDigit of Object.keys(digitMap) as Array<
    keyof typeof digitMap
  >) {
    if (str.slice(index, index + stringDigit.length) === stringDigit) {
      return digitMap[stringDigit];
    }
  }

  return null;
}

function getCalibrationValueWithStringDigits(str: string): number {
  let firstDigit = "";
  let lastDigit = "";

  for (let index = 0; index < str.length; index++) {
    const digit = getDigitAt(str, index);
    if (digit) {
      firstDigit = digit;
      break;
    }
  }

  for (let index = str.length - 1; index >= 0; index--) {
    const digit = getDigitAt(str, index);
    if (digit) {
      lastDigit = digit;
      break;
    }
  }

  return parseInt(`${firstDigit}${lastDigit}`);
}

export function processPart1(input: string): string {
  const lines = splitByLine(input);

  let total = 0;

  for (const line of lines) {
    total += getCalibrationValue(line);
  }

  return String(total);
}

export function processPart2(input: string): string {
  const lines = splitByLine(input);

  let total = 0;

  for (const line of lines) {
    total += getCalibrationValueWithStringDigits(line);
  }

  return String(total);
}
