import { splitByLine } from "@utils";

type Card = {
  id: number;
  winningNumbers: Array<number>;
  yourNumbers: Array<number>;
};

const cardMatch = /\s(\d+): ([0-9 ]*) \| ([0-9 ]*)/;

function parseIntList(listString: string): Array<number> {
  return [...listString.matchAll(/\d+/g)].map((match) => parseInt(match[0]));
}

function parseCard(cardString: string): Card {
  const [, id, winningNumbersString, yourNumbersString] =
    cardString.match(cardMatch) ?? [];

  return {
    id: parseInt(id),
    winningNumbers: parseIntList(winningNumbersString),
    yourNumbers: parseIntList(yourNumbersString),
  };
}

export function processPart1(input: string): string {
  let total = 0;

  for (const line of splitByLine(input)) {
    const card = parseCard(line);
    const matchingNumbers = card.yourNumbers.filter((num) =>
      card.winningNumbers.includes(num)
    );
    const matchingNumberCount = matchingNumbers.length;

    if (matchingNumberCount) {
      const score = 2 ** (matchingNumberCount - 1);
      total += score;
    }
  }

  return String(total);
}

export function processPart2(input: string): string {
  let totalCards = 0;
  const nextCardsMultiplier: Array<number> = [];

  for (const line of splitByLine(input)) {
    const cardMultiplier = (nextCardsMultiplier.shift() ?? 0) + 1;
    totalCards += cardMultiplier;

    const card = parseCard(line);
    const matchingNumbersCount = card.yourNumbers.filter((num) =>
      card.winningNumbers.includes(num)
    ).length;

    for (let index = 0; index < matchingNumbersCount; index++) {
      nextCardsMultiplier[index] =
        (nextCardsMultiplier[index] ?? 0) + cardMultiplier;
    }
  }

  return String(totalCards);
}
