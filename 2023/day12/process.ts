import { splitByLine, extractInts } from "@utils";
import memoize from "fast-memoize";
import { _cache } from "module";

function parseRowInput(rowInput: string) {
  const [planString, contiguousCountsString] = rowInput.split(" ");
  const contiguousDamagedSpringCounts = extractInts(contiguousCountsString);

  const damagedSpringGroups = planString.split(/\.+/);

  return {
    contiguousDamagedSpringCounts,
    damagedSpringGroups,
  };
}

type GroupDetails = ReturnType<typeof getGroupDetails>;

function getGroupDetails(groupString: string, isSkippable: boolean) {
  const size = groupString.length;
  let min = 0;
  let knownInARow = 0;

  for (const char of groupString) {
    if (char === "#") {
      knownInARow++;
      min = Math.max(min, knownInARow);
    } else {
      knownInARow = 0;
    }
  }

  return {
    groupString,
    isSkippable: isSkippable && min === 0,
    max: size,
  };
}

// function fastOneBlockAllOptional(blockSize: number, springCounts: number[]) {
//   const minMatchLength =
//     springCounts.reduce((a, b) => a + b, 0) + (springCounts.length - 1);

//   const wiggleRoom = blockSize - minMatchLength;

//   if (wiggleRoom < 0) return 0;

//   let _recurse = memoize((springGroupCounts, wiggleRoom): number => {
//     if (wiggleRoom === 0) return 1;
//     if (wiggleRoom === 1) return springGroupCounts + 1;
//     if (springGroupCounts === 1) return 1 + wiggleRoom;

//     return (
//       _recurse(springGroupCounts, wiggleRoom - 1) +
//       _recurse(springGroupCounts - 1, wiggleRoom)
//     );
//   });

//   return _recurse(springCounts.length, wiggleRoom);
// }

export function getRowArrangementCount(rowInput: string): number {
  const { contiguousDamagedSpringCounts: springCounts, damagedSpringGroups } =
    parseRowInput(rowInput);

  const groups = damagedSpringGroups.map((groupString) =>
    getGroupDetails(groupString, true)
  );

  // Depth first search
  const dfs = memoize(function (
    springCounts: number[],
    groups: GroupDetails[]
  ): number {
    if (springCounts.length === 0) {
      if (groups.some((group) => !group.isSkippable)) {
        return 0;
      }

      // Found a valid arrangement!
      return 1;
    }

    if (groups.length === 0) {
      return 0;
    }

    // Not enough space to fit the remaining springs
    if (
      springCounts.reduce((a, b) => a + b) >
      groups.reduce((total, group) => total + group.max, 0)
    ) {
      return 0;
    }

    const [currentSpringCount, ...remainingSpringCounts] = springCounts;
    const [currentGroup, ...remainingGroups] = groups;
    const groupString = currentGroup.groupString;

    // if (remainingGroups.length === 0 && currentGroup.isSkippable) {
    //   return fastOneBlockAllOptional(currentGroup.max, springCounts);
    // }

    let arrangementCounts = 0;

    if (currentGroup.isSkippable) {
      arrangementCounts += dfs(springCounts, remainingGroups);
    }

    if (currentSpringCount > currentGroup.max) {
      return arrangementCounts;
    }

    // If the first space is optional then try to solve without it
    if (groupString[0] === "?") {
      arrangementCounts += dfs(springCounts, [
        getGroupDetails(groupString.slice(1), false),
        ...remainingGroups,
      ]);
    }

    // Check we can fit the first count at the start of the first group
    if (groupString[currentSpringCount] !== "#") {
      if (currentSpringCount + 1 >= currentGroup.max) {
        arrangementCounts += dfs(remainingSpringCounts, remainingGroups);
      } else {
        // Remove first count + 1 so the springs do not touch
        arrangementCounts += dfs(remainingSpringCounts, [
          getGroupDetails(groupString.slice(currentSpringCount + 1), true),
          ...remainingGroups,
        ]);
      }
    }

    return arrangementCounts;
  });

  return dfs(springCounts, groups);
}

export function processPart1(input: string): string {
  let total = 0;

  for (const line of splitByLine(input)) {
    total += getRowArrangementCount(line);
  }

  return String(total);
}

export function getUnfoldedRowArrangementCount(rowInput: string): number {
  const [springsString, groupCountsString] = rowInput.split(" ");

  const unfoldedSprings = `${springsString}?`.repeat(5).slice(0, -1);
  const unfoldedGroupCounts = `${groupCountsString},`.repeat(5).slice(0, -1);

  return getRowArrangementCount(`${unfoldedSprings} ${unfoldedGroupCounts}`);
}

export function processPart2(input: string): string {
  let total = 0;

  for (const line of splitByLine(input)) {
    total += getUnfoldedRowArrangementCount(line);
  }

  return String(total);
}
