import { z } from "zod";
import { splitByLine } from "../../utils";

const gameSchema = z.object({
  id: z.coerce.number().int(),
  rounds: z.array(
    z.object({
      blue: z.coerce.number().int().default(0),
      red: z.coerce.number().int().default(0),
      green: z.coerce.number().int().default(0),
    })
  ),
});

type Game = z.infer<typeof gameSchema>;
type Round = Game["rounds"][0];

function parseGame(str: string): Game {
  const [header, roundsStr] = str.split(": ");
  const id = header.slice(5);

  const rounds = [];
  for (const roundStr of roundsStr.trim().split("; ")) {
    const round: Record<string, any> = {};

    for (const cubeCountStr of roundStr.split(", ")) {
      const [count, color] = cubeCountStr.split(" ");
      round[color] = count;
    }

    rounds.push(round);
  }

  return gameSchema.parse({
    id,
    rounds,
  });
}

function checkIsGamePossible(game: Game, cubeCounts: Round): boolean {
  for (const round of game.rounds) {
    if (
      round.red > cubeCounts.red ||
      round.blue > cubeCounts.blue ||
      round.green > cubeCounts.green
    ) {
      return false;
    }
  }

  return true;
}

const part1CubeCounts: Round = {
  red: 12,
  green: 13,
  blue: 14,
};

export function processPart1(input: string): string {
  let total = 0;

  for (const line of splitByLine(input)) {
    const game = parseGame(line);
    if (checkIsGamePossible(game, part1CubeCounts)) {
      total += game.id;
    }
  }

  return String(total);
}

function getGameMinimumCubes(game: Game): Round {
  const minimumCubes: Round = {
    red: 0,
    green: 0,
    blue: 0,
  };

  for (const round of game.rounds) {
    minimumCubes.red = Math.max(minimumCubes.red, round.red);
    minimumCubes.green = Math.max(minimumCubes.green, round.green);
    minimumCubes.blue = Math.max(minimumCubes.blue, round.blue);
  }

  return minimumCubes;
}

export function processPart2(input: string): string {
  let total = 0;

  for (const line of splitByLine(input)) {
    const game = parseGame(line);
    const minimumCubes = getGameMinimumCubes(game);
    const power = minimumCubes.red * minimumCubes.green * minimumCubes.blue;

    total += power;
  }

  return String(total);
}
