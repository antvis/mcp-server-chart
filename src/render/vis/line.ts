import { createChart } from '@antv/g2-ssr';
import { type LineProps } from '@antv/gpt-vis/dist/esm/Line';
import { THEME_MAP } from '../constant';
import { CommonOptions } from './types';

export type LineOptions = CommonOptions & LineProps;

export async function Line(options: LineOptions) {
  const {
    data,
    title,
    width = 600,
    height = 400,
    axisYTitle,
    axisXTitle,
    theme = 'default',
  } = options;

  const hasGroupField = (data || [])[0]?.group !== undefined;

  let encode = {};
  if (hasGroupField) {
    encode = { x: 'time', y: 'value', color: 'group' };
  } else {
    encode = { x: 'time', y: 'value' };
  }

  return await createChart({
    type: 'view',
    title,
    data,
    width,
    height,
    encode: encode,
    theme: THEME_MAP[theme],
    insetRight: 12,
    insetTop: 4,
    style: { minHeight: 1 },
    axis: {
      y: {
        title: axisYTitle || false,
      },
      x: {
        title: axisXTitle || false,
      },
    },
    children: [
      {
        type: 'line',
        style: {
          lineWidth: 2,
        },
        labels: [
          {
            text: 'value',
            style: { textAlign: 'center', dy: -12 },
            transform: [{ type: 'overlapDodgeY' }],
          },
        ],
      },
      {
        type: 'point',
        encode: { shape: 'point' },
        style: { fill: 'white', lineWidth: 1 },
      },
    ],
  });
}
