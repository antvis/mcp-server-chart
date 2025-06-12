import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { HeightSchema, ThemeSchema, TitleSchema, WidthSchema } from "./base";

const data = z.object({
  category: z.string(),
  value: z.number(),
});

const schema = {
  data: z
    .array(data)
    .describe(
      "Data for funnel chart, such as, [{ category: '浏览网站', value: 50000 }, { category: '放入购物车', value: 35000 }, { category: '生成订单', value: 25000 }, { category: '支付订单', value: 15000 }, { category: '完成交易', value: 8000 }].",
    )
    .nonempty({ message: "Funnel chart data cannot be empty." }),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
  title: TitleSchema,
};

const tool = {
  name: "generate_funnel_chart",
  description:
    "Generate a funnel chart to visualize the progressive reduction of data as it passes through stages, such as, the conversion rates of users from visiting a website to completing a purchase.",
  inputSchema: zodToJsonSchema(schema),
};

export const funnel = {
  schema,
  tool,
};
