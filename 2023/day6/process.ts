import { splitByLine } from "@utils";

type Race = ReturnType<typeof parseRaces>[0];

function parseRaces(input: string) {
  const [times, distances] = splitByLine(input).map((line) => [
    ...(line.match(/\d+/g) ?? []),
  ]);

  const races = times.map((time, index) => ({
    time: parseInt(time),
    distance: parseInt(distances[index]),
  }));

  return races;
}

export function getDistance(raceTime: number, buttonHeldTime: number) {
  const speed = buttonHeldTime;
  return Math.max((raceTime - buttonHeldTime) * speed, 0);
}

type BINARY_SEARCH_TEST_RESULT = "CORRECT" | "TO HIGH" | "TO LOW";

function binarySearch(
  start: number,
  end: number,
  testFn: (x: number) => BINARY_SEARCH_TEST_RESULT
) {
  const testNumber = start + Math.floor((end - start) / 2);

  const result = testFn(testNumber);

  switch (result) {
    case "CORRECT":
      return testNumber;
    case "TO HIGH":
      return binarySearch(start, testNumber - 1, testFn);
    case "TO LOW":
      return binarySearch(testNumber + 1, end, testFn);
  }
}

function getWinRange(race: Race) {
  const lowest = binarySearch(1, race.time - 1, (heldTime) => {
    const distance = getDistance(race.time, heldTime);
    const prevDistance = getDistance(race.time, heldTime - 1);
    const isWin = distance > race.distance;
    const isPrevWin = prevDistance > race.distance;

    if (isWin && !isPrevWin) {
      return "CORRECT";
    }

    if (isWin) {
      return "TO HIGH";
    }

    return distance > prevDistance ? "TO LOW" : "TO HIGH";
  });

  const highest = binarySearch(1, race.time - 1, (heldTime) => {
    const distance = getDistance(race.time, heldTime);
    const nextDistance = getDistance(race.time, heldTime + 1);
    const isWin = distance > race.distance;
    const isNextWin = nextDistance > race.distance;

    if (isWin && !isNextWin) {
      return "CORRECT";
    }

    if (isWin) {
      return "TO LOW";
    }

    return distance > nextDistance ? "TO HIGH" : "TO HIGH";
  });

  return {
    lowest,
    highest,
  };
}

export function processPart1(input: string): string {
  const races = parseRaces(input);
  let multiple = 1;
  for (const race of races) {
    const { lowest, highest } = getWinRange(race);
    multiple *= highest - lowest + 1;
  }

  return String(multiple);
}

export function processPart2(input: string): string {
  const trueInput = input.replaceAll(" ", "");
  const race = parseRaces(trueInput)[0];

  const { lowest, highest } = getWinRange(race);

  return String(highest - lowest + 1);
}
