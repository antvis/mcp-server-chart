import { ACADEMY_COLOR_PALETTE, DEFAULT_COLOR_PALETTE } from './utils';
const DEFAULT_THEME = {
  type: 'light',
  view: {
    viewFill: '#FFF',
    plotFill: 'transparent',
    mainFill: 'transparent',
    contentFill: 'transparent',
  },
  interval: {
    rect: {
      fillOpacity: 0.8,
    },
  },
  line: {
    line: {
      lineWidth: 2,
    },
  },
  area: {
    area: {
      fillOpacity: 0.6,
    },
  },
  point: {
    point: {
      lineWidth: 1,
    },
  },
};

const ACADEMY_THEME = {
  type: 'academy',
  view: {
    viewFill: '#FFF',
    plotFill: 'transparent',
    mainFill: 'transparent',
    contentFill: 'transparent',
  },
  interval: {
    rect: {
      fillOpacity: 0.8,
    },
  },
  line: {
    line: {
      lineWidth: 2,
    },
  },
  area: {
    area: {
      fillOpacity: 0.6,
    },
  },
  point: {
    point: {
      lineWidth: 1,
    },
  },
};

export const THEME_MAP: any = {
  default: DEFAULT_THEME,
  academy: ACADEMY_THEME,
};

export const G6THEME_MAP: any = {
  default: DEFAULT_COLOR_PALETTE,
  academy: ACADEMY_COLOR_PALETTE,
};
