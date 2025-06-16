import { createChart } from "@antv/g2-ssr";
import { THEME_MAP } from "../constant";
import type { G2ChartOptions } from "./types";

export type DualAxespOptions = G2ChartOptions;

export async function DualAxes(options: DualAxespOptions) {
  const {
    series,
    categories,
    title,
    width = 600,
    height = 400,
    theme = "default",
  } = options;
  type DualAxesSeriesItem = {
    type: string;
    data: number[];
    axisYTitle?: string;
  };

  enum ChartType {
    Column = "column",
    Line = "line",
  }

  let radiusStyle = {};

  if (theme === "default") {
    radiusStyle = { radiusTopLeft: 4, radiusTopRight: 4 };
  }

  function transform(series: DualAxesSeriesItem[], categories: string[]) {
    const newChildren = series
      .sort((a, b) => {
        const ORDER = ["column", "line"];
        return ORDER.indexOf(a.type) - ORDER.indexOf(b.type);
      })
      // biome-ignore lint/suspicious/noExplicitAny: Series item structure varies by chart type
      .map((item: any) => {
        const { type, axisYTitle, ...others } = item;

        const baseConfig = {
          ...others,
          axis: { y: { title: axisYTitle } },
          encode: { x: "category", y: axisYTitle, color: () => axisYTitle },
          legend: {
            color: {
              // biome-ignore lint/suspicious/noExplicitAny: Legend marker function parameter type varies
              itemMarker: (v: any) => {
                if (v === axisYTitle) return "smooth";
                return "rect";
              },
            },
          },
          data: undefined,
        };

        if (type === ChartType.Column) {
          return {
            ...baseConfig,
            type: "interval",
            style: { columnWidthRatio: 0.8, ...radiusStyle },
          };
        }

        if (type === ChartType.Line) {
          return {
            ...baseConfig,
            type,
            axis: { y: { position: "right", title: axisYTitle } },
            encode: {
              x: "category",
              y: axisYTitle,
              shape: "smooth",
              color: () => axisYTitle,
            },
            style: { lineWidth: 2 },
            scale: { y: { independent: true } },
          };
        }

        return baseConfig;
      });

    const newData = categories.map((item: string, index: number) => {
      const temp = {
        category: item,
      } as {
        category: string;
        // biome-ignore lint/suspicious/noExplicitAny: Dynamic properties from series data
        [key: string]: any;
      };
      series.forEach((s: DualAxesSeriesItem, i: number) => {
        const defaultYField = s.axisYTitle || `value_${i + 1}`;
        temp[defaultYField] = s.data[index];
      });
      return temp;
    });

    // todo: GPT-Vis 的 legendTypeList 是必选，不合理
    // biome-ignore lint/suspicious/noExplicitAny: Series item type varies
    const legendTypeList = series.map((item: any) => {
      return item.type === ChartType.Line ? "smooth" : "rect";
    });

    return {
      children: newChildren,
      data: newData,
      legendTypeList,
    };
  }

  const config = transform(series || [], categories || []);

  return await createChart({
    type: "view",
    theme: THEME_MAP[theme],
    autoFit: true,
    title,
    width,
    height,
    ...config,
  });
}
