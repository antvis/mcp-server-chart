import { type AreaOptions } from './vis/area';
import { type BarOptions } from './vis/bar';
import { type ColumnOptions } from './vis/column';
import { type DualAxespOptions } from './vis/dual-axes';
import { type FishboneDiagramOptions } from './vis/fishbone-diagram';
import { type FlowDiagramOptions } from './vis/flow-diagram';
import { type HistogramOptions } from './vis/histogram';
import { type LineOptions } from './vis/line';
import { type MindMapOptions } from './vis/mind-map';
import { type NetworkGraphOptions } from './vis/network-graph';
import { type PieOptions } from './vis/pie';
import { type RadarOptions } from './vis/radar';
import { type ScatterOptions } from './vis/scatter';
import { type TreemapOptions } from './vis/treemap';
import { type WordCloudOptions } from './vis/word-cloud';

export type VisOptionMap = {
  area: AreaOptions;
  bar: BarOptions;
  column: ColumnOptions;
  'dual-axes': DualAxespOptions;
  'fishbone-diagram': FishboneDiagramOptions;
  'flow-diagram': FlowDiagramOptions;
  histogram: HistogramOptions;
  line: LineOptions;
  'mind-map': MindMapOptions;
  'network-graph': NetworkGraphOptions;
  pie: PieOptions;
  radar: RadarOptions;
  scatter: ScatterOptions;
  treemap: TreemapOptions;
  'word-cloud': WordCloudOptions;
};

/**
 * 所有的 Vis 类型的类型定义
 */
export type Options = {
  [K in keyof VisOptionMap]: { type: K } & VisOptionMap[K];
}[keyof VisOptionMap];

/**
 * 返回结果
 * todo: G2-SSR 目前不支持 toDataURL
 */
export type SSRResult = {
  exportToFile: (file: string, meta?: any) => void;
  toBuffer: (meta?: any) => Buffer;
  toDataURL: () => string;
  destroy: () => void
};
