import { G6 } from '@antv/g6-ssr';
const { register, BaseNode, BaseTransform, ExtensionCategory, idOf } = G6;

export const DEFAULT_COLOR_PALETTE = {
  type: 'assign-color-by-branch',
  colors: [
    '#1783FF',
    '#F08F56',
    '#D580FF',
    '#00C9C9',
    '#7863FF',
    '#DB9D0D',
    '#60C42D',
    '#FF80CA',
    '#2491B3',
    '#17C76F',
  ],
};

export const ACADEMY_COLOR_PALETTE = {
  type: 'assign-color-by-branch',
  colors: [
    '#4e79a7',
    '#f28e2c',
    '#e15759',
    '#76b7b2',
    '#59a14f',
    '#edc949',
    '#af7aa1',
    '#ff9da7',
    '#9c755f',
    '#bab0ab',
  ],
};
class AssignColorByBranch extends BaseTransform {
  static defaultOptions = {
    colors: DEFAULT_COLOR_PALETTE.colors,
  };

  constructor(context: G6.RuntimeContext, options: any) {
    super(context, Object.assign({}, AssignColorByBranch.defaultOptions, options));
  }

  beforeDraw(input: any) {
    const nodes = this.context.model.getNodeData();

    if (nodes.length === 0) return input;

    let colorIndex = 0;
    const dfs = (nodeId: string, color: any) => {
      const node = nodes.find((datum) => datum.id == nodeId);
      if (!node) return;

      node.style ||= {};
      node.style.color = color || this.options.colors[colorIndex++ % this.options.colors.length];
      node.children?.forEach((childId) => dfs(childId, node.style?.color));
    };
    // @ts-ignore
    nodes.filter((node) => node.depth === 1).forEach((rootNode) => dfs(rootNode.id));

    return input;
  }
}

class MindmapNode extends BaseNode {
  static defaultStyleProps: object = {
    ...BaseNode.defaultStyleProps,
    showIcon: false,
  };

  get childrenData() {
    return this.context.model.getChildrenData(this.id);
  }

  get rootId() {
    return idOf(this.context.model.getRootsData()[0]);
  }

  isShowCollapse(attributes: { collapsed: any; showIcon: any }) {
    const { collapsed, showIcon } = attributes;
    return !collapsed && showIcon && this.childrenData.length > 0;
  }

  getCollapseStyle(attributes: any) {
    const { showIcon, color, direction } = attributes;
    if (!this.isShowCollapse(attributes)) return false;
    const [width, height] = this.getSize(attributes);

    return {
      backgroundFill: color,
      backgroundHeight: 12,
      backgroundWidth: 12,
      cursor: 'pointer',
      fill: '#fff',
      fontFamily: 'iconfont',
      fontSize: 8,
      text: '\ue6e4',
      textAlign: 'center',
      transform: direction === 'left' ? [['rotate', 90]] : [['rotate', -90]],
      visibility: showIcon ? 'visible' : 'hidden',
      x: direction === 'left' ? -6 : width + 6,
      y: height,
    };
  }

  drawCollapseShape() {}

  getCountStyle(attributes: any) {
    const { collapsed, color, direction } = attributes;
    const count = this.context.model.getDescendantsData(this.id).length;
    if (!collapsed || count === 0) return false;
    const [width, height] = this.getSize(attributes);
    return {
      backgroundFill: color,
      backgroundHeight: 12,
      backgroundWidth: 12,
      cursor: 'pointer',
      fill: '#fff',
      fontSize: 8,
      text: count.toString(),
      textAlign: 'center',
      x: direction === 'left' ? -6 : width + 6,
      y: height,
    };
  }

  drawCountShape() {}

  getAddStyle(attributes: any) {
    const { collapsed, showIcon, direction } = attributes;
    if (collapsed || !showIcon) return false;
    const [width, height] = this.getSize(attributes);
    const color = '#ddd';

    const offsetX = this.isShowCollapse(attributes) ? 24 : 12;
    const isRoot = this.id === this.rootId;

    return {
      backgroundFill: '#fff',
      backgroundHeight: 12,
      backgroundLineWidth: 1,
      backgroundStroke: color,
      backgroundWidth: 12,
      cursor: 'pointer',
      fill: color,
      fontFamily: 'iconfont',
      fontSize: 8,
      text: '\ue664',
      textAlign: 'center',
      x: isRoot ? width + 12 : direction === 'left' ? -offsetX : width + offsetX,
      y: isRoot ? height / 2 : height,
    };
  }

  getAddBarStyle(attributes: any) {
    const { collapsed, showIcon, direction, color = '#1783FF' } = attributes;
    if (collapsed || !showIcon) return false;
    const [width, height] = this.getSize(attributes);

    const offsetX = this.isShowCollapse(attributes) ? 12 : 0;
    const isRoot = this.id === this.rootId;

    const HEIGHT = 2;
    const WIDTH = 6;

    return {
      cursor: 'pointer',
      fill:
        direction === 'left'
          ? `linear-gradient(180deg, #fff 20%, ${color})`
          : `linear-gradient(0deg, #fff 20%, ${color})`,
      height: HEIGHT,
      width: WIDTH,
      x: isRoot ? width : direction === 'left' ? -offsetX - WIDTH : width + offsetX,
      y: isRoot ? height / 2 - HEIGHT / 2 : height - HEIGHT / 2,
      zIndex: -1,
    };
  }

  drawAddShape() {}

  forwardEvent() {}

  getKeyStyle(attributes: any) {
    const [width, height] = this.getSize(attributes);
    const keyShape = super.getKeyStyle(attributes);
    return { width, height, ...keyShape };
  }

  drawKeyShape(attributes: any, container: any): any {
    const keyStyle = this.getKeyStyle(attributes);
    return this.upsert('key', 'rect', keyStyle, container);
  }

  render(attributes = this.parsedAttributes, container = this) {
    super.render(attributes, container);
  }
}

register(ExtensionCategory.NODE, 'mindmap', MindmapNode);
register(ExtensionCategory.TRANSFORM, 'assign-color-by-branch', AssignColorByBranch);

/**
 * Same with lodash's `groupBy` function.
 * Groups the elements of an array based on a key function.
 * @param data
 * @param keyFunc
 * @returns
 */
export function groupBy(data: any[], keyFunc: (d: any) => string) {
  return data.reduce(
    (acc, item) => {
      const key = keyFunc(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, any[]>,
  );
}
