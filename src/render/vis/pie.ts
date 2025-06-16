import { createChart } from "@antv/g2-ssr";
import { THEME_MAP } from "../constant";
import type { G2ChartOptions } from "./types";

export type PieOptions = G2ChartOptions;

export async function Pie(options: PieOptions) {
  const {
    data,
    title,
    width = 600,
    height = 400,
    innerRadius,
    theme = "default",
  } = options;

  return await createChart({
    type: "interval",
    theme: THEME_MAP[theme],
    title,
    width,
    height,
    data,
    encode: { y: "value", color: "category" },
    transform: [{ type: "stackY" }],
    coordinate: {
      type: "theta",
      outerRadius: 0.95,
      innerRadius,
    },
    style: {
      radius: 4,
      stroke: "#fff",
      lineWidth: 1,
    },
    labels: [
      {
        // biome-ignore lint/suspicious/noExplicitAny: Pie chart data structure varies
        text: (data: any) => `${data.category}: ${data.value}`,
        position: "outside",
        radius: 0.85,
        fontSize: 12,
        transform: [{ type: "overlapHide" }],
      },
    ],
    legend: {
      color: { position: "bottom", layout: { justifyContent: "center" } },
    },
    animate: false,
    axis: false,
  });
}
