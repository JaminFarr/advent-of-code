import { splitByLine } from "@utils";

function getHandRank(hand: string) {
  const cardCountMap: Record<string, number> = {};

  for (const card of hand) {
    cardCountMap[card] = (cardCountMap[card] || 0) + 1;
  }

  const counts = Object.values(cardCountMap).sort((a, b) => b - a);

  if (counts[0] === 5) {
    return 1;
  }
  if (counts[0] === 4) {
    return 2;
  }
  if (counts[0] === 3 && counts[1] === 2) {
    return 3;
  }
  if (counts[0] === 3) {
    return 4;
  }
  if (counts[0] === 2 && counts[1] === 2) {
    return 5;
  }
  if (counts[0] === 2) {
    return 6;
  }

  return 7;
}

const cardStrengthMap: Record<string, number> = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

function getHandValueStrength(hand: string, strengthMap = cardStrengthMap) {
  let strength = 0;
  for (const card of hand) {
    strength *= 20;
    if (!strengthMap[card]) throw new Error(`Missing map for "${card}"`);
    strength += strengthMap[card];
  }

  return strength;
}

export function processPart1(input: string): string {
  const hands = splitByLine(input).map((line) => {
    const [hand, bidString] = line.split(" ");

    return {
      hand,
      bid: parseInt(bidString),
      handRank: getHandRank(hand),
      valueStrength: getHandValueStrength(hand),
    };
  });

  const sortedHands = hands.toSorted(
    (a, b) => b.handRank - a.handRank || a.valueStrength - b.valueStrength
  );

  let total = 0;

  for (const [index, hand] of sortedHands.entries()) {
    total += hand.bid * (index + 1);
  }

  return String(total);
}

const cardStrengthMapJokersLow: Record<string, number> = {
  ...cardStrengthMap,
  J: 1,
};

function getHandRankWithJokers(hand: string) {
  const cardCountMap: Record<string, number> = {};

  let jokerCount = 0;

  for (const card of hand) {
    if (card === "J") {
      jokerCount++;
      continue;
    }
    cardCountMap[card] = (cardCountMap[card] || 0) + 1;
  }

  const counts = Object.values(cardCountMap).sort((a, b) => b - a);

  counts[0] = (counts[0] || 0) + jokerCount;

  if (counts[0] === 5) {
    return 1;
  }
  if (counts[0] === 4) {
    return 2;
  }
  if (counts[0] === 3 && counts[1] === 2) {
    return 3;
  }
  if (counts[0] === 3) {
    return 4;
  }
  if (counts[0] === 2 && counts[1] === 2) {
    return 5;
  }
  if (counts[0] === 2) {
    return 6;
  }

  return 7;
}

export function processPart2(input: string): string {
  const hands = splitByLine(input).map((line) => {
    const [hand, bidString] = line.split(" ");

    return {
      hand,
      bid: parseInt(bidString),
      handRank: getHandRankWithJokers(hand),
      valueStrength: getHandValueStrength(hand, cardStrengthMapJokersLow),
    };
  });

  const sortedHands = hands.toSorted(
    (a, b) => b.handRank - a.handRank || a.valueStrength - b.valueStrength
  );

  let total = 0;

  for (const [index, hand] of sortedHands.entries()) {
    total += hand.bid * (index + 1);
  }

  return String(total);
}
