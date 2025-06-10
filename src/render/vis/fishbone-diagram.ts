import { createGraph, G6 } from '@antv/g6-ssr';
import { type FishboneDiagramProps } from '@antv/gpt-vis/dist/esm/FishboneDiagram';
import type { CanvasRenderingContext2D } from 'canvas';
import { createCanvas } from 'canvas';
import { G6THEME_MAP } from '../constant';
import { CommonOptions } from './types';

const { treeToGraphData } = G6;

export type FishboneDiagramOptions = CommonOptions & FishboneDiagramProps;

let canvas: ReturnType<typeof createCanvas> | null = null;
let ctx: CanvasRenderingContext2D | null = null;

type TextStyle = {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
};

const measureText = (style: TextStyle): number => {
  if (!canvas) {
    canvas = createCanvas(0, 0);
    ctx = canvas.getContext('2d');
  }

  const font = [
    style.fontStyle || 'normal',
    style.fontWeight || 'normal',
    `${style.fontSize || 12}px`,
    style.fontFamily || 'sans-serif',
  ].join(' ');

  ctx!.font = font;
  return ctx!.measureText(style.text).width;
};

const getNodeSize = (id: any, depth: any) => {
  const FONT_FAMILY = 'system-ui, sans-serif';
  return depth === 0
    ? [
        measureText({ text: id, fontSize: 24, fontWeight: 'bold', fontFamily: FONT_FAMILY }) + 80,
        70,
      ]
    : depth === 1
      ? [measureText({ text: id, fontSize: 18, fontFamily: FONT_FAMILY }) + 50, 42]
      : [2, 30];
};

function visTreeData2GraphData(data: any) {
  return treeToGraphData(data, {
    getNodeData: (datum: any, depth: any) => {
      datum.id = datum.name;
      datum.depth = depth;
      if (!datum.children) return datum;
      const { children, ...restDatum } = datum;
      return {
        ...restDatum,
        children: children.map((child: any) => child.name),
      };
    },
    getEdgeData: (source, target) => ({
      source: source.name,
      target: target.name,
    }),
  });
}

export async function FishboneDiagram(options: FishboneDiagramOptions) {
  const { data, width = 600, height = 400, theme = 'default' } = options;
  const dataParse = visTreeData2GraphData(data);

  return await createGraph({
    autoFit: {
      type: 'view',
      options: {
        when: 'overflow',
        direction: 'x',
      },
    },
    width,
    height,
    data: dataParse,
    devicePixelRatio: 3,
    padding: 20,
    node: {
      type: 'rect',
      // @ts-ignore
      style: (d) => {
        const style = {
          radius: 8,
          size: getNodeSize(d.id, d.depth),
          labelText: d.id,
          labelPlacement: 'left',
          labelFontFamily: 'Gill Sans',
        };

        if (d.depth === 0) {
          Object.assign(style, {
            fill: '#EFF0F0',
            labelFill: '#262626',
            labelFontWeight: 'bold',
            labelFontSize: 24,
            labelOffsetY: 4,
            labelPlacement: 'center',
            labelLineHeight: 24,
          });
        } else if (d.depth === 1) {
          Object.assign(style, {
            labelFontSize: 18,
            labelFill: '#fff',
            labelFillOpacity: 0.9,
            labelOffsetY: 5,
            labelPlacement: 'center',
            fill: d.style?.color,
          });
        } else {
          Object.assign(style, {
            fill: 'transparent',
            labelFontSize: 16,
            labeFill: '#262626',
          });
        }
        return style;
      },
    },
    edge: {
      type: 'polyline',
      style: {
        lineWidth: 3,
        // @ts-ignore
        stroke: function (data) {
          // @ts-ignore
          return this.getNodeData(data.target).style.color || '#99ADD1';
        },
      },
    },
    layout: {
      type: 'fishbone',
      direction: 'RL',
      hGap: 40,
      vGap: 60,
    },
    transforms: [G6THEME_MAP[theme]],
  });
}
