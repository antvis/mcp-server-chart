import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { HeightSchema, ThemeSchema, WidthSchema } from "./base";

export type OrganizationChartDatumType = {
  name: string;
  description?: string;
  children?: OrganizationChartDatumType[];
};

const OrganizationChartNodeSchema: z.ZodType<OrganizationChartDatumType> =
  z.lazy(() =>
    z.object({
      name: z.string(),
      description: z.string().optional(),
      children: z.array(OrganizationChartNodeSchema).optional(),
    }),
  );

const schema = {
  data: OrganizationChartNodeSchema.describe(
    "Data for organization chart, such as, { name: 'CEO', description: 'Chief Executive Officer', children: [{ name: 'CTO', description: 'Chief Technology Officer', children: [{ name: 'Dev Manager', description: 'Development Manager' }] }] }.",
  ),
  orient: z
    .enum(["horizontal", "vertical"])
    .default("vertical")
    .describe(
      "Orientation of the organization chart, either horizontal or vertical. Default is vertical, when the level of the chart is more than 3, it is recommended to use horizontal orientation.",
    ),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
};

const tool = {
  name: "generate_organization_chart",
  description:
    "Generate an organization chart to visualize the hierarchical structure of an organization, such as, a diagram showing the relationship between a CEO and their direct reports.",
  inputSchema: zodToJsonSchema(schema),
};

export const organizationChart = {
  schema,
  tool,
};
