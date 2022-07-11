import { DAGDims } from "./types";

export const NODE_WIDTH = 200 as const;
export const NODE_HEIGHT = 80 as const;
export const CIRCLE_SIZE = 40 as const;

export const DEFAULT_DIMS: DAGDims = {
  trigger: {
    height: NODE_HEIGHT * 3,
    width: NODE_WIDTH * 4.5,
  },
  node: {
    height: NODE_HEIGHT,
    width: NODE_WIDTH,
  },
  condition: {
    height: NODE_HEIGHT * 3,
    width: NODE_WIDTH * 4.5,
  },
  circle: {
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
  },
  distanceFactor: {
    node: 1.5,
    collection: 1,
  },
  position: {
    x: 50,
    y: 50,
  },
  flipped: true,
};
