import { ACADEMY_COLOR_PALETTE, DEFAULT_COLOR_PALETTE } from "./utils";

// G2 theme configuration interface
interface G2Theme {
  type: "light" | "academy";
  view: {
    viewFill: string;
    plotFill: string;
    mainFill: string;
    contentFill: string;
  };
  interval: {
    rect: {
      fillOpacity: number;
    };
  };
  line: {
    line: {
      lineWidth: number;
    };
  };
  area: {
    area: {
      fillOpacity: number;
    };
  };
  point: {
    point: {
      lineWidth: number;
    };
  };
}

const DEFAULT_THEME: G2Theme = {
  type: "light",
  view: {
    viewFill: "#FFF",
    plotFill: "transparent",
    mainFill: "transparent",
    contentFill: "transparent",
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

const ACADEMY_THEME: G2Theme = {
  type: "academy",
  view: {
    viewFill: "#FFF",
    plotFill: "transparent",
    mainFill: "transparent",
    contentFill: "transparent",
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

// Theme mapping with index signatures for dynamic access
export const THEME_MAP: Record<string, G2Theme> = {
  default: DEFAULT_THEME,
  academy: ACADEMY_THEME,
};

export const G6THEME_MAP: Record<string, typeof DEFAULT_COLOR_PALETTE> = {
  default: DEFAULT_COLOR_PALETTE,
  academy: ACADEMY_COLOR_PALETTE,
};
