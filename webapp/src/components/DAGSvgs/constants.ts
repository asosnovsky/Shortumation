export const NODE_WIDTH = 150 as const;
export const NODE_HEIGHT = 60 as const;
export const ADD_HEIGHT = 10 as const;
export const ADD_WIDTH = 10 as const;
export const CIRCLE_SIZE = 30 as const;
export const DISTANCE_FACTOR = 1.5 as const;
export const PADDING = 50 as const;

export const DEFAULT_DIMS = {
  nodeHeight: NODE_HEIGHT,
  nodeWidth: NODE_WIDTH,
  distanceFactor: DISTANCE_FACTOR,
  circleSize: CIRCLE_SIZE,
  padding: {
    x: PADDING,
    y: PADDING,
  },
}