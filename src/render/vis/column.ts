import { createChart } from '@antv/g2-ssr';
import { type ColumnProps } from '@antv/gpt-vis/dist/esm/Column';
import { THEME_MAP } from '../constant';
import { CommonOptions } from './types';

export type ColumnOptions = CommonOptions & ColumnProps;

export async function Column(options: ColumnOptions) {
  const {
    data,
    title,
    width = 600,
    height = 400,
    axisYTitle,
    axisXTitle,
    group,
    stack,
    theme = 'default',
  } = options;

  const hasGroupField = (data || [])[0]?.group !== undefined;
  let transforms: any = [];
  let radiusStyle = {};
  let encode = {};

  if (theme === 'default') {
    radiusStyle = { radiusTopLeft: 4, radiusTopRight: 4 };
  }

  if (group) {
    transforms = [
      {
        type: 'dodgeX',
      },
    ];
  }

  if (stack) {
    transforms = [
      {
        type: 'stackY',
      },
    ];
  }

  if (hasGroupField) {
    encode = {
      x: 'category',
      y: 'value',
      color: 'group',
    };
  } else {
    encode = {
      x: 'category',
      y: 'value',
      color: 'category',
    };
  }

  return await createChart({
    theme: THEME_MAP[theme],
    width,
    height,
    title,
    data,
    type: 'interval',
    encode: encode,
    transform: transforms,
    insetRight: 12,
    style: {
      ...radiusStyle,
      columnWidthRatio: 0.8,
    },
    axis: {
      x: {
        title: axisXTitle,
      },
      y: {
        title: axisYTitle,
      },
    },
  });
}
