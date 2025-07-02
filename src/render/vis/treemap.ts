import { createChart } from "@antv/g2-ssr";
import { THEME_MAP } from "../constant";
import type { BasicG2ChartOptions } from "./types";

export type TreemapOptions = BasicG2ChartOptions;

export async function Treemap(options: TreemapOptions) {
  const { data, title, width = 600, height = 400, theme = "default" } = options;
  return await createChart({
    type: "treemap",
    theme: THEME_MAP[theme],
    width,
    height,
    title,
    data: {
      type: "inline",
      value: {
        name: "root",
        children: data,
      },
    },
    layout: {
      tile: "treemapBinary",
      paddingInner: 2,
    },
    encode: { value: "value" },
    style: {
      fillOpacity: 0.8,
      labelFontSize: 10,
    },
    tooltip: false,
    legend: false,
    animate: false,
  });
}
