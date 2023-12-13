import { readFile } from "node:fs/promises";
import { processPart2 } from "./process";

const input = await readFile(import.meta.dir + "/input.txt", "utf-8");

console.log(processPart2(input));
