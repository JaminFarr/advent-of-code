import { splitByEmptyLines, splitByLine } from "@utils";
import lcm from "compute-lcm";
import { z } from "zod";

type Map = z.infer<typeof mapSchema>;
const mapSchema = z.object({
  directions: z.array(z.enum(["L", "R"])),
  locationMap: z.map(
    z.string(),
    z.object({
      R: z.string(),
      L: z.string(),
    })
  ),
});

function parseInput(input: string): Map {
  function throwLocationParseError(src: string): never {
    throw new Error(`Could not parse location string ${src}`);
  }
  const [directionsString, locationsString] = splitByEmptyLines(input);

  const locationMap = new Map();
  for (const locationString of splitByLine(locationsString)) {
    const [, location, left, right] =
      locationString.match(/(\w+) = \((\w+), (\w+)\)/) ||
      throwLocationParseError(locationString);

    locationMap.set(location, {
      L: left,
      R: right,
    });
  }

  return mapSchema.parse({
    directions: directionsString.split(""),
    locationMap,
  });
}

export function processPart1(input: string): string {
  const { directions, locationMap } = parseInput(input);

  let steps = 0;
  let currentLocation = "AAA";

  while (currentLocation !== "ZZZ") {
    const nextDirection = directions[steps % directions.length];

    currentLocation = locationMap.get(currentLocation)![nextDirection];

    steps++;
  }

  return String(steps);
}

type PathDetails = {
  pathEndIndex: number;
  goalIndexes: Array<number>;
  loopGoalIndexes: Array<number>;
  loopStart: number;
  loopSize: number;
};

function analyzePath(
  startLocation: string,
  directions: Map["directions"],
  locationMap: Map["locationMap"]
): PathDetails {
  let currentLocation = startLocation;
  let currentIndex = 0;
  const goalIndexes: Array<number> = [];
  const startLocations: Array<string> = [];
  const startIndexes: Array<number> = [];

  while (!startLocations.includes(currentLocation)) {
    startLocations.push(currentLocation);
    startIndexes.push(currentIndex);

    for (const direction of directions) {
      const nextLocations = locationMap.get(currentLocation);
      if (!nextLocations) {
        currentLocation = "";
        break;
      }
      currentLocation = nextLocations[direction];
      currentIndex++;
      if (currentLocation.endsWith("Z")) {
        goalIndexes.push(currentIndex);
      }
    }
  }

  const loopStartIndex = startLocations.indexOf(currentLocation);
  const loopStart =
    loopStartIndex === -1 ? false : startIndexes[loopStartIndex];

  return {
    pathEndIndex: currentIndex,
    goalIndexes,
    loopGoalIndexes: goalIndexes.map((index) => index - (loopStart || 0)),
    loopStart: loopStart || 0,
    loopSize: loopStart ? currentIndex - loopStart : 0,
  };
}

function getStepCountToGoal(goalIndex: number, path: PathDetails) {
  const loopGoalIndex = goalIndex % path.loopGoalIndexes.length;
  const loopCount = (goalIndex - loopGoalIndex) / path.loopGoalIndexes.length;

  return (
    path.loopStart +
    loopCount * path.loopSize +
    path.loopGoalIndexes[loopGoalIndex]
  );
}

export function processPart2(input: string): string {
  const { directions, locationMap } = parseInput(input);

  const ghostStartLocations = [...locationMap.keys()].filter((location) =>
    location.endsWith("A")
  );

  const ghosts = ghostStartLocations.map((startLocation) => {
    const path = analyzePath(startLocation, directions, locationMap);
    const currentGoalIndex = 0;
    const stepCount = getStepCountToGoal(currentGoalIndex, path);

    return {
      path,
      currentGoalIndex,
      stepCount,
    };
  });

  /**
   * Fast mode when each ghosts goals steps are always multiples of a single number
   *
   * E.g. in the input Ghost 1's first step with a goal is 18113 and the pattern also repeats
   * every 18113 steps. Therefore all it's goal step counts will be a multiple of 18113.
   *
   * If all ghosts fit this the solution is the least common multiple of all their loop sizes.
   */

  if (
    ghosts.every(
      (ghost) =>
        ghost.path.goalIndexes.length === 1 &&
        ghost.path.goalIndexes[0] === ghost.path.loopSize
    )
  ) {
    const commonStepCount = lcm(ghosts.map((ghost) => ghost.path.loopSize));

    return String(commonStepCount);
  }

  /**
   * Generic solution
   *
   * This works for all inputs
   * Works well for the test case but takes ~10 minutes for the full input
   */

  const getIsAllOnSameStepCount = () =>
    ghosts.every((ghost, _, ghosts) => ghost.stepCount === ghosts[0].stepCount);

  while (!getIsAllOnSameStepCount()) {
    const maxStepCount = Math.max(...ghosts.map((ghost) => ghost.stepCount));

    for (const ghost of ghosts) {
      while (ghost.stepCount < maxStepCount) {
        ghost.currentGoalIndex++;
        ghost.stepCount = getStepCountToGoal(
          ghost.currentGoalIndex,
          ghost.path
        );
      }
    }
  }

  return String(ghosts[0].stepCount);
}
