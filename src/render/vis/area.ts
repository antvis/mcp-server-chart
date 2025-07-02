import { createChart } from "@antv/g2-ssr";
import { THEME_MAP } from "../constant";
import type { GroupableChartOptions } from "./types";

export type AreaOptions = GroupableChartOptions;

export async function Area(options: AreaOptions) {
  const {
    data,
    title,
    width = 600,
    height = 400,
    stack,
    axisYTitle,
    axisXTitle,
    theme = "default",
  } = options;

  let encode = {};
  // biome-ignore lint/suspicious/noExplicitAny: Transform array has complex nested structure
  let transform: any = [];
  let children = [];

  if (stack) {
    encode = { x: "time", y: "value", color: "group" };
    transform = [{ type: "stackY" }];
    children = [
      {
        type: "area",
        style: { fillOpacity: 0.6 },
      },
      {
        type: "line",
        style: { lineWidth: 2, strokeOpacity: 0.6 },
      },
    ];
  } else {
    encode = { x: "time", y: "value" };
    children = [
      {
        type: "area",
        style: {
          fillOpacity: 0.6,
          ...(theme === "academy"
            ? {}
            : { fill: "linear-gradient(-90deg, white 0%, #3A95FF 100%)" }),
        },
      },
      {
        type: "line",
        style: { lineWidth: 2, strokeOpacity: 0.6 },
      },
      {
        type: "point",
        encode: { shape: "point" },
        style: { fill: "white", lineWidth: 1 },
      },
    ];
  }

  return await createChart({
    type: "view",
    theme: THEME_MAP[theme],
    title,
    data,
    width,
    height,
    encode,
    transform,
    insetRight: 12,
    style: { minHeight: 1 },
    axis: {
      y: {
        title: axisYTitle || false,
      },
      x: {
        title: axisXTitle || false,
      },
    },
    children: children,
  });
}
