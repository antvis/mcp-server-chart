import { createChart } from '@antv/g2-ssr';
import { type HistogramProps } from '@antv/gpt-vis/dist/esm/Histogram';
import { THEME_MAP } from '../constant';
import { CommonOptions } from './types';

export type HistogramOptions = CommonOptions & HistogramProps;

export async function Histogram(options: HistogramOptions) {
  const {
    data,
    title,
    width = 600,
    height = 400,
    axisYTitle,
    axisXTitle,
    binNumber,
    theme = 'default',
  } = options;

  return await createChart({
    type: 'interval',
    theme: THEME_MAP[theme],
    width,
    height,
    data,
    title,
    encode: {
      x: (d: any) => d,
      y: 'count',
    },
    transform: [{ type: 'binX', y: 'count', thresholds: binNumber }],
    style: { minHeight: 1, columnWidthRatio: 1, inset: 0.5 },
    axis: {
      x: { title: axisXTitle },
      y: { title: axisYTitle },
    },
    animate: false,
  });
}
