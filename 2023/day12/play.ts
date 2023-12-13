import { extractInts } from "@utils";

function checkIsMatch(springsString: string, counts: Array<number>) {
  const groups = springsString.split(/[^#]+/).filter((x) => x.length > 0);

  return (
    groups.length === counts.length &&
    groups.every((group, i) => group.length === counts[i])
  );
}

function binaryBruteForce(input: string) {
  const [springs, countsString] = input.split(" ");
  const counts = extractInts(countsString);
  const springsArr = springs.split("");

  const optionalCharIndexes = [];
  for (let index = 0; index < springsArr.length; index++) {
    const char = springsArr[index];
    if (char === "?") {
      optionalCharIndexes.push(index);
    }
  }

  let arrangementCount = 0;

  const binaryLimit = 2 ** optionalCharIndexes.length;
  for (let binary = 0; binary < binaryLimit; binary++) {
    let i = 1;
    for (const optionalCharIndex of optionalCharIndexes) {
      springsArr[optionalCharIndex] = binary & i ? "#" : ".";
      i <<= 1;
    }

    if (checkIsMatch(springsArr.join(""), counts)) {
      arrangementCount++;
    }
  }

  return arrangementCount;
}

console.log(binaryBruteForce("?###???????? 3,2,1"));
console.log(checkIsMatch(".###..#.#....#", [3, 1, 1, 1]));
