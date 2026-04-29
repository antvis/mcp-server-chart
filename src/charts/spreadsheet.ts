import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { HeightSchema, WidthSchema } from "./base";

// Spreadsheet data schema - flexible record type
const data = z.record(z.string(), z.union([z.string(), z.number(), z.null()]));

// Spreadsheet theme schema
const SpreadsheetThemeSchema = z
  .enum(["default", "dark"])
  .optional()
  .default("default")
  .describe(
    "Set the theme for the spreadsheet, optional, default is 'default'.",
  );

// Spreadsheet input schema
const schema = {
  data: z
    .array(data)
    .describe(
      "Data for spreadsheet, an array of objects where each object represents a row. Keys are column names and values can be string, number, or null. Such as, [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }].",
    )
    .nonempty({ message: "Spreadsheet data cannot be empty." }),
  rows: z
    .array(z.string())
    .optional()
    .describe(
      "Row header fields for pivot table. When 'rows' or 'values' is provided, the spreadsheet will be rendered as a pivot table.",
    ),
  columns: z
    .array(z.string())
    .optional()
    .describe(
      "Column header fields, used to specify the order of columns. For regular tables, this determines column order; for pivot tables, this is used for column grouping.",
    ),
  values: z
    .array(z.string())
    .optional()
    .describe(
      "Value fields for pivot table. When 'rows' or 'values' is provided, the spreadsheet will be rendered as a pivot table.",
    ),
  theme: SpreadsheetThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
};

// Spreadsheet tool descriptor
const tool = {
  name: "generate_spreadsheet",
  description:
    "Generate a spreadsheet or pivot table for displaying tabular data. When 'rows' or 'values' fields are provided, it renders as a pivot table (cross-tabulation); otherwise, it renders as a regular table. Useful for displaying structured data, comparing values across categories, and creating data summaries.",
  inputSchema: zodToJsonSchema(schema),
  annotations: {
    title: "Generate Spreadsheet",
    readOnlyHint: true,
  },
};

export const spreadsheet = {
  schema,
  tool,
};
