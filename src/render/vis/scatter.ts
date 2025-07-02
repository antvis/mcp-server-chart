import { createChart } from "@antv/g2-ssr";
import { THEME_MAP } from "../constant";
import type { BasicG2ChartOptions } from "./types";

export type ScatterOptions = BasicG2ChartOptions;

export async function Scatter(options: ScatterOptions) {
  const {
    data,
    title,
    width = 600,
    height = 400,
    axisYTitle,
    axisXTitle,
    theme = "default",
  } = options;
  return await createChart({
    type: "point",
    theme: THEME_MAP[theme],
    data,
    width,
    height,
    title,
    encode: {
      x: "x",
      y: "y",
      // shape: 'point',
    },
    axis: {
      x: {
        title: axisXTitle,
      },
      y: {
        title: axisYTitle,
      },
    },
    insetRight: 4,
    style: { lineWidth: 1 },
    legend: { size: false },
    animate: false,
    tooltip: false,
  });
}
