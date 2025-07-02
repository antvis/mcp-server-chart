import { createChart } from "@antv/g2-ssr";
import { THEME_MAP } from "../constant";
import type { BasicG2ChartOptions } from "./types";

export type WordCloudOptions = BasicG2ChartOptions;

export async function WordCloud(options: WordCloudOptions) {
  const { data, title, width = 600, height = 400, theme = "default" } = options;
  return await createChart({
    type: "wordCloud",
    theme: THEME_MAP[theme],
    layout: {
      fontSize: [8, 42],
    },
    title,
    data,
    width,
    height,
    encode: {
      text: "text",
      color: "text",
      value: "value",
    },
    legend: false,
  });
}
