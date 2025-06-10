import { SSRResult, type Options } from './types';
import { Area } from './vis/area';
import { Bar } from './vis/bar';
import { Column } from './vis/column';
import { DualAxes } from './vis/dual-axes';
import { FishboneDiagram } from './vis/fishbone-diagram';
import { FlowDiagram } from './vis/flow-diagram';
import { Histogram } from './vis/histogram';
import { Line } from './vis/line';
import { MindMap } from './vis/mind-map';
import { NetworkGraph } from './vis/network-graph';
import { Pie } from './vis/pie';
import { Radar } from './vis/radar';
import { Scatter } from './vis/scatter';
import { Treemap } from './vis/treemap';
import { WordCloud } from './vis/word-cloud';

/**
 * 所有的 Vis 类型
 * @type {Record<VisType, (options: Options) => Promise<Buffer>>}
 */
const VIS = {
  area: Area,
  bar: Bar,
  column: Column,
  'dual-axes': DualAxes,
  'fishbone-diagram': FishboneDiagram,
  'flow-diagram': FlowDiagram,
  histogram: Histogram,
  line: Line,
  'mind-map': MindMap,
  'network-graph': NetworkGraph,
  pie: Pie,
  radar: Radar,
  scatter: Scatter,
  treemap: Treemap,
  'word-cloud': WordCloud,
};

/**
 *
 * @param options
 * @returns Image Buffer
 */
export async function render(options: Options): Promise<SSRResult> {
  const { type, ...rest } = options;

  // @ts-ignore
  const renderVis = VIS[type];

  if (!renderVis) {
    throw new Error(`Unknown chart type: ${type}`);
  }
  // @ts-ignore
  return await renderVis(rest);
}
