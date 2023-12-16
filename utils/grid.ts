import { splitByLine } from "@utils";
import { z } from "zod";

export type Grid<TCell> = z.infer<
  ReturnType<typeof createGridSchema<z.ZodType<TCell>>>
>;

export type Row<TCell> = Grid<TCell>["rows"][0];

function createGridSchema<TCellSchema extends z.ZodTypeAny>(
  cellSchema: TCellSchema
) {
  return z.object({
    width: z.number(),
    height: z.number(),
    rows: z.array(z.array(cellSchema)),
  });
}

export function parseGrid<TCellSchema extends z.ZodTypeAny>(
  input: string,
  {
    cellSchema,
    cellDelimiter = "",
  }: { cellSchema: TCellSchema; cellDelimiter?: string }
) {
  const stringRows = splitByLine(input);

  const grid = {
    width: stringRows[0].length,
    height: stringRows.length,
    rows: stringRows.map((stringRow) => stringRow.split(cellDelimiter)),
  };

  return createGridSchema(cellSchema).parse(grid);
}
