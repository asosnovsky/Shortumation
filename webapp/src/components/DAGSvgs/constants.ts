import { DAGBoardElmDims } from 'components/DAGSvgs/DAGBoard';



export const NODE_WIDTH = 100 as const;
export const NODE_HEIGHT = 40 as const;
export const ADD_HEIGHT = 10 as const;
export const ADD_WIDTH = 10 as const;
export const CIRCLE_SIZE = 30 as const;
export const DISTANCE_FACTOR = 1.5 as const;

export const DEFAULT_DIMS: DAGBoardElmDims = {
  nodeHeight: NODE_HEIGHT,
  nodeWidth: NODE_WIDTH,
  addHeight: ADD_HEIGHT,
  addWidth: ADD_WIDTH,
  circleSize: CIRCLE_SIZE,
  distanceFactor: DISTANCE_FACTOR,
};
